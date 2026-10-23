import React, { createContext, useContext, useState } from "react";
import { Medicine, MedicineStatus, UserProfile } from "../types/medicine";
import { initialMedicines } from "../data/medicines";

interface AppContextType {
  medicines: Medicine[];
  userProfile: UserProfile;
  currentRole: "patient" | "caregiver";
  switchRole: (role: "patient" | "caregiver") => void;
  isSeniorMode: boolean;
  toggleSeniorMode: () => void;
  addMedicine: (medicine: Medicine) => void;
  updateMedicineStatus: (id: string, status: MedicineStatus, reason?: string) => void;
  snoozeMedicine: (id: string, minutes: number) => void;
  takeMedicine: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [medicines, setMedicines] = useState<Medicine[]>(initialMedicines);
  const [isSeniorMode, setIsSeniorMode] = useState<boolean>(false);
  const [currentRole, setCurrentRole] = useState<"patient" | "caregiver">("patient");

  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "Ibu Siti Rahma",
    age: 62,
    gender: "Perempuan",
    condition: "Hipertensi & Diabetes Tipe 2",
    role: "patient",
  });

  const switchRole = (role: "patient" | "caregiver") => {
    setCurrentRole(role);
    if (role === "caregiver") {
      setUserProfile({
        name: "Rizky (Anak / Pengasuh)",
        age: 26,
        gender: "Laki-laki",
        condition: "Pendamping Pasien Ibu Siti",
        role: "caregiver",
      });
    } else {
      setUserProfile({
        name: "Ibu Siti Rahma",
        age: 62,
        gender: "Perempuan",
        condition: "Hipertensi & Diabetes Tipe 2",
        role: "patient",
      });
    }
  };

  const toggleSeniorMode = () => {
    setIsSeniorMode((prev) => !prev);
  };

  const addMedicine = (newMed: Medicine) => {
    setMedicines((prev) => [newMed, ...prev]);
  };

  const updateMedicineStatus = (id: string, status: MedicineStatus, reason?: string) => {
    setMedicines((prev) =>
      prev.map((med) => {
        if (med.id === id) {
          return {
            ...med,
            status,
            missedReason: reason || med.missedReason,
          };
        }
        return med;
      })
    );
  };

  const takeMedicine = (id: string) => {
    setMedicines((prev) =>
      prev.map((med) => {
        if (med.id === id) {
          const newStock = med.stock !== undefined ? Math.max(0, med.stock - 1) : undefined;
          return {
            ...med,
            status: "taken",
            stock: newStock,
          };
        }
        return med;
      })
    );
  };

  const snoozeMedicine = (id: string, minutes: number) => {
    setMedicines((prev) =>
      prev.map((med) => {
        if (med.id === id) {
          return {
            ...med,
            status: "snoozed",
            note: `${med.note || ""} (Ditunda ${minutes} mnt)`,
          };
        }
        return med;
      })
    );
  };

  return (
    <AppContext.Provider
      value={{
        medicines,
        userProfile,
        currentRole,
        switchRole,
        isSeniorMode,
        toggleSeniorMode,
        addMedicine,
        updateMedicineStatus,
        snoozeMedicine,
        takeMedicine,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
