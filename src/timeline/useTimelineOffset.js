import { useCallback, useEffect } from 'react';
export default (props) => {
    const { onChangeOffset, scrollOffset, scrollViewRef } = props;
    useEffect(() => {
        // NOTE: The main reason for this feature is to sync the offset
        // between all of the timelines in the TimelineList component
        if (scrollOffset !== undefined) {
            scrollViewRef?.current?.scrollTo({
                y: scrollOffset,
                animated: false
            });
        }
    }, [scrollOffset]);
    const onScrollEndDrag = useCallback((event) => {
        const offset = event.nativeEvent.contentOffset.y;
        const velocity = event.nativeEvent.velocity?.y;
        if (velocity === 0) {
            onChangeOffset?.(offset);
        }
    }, []);
    const onMomentumScrollEnd = useCallback((event) => {
        onChangeOffset?.(event.nativeEvent.contentOffset.y);
    }, []);
    return {
        scrollEvents: {
            onScrollEndDrag,
            onMomentumScrollEnd
        }
    };
};
