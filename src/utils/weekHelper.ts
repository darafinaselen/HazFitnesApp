export const getWeekRange = (dateString: string) => {
  const date = dateString ? new Date(dateString) : new Date();
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);

  const start = new Date(date);
  start.setDate(diff);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  const startStr = `${start.getDate()} ${start.toLocaleString('default', {
    month: 'short',
  })}`;
  const endStr = `${end.getDate()} ${end.toLocaleString('default', {
    month: 'short',
  })}`;

  return { start, end, label: `${startStr} - ${endStr}` };
};
