// TYPE & INTERFACE SESUAI PRD & MODUL 2
export type MedicineStatus = "taken" | "pending" | "missed" | "snoozed";

export type MedicineForm = "Tablet" | "Kapsul" | "Sirup" | "Injeksi";

export interface Medicine {
  readonly id: string;
  name: string;
  dosage: string;
  form: MedicineForm;
  time: string;
  status: MedicineStatus;
  note?: string; // Aturan minum / catatan dokter
  duration?: string; // misal: "7 hari" / "Rutin / Seumur Hidup"
  frequency?: string; // misal: "3x sehari"
  stock?: number; // Jumlah stok fisik obat
  missedReason?: string; // Alasan jika dosis dilewati

  // Kompatibilitas komponen demo sebelumnya
  dose?: string;
  instruction?: string;
}

export interface UserProfile {
  name: string;
  age: number;
  gender: "Laki-laki" | "Perempuan";
  condition: string;
  role: "patient" | "caregiver";
}

export interface DayAdherence {
  day: string;
  percent: number;
}
