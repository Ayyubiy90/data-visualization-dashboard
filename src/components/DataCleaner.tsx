import React, { useState, memo } from "react";
import { Settings, RefreshCw } from "lucide-react";
import { DataPoint } from "../types/data";

interface DataCleanerProps {
  data: DataPoint[];
  onDataClean: (cleanedData: DataPoint[]) => void;
}

interface CleaningOptions {
  removeOutliers: boolean;
  interpolateMissing: boolean;
  roundNumbers: boolean;
  normalizeValues: boolean;
}

const DataCleaner: React.FC<DataCleanerProps> = memo(({ data, onDataClean }) => {
  const [options, setOptions] = useState<CleaningOptions>({
    removeOutliers: true,
    interpolateMissing: true,
    roundNumbers: true,
    normalizeValues: false,
  });

  const detectOutliers = (values: number[]): boolean[] => {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const stdDev = Math.sqrt(
      values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length
    );
    const threshold = 3; // Standard deviations
    return values.map((v) => Math.abs(v - mean) > threshold * stdDev);
  };

  const interpolateValue = (prev: number, next: number): number => {
    return (prev + next) / 2;
  };

  const cleanData = () => {
    let cleanedData = [...data];

    if (options.removeOutliers || options.interpolateMissing) {
      const revenues = data.map((d) => d.revenue);
      const users = data.map((d) => d.users);
      const orders = data.map((d) => d.orders);

      const revenueOutliers = detectOutliers(revenues);
      const userOutliers = detectOutliers(users);
      const orderOutliers = detectOutliers(orders);

      cleanedData = cleanedData.map((point, i) => {
        const newPoint = { ...point };

        if (options.removeOutliers) {
          if (revenueOutliers[i]) {
            const prevRevenue = i > 0 ? revenues[i - 1] : revenues[i + 1];
            const nextRevenue =
              i < revenues.length - 1 ? revenues[i + 1] : revenues[i - 1];
            newPoint.revenue = interpolateValue(prevRevenue, nextRevenue);
          }
          if (userOutliers[i]) {
            const prevUsers = i > 0 ? users[i - 1] : users[i + 1];
            const nextUsers =
              i < users.length - 1 ? users[i + 1] : users[i - 1];
            newPoint.users = interpolateValue(prevUsers, nextUsers);
          }
          if (orderOutliers[i]) {
            const prevOrders = i > 0 ? orders[i - 1] : orders[i + 1];
            const nextOrders =
              i < orders.length - 1 ? orders[i + 1] : orders[i - 1];
            newPoint.orders = interpolateValue(prevOrders, nextOrders);
          }
        }

        return newPoint;
      });
    }

    if (options.roundNumbers) {
      cleanedData = cleanedData.map((point) => ({
        ...point,
        revenue: Math.round(point.revenue),
        users: Math.round(point.users),
        orders: Math.round(point.orders),
      }));
    }

    if (options.normalizeValues) {
      const maxRevenue = Math.max(...cleanedData.map((d) => d.revenue));
      const maxUsers = Math.max(...cleanedData.map((d) => d.users));
      const maxOrders = Math.max(...cleanedData.map((d) => d.orders));

      cleanedData = cleanedData.map((point) => ({
        ...point,
        revenue: point.revenue / maxRevenue,
        users: point.users / maxUsers,
        orders: point.orders / maxOrders,
      }));
    }

    onDataClean(cleanedData);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Data Cleaning Options
          </h3>
        </div>
        <button
          onClick={cleanData}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg 
                     hover:bg-blue-600 transition-colors">
          <RefreshCw size={16} />
          Clean Data
        </button>
      </div>

      <div className="space-y-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={options.removeOutliers}
            onChange={(e) =>
              setOptions({ ...options, removeOutliers: e.target.checked })
            }
            className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
          />
          <span className="text-gray-700 dark:text-gray-300">
            Remove and interpolate outliers
          </span>
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={options.interpolateMissing}
            onChange={(e) =>
              setOptions({ ...options, interpolateMissing: e.target.checked })
            }
            className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
          />
          <span className="text-gray-700 dark:text-gray-300">
            Interpolate missing values
          </span>
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={options.roundNumbers}
            onChange={(e) =>
              setOptions({ ...options, roundNumbers: e.target.checked })
            }
            className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
          />
          <span className="text-gray-700 dark:text-gray-300">
            Round numbers to integers
          </span>
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={options.normalizeValues}
            onChange={(e) =>
              setOptions({ ...options, normalizeValues: e.target.checked })
            }
            className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
          />
          <span className="text-gray-700 dark:text-gray-300">
            Normalize values (0-1 range)
          </span>
        </label>
      </div>
    </div>
  );
});

export default DataCleaner;
