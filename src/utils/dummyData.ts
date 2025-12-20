export interface WeightRecord {
  id: string;
  weight: number;
  date: string;
}

export const weightHistoryData: WeightRecord[] = [
  // --- DATA LAMA (2023)
  { id: '1', weight: 49.5, date: '2023-09-28' },
  { id: '2', weight: 49.7, date: '2023-09-30' },

  // November 2025 (Bulan lalu)
  { id: '3', weight: 51.0, date: '2025-11-15' },
  { id: '4', weight: 51.2, date: '2025-11-20' },

  // Desember 2025
  { id: '5', weight: 50.0, date: '2025-12-01' },
  { id: '6', weight: 49.8, date: '2025-12-05' },
  { id: '7', weight: 50.4, date: '2025-12-10' },
  { id: '8', weight: 50.1, date: '2025-12-12' },
  { id: '9', weight: 49.9, date: '2025-12-15' },
  { id: '10', weight: 49.5, date: '2025-12-18' },
  { id: '11', weight: 49.2, date: '2025-12-20' },
];
