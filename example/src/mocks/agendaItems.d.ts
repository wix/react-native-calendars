import { MarkedDates } from '../../../src/types';
export declare const agendaItems: ({
    title: string;
    data: ({
        hour: string;
        duration: string;
        title: string;
        itemCustomHeightType?: undefined;
    } | {
        hour: string;
        duration: string;
        title: string;
        itemCustomHeightType: string;
    })[];
} | {
    title: string;
    data: {}[];
})[];
export declare function getMarkedDates(): MarkedDates;
