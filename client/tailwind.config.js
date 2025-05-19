/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1D4ED8", // Mavi (Ana Renk)
          light: "#3B82F6",
          dark: "#1E40AF",
        },
        secondary: {
          DEFAULT: "#0F172A", // Lacivertimsi gri (arka plan / sidebar vs.)
          light: "#1E293B",
          dark: "#0B1120",
        },
        success: {
          DEFAULT: "#10B981", // Yeşil (başarılı işlem)
          light: "#6EE7B7",
          dark: "#047857",
        },
        danger: {
          DEFAULT: "#EF4444", // Kırmızı (hata)
          light: "#FCA5A5",
          dark: "#B91C1C",
        },
        warning: {
          DEFAULT: "#F59E0B", // Sarı (uyarı)
          light: "#FDE68A",
          dark: "#B45309",
        },
        gray: {
          light: "#F8FAFC",
          DEFAULT: "#E2E8F0", // Gri zeminler
          dark: "#475569",
        },
        background: {
          light: "#F1F5F9", // Açık arka plan
          dark: "#1E293B", // Koyu tema için alternatif
        },
      },
    },
  },
  plugins: [],
};
