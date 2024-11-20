import { useCallback, useEffect } from 'react';
export default (props) => {
    const { onChangeOffset, scrollOffset, scrollViewRef } = props;
    useEffect(() => {
        var _a;
        // NOTE: The main reason for this feature is to sync the offset
        // between all of the timelines in the TimelineList component
        if (scrollOffset !== undefined) {
            (_a = scrollViewRef === null || scrollViewRef === void 0 ? void 0 : scrollViewRef.current) === null || _a === void 0 ? void 0 : _a.scrollTo({
                y: scrollOffset,
                animated: false
            });
        }
    }, [scrollOffset]);
    const onScrollEndDrag = useCallback((event) => {
        var _a;
        const offset = event.nativeEvent.contentOffset.y;
        const velocity = (_a = event.nativeEvent.velocity) === null || _a === void 0 ? void 0 : _a.y;
        if (velocity === 0) {
            onChangeOffset === null || onChangeOffset === void 0 ? void 0 : onChangeOffset(offset);
        }
    }, []);
    const onMomentumScrollEnd = useCallback((event) => {
        onChangeOffset === null || onChangeOffset === void 0 ? void 0 : onChangeOffset(event.nativeEvent.contentOffset.y);
    }, []);
    return {
        scrollEvents: {
            onScrollEndDrag,
            onMomentumScrollEnd
        }
    };
};
