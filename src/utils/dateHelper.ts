export const getCurrentWeekDays = () => {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const numDay = now.getDate();

  const start = new Date(now);
  // Jika hari ini Minggu (0), mundur 6 hari. Jika tidak, mundur (dayOfWeek - 1)
  const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  start.setDate(numDay - diff);
  start.setHours(0, 0, 0, 0);

  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push({
      date: d.getDate(), // Tanggal (1, 2, 3...)
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }), // Mon, Tue...
      fullDate: d,
      isToday: d.toDateString() === now.toDateString(),
    });
  }
  return days;
};

export const formatDateToWords = (dateString: string): string => {
  if (!dateString) return '';

  // Format YYYY-MM-DD
  const parts = dateString.split('-');
  if (parts.length !== 3) return dateString;

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const year = parts[0];
  const monthIndex = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  const monthName = months[monthIndex] || '';

  return `${day} ${monthName} ${year}`;
};
