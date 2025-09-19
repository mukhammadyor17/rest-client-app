export type HistoryRow = {
  id: string;
  method: string;
  url: string;
  status_code: number;
  created_at: string;
  latency_ms: number;
  request_size: number;
  response_size: number;
  error: string | null;
  headers?: Record<string, string>;
  body?: unknown;
};
