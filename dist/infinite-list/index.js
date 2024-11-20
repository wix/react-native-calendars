import inRange from 'lodash/inRange';
import debounce from 'lodash/debounce';
import noop from 'lodash/noop';
import React, { forwardRef, useCallback, useEffect, useMemo, useRef } from 'react';
import { DataProvider, LayoutProvider, RecyclerListView } from 'recyclerlistview';
import constants from '../commons/constants';
import { useCombinedRefs } from '../hooks';
const dataProviderMaker = (items) => new DataProvider((item1, item2) => item1 !== item2).cloneWithRows(items);
const InfiniteList = (props, ref) => {
    const { isHorizontal, renderItem, data, reloadPages = noop, pageWidth = constants.screenWidth, pageHeight = constants.screenHeight, onPageChange, onReachEdge, onReachNearEdge, onReachNearEdgeThreshold, initialPageIndex = 0, initialOffset, extendedState, scrollViewProps, positionIndex = 0, disableScrollOnDataChange, onEndReachedThreshold, onVisibleIndicesChanged, layoutProvider, onScroll, onEndReached, renderFooter, } = props;
    const dataProvider = useMemo(() => {
        return dataProviderMaker(data);
    }, [data]);
    const _layoutProvider = useRef(new LayoutProvider(() => 'page', (_type, dim) => {
        dim.width = pageWidth;
        dim.height = pageHeight;
    }));
    const shouldUseAndroidRTLFix = useMemo(() => {
        return constants.isAndroidRTL && isHorizontal;
    }, []);
    const listRef = useCombinedRefs(ref);
    const pageIndex = useRef();
    const isOnEdge = useRef(false);
    const isNearEdge = useRef(false);
    const scrolledByUser = useRef(false);
    const reloadPagesDebounce = useCallback(debounce(reloadPages, 500, { leading: false, trailing: true }), [reloadPages]);
    useEffect(() => {
        if (disableScrollOnDataChange) {
            return;
        }
        setTimeout(() => {
            var _a, _b;
            const x = isHorizontal ? constants.isAndroidRTL ? Math.floor(data.length / 2) + 1 : Math.floor(data.length / 2) * pageWidth : 0;
            const y = isHorizontal ? 0 : positionIndex * pageHeight;
            // @ts-ignore
            (_b = (_a = listRef.current) === null || _a === void 0 ? void 0 : _a.scrollToOffset) === null || _b === void 0 ? void 0 : _b.call(_a, x, y, false);
        }, 0);
    }, [data, disableScrollOnDataChange]);
    const _onScroll = useCallback((event, offsetX, offsetY) => {
        reloadPagesDebounce === null || reloadPagesDebounce === void 0 ? void 0 : reloadPagesDebounce.cancel();
        const contentOffset = event.nativeEvent.contentOffset;
        const y = contentOffset.y;
        const x = shouldUseAndroidRTLFix ? (pageWidth * data.length - contentOffset.x) : contentOffset.x;
        const newPageIndex = Math.round(isHorizontal ? x / pageWidth : y / pageHeight);
        if (pageIndex.current !== newPageIndex) {
            if (pageIndex.current !== undefined) {
                onPageChange === null || onPageChange === void 0 ? void 0 : onPageChange(newPageIndex, pageIndex.current, { scrolledByUser: scrolledByUser.current });
                scrolledByUser.current = false;
                isOnEdge.current = false;
                isNearEdge.current = false;
                if (newPageIndex === 0 || newPageIndex === data.length - 1) {
                    isOnEdge.current = true;
                }
                else if (onReachNearEdgeThreshold &&
                    !inRange(newPageIndex, onReachNearEdgeThreshold, data.length - onReachNearEdgeThreshold)) {
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
        onScroll === null || onScroll === void 0 ? void 0 : onScroll(event, offsetX, offsetY);
    }, [onScroll, onPageChange, data.length, reloadPagesDebounce]);
    const onMomentumScrollEnd = useCallback(event => {
        var _a;
        if (pageIndex.current) {
            if (isOnEdge.current) {
                onReachEdge === null || onReachEdge === void 0 ? void 0 : onReachEdge(pageIndex.current);
                reloadPagesDebounce === null || reloadPagesDebounce === void 0 ? void 0 : reloadPagesDebounce(pageIndex.current);
            }
            else if (isNearEdge.current) {
                reloadPagesDebounce === null || reloadPagesDebounce === void 0 ? void 0 : reloadPagesDebounce(pageIndex.current);
                onReachNearEdge === null || onReachNearEdge === void 0 ? void 0 : onReachNearEdge(pageIndex.current);
            }
            (_a = scrollViewProps === null || scrollViewProps === void 0 ? void 0 : scrollViewProps.onMomentumScrollEnd) === null || _a === void 0 ? void 0 : _a.call(scrollViewProps, event);
        }
    }, [scrollViewProps === null || scrollViewProps === void 0 ? void 0 : scrollViewProps.onMomentumScrollEnd, onReachEdge, onReachNearEdge, reloadPagesDebounce]);
    const onScrollBeginDrag = useCallback(() => {
        scrolledByUser.current = true;
    }, []);
    const scrollViewPropsMemo = useMemo(() => {
        return Object.assign(Object.assign({ pagingEnabled: isHorizontal, bounces: false }, scrollViewProps), { onScrollBeginDrag,
            onMomentumScrollEnd });
    }, [onScrollBeginDrag, onMomentumScrollEnd, scrollViewProps, isHorizontal]);
    const style = useMemo(() => {
        return { height: pageHeight };
    }, [pageHeight]);
    return (<RecyclerListView 
    // @ts-ignore
    ref={listRef} isHorizontal={isHorizontal} disableRecycling={shouldUseAndroidRTLFix} rowRenderer={renderItem} dataProvider={dataProvider} layoutProvider={layoutProvider !== null && layoutProvider !== void 0 ? layoutProvider : _layoutProvider.current} extendedState={extendedState} initialRenderIndex={initialOffset ? undefined : initialPageIndex} initialOffset={initialOffset} renderAheadOffset={5 * pageWidth} onScroll={_onScroll} style={style} scrollViewProps={scrollViewPropsMemo} onEndReached={onEndReached} onEndReachedThreshold={onEndReachedThreshold} onVisibleIndicesChanged={onVisibleIndicesChanged} renderFooter={renderFooter}/>);
};
export default forwardRef(InfiniteList);
