import {useCallback, useEffect, useRef, MutableRefObject} from 'react';
import {NativeScrollEvent, NativeSyntheticEvent, ScrollView} from 'react-native';

interface UseTimelineOffsetProps {
  onChangeOffset?: (offset: number) => void;
  scrollOffset?: number;
  scrollViewRef: MutableRefObject<ScrollView | undefined>;
}

export default (props: UseTimelineOffsetProps) => {
  const {onChangeOffset, scrollOffset, scrollViewRef} = props;

  const inMomentum = useRef(false);

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

  const onScrollEndDrag = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offset = event.nativeEvent.contentOffset.y;
    setTimeout(() => {
      if (!inMomentum.current) {
        onChangeOffset?.(offset);
      }
    }, 0);
  }, []);

  const onMomentumScrollBegin = useCallback(() => {
    inMomentum.current = true;
  }, []);

  const onMomentumScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      inMomentum.current = false;
      onChangeOffset?.(event.nativeEvent.contentOffset.y);
    },
    [onChangeOffset]
  );

  return {
    scrollEvents: {
      onScrollEndDrag,
      onMomentumScrollBegin,
      onMomentumScrollEnd
    }
  };
};
