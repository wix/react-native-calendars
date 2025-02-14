import XDate from 'xdate';
import constants from '../../commons/constants';
import {generateDay} from '../../dateutils';

export function calcTimeByPosition(yPosition, hourBlockHeight, startHour = 0, cellDuration) {
  const cellIndex = Math.floor(yPosition / hourBlockHeight);
  const totalMinutes = cellIndex * cellDuration;
  const startInMinutes = startHour.hour * 60 + startHour.minutes;
  const minutes = startInMinutes + totalMinutes;

  return {hour: Math.floor(minutes / 60), minutes: minutes % 60};
}

export function calcDateByPosition(xPosition, timelineLeftInset, numberOfDays = 1, firstDate = new XDate()) {
  const timelineWidth = constants.screenWidth - timelineLeftInset;
  const dayWidth = timelineWidth / numberOfDays;
  const positionIndex = Math.floor((xPosition - timelineLeftInset) / dayWidth);
  return generateDay(firstDate, positionIndex);
}
export function buildTimeString(hour = 0, minutes = 0, date = '') {
  const totalMinutes = hour * 60 + minutes;
  const calculatedHour = Math.floor(totalMinutes / 60) % 24;
  const calculatedMinutes = totalMinutes % 60;

  const hourString = calculatedHour.toString().padStart(2, '0');
  const minuteString = calculatedMinutes.toString().padStart(2, '0');

  return `${date} ${hourString}:${minuteString}`.trimStart();
}
export function calcTimeOffset(hourBlockHeight, hour, minutes, dayStart) {
  const now = new Date();
  const startHour = hour ?? now.getHours();
  const startMinutes = minutes ?? now.getMinutes();
  const startTimeInMinutes = startHour * 60 + startMinutes;
  const nowInMinutes = now.getHours() * 60 + now.getMinutes();

  const minutesFromStart = dayStart.hour * 60 + dayStart.minutes;
  return nowInMinutes === startTimeInMinutes
    ? (Math.abs(startTimeInMinutes - minutesFromStart) / 60) * hourBlockHeight
    : ((nowInMinutes - startTimeInMinutes) / 60) * hourBlockHeight;
}
