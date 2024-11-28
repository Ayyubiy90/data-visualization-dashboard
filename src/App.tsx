import { useState, useEffect } from "react";
import { Users, DollarSign, ShoppingCart } from "lucide-react";
import DashboardHeader from "./components/DashboardHeader";
import FilterBar from "./components/FilterBar";
import GridLayout from "./components/GridLayout";
import LayoutControls from "./components/LayoutControls";
import DataUploader from "./components/DataUploader";
import DataCleaner from "./components/DataCleaner";
import FeedbackForm from "./components/FeedbackForm";
import ScheduleSettings from "./components/ScheduleSettings";
import AchievementBadge from "./components/AchievementBadge";
import { generateMockData } from "./data/mockData";
import { exportDataToCloud } from "./services/export";
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
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
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
    addComment(position, text, "Current User");
  };

  const handleReplyToComment = (commentId: string, text: string) => {
    addReply(commentId, text, "Current User");
  };

  const handleResolveComment = (commentId: string) => {
    resolveComment(commentId);
  };

  const handleStatusMessage = (message: string) => {
    setStatusMessage(message);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleFeedbackSubmit = (feedback: string) => {
    console.log("User feedback submitted:", feedback);
    handleStatusMessage("Thank you for your feedback!");
  };

  const handleExportData = async () => {
    try {
      await exportDataToCloud(data);
      handleStatusMessage("Data exported successfully!");
    } catch {
      handleStatusMessage("Failed to export data.");
    }
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

          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DataUploader
                onDataUpload={(newData: DataPoint[]) => {
                  setData(newData);
                  handleStatusMessage("Data uploaded successfully");
                }}
                onError={handleStatusMessage}
              />
              <DataCleaner
                data={data}
                onDataClean={(cleanedData: DataPoint[]) => {
                  setData(cleanedData);
                  handleStatusMessage("Data cleaned successfully");
                }}
              />
            </div>

            <ScheduleSettings
              onUpdate={async () => {
                try {
                  const newData = generateMockData();
                  setData(newData);
                  handleStatusMessage("Data updated successfully");
                } catch {
                  handleStatusMessage("Failed to update data");
                }
              }}
            />

            <FeedbackForm onSubmit={handleFeedbackSubmit} />
            <AchievementBadge
              title="First Upload"
              description="You uploaded your first dataset!"
              isAchieved={data.length > 0}
            />
          </div>

          <button
            onClick={handleExportData}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg 
                     hover:bg-green-600 transition-colors">
            Export Data to Cloud
          </button>

          <GridLayout
            layouts={layouts}
            onLayoutChange={handleLayoutChange}
            data={filteredData}
            metrics={metrics}
            comments={comments}
            onAddComment={handleAddComment}
            onReplyToComment={handleReplyToComment}
            onResolveComment={handleResolveComment}
            threshold={100} // Set your desired threshold value here
          />

          {!isConnected && (
            <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg">
              Reconnecting to comments service...
            </div>
          )}

          {statusMessage && (
            <div className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg">
              {statusMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
