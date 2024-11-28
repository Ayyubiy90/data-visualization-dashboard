import { useState, useEffect } from "react";
import { Users, DollarSign, ShoppingCart } from "lucide-react";
import DashboardHeader from "./components/DashboardHeader";
import FilterBar from "./components/FilterBar";
import GridLayout from "./components/GridLayout";
import LayoutControls from "./components/LayoutControls";
import { generateMockData } from "./data/mockData";
import {
  DataPoint,
  MetricCard as MetricCardType,
  FilterOptions,
} from "./types/data";
import { LayoutItem } from "./types/layout";
import { Comment, CommentPosition } from "./types/comments";
import {
  loadPreferences,
  savePreferences,
  defaultPreferences,
} from "./services/preferences";
import {
  initializeComments,
  addComment,
  addReply,
  resolveComment,
  closeConnection,
} from "./services/comments";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [data, setData] = useState<DataPoint[]>([]);
  const [filteredData, setFilteredData] = useState<DataPoint[]>([]);
  const [layouts, setLayouts] = useState<LayoutItem[]>(
    defaultPreferences.layouts
  );
  const [comments, setComments] = useState<Comment[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    timeRange: defaultPreferences.defaultTimeRange,
    dataType: defaultPreferences.defaultMetric,
  });

  // Initialize WebSocket connection for comments
  useEffect(() => {
    initializeComments(
      (updatedComments: Comment[]) => setComments(updatedComments),
      (connected: boolean) => setIsConnected(connected)
    );

    return () => {
      closeConnection();
    };
  }, []);

  // Load saved preferences
  useEffect(() => {
    const preferences = loadPreferences();
    setDarkMode(preferences.darkMode);
    setLayouts(preferences.layouts);
    setFilters({
      timeRange: preferences.defaultTimeRange,
      dataType: preferences.defaultMetric,
    });
  }, []);

  useEffect(() => {
    setData(generateMockData());
  }, []);

  useEffect(() => {
    const filterData = () => {
      let filtered = [...data];

      if (filters.timeRange !== "all") {
        const days = parseInt(filters.timeRange);
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        filtered = filtered.filter((item) => new Date(item.date) >= cutoffDate);
      }

      setFilteredData(filtered);
    };

    filterData();
  }, [data, filters]);

  const metrics: MetricCardType[] = [
    {
      title: "Total Revenue",
      value:
        filteredData.length > 0
          ? filteredData[filteredData.length - 1].revenue
          : 0,
      change: 12.5,
      icon: DollarSign,
    },
    {
      title: "Active Users",
      value:
        filteredData.length > 0
          ? filteredData[filteredData.length - 1].users
          : 0,
      change: 8.2,
      icon: Users,
    },
    {
      title: "Orders",
      value:
        filteredData.length > 0
          ? filteredData[filteredData.length - 1].orders
          : 0,
      change: -3.1,
      icon: ShoppingCart,
    },
  ];

  const handleLayoutChange = (newLayouts: LayoutItem[]) => {
    setLayouts(newLayouts);
  };

  const handleSaveLayout = () => {
    savePreferences({
      layouts,
      darkMode,
      defaultTimeRange: filters.timeRange,
      defaultMetric: filters.dataType,
    });
  };

  const handleResetLayout = () => {
    const preferences = defaultPreferences;
    setLayouts(preferences.layouts);
    setDarkMode(preferences.darkMode);
    setFilters({
      timeRange: preferences.defaultTimeRange,
      dataType: preferences.defaultMetric,
    });
  };

  const handleToggleComponent = (componentId: string) => {
    setLayouts(
      layouts.map((layout) =>
        layout.id === componentId
          ? {
              ...layout,
              w:
                layout.w === 0
                  ? defaultPreferences.layouts.find((l) => l.id === componentId)
                      ?.w || 0
                  : 0,
            }
          : layout
      )
    );
  };

  const handleAddComment = (position: CommentPosition, text: string) => {
    addComment(position, text, "Current User"); // In a real app, get the current user's name
  };

  const handleReplyToComment = (commentId: string, text: string) => {
    addReply(commentId, text, "Current User"); // In a real app, get the current user's name
  };

  const handleResolveComment = (commentId: string) => {
    resolveComment(commentId);
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8 transition-colors">
        <div className="max-w-7xl mx-auto">
          <DashboardHeader
            darkMode={darkMode}
            onToggleDarkMode={() => setDarkMode(!darkMode)}
          />

          <FilterBar filters={filters} onFilterChange={setFilters} />

          <LayoutControls
            layouts={layouts}
            onSaveLayout={handleSaveLayout}
            onResetLayout={handleResetLayout}
            onToggleComponent={handleToggleComponent}
          />

          <GridLayout
            layouts={layouts}
            onLayoutChange={handleLayoutChange}
            data={filteredData}
            metrics={metrics}
            comments={comments}
            onAddComment={handleAddComment}
            onReplyToComment={handleReplyToComment}
            onResolveComment={handleResolveComment}
          />

          {!isConnected && (
            <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg">
              Reconnecting to comments service...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
