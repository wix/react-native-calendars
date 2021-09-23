import React from 'react';
import { DateData } from '../../types';
import { WeekCalendarProps } from './index';
declare class Presenter {
    private _applyAndroidRtlFix;
    private _firstAndroidRTLScrollIgnored;
    list: React.RefObject<any>;
    scrollToIndex: (animated: boolean) => void;
    isSameWeek: (date: Date, prevDate: Date, firstDay: number) => any;
    onDayPress: (context: any, value: DateData) => void;
    onScroll: ({ context, updateState, x, page, items, width }: any) => void;
    onMomentumScrollEnd: ({ items, props, page, updateItems }: any) => void;
    shouldComponentUpdate: (context: any, prevContext: any) => boolean;
    getDate({ current, context, firstDay }: WeekCalendarProps, weekIndex: number): any;
    getDatesArray: (args: WeekCalendarProps) => any[];
    _shouldUpdateState: (page: number, newPage: number) => boolean;
    _getX: (x: number, itemsCount: number, containerWidth: number) => number;
    _getNewPage: (x: number, containerWidth: number) => number;
    _isFirstPage: (page: number) => boolean;
    _isLastPage: (page: number, items: Date[]) => boolean;
    _getNexPageItems: (items: Date[]) => Date[];
    _getFirstPageItems: (items: Date[]) => Date[];
    _mergeArraysFromEnd: (items: Date[], newArray: Date[]) => Date[];
    _mergeArraysFromTop: (items: Date[], newArray: Date[]) => Date[];
    _getItemsForPage: (page: number, items: Date[]) => Date[];
}
export default Presenter;
