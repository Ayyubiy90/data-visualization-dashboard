import React from 'react';
import { LayoutItem } from '../types/layout';

interface LayoutControlsProps {
  layouts: LayoutItem[];
  onSaveLayout: () => void;
  onResetLayout: () => void;
  onToggleComponent: (componentId: string) => void;
}

const LayoutControls: React.FC<LayoutControlsProps> = ({
  layouts,
  onSaveLayout,
  onResetLayout,
  onToggleComponent,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Layout Customization
        </h3>
        <div className="space-x-2">
          <button
            onClick={onSaveLayout}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mt-2 mb-2"
          >
            Save Layout
          </button>
          <button
            onClick={onResetLayout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors mt-2 mb-2"
          >
            Reset Layout
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {layouts.map((item) => (
          <label
            key={item.id}
            className="flex items-center space-x-2 text-gray-700 dark:text-gray-300"
          >
            <input
              type="checkbox"
              checked={true}
              onChange={() => onToggleComponent(item.id)}
              className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
            />
            <span>{item.title}</span>
          </label>
        ))}
      </div>
      <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        Drag components to rearrange, resize using handles, and toggle visibility using checkboxes.
      </p>
    </div>
  );
};

export default LayoutControls;
