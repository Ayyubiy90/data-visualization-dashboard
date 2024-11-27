import React from 'react';
import { Moon, Sun } from 'lucide-react';

interface DashboardHeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ darkMode, onToggleDarkMode }) => {
  return (
    <header className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400">Track your key metrics in real-time</p>
      </div>
      <button
        onClick={onToggleDarkMode}
        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        aria-label="Toggle dark mode"
      >
        {darkMode ? (
          <Sun className="w-5 h-5 text-gray-900 dark:text-white" />
        ) : (
          <Moon className="w-5 h-5 text-gray-900 dark:text-white" />
        )}
      </button>
    </header>
  );
};

export default DashboardHeader;