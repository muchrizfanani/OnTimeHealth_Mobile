// TYPE & INTERFACE
export type MedicineStatus = "taken" | "pending" | "missed" | "snoozed"; // union type

export type MedicineForm = "Tablet" | "Kapsul" | "Sirup" | "Suntik";

export interface Medicine {
  readonly id: string; // tidak bisa diubah setelah dibuat
  name: string;
  dosage: string;
  time: string;
  status: MedicineStatus;
  note?: string; // opsional: aturan minum (misal: "Sesudah makan")
  dose?: string; // backward-compatible alias untuk dosage
  form?: MedicineForm;
  instruction?: string; // backward-compatible alias untuk note
  stock?: number;
}

export interface DayAdherence {
  day: string;
  percent: number;
}
