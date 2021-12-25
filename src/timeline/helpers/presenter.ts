export function calcTimeByPosition(yPosition: number, hourBlockHeight: number) {
  const halfHourBlockHeight = hourBlockHeight / 2;
  let time = yPosition / halfHourBlockHeight / 2;
  time = Math.round(time * 2) / 2;

  const hour = Math.floor(time);
  const minutes = (time - Math.floor(time)) * 60;
  return {hour, minutes};
}

export function buildTimeString(hour = 0, minutes = 0) {
  return `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
}
