export type UpdateInterval = '1min' | '5min' | '15min' | '30min' | '1hour';

export interface ScheduleConfig {
  enabled: boolean;
  interval: UpdateInterval;
  lastUpdate: string;
}

const STORAGE_KEY = 'update_schedule';

export const defaultSchedule: ScheduleConfig = {
  enabled: false,
  interval: '5min',
  lastUpdate: new Date().toISOString(),
};

export const loadScheduleConfig = (): ScheduleConfig => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return defaultSchedule;
    return JSON.parse(saved);
  } catch (error) {
    console.error('Failed to load schedule config:', error);
    return defaultSchedule;
  }
};

export const saveScheduleConfig = (config: ScheduleConfig): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (error) {
    console.error('Failed to save schedule config:', error);
  }
};

let updateInterval: number | null = null;

export const startScheduledUpdates = (
  config: ScheduleConfig,
  onUpdate: () => Promise<void>
): void => {
  if (updateInterval) {
    clearInterval(updateInterval);
  }

  if (!config.enabled) return;

  const intervals: Record<UpdateInterval, number> = {
    '1min': 60 * 1000,
    '5min': 5 * 60 * 1000,
    '15min': 15 * 60 * 1000,
    '30min': 30 * 60 * 1000,
    '1hour': 60 * 60 * 1000,
  };

  updateInterval = setInterval(async () => {
    try {
      await onUpdate();
      saveScheduleConfig({
        ...config,
        lastUpdate: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Failed to perform scheduled update:', error);
    }
  }, intervals[config.interval]);
};

export const stopScheduledUpdates = (): void => {
  if (updateInterval) {
    clearInterval(updateInterval);
    updateInterval = null;
  }
};
