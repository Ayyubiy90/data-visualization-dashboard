import React, { useState, useRef } from "react";
import { Upload, X, Check, AlertCircle } from "lucide-react";
import { DataPoint } from "../types/data";

interface DataUploaderProps {
  onDataUpload: (data: DataPoint[]) => void;
  onError: (error: string) => void;
}

interface ValidationError {
  row: number;
  field: string;
  message: string;
}

const DataUploader: React.FC<DataUploaderProps> = ({
  onDataUpload,
  onError,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
    []
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateData = (data: any[]): ValidationError[] => {
    const errors: ValidationError[] = [];

    data.forEach((row, index) => {
      if (!row.date || isNaN(new Date(row.date).getTime())) {
        errors.push({
          row: index + 1,
          field: "date",
          message: "Invalid date format",
        });
      }

      ["revenue", "users", "orders"].forEach((field) => {
        if (typeof row[field] !== "number" || isNaN(row[field])) {
          errors.push({
            row: index + 1,
            field,
            message: `Invalid ${field} value`,
          });
        }
      });
    });

    return errors;
  };

  const cleanData = (data: any[]): DataPoint[] => {
    return data.map((row) => ({
      date: new Date(row.date).toISOString().split("T")[0],
      revenue: Number(row.revenue),
      users: Math.floor(Number(row.users)),
      orders: Math.floor(Number(row.orders)),
    }));
  };

  const processFile = async (file: File) => {
    setIsProcessing(true);
    setValidationErrors([]);

    try {
      const text = await file.text();
      let data: any[];

      if (file.name.endsWith(".csv")) {
        // Process CSV
        const rows = text.split("\n");
        const headers = rows[0].split(",").map((h) => h.trim());
        data = rows.slice(1).map((row) => {
          const values = row.split(",");
          return headers.reduce((obj, header, i) => {
            obj[header] = values[i]?.trim();
            return obj;
          }, {} as any);
        });
      } else if (file.name.endsWith(".json")) {
        // Process JSON
        data = JSON.parse(text);
      } else {
        throw new Error("Unsupported file format");
      }

      const errors = validateData(data);
      if (errors.length > 0) {
        setValidationErrors(errors);
        return;
      }

      const cleanedData = cleanData(data);
      onDataUpload(cleanedData);
    } catch (error) {
      onError(
        error instanceof Error ? error.message : "Failed to process file"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      await processFile(file);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        Data Upload
      </h3>

      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${
            isDragging
              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
              : "border-gray-300 dark:border-gray-600"
          }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".csv,.json"
          onChange={handleFileSelect}
        />

        <Upload
          className={`mx-auto h-12 w-12 mb-4 ${
            isDragging ? "text-blue-500" : "text-gray-400"
          }`}
        />

        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
          Drag and drop your CSV or JSON file here, or{" "}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-blue-500 hover:text-blue-600">
            browse
          </button>
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Supported formats: CSV, JSON
        </p>
      </div>

      {isProcessing && (
        <div className="mt-4 text-center text-gray-600 dark:text-gray-300">
          Processing file...
        </div>
      )}

      {validationErrors.length > 0 && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400 mb-2">
            <AlertCircle size={16} />
            <span className="font-medium">Validation Errors</span>
          </div>
          <ul className="text-sm space-y-1">
            {validationErrors.map((error, index) => (
              <li key={index} className="text-red-600 dark:text-red-400">
                Row {error.row}: {error.message} ({error.field})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DataUploader;
