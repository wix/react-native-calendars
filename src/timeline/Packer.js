import inRange from 'lodash/inRange';
import XDate from 'xdate';
import constants from '../commons/constants';
const OVERLAP_EVENTS_SPACINGS = 10;
const RIGHT_EDGE_SPACING = 10;

function buildEvent(event, left, width, {dayStart = 0, cellDuration, cellHeight}) {
  const startTime = new XDate(event.start);
  const endTime = event.end ? new XDate(event.end) : new XDate(startTime).addHours(1);

  const cellCount = startTime.diffMinutes(endTime) / cellDuration;
  const eventHeight = cellHeight * cellCount;
  const hourBlockHeight = calcHourBlockHeight(cellDuration, cellHeight);

  const dayStartTimeInMinutes = startTime.getHours() * 60 + startTime.getMinutes();
  const workingDayStartTimeInMinutes = dayStart.hour * 60 + dayStart.minutes;

  return {
    ...event,
    top: ((dayStartTimeInMinutes - workingDayStartTimeInMinutes) / 60) * hourBlockHeight,
    height: eventHeight,
    width,
    left
  };
}
function hasCollision(a, b) {
  return a.end > b.start && a.start < b.end;
}
function calcColumnSpan(event, columnIndex, columns) {
  let colSpan = 1;
  for (let i = columnIndex + 1; i < columns.length; i++) {
    const column = columns[i];
    const foundCollision = column.find(ev => hasCollision(event, ev));
    if (foundCollision) {
      return colSpan;
    }
    colSpan++;
  }
  return colSpan;
}
function packOverlappingEventGroup(columns, calculatedEvents, populateOptions) {
  const {
    screenWidth = constants.screenWidth,
    rightEdgeSpacing = RIGHT_EDGE_SPACING,
    overlapEventsSpacing = OVERLAP_EVENTS_SPACINGS
  } = populateOptions;
  columns.forEach((column, columnIndex) => {
    column.forEach(event => {
      const totalWidth = screenWidth - rightEdgeSpacing;
      const columnSpan = calcColumnSpan(event, columnIndex, columns);
      const eventLeft = (columnIndex / columns.length) * totalWidth;
      let eventWidth = totalWidth * (columnSpan / columns.length);
      if (columnIndex + columnSpan <= columns.length - 1) {
        eventWidth -= overlapEventsSpacing;
      }
      calculatedEvents.push(buildEvent(event, eventLeft, eventWidth, populateOptions));
    });
  });
}
export function calcHourBlockHeight(cellDuration, cellHeight) {
  return (60 / cellDuration) * cellHeight;
}
export function populateEvents(_events, populateOptions) {
  let lastEnd = null;
  let columns = [];
  const calculatedEvents = [];
  const events = _events
    .map((ev, index) => ({...ev, index: index}))
    .sort(function (a, b) {
      if (a.start < b.start) return -1;
      if (a.start > b.start) return 1;
      if (a.end < b.end) return -1;
      if (a.end > b.end) return 1;
      return 0;
    });
  events.forEach(function (ev) {
    // Reset recent overlapping event group and start a new one
    if (lastEnd !== null && ev.start >= lastEnd) {
      packOverlappingEventGroup(columns, calculatedEvents, populateOptions);
      columns = [];
      lastEnd = null;
    }
    // Place current event in the right column where it doesn't overlap
    let placed = false;
    for (let i = 0; i < columns.length; i++) {
      const col = columns[i];
      if (!hasCollision(col[col.length - 1], ev)) {
        col.push(ev);
        placed = true;
        break;
      }
    }
    // If curr event wasn't placed in any of the columns, create a new column for it
    if (!placed) {
      columns.push([ev]);
    }
    if (lastEnd === null || ev.end > lastEnd) {
      lastEnd = ev.end;
    }
  });
  if (columns.length > 0) {
    packOverlappingEventGroup(columns, calculatedEvents, populateOptions);
  }
  return calculatedEvents;
}
export function buildUnavailableHoursBlocks(cellDuration, cellHeight, unavailableHours = [], options) {
  const {hourBlockHeight = calcHourBlockHeight(cellDuration, cellHeight), dayStart = 0, dayEnd = 24} = options || {};
  const totalDayHours = dayEnd - dayStart;
  const totalDayHeight = (dayEnd - dayStart) * hourBlockHeight;
  return (
    unavailableHours
      .map(hours => {
        if (!inRange(hours.start, 0, 25) || !inRange(hours.end, 0, 25)) {
          console.error('Calendar Timeline unavailableHours is invalid. Hours should be between 0 and 24');
          return undefined;
        }
        if (hours.start >= hours.end) {
          console.error('Calendar Timeline availableHours is invalid. start hour should be earlier than end hour');
          return undefined;
        }
        const startFixed = Math.max(hours.start, dayStart);
        const endFixed = Math.min(hours.end, dayEnd);
        return {
          top: ((startFixed - dayStart) / totalDayHours) * totalDayHeight,
          height: (endFixed - startFixed) * hourBlockHeight
        };
      })
      // Note: this filter falsy values (undefined blocks)
      .filter(Boolean)
  );
}
