export interface DataPoint {
  date: string;
  revenue: number;
  users: number;
  orders: number;
}

export interface MetricCard {
  title: string;
  value: number;
  change: number;
  icon: React.ComponentType;
}

export interface ChartData {
  name: string;
  value: number;
}

export type TimeRange = '7d' | '30d' | '90d' | 'all';

export interface FilterOptions {
  timeRange: TimeRange;
  dataType: 'revenue' | 'users' | 'orders';
}