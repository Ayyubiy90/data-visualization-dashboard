import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { MetricCard as MetricCardType } from '../types/data';

interface MetricCardProps extends MetricCardType {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon: Icon }) => {
  const isPositive = change >= 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl w-full max-w-xs mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Icon className="w-5 h-5 text-blue-500" />
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
        </div>
        <span className={`flex items-center text-sm ${
          isPositive ? 'text-green-500' : 'text-red-500'
        }`}>
          {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
          {Math.abs(change)}%
        </span>
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">
        {value.toLocaleString()}
      </p>
    </div>
  );
}

export default MetricCard;
