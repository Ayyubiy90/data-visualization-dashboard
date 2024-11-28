import { TimeRange, MetricType } from './data';

export type ComponentType = 
  | 'metrics'
  | 'lineChart'
  | 'scatterPlot'
  | 'treeMap'
  | 'insights';

export interface LayoutItem {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  component: ComponentType;
  title: string;
}

export interface LayoutPreferences {
  layouts: LayoutItem[];
  darkMode: boolean;
  defaultTimeRange: TimeRange;
  defaultMetric: MetricType;
}
