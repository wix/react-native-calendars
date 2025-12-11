import XDate from 'xdate';
import React from 'react';
import { Theme } from '../types';
import { CalendarProps } from '../calendar';
export type CalendarListItemProps = CalendarProps & {
    item: any;
    calendarWidth?: number;
    calendarHeight?: number;
    horizontal?: boolean;
    theme?: Theme;
    scrollToMonth?: (date: XDate) => void;
    visible?: boolean;
};
declare const CalendarListItem: React.MemoExoticComponent<(props: CalendarListItemProps) => React.JSX.Element>;
export default CalendarListItem;
