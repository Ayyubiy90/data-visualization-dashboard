import React from "react";

interface AchievementBadgeProps {
  title: string;
  description: string;
  isAchieved: boolean;
}

const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  title,
  description,
  isAchieved,
}) => {
  return (
    <div
      className={`p-4 border rounded-lg ${
        isAchieved
          ? "bg-green-100 border-green-500"
          : "bg-gray-100 border-gray-300"
      }`}>
      <h4 className="font-bold text-lg">{title}</h4>
      <p className="text-sm">{description}</p>
      {isAchieved && <span className="text-green-600">Achieved!</span>}
    </div>
  );
};

export default AchievementBadge;
