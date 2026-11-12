// ===============================================================
// RUBRIK MODUL 3: Service HTTP & Pre-built Async Function
// ===============================================================

import { ApiResponse } from "../types/api";

// Endpoint API Eksternal Publik yang diakses aplikasi
export const API_BASE_URL = "https://dummyjson.com";

/**
 * Pre-built Async Function Wrapper menggunakan fetch()
 * Mengambil data mentah dari server dan memetakannya ke Generic Interface T
 */
export async function getJsonFromApi<T>(endpoint: string): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  console.log(`[HTTP GET] Memulai request ke: ${url}`);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP Request Gagal: ${response.status} ${response.statusText}`);
  }

  const result: T = await response.json();
  return result;
}
