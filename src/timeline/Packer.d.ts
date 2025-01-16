import {Event, PackedEvent} from './EventBlock';
interface PopulateOptions {
  screenWidth?: number;
  dayStart?: {
    hour: number;
    minutes: number;
  };
  hourBlockHeight?: number;
  overlapEventsSpacing?: number;
  rightEdgeSpacing?: number;
  cellDuration?: number;
  cellHeight?: number;
}
export interface UnavailableHours {
  start: number;
  end: number;
}
interface UnavailableHoursOptions {
  hourBlockHeight?: number;
  dayStart: number;
  dayEnd: number;
}
export declare function calcHourBlockHeight(populateOptions: PopulateOptions): number;
export declare function populateEvents(_events: Event[], populateOptions: PopulateOptions): PackedEvent[];
export declare function buildUnavailableHoursBlocks(
  cellDuration: number,
  cellHeight: number,
  unavailableHours: UnavailableHours[] | undefined,
  options: UnavailableHoursOptions
): (
  | {
      top: number;
      height: number;
    }
  | undefined
)[];
export {};
