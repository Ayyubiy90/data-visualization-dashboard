# Data Visualization Dashboard

A modern, interactive dashboard built with React, TypeScript, and Recharts for analyzing and visualizing data in real-time. Features a responsive design, dark mode support, and interactive charts.

## Implemented Features

### 📊 Data Visualization
- ✅ Interactive line charts with hover effects
- ✅ Scatter plots with regression analysis
- ✅ Real-time metric updates
- ✅ Multiple chart types and views

### 📈 Analytics & Insights
- ✅ Key performance metrics
- ✅ Trend analysis with growth indicators
- ✅ Anomaly detection for significant changes
- ✅ Statistical analysis (regression, R² values)

### 🎨 User Interface
- ✅ Dark/light mode toggle
- ✅ Responsive, mobile-first design
- ✅ Interactive filters and controls
- ✅ Smooth animations and transitions

### 🔍 Data Analysis
- ✅ Time range filtering
- ✅ Metric comparisons
- ✅ Trend visualization
- ✅ Performance alerts

## Tech Stack

- **React** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **Lucide React** - Icons
- **Regression.js** - Statistical analysis

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── components/          # UI components
│   ├── ChartContainer.tsx
│   ├── DashboardHeader.tsx
│   ├── FilterBar.tsx
│   ├── InsightPanel.tsx
│   ├── MetricCard.tsx
│   └── ScatterPlot.tsx
├── data/               # Data management
│   └── mockData.ts
├── types/              # TypeScript definitions
│   └── data.ts
├── App.tsx            # Main component
└── index.css          # Global styles
```

## Components

### MetricCard
```tsx
<MetricCard
  title="Total Revenue"
  value={50000}
  change={12.5}
  icon={DollarSign}
/>
```

### ChartContainer
```tsx
<ChartContainer
  data={data}
  dataKey="revenue"
  title="Revenue Over Time"
/>
```

### ScatterPlot
```tsx
<ScatterPlot
  data={scatterData}
  xLabel="Users"
  yLabel="Revenue"
  title="Correlation Analysis"
/>
```

## Customization

### Theme Configuration
Update `tailwind.config.js` to customize:
- Color schemes
- Dark mode preferences
- Typography
- Breakpoints
- Animations

### Chart Options
Modify chart components to adjust:
- Colors and styles
- Animations
- Tooltips
- Axes and legends

## Performance

The dashboard implements several optimizations:
- React component memoization
- Efficient data filtering
- Responsive design patterns
- Optimized bundle size

## License

MIT License - free to use for personal or commercial projects.