import { MutableRefObject } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView } from 'react-native';
interface UseTimelineOffsetProps {
    onChangeOffset?: (offset: number) => void;
    scrollOffset?: number;
    scrollViewRef: MutableRefObject<ScrollView | undefined>;
}
declare const _default: (props: UseTimelineOffsetProps) => {
    scrollEvents: {
        onScrollEndDrag: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
        onMomentumScrollEnd: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
    };
};
export default _default;
