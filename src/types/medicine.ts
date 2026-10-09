export type MedicineStatus = 'taken' | 'snoozed' | 'missed' | 'pending';

export type MedicineForm = 'Tablet' | 'Kapsul' | 'Sirup' | 'Suntik';

export interface Medicine {
  id: string;
  name: string;
  dose: string;
  form: MedicineForm;
  time: string;
  instruction: string; // misal: "Sesudah makan" / "Sebelum makan"
  status: MedicineStatus;
  stock?: number;
}
