// client/src/utils/helpers.ts
import { format } from "date-fns";
import { Patient } from "../data/mockData";

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return format(date, "MMM d, yyyy h:mm a");
};

export const getSentimentColor = (score: number) => {
  if (score <= -0.6) return "bg-red-500";
  if (score <= -0.3) return "bg-yellow-500";
  return "bg-green-500";
};

export const getRiskBadge = (level: Patient["riskLevel"]) => {
  switch (level) {
    case "low":
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
          Low
        </span>
      );
    case "medium":
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
          Medium
        </span>
      );
    case "high":
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
          High
        </span>
      );
    default:
      return null;
  }
};
