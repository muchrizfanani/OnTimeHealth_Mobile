// TYPE & INTERFACE
export type MedicineStatus = "taken" | "pending" | "missed"; // union type

export interface Medicine {
  readonly id: string; // tidak bisa diubah setelah dibuat
  name: string;
  dosage: string;
  time: string;
  status: MedicineStatus;
  note?: string; // opsional
}

export interface DayAdherence {
  day: string;
  percent: number;
}