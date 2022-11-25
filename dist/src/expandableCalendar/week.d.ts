import React from 'react';
import { CalendarProps } from '../calendar';
import { CalendarContextProps } from './Context';
export type WeekProps = CalendarProps & {
    context?: CalendarContextProps;
};
declare const Week: React.MemoExoticComponent<(props: WeekProps) => JSX.Element>;
export default Week;
