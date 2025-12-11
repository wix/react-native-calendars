import { Event, PackedEvent } from './EventBlock';
interface PopulateOptions {
    screenWidth?: number;
    dayStart?: number;
    hourBlockHeight?: number;
    overlapEventsSpacing?: number;
    rightEdgeSpacing?: number;
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
export declare const HOUR_BLOCK_HEIGHT = 100;
export declare function populateEvents(_events: Event[], populateOptions: PopulateOptions): PackedEvent[];
export declare function buildUnavailableHoursBlocks(unavailableHours: UnavailableHours[] | undefined, options: UnavailableHoursOptions): ({
    top: number;
    height: number;
} | undefined)[];
export {};
