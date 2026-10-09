import { DayAdherence, Medicine } from "../types/medicine";

// ARRAY OF OBJECTS
export const medicines: Medicine[] = [
  { id: "1", name: "Captopril", dosage: "25 mg", time: "06:00", status: "missed", note: "Sebelum makan" },
  { id: "2", name: "Metformin", dosage: "500 mg", time: "07:00", status: "taken", note: "Sesudah makan" },
  { id: "3", name: "Amlodipine", dosage: "5 mg", time: "12:00", status: "pending", note: "Sesudah makan" },
  { id: "4", name: "Glimepiride", dosage: "2 mg", time: "18:00", status: "pending", note: "Sebelum makan" },
];

export const weekly: DayAdherence[] = [
  { day: "S", percent: 100 },
  { day: "S", percent: 100 },
  { day: "R", percent: 75 },
  { day: "K", percent: 100 },
  { day: "J", percent: 100 },
  { day: "S", percent: 50 },
  { day: "M", percent: 60 },
];