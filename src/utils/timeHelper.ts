export const formatDuration = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  const mDisplay = minutes.toString().padStart(2, '0');
  const sDisplay = seconds.toString().padStart(2, '0');

  return `${mDisplay}:${sDisplay}`;
};
