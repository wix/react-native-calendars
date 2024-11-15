import React from 'react';
import { DateData } from '../../types';
import { BasicDayProps } from './basic';
export interface DayProps extends BasicDayProps {
    /** Provide custom day rendering component */
    dayComponent?: React.ComponentType<DayProps & {
        date?: DateData;
    }>;
}
declare const Day: any;
export default Day;
