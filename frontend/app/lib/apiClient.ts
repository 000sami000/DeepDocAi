const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

type ApiOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  token?: string | null;
  body?: any;
  isFormData?: boolean;
  cache?: RequestCache;
};

export async function apiClient<T = any>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  const {
    method = "GET",
    token,
    body,
    isFormData = false,
    cache = "no-store",
  } = options;

  const headers: Record<string, string> = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    cache,
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
  });

  if (!res.ok) {
  const contentType = res.headers.get("content-type");

  let errorMessage = "API Error";

  if (contentType?.includes("application/json")) {
    const data = await res.json();
    errorMessage = data.message || JSON.stringify(data);
  } else {
    errorMessage = await res.text();
  }

  throw new Error(errorMessage);
 }
  return res.json();
}