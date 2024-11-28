export interface RawDataRow {
  date: string;
  revenue: string | number;
  users: string | number;
  orders: string | number;
  [key: string]: string | number; // Allow for additional fields
}

export interface ValidationError {
  row: number;
  field: string;
  message: string;
}

export interface FileProcessingResult {
  data: RawDataRow[];
  errors: ValidationError[];
}
