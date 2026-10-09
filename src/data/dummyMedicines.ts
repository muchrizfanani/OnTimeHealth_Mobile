import { Medicine } from '../types/medicine';

export const dummyMedicines: Medicine[] = [
  {
    id: 'med-1',
    name: 'Parasetamol',
    dose: '500 mg',
    form: 'Tablet',
    time: '08:00',
    instruction: 'Sesudah makan',
    status: 'taken',
    stock: 10,
  },
  {
    id: 'med-2',
    name: 'Amoxicillin',
    dose: '1 Kapsul',
    form: 'Kapsul',
    time: '13:00',
    instruction: 'Sesudah makan (Habiskan)',
    status: 'snoozed',
    stock: 6,
  },
  {
    id: 'med-3',
    name: 'Vitamin C & Zinc',
    dose: '1 Tablet',
    form: 'Tablet',
    time: '19:00',
    instruction: 'Sebelum tidur',
    status: 'pending',
    stock: 20,
  },
  {
    id: 'med-4',
    name: 'Antasida Doen',
    dose: '1 Sendok Takar (5 ml)',
    form: 'Sirup',
    time: '07:30',
    instruction: 'Sebelum makan',
    status: 'missed',
    stock: 2,
  },
];
