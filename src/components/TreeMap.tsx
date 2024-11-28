import React from 'react';
import {
  ResponsiveContainer,
  Treemap as RechartsTreemap,
  Tooltip,
} from 'recharts';

interface TreeMapData {
  name: string;
  size: number;
  children?: TreeMapData[];
}

interface TreeMapProps {
  data: TreeMapData[];
  title: string;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: TreeMapData;
  }>;
}



const TreeMap: React.FC<TreeMapProps> = ({ data, title }) => {
  const CustomTooltip: React.FC<TooltipProps> = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-800 text-white p-3 rounded-lg shadow-lg">
          <p className="text-sm font-medium">{data.name}</p>
          <p className="text-sm">Value: {data.size.toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">{title}</h3>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsTreemap
            data={data}
            dataKey="size"
            aspectRatio={4/3}
            stroke="#fff"
            fill="#8884d8"
          >
            <Tooltip content={<CustomTooltip />} />
          </RechartsTreemap>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TreeMap;
