// ===============================================================
// RUBRIK MODUL 3: Interface untuk API Call & Response Object
// ===============================================================

// 1. Generic API Response Wrapper (Sesuai Halaman 20 Modul 3)
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  source?: "external_api" | "cloud_cache" | "local_fallback";
  timestamp?: string;
}

// 2. Interface Raw Response dari External API (DummyJSON / Public Health API)
export interface ExternalPostItem {
  id: number;
  title: string;
  body: string;
  tags?: string[];
  views?: number;
  reactions?: {
    likes: number;
    dislikes: number;
  };
}

export interface ExternalPostResponse {
  posts: ExternalPostItem[];
  total: number;
  skip: number;
  limit: number;
}

// 3. Interface Model Edukasi Kesehatan Terstandar Aplikasi
export interface HealthArticle {
  id: string;
  category: "Panduan" | "Interaksi" | "Tips" | "Info Medis";
  title: string;
  summary: string;
  content: string;
  readTime: string;
  source: string;
  isOnlineFetched: boolean;
}

// 4. Interface Hasil Verifikasi BPOM (Demonstrasi .resolve() & .reject())
export interface BPOMVerificationResult {
  valid: boolean;
  drugCode: string;
  tradeName: string;
  distributor: string;
  activeSubstance: string;
  verifiedAt: string;
}

// 5. Interface Sinkronisasi Cloud (Demonstrasi Custom Promise & .then())
export interface CloudSyncResult {
  syncId: string;
  itemsUploaded: number;
  serverStatus: "SYNCED" | "QUEUED";
  completedAt: string;
  bandwidthMs: number;
}
