export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export type CustomResponseBody = {
  status: number;
  statusText: string;
  body: unknown;
};

export type ErrorResponseBody = {
  error: string;
  status: number;
};

export type HeadersType = Record<string, string>;

export enum BodyType {
  req = "request",
  response = "response",
}

export type BodyProps = {
  type: BodyType;
  placeholder: string;
  value: string;
  onchange: (str: string | Error) => void;
  clear?: () => void;
  status?: string;
  handlePrettify: (str: string) => void;
};
