// TODO: Make this a common component for all horizontal lists in this lib
import React, {forwardRef, useCallback, useMemo, useRef} from 'react';
import {DataProvider, LayoutProvider, RecyclerListView, RecyclerListViewProps} from 'recyclerlistview';
import constants from '../commons/constants';

const layoutProvider = new LayoutProvider(
  () => 'page',
  (_type, dim) => {
    dim.width = constants.screenWidth;
    dim.height = constants.screenHeight;
  }
);

const dataProviderMaker = (items: string[]) =>
  new DataProvider((item1, item2) => item1.value !== item2.value || item1.label !== item2.label).cloneWithRows(items);

export interface HorizontalListProps
  extends Omit<RecyclerListViewProps, 'dataProvider' | 'layoutProvider' | 'rowRenderer'> {
  data: any[];
  renderItem: RecyclerListViewProps['rowRenderer'];
  pageWidth?: number;
  onPageChange?: (pageIndex: number, prevPageIndex: number) => void;
  initialPageIndex?: number;
}

const HorizontalList = (props: HorizontalListProps, ref: any) => {
  const {
    renderItem,
    data,
    pageWidth = constants.screenWidth,
    onPageChange,
    initialPageIndex = 0,
    extendedState,
    scrollViewProps
  } = props;
  const dataProvider = useMemo(() => {
    return dataProviderMaker(data);
  }, [data]);

  const pageIndex = useRef<number>();

  const onScroll = useCallback(
    (event, offsetX, offsetY) => {
      const currPageIndex = Math.round(event.nativeEvent.contentOffset.x / pageWidth);

      if (pageIndex.current !== currPageIndex) {
        if (pageIndex.current !== undefined) {
          onPageChange?.(currPageIndex, pageIndex.current);
        }
        pageIndex.current = currPageIndex;
      }

      props.onScroll?.(event, offsetX, offsetY);
    },
    [props.onScroll]
  );

  return (
    <RecyclerListView
      ref={ref}
      isHorizontal
      rowRenderer={renderItem}
      dataProvider={dataProvider}
      layoutProvider={layoutProvider}
      extendedState={extendedState}
      initialRenderIndex={initialPageIndex}
      renderAheadOffset={5 * pageWidth}
      onScroll={onScroll}
      scrollViewProps={{
        pagingEnabled: true,
        bounces: false,
        ...scrollViewProps
      }}
    />
  );
};

export default forwardRef(HorizontalList);
