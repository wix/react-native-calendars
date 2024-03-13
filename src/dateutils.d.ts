/// <reference types="xdate" />
export declare function sameMonth(a?: XDate, b?: XDate): boolean;
export declare function sameDate(a?: XDate, b?: XDate): boolean;
export declare function onSameDateRange({ firstDay, secondDay, numberOfDays, firstDateInRange, }: {
    firstDay: string;
    secondDay: string;
    numberOfDays: number;
    firstDateInRange: string;
}): boolean;
export declare function sameWeek(a: string, b: string, firstDayOfWeek: number): boolean | undefined;
export declare function isPastDate(date: string): boolean;
export declare function isToday(date?: XDate | string): boolean;
export declare function isGTE(a: XDate, b: XDate): boolean;
export declare function isLTE(a: XDate, b: XDate): boolean;
export declare function formatNumbers(date: any): any;
export declare function month(date: XDate): import("xdate")[];
export declare function weekDayNames(firstDayOfWeek?: number): any;
export declare function page(date: XDate, firstDayOfWeek?: number, showSixWeeks?: boolean): import("xdate")[];
export declare function isDateNotInRange(date: XDate, minDate: string, maxDate: string): boolean | "";
export declare function getWeekDates(date: string, firstDay?: number, format?: string): import("xdate")[] | string[] | undefined;
export declare function getPartialWeekDates(date?: string, numberOfDays?: number): string[];
export declare function generateDay(originDate: string | XDate, daysOffset?: number): any;
export declare function getLocale(): any;
