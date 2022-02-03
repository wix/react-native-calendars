// TODO: Make this a common component for all horizontal lists in this lib
import React, {forwardRef, useCallback, useMemo, useRef} from 'react';
import {ScrollViewProps} from 'react-native';
import {DataProvider, LayoutProvider, RecyclerListView, RecyclerListViewProps} from 'recyclerlistview';
import inRange from 'lodash/inRange';

import constants from '../commons/constants';

const dataProviderMaker = (items: string[]) => new DataProvider((item1, item2) => item1 !== item2).cloneWithRows(items);

export interface InfiniteListProps
  extends Omit<RecyclerListViewProps, 'dataProvider' | 'layoutProvider' | 'rowRenderer'> {
  data: any[];
  renderItem: RecyclerListViewProps['rowRenderer'];
  pageWidth?: number;
  pageHeight?: number;
  onPageChange?: (pageIndex: number, prevPageIndex: number, info: {scrolledByUser: boolean}) => void;
  onReachEdge?: (pageIndex: number) => void;
  onReachNearEdge?: (pageIndex: number) => void;
  onReachNearEdgeThreshold?: number;
  initialPageIndex?: number;
  scrollViewProps?: ScrollViewProps;
}

const InfiniteList = (props: InfiniteListProps, ref: any) => {
  const {
    renderItem,
    data,
    pageWidth = constants.screenWidth,
    pageHeight = constants.screenHeight,
    onPageChange,
    onReachEdge,
    onReachNearEdge,
    onReachNearEdgeThreshold,
    initialPageIndex = 0,
    extendedState,
    scrollViewProps
  } = props;
  const dataProvider = useMemo(() => {
    return dataProviderMaker(data);
  }, [data]);

  const layoutProvider = useRef(
    new LayoutProvider(
      () => 'page',
      (_type, dim) => {
        dim.width = pageWidth;
        dim.height = pageHeight;
      }
    )
  );

  const pageIndex = useRef<number>();
  const isOnEdge = useRef(false);
  const isNearEdge = useRef(false);
  const scrolledByUser = useRef(false);

  const onScroll = useCallback(
    (event, offsetX, offsetY) => {
      const newPageIndex = Math.round(event.nativeEvent.contentOffset.x / pageWidth);

      if (pageIndex.current !== newPageIndex) {
        if (pageIndex.current !== undefined) {
          onPageChange?.(newPageIndex, pageIndex.current, {scrolledByUser: scrolledByUser.current});
          scrolledByUser.current = false;

          isOnEdge.current = false;
          isNearEdge.current = false;

          if (newPageIndex === 0 || newPageIndex === data.length - 1) {
            isOnEdge.current = true;
          } else if (
            onReachNearEdgeThreshold &&
            !inRange(newPageIndex, onReachNearEdgeThreshold, data.length - onReachNearEdgeThreshold)
          ) {
            isNearEdge.current = true;
          }
        }
        pageIndex.current = newPageIndex;
      }

      props.onScroll?.(event, offsetX, offsetY);
    },
    [props.onScroll, onPageChange, data.length]
  );

  const onMomentumScrollEnd = useCallback(
    event => {
      if (isOnEdge.current) {
        onReachEdge?.(pageIndex.current!);
      } else if (isNearEdge.current) {
        onReachNearEdge?.(pageIndex.current!);
      }

      scrollViewProps?.onMomentumScrollEnd?.(event);
    },
    [scrollViewProps?.onMomentumScrollEnd, onReachEdge, onReachNearEdge]
  );

  const onScrollBeginDrag = useCallback(() => {
    scrolledByUser.current = true;
  }, []);

  const style = useMemo(() => {
    return {height: pageHeight};
  }, [pageHeight]);

  return (
    <RecyclerListView
      ref={ref}
      isHorizontal
      rowRenderer={renderItem}
      dataProvider={dataProvider}
      layoutProvider={layoutProvider.current}
      extendedState={extendedState}
      initialRenderIndex={initialPageIndex}
      renderAheadOffset={5 * pageWidth}
      onScroll={onScroll}
      style={style}
      scrollViewProps={{
        pagingEnabled: true,
        bounces: false,
        ...scrollViewProps,
        onScrollBeginDrag,
        onMomentumScrollEnd
      }}
    />
  );
};

export default forwardRef(InfiniteList);
