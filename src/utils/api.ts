// src/hooks/useApi.ts
import { useAuth } from "../context/AuthContext";
import env from "../config/env";

const API_URL = env.API_URL;

export function useApi() {
  const { accessToken } = useAuth();

  const getHeaders = (customHeaders: HeadersInit = {}) => ({
    "Content-Type": "application/json",
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    ...customHeaders,
  });

  async function apiFetch<T = unknown>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const res = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: getHeaders(options.headers),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error((error as { message?: string }).message || "API request failed");
    }

    return res.json() as Promise<T>;
  }

  async function apiPost<T = unknown>(
    endpoint: string,
    body?: unknown,
    options: RequestInit = {}
  ): Promise<T> {
    return apiFetch<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
      ...options,
    });
  }

  async function apiPut<T = unknown>(
    endpoint: string,
    body?: unknown,
    options: RequestInit = {}
  ): Promise<T> {
    return apiFetch<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
      ...options,
    });
  }

  async function apiDelete<T = unknown>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    return apiFetch<T>(endpoint, {
      method: "DELETE",
      ...options,
    });
  }

  return { apiFetch, apiPost, apiPut, apiDelete };
}
