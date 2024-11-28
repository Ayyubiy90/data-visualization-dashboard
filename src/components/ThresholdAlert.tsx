import React from "react";

interface ThresholdAlertProps {
  value: number;
  threshold: number;
}

const ThresholdAlert: React.FC<ThresholdAlertProps> = ({
  value,
  threshold,
}) => {
  return (
    <div>
      {value > threshold && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert">
          <strong className="font-bold">Alert!</strong>
          <span className="block sm:inline">
            {" "}
            The value {value} exceeds the threshold of {threshold}.
          </span>
        </div>
      )}
    </div>
  );
};

export default ThresholdAlert;
