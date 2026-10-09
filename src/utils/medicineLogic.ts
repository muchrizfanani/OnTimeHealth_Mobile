import { Medicine } from '../types/medicine';

/**
 * Menghitung persentase kepatuhan minum obat (jumlah obat 'taken' / total obat * 100)
 */
export const hitungKepatuhan = (medicines: Medicine[]): number => {
  if (medicines.length === 0) return 0;
  const takenCount = medicines.filter((m) => m.status === 'taken').length;
  return (takenCount / medicines.length) * 100;
};
