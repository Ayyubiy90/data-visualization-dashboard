import React from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import regression from 'regression';

interface ScatterPlotProps {
  data: Array<{ x: number; y: number }>;
  xLabel: string;
  yLabel: string;
  title: string;
}

const ScatterPlot: React.FC<ScatterPlotProps> = ({ data, xLabel, yLabel, title }) => {
  // Calculate regression line
  const regressionData = regression.linear(data.map(point => [point.x, point.y]));
  const regressionLine = [
    { x: Math.min(...data.map(d => d.x)), y: regressionData.predict(Math.min(...data.map(d => d.x)))[1] },
    { x: Math.max(...data.map(d => d.x)), y: regressionData.predict(Math.max(...data.map(d => d.x)))[1] }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">{title}</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              type="number"
              dataKey="x"
              name={xLabel}
              stroke="#6B7280"
              tick={{ fill: '#6B7280' }}
            />
            <YAxis
              type="number"
              dataKey="y"
              name={yLabel}
              stroke="#6B7280"
              tick={{ fill: '#6B7280' }}
            />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-gray-800 text-white p-3 rounded-lg shadow-lg">
                      <p className="text-sm">{`${xLabel}: ${payload[0].value}`}</p>
                      <p className="text-sm">{`${yLabel}: ${payload[1].value}`}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Scatter
              name="Data Points"
              data={data}
              fill="#3B82F6"
              opacity={0.6}
            />
            <Scatter
              name="Regression Line"
              data={regressionLine}
              line={{ stroke: '#EF4444', strokeWidth: 2 }}
              shape={() => null}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        <p>R² Value: {regressionData.r2.toFixed(3)}</p>
        <p>Equation: y = {regressionData.equation[0].toFixed(2)}x + {regressionData.equation[1].toFixed(2)}</p>
      </div>
    </div>
  );
};

export default ScatterPlot;