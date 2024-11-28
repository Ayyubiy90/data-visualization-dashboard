import { LayoutPreferences } from '../types/layout';
import { TimeRange, MetricType } from '../types/data';

const STORAGE_KEY = 'dashboard_preferences';

export const defaultPreferences: LayoutPreferences = {
  layouts: [
    { id: 'metrics', x: 0, y: 0, w: 12, h: 1, component: 'metrics', title: 'Key Metrics' },
    { id: 'lineChart', x: 0, y: 1, w: 8, h: 2, component: 'lineChart', title: 'Trends' },
    { id: 'insights', x: 8, y: 1, w: 4, h: 2, component: 'insights', title: 'Insights' },
    { id: 'scatterPlot', x: 0, y: 3, w: 6, h: 2, component: 'scatterPlot', title: 'Correlation' },
    { id: 'treeMap', x: 6, y: 3, w: 6, h: 2, component: 'treeMap', title: 'Distribution' },
  ],
  darkMode: false,
  defaultTimeRange: '30d' as TimeRange,
  defaultMetric: 'revenue' as MetricType,
};

export const savePreferences = (preferences: LayoutPreferences): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  } catch (error) {
    console.error('Failed to save preferences:', error);
  }
};

export const loadPreferences = (): LayoutPreferences => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return defaultPreferences;
    return JSON.parse(saved);
  } catch (error) {
    console.error('Failed to load preferences:', error);
    return defaultPreferences;
  }
};

export const resetPreferences = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to reset preferences:', error);
  }
};
