import { useWindowDimensions } from "react-native";

// Skala ukuran mengikuti lebar layar (HP kecil sampai tablet)
export function useScale() {
  const { width } = useWindowDimensions();
  const k = Math.min(Math.max(width / 390, 0.9), 1.25);
  return (size: number) => Math.round(size * k);
}