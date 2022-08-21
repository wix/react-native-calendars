import inRange from 'lodash/inRange';
import debounce from 'lodash/debounce';
import noop from 'lodash/noop';

import React, {forwardRef, useCallback, useEffect, useMemo, useRef} from 'react';
import {ScrollViewProps} from 'react-native';
import {DataProvider, LayoutProvider, RecyclerListView, RecyclerListViewProps} from 'recyclerlistview';

import constants from '../commons/constants';
import {useCombinedRefs} from '../hooks';

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
  reloadPages?: (pageIndex: number) => void;
  positionIndex?: number;
}

const InfiniteList = (props: InfiniteListProps, ref: any) => {
  const {
    isHorizontal,
    renderItem,
    data,
    reloadPages = noop,
    pageWidth = constants.screenWidth,
    pageHeight = constants.screenHeight,
    onPageChange,
    onReachEdge,
    onReachNearEdge,
    onReachNearEdgeThreshold,
    initialPageIndex = 0,
    extendedState,
    scrollViewProps,
    positionIndex = 0
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

  const listRef = useCombinedRefs(ref);
  const pageIndex = useRef<number>();
  const isOnEdge = useRef(false);
  const isNearEdge = useRef(false);
  const scrolledByUser = useRef(false);
  const reloadPagesDebounce = useCallback(debounce(reloadPages, 500, {leading: false, trailing: true}), [reloadPages]);

  useEffect(() => {
    setTimeout(() => {
      const x = isHorizontal ? Math.floor(data.length / 2) * pageWidth : 0;
      const y = isHorizontal ? 0 : positionIndex * pageHeight;
      // @ts-expect-error
      listRef.current?.scrollToOffset?.(x, y, false);
    }, 0);
  }, [data]);

  const onScroll = useCallback(
    (event, offsetX, offsetY) => {
      reloadPagesDebounce?.cancel();

      const {x, y} = event.nativeEvent.contentOffset;
      const newPageIndex = Math.round(isHorizontal ? x / pageWidth : y / pageHeight);

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

        if (isHorizontal && constants.isAndroid) {
          // NOTE: this is done only to handle 'onMomentumScrollEnd' not being called on Android
          setTimeout(() => {
            onMomentumScrollEnd(event);
          }, 100);
        }

        pageIndex.current = newPageIndex;
      }

      props.onScroll?.(event, offsetX, offsetY);
    },
    [props.onScroll, onPageChange, data.length, reloadPagesDebounce]
  );

  const onMomentumScrollEnd = useCallback(
    event => {
      if (pageIndex.current) {
        if (isOnEdge.current) {
          onReachEdge?.(pageIndex.current!);
          reloadPagesDebounce?.(pageIndex.current);
        } else if (isNearEdge.current) {
          reloadPagesDebounce?.(pageIndex.current);
          onReachNearEdge?.(pageIndex.current!);
        }

        scrollViewProps?.onMomentumScrollEnd?.(event);
      }
    },
    [scrollViewProps?.onMomentumScrollEnd, onReachEdge, onReachNearEdge, reloadPagesDebounce]
  );

  const onScrollBeginDrag = useCallback(() => {
    scrolledByUser.current = true;
  }, []);

  const scrollViewPropsMemo = useMemo(() => {
    return {
      pagingEnabled: isHorizontal,
      bounces: false,
      ...scrollViewProps,
      onScrollBeginDrag,
      onMomentumScrollEnd
    };
  }, [onScrollBeginDrag, onMomentumScrollEnd, scrollViewProps, isHorizontal]);

  const style = useMemo(() => {
    return {height: pageHeight};
  }, [pageHeight]);

  return (
    <RecyclerListView
      // @ts-expect-error
      ref={listRef}
      isHorizontal={isHorizontal}
      rowRenderer={renderItem}
      dataProvider={dataProvider}
      layoutProvider={layoutProvider.current}
      extendedState={extendedState}
      initialRenderIndex={initialPageIndex}
      renderAheadOffset={5 * pageWidth}
      onScroll={onScroll}
      style={style}
      scrollViewProps={scrollViewPropsMemo}
    />
  );
};

export default forwardRef(InfiniteList);
