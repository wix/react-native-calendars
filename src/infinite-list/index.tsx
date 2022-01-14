// TODO: Make this a common component for all horizontal lists in this lib
import React, {forwardRef, useCallback, useMemo, useRef} from 'react';
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
  onPageChange?: (pageIndex: number, prevPageIndex: number) => void;
  onReachEdge?: (pageIndex: number) => void;
  onReachNearEdge?: (pageIndex: number) => void;
  nearEdgeThreshold?: number;
  initialPageIndex?: number;
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
    nearEdgeThreshold,
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

  const onScroll = useCallback(
    (event, offsetX, offsetY) => {
      const currPageIndex = Math.round(event.nativeEvent.contentOffset.x / pageWidth);

      if (pageIndex.current !== currPageIndex) {
        if (pageIndex.current !== undefined) {
          onPageChange?.(currPageIndex, pageIndex.current);

          if (currPageIndex === 0 || currPageIndex === data.length - 1) {
            onReachEdge?.(currPageIndex);
          } else if (nearEdgeThreshold && !inRange(currPageIndex, nearEdgeThreshold, data.length - nearEdgeThreshold)) {
            onReachNearEdge?.(currPageIndex);
          }
        }
        pageIndex.current = currPageIndex;
      }

      props.onScroll?.(event, offsetX, offsetY);
    },
    [props.onScroll, data.length]
  );

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
        ...scrollViewProps
      }}
    />
  );
};

export default forwardRef(InfiniteList);
