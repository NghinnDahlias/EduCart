const devBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
const prodBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL_PROD;

const rawBase = process.env.NODE_ENV === "production" && prodBaseUrl ? prodBaseUrl : devBaseUrl;
export const API_BASE_URL = rawBase.endsWith("/") ? rawBase.slice(0, -1) : rawBase;

export const getImageUrl = (url: string | null | undefined): string => {
  if (!url) return "/placeholder-book.png";
  if (url.startsWith("http")) return url;
  return `${API_BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
};

// Token management (client-side only)
export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("educart_token");
};
export const setToken = (token: string) => localStorage.setItem("educart_token", token);
export const clearToken = () => localStorage.removeItem("educart_token");
export const getUser = (): Record<string, unknown> | null => {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("educart_user");
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
};
export const setUser = (user: unknown) => localStorage.setItem("educart_user", JSON.stringify(user));
export const clearUser = () => localStorage.removeItem("educart_user");

interface RequestOptions extends RequestInit {
  auth?: boolean;
  json?: unknown;
}

export async function apiFetch<T = unknown>(path: string, opts: RequestOptions = {}): Promise<T> {
  const { auth = false, json, headers: extraHeaders, ...rest } = opts;
  const url = `${API_BASE_URL}/api${path.startsWith("/") ? path : "/" + path}`;

  const headers: Record<string, string> = { ...(extraHeaders as Record<string, string>) };
  if (json !== undefined) headers["Content-Type"] = "application/json";
  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    ...rest,
    headers,
    body: json !== undefined ? JSON.stringify(json) : rest.body,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const errMessage = data?.error || data?.message || `HTTP ${res.status}`;
    const details = data?.details ? JSON.stringify(data.details) : "";
    throw new Error(details ? `${errMessage}: ${details}` : errMessage);
  }
  return data as T;
}

// Convenience helpers
export const api = {
  get: <T>(path: string, auth = false) => apiFetch<T>(path, { method: "GET", auth }),
  post: <T>(path: string, body: unknown, auth = false) => apiFetch<T>(path, { method: "POST", json: body, auth }),
  put: <T>(path: string, body: unknown, auth = false) => apiFetch<T>(path, { method: "PUT", json: body, auth }),
  delete: <T>(path: string, auth = false) => apiFetch<T>(path, { method: "DELETE", auth }),
  postForm: <T>(path: string, body: FormData, auth = false) => {
    const token = auth ? getToken() : null;
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    return apiFetch<T>(path, {
      method: "POST",
      body,
      headers,
      // Nếu auth=true thì API fetch sẽ tự gắn Authorization, còn ở đây ta đã gắn thủ công.
      // Giữ auth=false để tránh trùng.
      auth: false,
    });
  },
};
