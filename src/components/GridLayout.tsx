import React, { useCallback } from "react";
import GridLayout, { Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { LayoutItem } from "../types/layout";
import MetricCard from "./MetricCard";
import ChartContainer from "./ChartContainer";
import ScatterPlot from "./ScatterPlot";
import TreeMap from "./TreeMap";
import InsightPanel from "./InsightPanel";
import CommentOverlay from "./CommentOverlay";
import ThresholdAlert from "./ThresholdAlert";
import { DataPoint, MetricCard as MetricCardType } from "../types/data";
import { Comment, CommentPosition } from "../types/comments";

interface DashboardGridProps {
  layouts: LayoutItem[];
  onLayoutChange: (layout: LayoutItem[]) => void;
  data: DataPoint[];
  metrics: MetricCardType[];
  comments: Comment[];
  onAddComment: (position: CommentPosition, text: string) => void;
  onReplyToComment: (commentId: string, text: string) => void;
  onResolveComment: (commentId: string) => void;
  threshold: number; // Add threshold prop
}

const DashboardGrid: React.FC<DashboardGridProps> = React.memo(
  ({
    layouts,
    onLayoutChange,
    data,
    metrics,
    comments,
    onAddComment,
    onReplyToComment,
    onResolveComment,
    threshold,
  }) => {
    const renderComponent = (item: LayoutItem) => {
      const componentComments = comments.filter(
        (comment) => comment.componentId === item.id
      );

      const wrappedComponent = (
        <div className="relative h-full">
          {(() => {
            switch (item.component) {
              case "metrics":
                return (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {metrics.map((metric, index) => (
                      <MetricCard key={index} {...metric} />
                    ))}
                  </div>
                );
              case "lineChart":
                return (
                  <ChartContainer
                    data={data}
                    dataKey="revenue"
                    title={item.title}
                  />
                );
              case "scatterPlot":
                return (
                  <ScatterPlot
                    data={data.map((d) => ({ x: d.users, y: d.revenue / 100 }))}
                    xLabel="Users"
                    yLabel="Revenue (hundreds)"
                    title={item.title}
                  />
                );
              case "treeMap": {
                const treeMapData = [
                  {
                    name: "Product Sales",
                    size: data.reduce(
                      (acc, curr) => acc + curr.revenue * 0.7,
                      0
                    ),
                  },
                  {
                    name: "Services",
                    size: data.reduce(
                      (acc, curr) => acc + curr.revenue * 0.2,
                      0
                    ),
                  },
                  {
                    name: "Subscriptions",
                    size: data.reduce(
                      (acc, curr) => acc + curr.revenue * 0.1,
                      0
                    ),
                  },
                ];
                return <TreeMap data={treeMapData} title={item.title} />;
              }
              case "insights":
                return <InsightPanel data={data} />;
              default:
                return <div>Unknown component</div>;
            }
          })()}
          <CommentOverlay
            comments={componentComments}
            componentId={item.id}
            onAddComment={onAddComment}
            onReplyToComment={onReplyToComment}
            onResolveComment={onResolveComment}
          />
          <ThresholdAlert
            value={data[data.length - 1]?.revenue}
            threshold={threshold}
          />
        </div>
      );

      return wrappedComponent;
    };

    const handleLayoutChange = useCallback(
      (newLayout: Layout[]) => {
        onLayoutChange(
          newLayout.map((l) => ({
            ...(layouts.find((ol) => ol.id === l.i) as LayoutItem),
            x: l.x,
            y: l.y,
            w: l.w,
            h: l.h,
          }))
        );
      },
      [layouts, onLayoutChange]
    );

    return (
      <GridLayout
        className="layout"
        layout={layouts.map(({ id, x, y, w, h }) => ({ i: id, x, y, w, h }))}
        cols={12}
        rowHeight={100}
        width={1200}
        onLayoutChange={handleLayoutChange}
        isDraggable
        isResizable
        margin={[16, 16]}>
        {layouts.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 transition-colors">
            <div className="h-full overflow-auto">{renderComponent(item)}</div>
          </div>
        ))}
      </GridLayout>
    );
  }
);

export default DashboardGrid;
