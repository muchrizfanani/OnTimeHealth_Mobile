// ===============================================================
// RUBRIK MODUL 3: Service Asynchronous & API Call OnTimeHealth
// Memenuhi seluruh kriteria:
// 1. External API Call & Pemetaan ke Interface (10%)
// 2. Custom & Pre-built Async Function (10%)
// 3. Custom Promise dengan resolve(), reject(), dan .then() (10%)
// ===============================================================

import {
  ApiResponse,
  BPOMVerificationResult,
  CloudSyncResult,
  ExternalPostResponse,
  HealthArticle,
} from "../types/api";
import { delay } from "../utils/delay";
import { getJsonFromApi } from "./api";

// Fallback data lokal bila pengguna offline
const LOCAL_FALLBACK_ARTICLES: HealthArticle[] = [
  {
    id: "local-1",
    category: "Panduan",
    title: "Aturan Minum Obat: Sebelum vs Sesudah Makan",
    summary: "Mengapa ada obat yang wajib diminum saat perut kosong dan ada yang bersama makanan?",
    content:
      "Obat 'sebelum makan' biasanya diserap lebih baik saat lambung kosong (minimal 1 jam sebelum atau 2 jam sesudah makan). Sebaliknya, obat 'sesudah makan' diminum untuk mencegah iritasi dinding lambung atau rasa mual.",
    readTime: "3 mnt baca",
    source: "Katalog Internal OnTimeHealth",
    isOnlineFetched: false,
  },
  {
    id: "local-2",
    category: "Interaksi",
    title: "Interaksi Kalsium Susu dengan Obat Tertentu",
    summary: "Kalsium dalam susu dapat mengikat zat aktif obat dan menurunkan efektivitasnya.",
    content:
      "Kandungan kalsium pada susu atau antasida dapat mengikat beberapa jenis antibiotik (seperti Ciprofloxacin atau Doksisiklin) dan suplemen zat besi, membentuk senyawa yang sulit diserap tubuh.",
    readTime: "4 mnt baca",
    source: "Katalog Internal OnTimeHealth",
    isOnlineFetched: false,
  },
  {
    id: "local-3",
    category: "Tips",
    title: "Pentingnya Menghabiskan Antibiotik Sampai Tuntas",
    summary: "Jangan pernah berhenti minum antibiotik meski tubuh sudah terasa lebih sehat.",
    content:
      "Menghentikan antibiotik sebelum tuntas memberi kesempatan pada sisa bakteri untuk bermutasi menjadi resisten (kebal terhadap obat).",
    readTime: "3 mnt baca",
    source: "Katalog Internal OnTimeHealth",
    isOnlineFetched: false,
  },
];

// ===============================================================
// 1. EXTERNAL API CALL & CUSTOM ASYNC FUNCTION (Kriteria 1 & 2)
// Menggunakan fetch (pre-built) dan fungsi async custom
// Mengambil data eksternal lalu memasukkannya ke Object Interface
// ===============================================================
export async function fetchHealthEducationArticles(): Promise<ApiResponse<HealthArticle[]>> {
  console.log("[Service] Memulai proses fetch data dari External API...");

  try {
    // 1. Pre-built async function: memanggil External API
    const rawData = await getJsonFromApi<ExternalPostResponse>("/posts?limit=6");

    // 2. Pemetaan response JSON ke dalam Object sesuai Interface HealthArticle
    const mappedArticles: HealthArticle[] = rawData.posts.map((item, index) => {
      const categories: HealthArticle["category"][] = [
        "Panduan",
        "Interaksi",
        "Tips",
        "Info Medis",
      ];
      const assignedCategory = categories[index % categories.length];

      return {
        id: `ext-${item.id}`,
        category: assignedCategory,
        title: item.title.charAt(0).toUpperCase() + item.title.slice(1),
        summary: item.body.slice(0, 95) + "...",
        content: item.body,
        readTime: `${Math.max(2, Math.round(item.body.length / 80))} mnt baca`,
        source: "External REST API (dummyjson.com/posts)",
        isOnlineFetched: true,
      };
    });

    console.log(`[Service] Berhasil memetakan ${mappedArticles.length} artikel ke Interface HealthArticle.`);

    // 3. Return dibungkus Generic ApiResponse<T>
    return {
      success: true,
      data: mappedArticles,
      message: "Data artikel edukasi berhasil dimuat dari cloud API.",
      source: "external_api",
      timestamp: new Date().toLocaleTimeString("id-ID"),
    };
  } catch (error) {
    console.warn("[Service] Gagal menghubungi API eksternal, beralih ke cache lokal:", error);
    // Fallback bila internet offline
    return {
      success: false,
      data: LOCAL_FALLBACK_ARTICLES,
      message: "Menggunakan data offline lokal (Koneksi ke API eksternal terhambat).",
      source: "local_fallback",
      timestamp: new Date().toLocaleTimeString("id-ID"),
    };
  }
}

