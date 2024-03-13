import { MarkedDates } from '../../../src/types';
export declare const agendaItems: ({
    title: string;
    data: {
        hour: string;
        duration: string;
        title: string;
    }[];
} | {
    title: string;
    data: {}[];
})[];
export declare function getMarkedDates(): MarkedDates;
