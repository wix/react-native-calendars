import XDate from 'xdate';
import constants from '../../commons/constants';
import { generateDay } from '../../dateutils';
export function calcTimeByPosition(yPosition, hourBlockHeight) {
    let time = yPosition / hourBlockHeight;
    time = Math.floor(time * 2) / 2;
    const hour = Math.floor(time);
    const minutes = (time - Math.floor(time)) * 60;
    return { hour, minutes };
}
export function calcDateByPosition(xPosition, timelineLeftInset, numberOfDays = 1, firstDate = new XDate()) {
    const timelineWidth = constants.screenWidth - timelineLeftInset;
    const dayWidth = timelineWidth / numberOfDays;
    const positionIndex = Math.floor((xPosition - timelineLeftInset) / dayWidth);
    return generateDay(firstDate, positionIndex);
}
export function buildTimeString(hour = 0, minutes = 0, date = '') {
    return `${date} ${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`.trimStart();
}
export function calcTimeOffset(hourBlockHeight, hour, minutes) {
    const now = new Date();
    const h = hour ?? now.getHours();
    const m = minutes ?? now.getMinutes();
    return (h + m / 60) * hourBlockHeight;
}
