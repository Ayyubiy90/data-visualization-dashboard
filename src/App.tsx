import React, { useState, useEffect } from 'react';
import { Users, DollarSign, ShoppingCart } from 'lucide-react';
import DashboardHeader from './components/DashboardHeader';
import MetricCard from './components/MetricCard';
import ChartContainer from './components/ChartContainer';
import ScatterPlot from './components/ScatterPlot';
import InsightPanel from './components/InsightPanel';
import FilterBar from './components/FilterBar';
import TreeMap from './components/TreeMap';
import { generateMockData } from './data/mockData';
import { DataPoint, MetricCard as MetricCardType, FilterOptions } from './types/data';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [data, setData] = useState<DataPoint[]>([]);
  const [filteredData, setFilteredData] = useState<DataPoint[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({
    timeRange: '30d',
    dataType: 'revenue',
  });

  useEffect(() => {
    setData(generateMockData());
  }, []);

  useEffect(() => {
    const filterData = () => {
      let filtered = [...data];
      
      if (filters.timeRange !== 'all') {
        const days = parseInt(filters.timeRange);
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        filtered = filtered.filter(item => new Date(item.date) >= cutoffDate);
      }

      setFilteredData(filtered);
    };

    filterData();
  }, [data, filters]);

  const metrics: MetricCardType[] = [
    {
      title: 'Total Revenue',
      value: filteredData.length > 0 ? filteredData[filteredData.length - 1].revenue : 0,
      change: 12.5,
      icon: DollarSign,
    },
    {
      title: 'Active Users',
      value: filteredData.length > 0 ? filteredData[filteredData.length - 1].users : 0,
      change: 8.2,
      icon: Users,
    },
    {
      title: 'Orders',
      value: filteredData.length > 0 ? filteredData[filteredData.length - 1].orders : 0,
      change: -3.1,
      icon: ShoppingCart,
    },
  ];

const scatterData = filteredData.map(item => ({
    x: item.users,
    y: item.revenue / 100, // Scaled for better visualization
  }));

  const treeMapData = [
    {
      name: 'Revenue Sources',
      children: [
        {
          name: 'Product Sales',
          size: filteredData.reduce((acc, curr) => acc + curr.revenue * 0.7, 0),
        },
        {
          name: 'Services',
          size: filteredData.reduce((acc, curr) => acc + curr.revenue * 0.2, 0),
        },
        {
          name: 'Subscriptions',
          size: filteredData.reduce((acc, curr) => acc + curr.revenue * 0.1, 0),
        },
      ],
    },
  ];

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8 transition-colors">
        <div className="max-w-7xl mx-auto">
          <DashboardHeader
            darkMode={darkMode}
            onToggleDarkMode={() => setDarkMode(!darkMode)}
          />

          <FilterBar
            filters={filters}
            onFilterChange={setFilters}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {metrics.map((metric, index) => (
              <MetricCard key={index} {...metric} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <ChartContainer
                data={filteredData}
                dataKey={filters.dataType}
                title={`${filters.dataType.charAt(0).toUpperCase() + filters.dataType.slice(1)} Over Time`}
              />
            </div>
            <InsightPanel data={filteredData} />
          </div>

<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <ScatterPlot
              data={scatterData}
              xLabel="Users"
              yLabel="Revenue (hundreds)"
              title="Revenue vs Users Correlation"
            />
            <ChartContainer
              data={filteredData}
              dataKey="orders"
              title="Order Trends"
            />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl">
            <TreeMap
              data={treeMapData[0].children}
              title="Revenue Distribution"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;