import inRange from 'lodash/inRange';
import debounce from 'lodash/debounce';
import noop from 'lodash/noop';
import React, {forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef} from 'react';
import {ScrollViewProps, View} from 'react-native';
import {DataProvider, LayoutProvider, RecyclerListView, RecyclerListViewProps} from 'recyclerlistview';
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
  initialOffset?: number;
  scrollViewProps?: ScrollViewProps;
  reloadPages?: (pageIndex: number) => void;
  positionIndex?: number;
  layoutProvider?: LayoutProvider;
  disableScrollOnDataChange?: boolean;
  renderFooter?: () => React.ReactElement | null;
  /**
   * RTL on the New Architecture (Fabric): keep the scroll container LTR and mirror the page order
   * in JS instead of relying on the native RTL scroll handling, which differs from the old
   * architecture on both platforms (on iOS the conversion is asymmetric — imperative scrollTo is
   * converted, the contentOffset prop is not — and timing-dependent; Android has its own model).
   * Only takes effect for a horizontal list in an RTL app with Fabric enabled; everywhere else the
   * list behaves exactly as before.
   */
  rtlViaLtrContainer?: boolean;
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
    initialOffset,
    extendedState,
    scrollViewProps,
    positionIndex = 0,
    disableScrollOnDataChange,
    onEndReachedThreshold,
    onVisibleIndicesChanged,
    layoutProvider,
    onScroll,
    onEndReached,
    renderFooter,
    rtlViaLtrContainer
  } = props;

  const mirrorRTL = !!(
    isHorizontal &&
    rtlViaLtrContainer &&
    constants.isRTL &&
    (globalThis as {nativeFabricUIManager?: unknown}).nativeFabricUIManager
  );
  const lastIndex = data.length - 1;
  // Map an index or x-offset between the caller's (chronological) space and the recycler's
  // (reversed) space. The mapping is its own inverse.
  const mirrorIndex = useCallback((i: number) => (mirrorRTL ? lastIndex - i : i), [mirrorRTL, lastIndex]);
  const mirrorX = useCallback(
    (x: number) => (mirrorRTL ? lastIndex * pageWidth - x : x),
    [mirrorRTL, lastIndex, pageWidth]
  );
  const listData = useMemo(() => (mirrorRTL ? [...data].reverse() : data), [data, mirrorRTL]);

  const dataProvider = useMemo(() => {
    return dataProviderMaker(listData);
  }, [listData]);

  const _layoutProvider = useRef(
    new LayoutProvider(
      () => 'page',
      (_type, dim) => {
        dim.width = pageWidth;
        dim.height = pageHeight;
      }
    )
  );

  const shouldFixRTL = useMemo(() => {
    return !mirrorRTL && isHorizontal && constants.isRTL && (constants.isRN73() || constants.isAndroid);
  }, [isHorizontal, mirrorRTL]);

  const listRef = useRef<InstanceType<typeof RecyclerListView>>(null);
  const scrollToOffset = useCallback(
    (x: number, y: number, animate?: boolean, useWindowCorrection?: boolean) => {
      listRef.current?.scrollToOffset(mirrorX(x), y, animate, useWindowCorrection);
    },
    [mirrorX]
  );
  // Callers keep driving the recycler through this ref; only scrollToOffset needs its x mirrored,
  // everything else passes straight through to the recycler instance.
  useImperativeHandle(
    ref,
    () =>
      new Proxy({} as Record<PropertyKey, unknown>, {
        get(_target, key) {
          if (key === 'scrollToOffset') {
            return scrollToOffset;
          }
          const instance = listRef.current;
          const value = instance ? Reflect.get(instance, key) : undefined;
          return typeof value === 'function' ? (value as (...args: unknown[]) => unknown).bind(instance) : value;
        }
      }),
    [scrollToOffset]
  );

  const pageIndex = useRef<number>();
  const isOnEdge = useRef(false);
  const isNearEdge = useRef(false);
  const scrolledByUser = useRef(false);
  const reloadPagesDebounce = useCallback(debounce(reloadPages, 500, {leading: false, trailing: true}), [reloadPages]);

  useEffect(() => {
    if (disableScrollOnDataChange) {
      return;
    }

    setTimeout(() => {
      const x = isHorizontal ? shouldFixRTL ? Math.floor(data.length / 2) + 1 : Math.floor(data.length / 2) * pageWidth : 0;
      const y = isHorizontal ? 0 : positionIndex * pageHeight;
      scrollToOffset(x, y, false);
    }, 0);
  }, [data, disableScrollOnDataChange, isHorizontal]);

  const _onScroll = useCallback(
    (event, offsetX, offsetY) => {
      reloadPagesDebounce?.cancel();

      const contentOffset = event.nativeEvent.contentOffset;
      const y = contentOffset.y;
      const x = shouldFixRTL ? (pageWidth * data.length - contentOffset.x) : contentOffset.x;
      const newPageIndex = Math.round(isHorizontal ? x / pageWidth : y / pageHeight);
      if (pageIndex.current !== newPageIndex) {
        if (pageIndex.current !== undefined) {
          onPageChange?.(mirrorIndex(newPageIndex), mirrorIndex(pageIndex.current), {
            scrolledByUser: scrolledByUser.current
          });
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

      onScroll?.(event, offsetX, offsetY);
    },
    [onScroll, onPageChange, data.length, reloadPagesDebounce, isHorizontal, shouldFixRTL, mirrorIndex]
  );

  const onMomentumScrollEnd = useCallback(
    event => {
      if (pageIndex.current) {
        const current = mirrorIndex(pageIndex.current);
        if (isOnEdge.current) {
          onReachEdge?.(current);
          reloadPagesDebounce?.(current);
        } else if (isNearEdge.current) {
          reloadPagesDebounce?.(current);
          onReachNearEdge?.(current);
        }

        scrollViewProps?.onMomentumScrollEnd?.(event);
      }
    },
    [scrollViewProps?.onMomentumScrollEnd, onReachEdge, onReachNearEdge, reloadPagesDebounce, mirrorIndex]
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

  const ltrContainerStyle = useMemo(() => {
    return {direction: 'ltr' as const, height: pageHeight};
  }, [pageHeight]);

  const rtlPageStyle = useMemo(() => {
    return {direction: 'rtl' as const, width: pageWidth, height: pageHeight};
  }, [pageWidth, pageHeight]);

  const rowRenderer = useCallback<NonNullable<RecyclerListViewProps['rowRenderer']>>(
    (type, item, index, extendedState) => {
      const content = renderItem(type, item, mirrorIndex(index), extendedState);
      if (!mirrorRTL) {
        return content;
      }
      // The container is LTR; re-wrap each page so its content still lays out right-to-left.
      return <View style={rtlPageStyle}>{content}</View>;
    },
    [renderItem, mirrorIndex, mirrorRTL, rtlPageStyle]
  );

  const list = (
    <RecyclerListView
      ref={listRef}
      isHorizontal={isHorizontal}
      rowRenderer={rowRenderer}
      dataProvider={dataProvider}
      layoutProvider={layoutProvider ?? _layoutProvider.current}
      extendedState={extendedState}
      initialRenderIndex={initialOffset ? undefined : mirrorIndex(initialPageIndex)}
      initialOffset={initialOffset === undefined ? undefined : mirrorX(initialOffset)}
      renderAheadOffset={5 * pageWidth}
      onScroll={_onScroll}
      style={style}
      scrollViewProps={scrollViewPropsMemo}
      onEndReached={onEndReached}
      onEndReachedThreshold={onEndReachedThreshold}
      onVisibleIndicesChanged={onVisibleIndicesChanged}
      renderFooter={renderFooter}
    />
  );

  if (!mirrorRTL) {
    return list;
  }

  // Keep the scroll container LTR so Fabric applies no RTL transform or offset conversion.
  return <View style={ltrContainerStyle}>{list}</View>;
};

export default forwardRef(InfiniteList);
