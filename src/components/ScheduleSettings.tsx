import React, { useState, useEffect } from "react";
import { Clock, RefreshCw } from "lucide-react";
import {
  UpdateInterval,
  ScheduleConfig,
  loadScheduleConfig,
  saveScheduleConfig,
  startScheduledUpdates,
  stopScheduledUpdates,
} from "../services/scheduler";

interface ScheduleSettingsProps {
  onUpdate: () => Promise<void>;
}

const intervals: { value: UpdateInterval; label: string }[] = [
  { value: "1min", label: "Every minute" },
  { value: "5min", label: "Every 5 minutes" },
  { value: "15min", label: "Every 15 minutes" },
  { value: "30min", label: "Every 30 minutes" },
  { value: "1hour", label: "Every hour" },
];

const ScheduleSettings: React.FC<ScheduleSettingsProps> = ({ onUpdate }) => {
  const [config, setConfig] = useState<ScheduleConfig>(loadScheduleConfig());
  const [nextUpdate, setNextUpdate] = useState<string>("");

  useEffect(() => {
    if (config.enabled) {
      startScheduledUpdates(config, onUpdate);
      updateNextUpdateTime();
    } else {
      stopScheduledUpdates();
    }

    return () => {
      stopScheduledUpdates();
    };
  }, [config, onUpdate]);

  useEffect(() => {
    const timer = setInterval(updateNextUpdateTime, 1000);
    return () => clearInterval(timer);
  }, [config]);

  const updateNextUpdateTime = () => {
    if (!config.enabled) {
      setNextUpdate("");
      return;
    }

    const lastUpdate = new Date(config.lastUpdate);
    const intervals: Record<UpdateInterval, number> = {
      "1min": 60 * 1000,
      "5min": 5 * 60 * 1000,
      "15min": 15 * 60 * 1000,
      "30min": 30 * 60 * 1000,
      "1hour": 60 * 60 * 1000,
    };

    const nextUpdateTime = new Date(
      lastUpdate.getTime() + intervals[config.interval]
    );
    const now = new Date();
    const diff = nextUpdateTime.getTime() - now.getTime();

    if (diff <= 0) {
      setNextUpdate("Updating...");
    } else {
      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setNextUpdate(
        `Next update in ${minutes}:${seconds.toString().padStart(2, "0")}`
      );
    }
  };

  const handleToggle = () => {
    const newConfig = {
      ...config,
      enabled: !config.enabled,
      lastUpdate: new Date().toISOString(),
    };
    setConfig(newConfig);
    saveScheduleConfig(newConfig);
  };

  const handleIntervalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newConfig = {
      ...config,
      interval: e.target.value as UpdateInterval,
      lastUpdate: new Date().toISOString(),
    };
    setConfig(newConfig);
    saveScheduleConfig(newConfig);
  };

  const handleManualUpdate = async () => {
    try {
      await onUpdate();
      const newConfig = {
        ...config,
        lastUpdate: new Date().toISOString(),
      };
      setConfig(newConfig);
      saveScheduleConfig(newConfig);
    } catch (error) {
      console.error("Manual update failed:", error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Update Schedule
          </h3>
        </div>
        <button
          onClick={handleManualUpdate}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg 
                   hover:bg-blue-600 transition-colors">
          <RefreshCw size={16} />
          Update Now
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={config.enabled}
              onChange={handleToggle}
              className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
            />
            <span className="text-gray-700 dark:text-gray-300">
              Enable automatic updates
            </span>
          </label>
          {nextUpdate && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {nextUpdate}
            </span>
          )}
        </div>

        <div className="flex items-center gap-4">
          <label className="text-gray-700 dark:text-gray-300">
            Update interval:
          </label>
          <select
            value={config.interval}
            onChange={handleIntervalChange}
            disabled={!config.enabled}
            className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 
                     text-gray-900 dark:text-white rounded-lg p-2 focus:ring-blue-500 
                     focus:border-blue-500 disabled:opacity-50">
            {intervals.map((interval) => (
              <option key={interval.value} value={interval.value}>
                {interval.label}
              </option>
            ))}
          </select>
        </div>

        <div className="text-sm text-gray-500 dark:text-gray-400">
          Last update: {new Date(config.lastUpdate).toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default ScheduleSettings;
