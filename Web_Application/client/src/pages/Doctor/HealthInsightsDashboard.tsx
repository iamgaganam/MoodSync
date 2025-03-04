import React, { useState } from "react";
import {
  LineChart,
  BarChart,
  PieChart,
  RadarChart,
  ScatterChart,
  Radar,
  Pie,
  Line,
  Bar,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import {
  CalendarDays,
  TrendingUp,
  Brain,
  Heart,
  AlertTriangle,
  Activity,
} from "lucide-react";

// Sample data – you can replace these with your actual data from your backend.
const moodData = [
  { date: "Jan 1", mood: 7, anxiety: 3, stress: 4 },
  { date: "Jan 2", mood: 6, anxiety: 4, stress: 5 },
  { date: "Jan 3", mood: 8, anxiety: 2, stress: 3 },
  { date: "Jan 4", mood: 5, anxiety: 5, stress: 6 },
  { date: "Jan 5", mood: 7, anxiety: 3, stress: 4 },
  { date: "Jan 6", mood: 9, anxiety: 1, stress: 2 },
  { date: "Jan 7", mood: 8, anxiety: 2, stress: 3 },
];

const sentimentData = [
  { name: "Positive", value: 65, color: "#4ade80" },
  { name: "Neutral", value: 25, color: "#facc15" },
  { name: "Negative", value: 10, color: "#f87171" },
];

const wellnessScores = [
  { subject: "Sleep", score: 80 },
  { subject: "Exercise", score: 65 },
  { subject: "Nutrition", score: 70 },
  { subject: "Mindfulness", score: 55 },
  { subject: "Social", score: 75 },
  { subject: "Productivity", score: 60 },
];

const riskFactors = [
  { name: "Sleep Disruption", value: 40 },
  { name: "Social Isolation", value: 30 },
  { name: "Negative Thoughts", value: 25 },
  { name: "Stress", value: 70 },
];

const moodDistributionData = [
  { name: "Happy", value: 40, color: "#4ade80" },
  { name: "Neutral", value: 30, color: "#facc15" },
  { name: "Anxious", value: 15, color: "#f97316" },
  { name: "Sad", value: 10, color: "#3b82f6" },
  { name: "Angry", value: 5, color: "#ef4444" },
];

const HealthInsightsDashboard = () => {
  const [activeTab, setActiveTab] = useState("trends");

  const renderTabContent = () => {
    switch (activeTab) {
      case "myHealth":
        return <MyHealthOverview />;
      case "trends":
        return <MentalHealthTrends />;
      case "wellness":
        return <WellnessInsights />;
      case "visualization":
        return <HealthDataVisualization />;
      case "graphical":
        return <GraphicalInsights />;
      default:
        return <MentalHealthTrends />;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Health Insights & Visualization
        </h1>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 bg-white p-2 rounded-lg shadow-sm">
          <TabButton
            active={activeTab === "myHealth"}
            onClick={() => setActiveTab("myHealth")}
            icon={<Heart className="w-4 h-4 mr-2" />}
            label="My Health Overview"
          />
          <TabButton
            active={activeTab === "trends"}
            onClick={() => setActiveTab("trends")}
            icon={<TrendingUp className="w-4 h-4 mr-2" />}
            label="Mental Health Trends"
          />
          <TabButton
            active={activeTab === "wellness"}
            onClick={() => setActiveTab("wellness")}
            icon={<Brain className="w-4 h-4 mr-2" />}
            label="Wellness Insights"
          />
          <TabButton
            active={activeTab === "visualization"}
            onClick={() => setActiveTab("visualization")}
            icon={<Activity className="w-4 h-4 mr-2" />}
            label="Health Data Visualization"
          />
          <TabButton
            active={activeTab === "graphical"}
            onClick={() => setActiveTab("graphical")}
            icon={<CalendarDays className="w-4 h-4 mr-2" />}
            label="Graphical Insights"
          />
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

type TabButtonProps = {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
};

const TabButton: React.FC<TabButtonProps> = ({
  active,
  onClick,
  icon,
  label,
}) => (
  <button
    className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
      active ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
    }`}
    onClick={onClick}
  >
    {icon}
    {label}
  </button>
);

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  change?: string;
  trend?: "up" | "down";
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  color,
  change,
  trend,
}) => (
  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <h3 className="text-2xl font-bold mt-1" style={{ color }}>
          {value}
        </h3>
        {change && (
          <p
            className={`text-xs mt-1 ${
              trend === "up" ? "text-green-500" : "text-red-500"
            }`}
          >
            {trend === "up" ? "↑" : "↓"} {change} from last week
          </p>
        )}
      </div>
      <div
        className="p-2 rounded-full"
        style={{ backgroundColor: `${color}20` }}
      >
        {icon}
      </div>
    </div>
  </div>
);

const MyHealthOverview = () => (
  <div>
    <h2 className="text-xl font-semibold text-gray-800 mb-4">
      My Health Overview
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <MetricCard
        title="Current Mood"
        value="7.5 / 10"
        icon={<Heart size={24} color="#3b82f6" />}
        color="#3b82f6"
        change="12%"
        trend="up"
      />
      <MetricCard
        title="Anxiety Level"
        value="Low"
        icon={<Brain size={24} color="#10b981" />}
        color="#10b981"
        change="8%"
        trend="down"
      />
      <MetricCard
        title="Stress Index"
        value="Medium"
        icon={<Activity size={24} color="#f59e0b" />}
        color="#f59e0b"
        change="5%"
        trend="up"
      />
      <MetricCard
        title="Risk Factors"
        value="2 Alerts"
        icon={<AlertTriangle size={24} color="#ef4444" />}
        color="#ef4444"
      />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          Weekly Mood Summary
        </h3>
        <div className="h-64">
          <LineChart
            width={500}
            height={250}
            data={moodData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="mood"
              stroke="#3b82f6"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="anxiety"
              stroke="#ef4444"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="stress"
              stroke="#f59e0b"
              strokeWidth={2}
            />
          </LineChart>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          Current Sentiment Analysis
        </h3>
        <div className="h-64 flex items-center justify-center">
          <PieChart width={300} height={250}>
            <Pie
              data={sentimentData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {sentimentData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </div>
    </div>
  </div>
);

const MentalHealthTrends = () => (
  <div>
    <h2 className="text-xl font-semibold text-gray-800 mb-4">
      Mental Health Trends
    </h2>

    <div className="grid grid-cols-1 gap-6">
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          Mood & Anxiety Trends (Last 30 Days)
        </h3>
        <div className="h-64">
          <LineChart
            width={700}
            height={250}
            data={[...moodData, ...moodData, ...moodData, ...moodData].slice(
              0,
              30
            )}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="mood"
              stroke="#3b82f6"
              strokeWidth={2}
              name="Mood"
            />
            <Line
              type="monotone"
              dataKey="anxiety"
              stroke="#ef4444"
              strokeWidth={2}
              name="Anxiety"
            />
          </LineChart>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            Common Triggers
          </h3>
          <div className="h-64">
            <BarChart
              width={300}
              height={250}
              data={[
                { name: "Work", value: 45 },
                { name: "Relationships", value: 30 },
                { name: "Health", value: 20 },
                { name: "Finances", value: 40 },
              ]}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            Monthly Progress
          </h3>
          <div className="h-64">
            <BarChart
              width={300}
              height={250}
              data={[
                { name: "Jan", value: 60 },
                { name: "Feb", value: 65 },
                { name: "Mar", value: 75 },
                { name: "Apr", value: 70 },
              ]}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#10b981" />
            </BarChart>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const WellnessInsights = () => (
  <div>
    <h2 className="text-xl font-semibold text-gray-800 mb-4">
      Wellness Insights
    </h2>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          Wellness Score
        </h3>
        <div className="h-64">
          <RadarChart width={300} height={250} data={wellnessScores}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis domain={[0, 100]} />
            <Radar
              name="Wellness"
              dataKey="score"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.6}
            />
            <Tooltip />
            <Legend />
          </RadarChart>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Risk Factors</h3>
        <div className="h-64">
          <BarChart
            width={300}
            height={250}
            data={riskFactors}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis type="category" dataKey="name" />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#ef4444" />
          </BarChart>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 lg:col-span-2">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          Weekly Activity Impact
        </h3>
        <div className="h-64">
          <BarChart
            width={700}
            height={250}
            data={[
              { name: "Exercise", positive: 75, negative: 25 },
              { name: "Meditation", positive: 65, negative: 35 },
              { name: "Social", positive: 80, negative: 20 },
              { name: "Reading", positive: 60, negative: 40 },
              { name: "Nature", positive: 85, negative: 15 },
            ]}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="positive" stackId="a" fill="#4ade80" />
            <Bar dataKey="negative" stackId="a" fill="#f87171" />
          </BarChart>
        </div>
      </div>
    </div>
  </div>
);

const HealthDataVisualization = () => (
  <div>
    <h2 className="text-xl font-semibold text-gray-800 mb-4">
      Health Data Visualization
    </h2>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          Mood vs. Physical Activity
        </h3>
        <div className="h-64">
          <ScatterChart
            width={300}
            height={250}
            margin={{ top: 20, right: 20, bottom: 10, left: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" dataKey="exercise" name="Exercise (minutes)" />
            <YAxis type="number" dataKey="mood" name="Mood Score" />
            <ZAxis range={[64, 144]} />
            <Tooltip />
            <Legend />
            <Scatter
              name="Correlation"
              data={[
                { exercise: 30, mood: 6 },
                { exercise: 45, mood: 7 },
                { exercise: 60, mood: 8 },
                { exercise: 20, mood: 5 },
                { exercise: 15, mood: 4 },
                { exercise: 75, mood: 9 },
                { exercise: 0, mood: 3 },
              ]}
              fill="#8884d8"
            />
          </ScatterChart>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          Sleep Quality vs. Stress
        </h3>
        <div className="h-64">
          <ScatterChart
            width={300}
            height={250}
            margin={{ top: 20, right: 20, bottom: 10, left: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" dataKey="sleep" name="Sleep (hours)" />
            <YAxis type="number" dataKey="stress" />
            <ZAxis range={[64, 144]} />
            <Tooltip />
            <Legend />
            <Scatter
              name="Correlation"
              data={[
                { sleep: 8, stress: 2 },
                { sleep: 7, stress: 3 },
                { sleep: 6, stress: 5 },
                { sleep: 5, stress: 7 },
                { sleep: 4, stress: 8 },
                { sleep: 9, stress: 1 },
                { sleep: 7.5, stress: 4 },
              ]}
              fill="#f59e0b"
            />
          </ScatterChart>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 lg:col-span-2">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          Text Analysis Results
        </h3>
        <div className="h-64">
          <BarChart
            width={700}
            height={250}
            data={[
              { date: "Week 1", positive: 30, neutral: 50, negative: 20 },
              { date: "Week 2", positive: 40, neutral: 45, negative: 15 },
              { date: "Week 3", positive: 35, neutral: 40, negative: 25 },
              { date: "Week 4", positive: 45, neutral: 40, negative: 15 },
            ]}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="positive" stackId="a" fill="#4ade80" />
            <Bar dataKey="neutral" stackId="a" fill="#facc15" />
            <Bar dataKey="negative" stackId="a" fill="#f87171" />
          </BarChart>
        </div>
      </div>
    </div>
  </div>
);

const GraphicalInsights = () => (
  <div>
    <h2 className="text-xl font-semibold text-gray-800 mb-4">
      Graphical Insights
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          Sentiment Analysis Over Time
        </h3>
        <div className="h-64">
          <LineChart
            width={300}
            height={250}
            data={[
              { date: "Jan", sentiment: 65 },
              { date: "Feb", sentiment: 68 },
              { date: "Mar", sentiment: 75 },
              { date: "Apr", sentiment: 70 },
              { date: "May", sentiment: 80 },
              { date: "Jun", sentiment: 75 },
            ]}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="sentiment"
              stroke="#8884d8"
              strokeWidth={2}
            />
          </LineChart>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          Mood Distribution
        </h3>
        <div className="h-64">
          <PieChart width={300} height={250}>
            <Pie
              data={moodDistributionData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {moodDistributionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          Weekly Usage Pattern
        </h3>
        <div className="h-64">
          <BarChart
            width={300}
            height={250}
            data={[
              { day: "Mon", entries: 5 },
              { day: "Tue", entries: 7 },
              { day: "Wed", entries: 4 },
              { day: "Thu", entries: 6 },
              { day: "Fri", entries: 8 },
              { day: "Sat", entries: 10 },
              { day: "Sun", entries: 9 },
            ]}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="entries" fill="#3b82f6" />
          </BarChart>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          Activity Impact
        </h3>
        <div className="h-64">
          <RadarChart
            width={300}
            height={250}
            data={[
              { subject: "Exercise", score: 80 },
              { subject: "Sleep", score: 85 },
              { subject: "Meditation", score: 65 },
              { subject: "Socialization", score: 70 },
              { subject: "Diet", score: 60 },
            ]}
          >
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis domain={[0, 100]} />
            <Radar
              name="Impact"
              dataKey="score"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.6}
            />
            <Tooltip />
            <Legend />
          </RadarChart>
        </div>
      </div>
    </div>
  </div>
);

export default HealthInsightsDashboard;
