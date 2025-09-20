export function createRequestUrl(
  base: string,
  method: string,
  url: string,
  body?: object | string | null,
  headers: Record<string, string> = {}
): string {
  const encodedUrl = btoa(url);

  let encodedBody = "";

  if (body) {
    const bodyStr = typeof body === "string" ? body : JSON.stringify(body);
    encodedBody = "/" + btoa(bodyStr);
  }

  const queryParams = new URLSearchParams();

  Object.entries(headers).forEach(([key, value]) => {
    queryParams.append(key, value);
  });

  const queryString = queryParams.toString()
    ? "?" + queryParams.toString()
    : "";

  return `${base}/${method}/${encodedUrl}${encodedBody}${queryString}`;
}

export function parseUrl(url: string) {
  const u = new URL(url);
  const parts = u.pathname.split("/").filter(Boolean);
  const method = parts[1];
  const encodedUrl = parts[2];
  const encodedBody = parts[3];

  const decodedUrl = encodedUrl ? atob(encodedUrl) : "";
  const decodedBody = encodedBody ? atob(encodedBody) : "";

  const headers: Record<string, string> = {};
  u.searchParams.forEach((value, key) => {
    headers[key] = value;
  });

  return {
    method,
    url: decodedUrl,
    body: decodedBody,
    headers,
  };
}

export function beautify(
  value: string,
  type: "json" | "text" = "json"
): string {
  if (!value.trim()) return "";

  if (type === "json") {
    try {
      return JSON.stringify(JSON.parse(value), null, 2);
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error("Invalid JSON format");
      }
      throw error;
    }
  }

  return value
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join("\n");
}
