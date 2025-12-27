const deg2rad = (deg: number) => {
  return deg * (Math.PI / 180);
};

/**
 * Menghitung jarak antara dua koordinat GPS menggunakan Haversine Formula
 * @returns Jarak dalam Kilometer (KM)
 */
export const getDistanceFromLatLonInKm = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) => {
  const R = 6371; // Radius bumi dalam km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Jarak dalam km
  return d;
};

/**
 * Mengubah detik menjadi format jam digital HH : MM : SS
 */
export const formatTime = (seconds: number) => {
  const getSeconds = `0${seconds % 60}`.slice(-2);
  const minutes = Math.floor(seconds / 60);
  const getMinutes = `0${minutes % 60}`.slice(-2);
  const getHours = `0${Math.floor(seconds / 3600)}`.slice(-2);

  return `${getHours} : ${getMinutes} : ${getSeconds}`;
};

/**
 * Menghitung Pace (Menit per Kilometer)
 * Rumus: Waktu (menit) / Jarak (km)
 * Output: String format "MM:SS" (Contoh: 05:30 /km)
 */
export const calculatePace = (timer: number, distance: number) => {
  // Jika jarak masih sedikit (< 50 meter), return 0 agar tidak infinity
  if (distance <= 0.05) return '00:00';

  const timeInMinutes = timer / 60;
  const paceVal = timeInMinutes / distance; // menit per km

  // Penjagaan kalau nilainya Infinity atau error
  if (!isFinite(paceVal) || paceVal > 100) return '00:00';

  const paceMin = Math.floor(paceVal);
  const paceSec = Math.round((paceVal - paceMin) * 60);

  // Format jadi 2 digit: "05:30"
  const minStr = paceMin < 10 ? `0${paceMin}` : `${paceMin}`;
  const secStr = paceSec < 10 ? `0${paceSec}` : `${paceSec}`;

  return `${minStr}:${secStr}`;
};
