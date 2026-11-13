// Tema Warna & Desain Modern OnTimeHealth (Teal & Mint Green)
export const colors = {
  // Teal / Mint Brand Palette
  primary: "#0D9488",        // Teal 600 - Warna utama modern & profesional
  primaryDark: "#0F766E",    // Teal 700 - Kontras tinggi untuk teks & header
  primaryDeep: "#115E59",    // Teal 800 - Aksen gelap
  primaryLight: "#CCFBF1",   // Teal 100 - Latar belakang badge & chip
  primaryLightest: "#F0FDFA",// Teal 50 - Latar belakang kartu halus
  mintAccent: "#14B8A6",     // Teal 500 - Aksen mint cerah
  mintGlow: "#5EEAD4",       // Teal 300 - Efek glow & highlight
  
  // Background & Surface
  background: "#F8FAFC",     // Slate 50 - Kanvas bersih
  cardBackground: "#FFFFFF", // Putih murni untuk kartu elegan
  surfaceMuted: "#F1F5F9",   // Slate 100
  
  // Typography Colors
  textPrimary: "#0F172A",    // Slate 900 - Teks utama sangat jelas
  textSecondary: "#475569",  // Slate 600 - Teks sekunder nyaman dibaca
  textMuted: "#94A3B8",      // Slate 400 - Keterangan & placeholder
  white: "#FFFFFF",
  
  // Border & Divider
  border: "#E2E8F0",         // Slate 200 - Garis kartu halus
  borderLight: "#F1F5F9",    // Slate 100
  borderTeal: "#99F6E4",     // Teal 200 - Border aksen aktif
  
  // Status colors untuk styling dinamis
  statusTaken: "#0F766E",     // Teal gelap (Sudah Diminum)
  statusTakenBg: "#CCFBF1",   // Mint muda
  statusTakenBorder: "#14B8A6",
  
  statusSnoozed: "#B45309",   // Amber (Ditunda)
  statusSnoozedBg: "#FEF3C7",
  statusSnoozedBorder: "#F59E0B",
  
  statusMissed: "#B91C1C",    // Red (Terlewat / Belum)
  statusMissedBg: "#FEE2E2",
  statusMissedBorder: "#EF4444",
  
  statusPending: "#475569",   // Slate (Menunggu jadwal)
  statusPendingBg: "#F1F5F9",
  statusPendingBorder: "#CBD5E1",
};

export const shadows = {
  subtle: {
    shadowColor: "#0F766E",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  card: {
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  glow: {
    shadowColor: "#0D9488",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 12,
    elevation: 5,
  },
};
