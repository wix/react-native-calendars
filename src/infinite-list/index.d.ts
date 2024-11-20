import React from 'react';
import { ScrollViewProps } from 'react-native';
import { LayoutProvider, RecyclerListViewProps } from 'recyclerlistview';
export interface InfiniteListProps extends Omit<RecyclerListViewProps, 'dataProvider' | 'layoutProvider' | 'rowRenderer'> {
    data: any[];
    renderItem: RecyclerListViewProps['rowRenderer'];
    pageWidth?: number;
    pageHeight?: number;
    onPageChange?: (pageIndex: number, prevPageIndex: number, info: {
        scrolledByUser: boolean;
    }) => void;
    onReachEdge?: (pageIndex: number) => void;
    onReachNearEdge?: (pageIndex: number) => void;
    onReachNearEdgeThreshold?: number;
    initialPageIndex?: number;
    initialOffset?: number;
    scrollViewProps?: ScrollViewProps;
    reloadPages?: (pageIndex: number) => void;
    positionIndex?: number;
    layoutProvider?: LayoutProvider;
    disableScrollOnDataChange?: boolean;
    renderFooter?: () => React.ReactElement | null;
}
declare const _default: React.ForwardRefExoticComponent<InfiniteListProps & React.RefAttributes<unknown>>;
export default _default;
