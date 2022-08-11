import XDate from 'xdate';
import constants from '../../commons/constants';
import {generateDay} from '../../dateutils';

export function calcTimeByPosition(yPosition: number, hourBlockHeight: number) {
  let time = yPosition / hourBlockHeight;
  time = Math.floor(time * 2) / 2;

  const hour = Math.floor(time);
  const minutes = (time - Math.floor(time)) * 60;
  return {hour, minutes};
}

export function calcDateByPosition(xPosition: number, timelineLeftInset: number, numberOfDays = 1, firstDate: string | XDate = new XDate()) {
  const timelineWidth = constants.screenWidth - timelineLeftInset;
  const dayWidth = timelineWidth / numberOfDays;
  const positionIndex = Math.floor((xPosition - timelineLeftInset) / dayWidth);
  return generateDay(firstDate, positionIndex);
}

export function buildTimeString(hour = 0, minutes = 0, date = '') {
  return `${date} ${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`.trimStart();
}

export function calcTimeOffset(hourBlockHeight: number, hour?: number, minutes?: number) {
  const now = new Date();
  const h = hour ?? now.getHours();
  const m = minutes ?? now.getMinutes();
  return (h + m / 60) * hourBlockHeight;
}
