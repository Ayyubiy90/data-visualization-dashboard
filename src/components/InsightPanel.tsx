import React from 'react';
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { DataPoint } from '../types/data';

interface InsightPanelProps {
  data: DataPoint[];
}

const InsightPanel: React.FC<InsightPanelProps> = ({ data }) => {
  const calculateInsights = () => {
    if (!data.length) return null;

    const recentData = data.slice(-30);
    const revenue = recentData.map(d => d.revenue);
    const users = recentData.map(d => d.users);
    const orders = recentData.map(d => d.orders);

    const avgRevenue = revenue.reduce((a, b) => a + b, 0) / revenue.length;
    const avgUsers = users.reduce((a, b) => a + b, 0) / users.length;
    const avgOrders = orders.reduce((a, b) => a + b, 0) / orders.length;

    const revenueGrowth = ((revenue[revenue.length - 1] - revenue[0]) / revenue[0]) * 100;
    const userGrowth = ((users[users.length - 1] - users[0]) / users[0]) * 100;
    const orderGrowth = ((orders[orders.length - 1] - orders[0]) / orders[0]) * 100;

    return {
      averages: { revenue: avgRevenue, users: avgUsers, orders: avgOrders },
      growth: { revenue: revenueGrowth, users: userGrowth, orders: orderGrowth },
    };
  };

  const insights = calculateInsights();
  if (!insights) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Key Insights</h3>
      <div className="space-y-4">
        {Object.entries(insights.growth).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400 capitalize">
              {key} Growth (30d)
            </span>
            <div className="flex items-center gap-2">
              {value > 0 ? (
                <TrendingUp className="w-4 h-4 text-green-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
              <span className={value > 0 ? 'text-green-500' : 'text-red-500'}>
                {value.toFixed(1)}%
              </span>
            </div>
          </div>
        ))}
        
        {Math.abs(insights.growth.revenue) > 20 && (
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-500" />
            <span className="text-sm text-yellow-600 dark:text-yellow-500">
              Significant revenue change detected
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default InsightPanel;