// ===============================================================
// RUBRIK MODUL 3: Custom Promise Utility (Sesuai Halaman 20 Modul 3)
// Menggunakan Promise Constructor dengan new Promise((resolve) => ...)
// ===============================================================

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
