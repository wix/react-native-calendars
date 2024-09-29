import React from 'react';
import { CalendarProps } from '../calendar';
import { CalendarContextProps } from './Context';
export declare type WeekProps = CalendarProps & {
    context?: CalendarContextProps;
};
declare const Week: React.MemoExoticComponent<(props: WeekProps) => React.JSX.Element>;
export default Week;
