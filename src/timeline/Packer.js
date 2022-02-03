// @flow
import XDate from 'xdate';
<<<<<<< HEAD:src/timeline/Packer.js
=======
import constants from '../commons/constants';
import {Event, PackedEvent} from './EventBlock';

type PartialPackedEvent = Event & {index: number};
interface PopulateOptions {
  screenWidth?: number;
  dayStart?: number;
  hourBlockHeight?: number;
  overlapEventsSpacing?: number;
}
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/timeline/Packer.ts

export const HOUR_BLOCK_HEIGHT = 100;
const OVERLAP_EVENTS_SPACINGS = 10;

<<<<<<< HEAD:src/timeline/Packer.js
function buildEvent(column, left, width, dayStart) {
  const startTime = XDate(column.start);
  const endTime = column.end ? XDate(column.end) : XDate(startTime).addHours(1);
=======
function buildEvent(event: Event & {index: number}, left: number, width: number, {dayStart = 0, hourBlockHeight = HOUR_BLOCK_HEIGHT}: PopulateOptions): PackedEvent {
  const startTime = new XDate(event.start);
  const endTime = event.end ? new XDate(event.end) : new XDate(startTime).addHours(1);
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/timeline/Packer.ts

  const dayStartTime = XDate(startTime).clearTime();

  return {
    ...event,
    top: (dayStartTime.diffHours(startTime) - dayStart) * hourBlockHeight,
    height: startTime.diffHours(endTime) * hourBlockHeight,
    width,
    left
  };
}

<<<<<<< HEAD:src/timeline/Packer.js
function collision(a, b) {
  return a.end > b.start && a.start < b.end;
}

function expand(ev, column, columns) {
=======
function hasCollision(a: Event, b: Event) {
  return a.end > b.start && a.start < b.end;
}

function calcColumnSpan(event: Event, columnIndex: number, columns: Event[][]) {
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/timeline/Packer.ts
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

<<<<<<< HEAD:src/timeline/Packer.js
function pack(columns, width, calculatedEvents, dayStart) {
  let colLength = columns.length;

  for (let i = 0; i < colLength; i++) {
    let col = columns[i];
    for (let j = 0; j < col.length; j++) {
      const colSpan = expand(col[j], i, columns);
      const L = (i / colLength) * width;
      const W = (width * colSpan) / colLength - 10;
=======
function packOverlappingEventGroup(
  columns: PartialPackedEvent[][],
  calculatedEvents: PackedEvent[],
  populateOptions: PopulateOptions
) {
  const {screenWidth = constants.screenWidth, overlapEventsSpacing = OVERLAP_EVENTS_SPACINGS} = populateOptions;
  columns.forEach((column, columnIndex) => {
    column.forEach(event => {
      const columnSpan = calcColumnSpan(event, columnIndex, columns);
      const eventLeft = (columnIndex / columns.length) * screenWidth;
      let eventWidth = screenWidth * (columnSpan / columns.length);

      if (columnIndex + columnSpan <= columns.length -1) {
        eventWidth -= overlapEventsSpacing;
      }
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/timeline/Packer.ts

      calculatedEvents.push(buildEvent(event, eventLeft, eventWidth, populateOptions));
    });
  });
}

<<<<<<< HEAD:src/timeline/Packer.js
function populateEvents(events, screenWidth, dayStart) {
  let lastEnd;
  let columns;
  let calculatedEvents = [];

  events = events
    .map((ev, index) => ({...ev, index: index}))
    .sort(function (a, b) {
=======
function populateEvents(_events: Event[], populateOptions: PopulateOptions) {
  let lastEnd: string | null = null;
  let columns: PartialPackedEvent[][] = [];
  const calculatedEvents: PackedEvent[] = [];

  const events: PartialPackedEvent[] = _events
    .map((ev: Event, index: number) => ({...ev, index: index}))
    .sort(function (a: Event, b: Event) {
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/timeline/Packer.ts
      if (a.start < b.start) return -1;
      if (a.start > b.start) return 1;
      if (a.end < b.end) return -1;
      if (a.end > b.end) return 1;
      return 0;
    });

<<<<<<< HEAD:src/timeline/Packer.js
  columns = [];
  lastEnd = null;

  events.forEach(function (ev) {
=======
  events.forEach(function (ev) {
    // Reset recent overlapping event group and start a new one
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/timeline/Packer.ts
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

export default populateEvents;
