// --- HELPER: Generate days for a specific month & year ---
export const getDaysInMonth = (month: number, year: number) => {
  const date = new Date(year, month, 1);
  const days = [];
  while (date.getMonth() === month) {
    days.push({
      dateObj: new Date(date),
      dayName: date.toLocaleDateString('en-US', { weekday: 'short' }), // "Mon"
      dayNumber: date.getDate(), // 1
    });
    date.setDate(date.getDate() + 1);
  }
  return days;
};