// ===============================================================
// 2. CUSTOM PROMISE DENGAN RESOLVE & REJECT (Kriteria 3)
// Menggunakan new Promise((resolve, reject) => { ... })
// ===============================================================

/**
 * Memverifikasi keaslian nomor registrasi izin edar BPOM obat.
 * Mendemonstrasikan penggunaan resolve() saat valid dan reject() saat kode salah.
 */
export function verifyBPOMRegistration(code: string): Promise<BPOMVerificationResult> {
  return new Promise((resolve, reject) => {
    console.log(`[BPOM Promise] Memulai verifikasi kode: "${code}"`);

    // Simulasi penundaan jaringan 1000ms
    setTimeout(() => {
      const cleanCode = code.trim().toUpperCase();

      if (!cleanCode) {
        // Panggil reject() bila input kosong
        reject(new Error("Kode BPOM tidak boleh kosong. Harap masukkan nomor registrasi obat."));
        return;
      }

      // Format resmi BPOM: DKL, GBL, POM, atau DTL
      const isValidFormat =
        cleanCode.startsWith("BPOM") ||
        cleanCode.startsWith("DKL") ||
        cleanCode.startsWith("POM") ||
        cleanCode.startsWith("GBL") ||
        cleanCode.startsWith("DTL");

      if (isValidFormat) {
        // Panggil resolve() saat nomor registrasi valid
        const result: BPOMVerificationResult = {
          valid: true,
          drugCode: cleanCode,
          tradeName: "Obat Bersertifikasi Resmi Farmasi",
          distributor: "PT Kimia Farma / PT Kalbe Farma Tbk",
          activeSubstance: "Zat Aktif Teruji Klinis & Terdaftar di BPOM RI",
          verifiedAt: new Date().toLocaleString("id-ID"),
        };
        resolve(result);
      } else {
        // Panggil reject() saat nomor registrasi tidak valid
        reject(
          new Error(
            `Nomor "${cleanCode}" tidak terdaftar di direktori BPOM. Awalan yang valid: BPOM-, DKL, POM, GBL, atau DTL.`
          )
        );
      }
    }, 1000);
  });
}

/**
 * Simulasi sinkronisasi jadwal obat ke Server Cloud Rumah Sakit / Pendamping
 * Mendemonstrasikan custom Promise dengan resolve dan reject
 */
export function simulateCloudSync(
  patientName: string,
  totalMedicines: number
): Promise<CloudSyncResult> {
  return new Promise((resolve, reject) => {
    console.log(`[CloudSync Promise] Mengirim ${totalMedicines} data obat pasien ${patientName}...`);

    setTimeout(() => {
      if (totalMedicines === 0) {
        reject(new Error("Gagal sinkronisasi: Tidak ada data jadwal obat yang dapat diunggah."));
        return;
      }

      // Sukses -> panggil resolve()
      const syncResult: CloudSyncResult = {
        syncId: `SYNC-${Date.now().toString().slice(-6)}`,
        itemsUploaded: totalMedicines,
        serverStatus: "SYNCED",
        completedAt: new Date().toLocaleTimeString("id-ID") + " WIB",
        bandwidthMs: 420,
      };

      resolve(syncResult);
    }, 1200);
  });
}
