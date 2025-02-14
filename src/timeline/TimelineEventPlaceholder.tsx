import {TextStyle, View, ViewStyle} from "react-native";
import {useMemo} from "react";
import {calcTimeOffset} from "./helpers/presenter";
import {HOUR_BLOCK_HEIGHT} from "./Packer";
import {NewEventTime} from "./TimelineHours";

export interface TimelineEventPlaceholderProps {
    styles: {[key: string]: ViewStyle | TextStyle};
    startTime: NewEventTime;
    endTime: NewEventTime;
    width: number;
    left: number;
    renderPlaceholder?: ()=> JSX.Element;
}

const TimelineEventPlaceholder = (props: TimelineEventPlaceholderProps) => {
    const {styles, startTime, endTime, width, left, renderPlaceholder} = props;

    const placeholderStart = calcTimeOffset(HOUR_BLOCK_HEIGHT, startTime.hour, startTime.minutes);
    const placeholderEnd = calcTimeOffset(HOUR_BLOCK_HEIGHT, endTime.hour, endTime.minutes);

    const timelineEventPlaceholderStyle = useMemo(() => {
        return [styles.eventPlaceholderStyle, {top: placeholderStart, height: placeholderEnd - placeholderStart, width, left}]
    }, [placeholderStart, placeholderEnd]);

    return <View style={timelineEventPlaceholderStyle} pointerEvents={"none"}>
        {renderPlaceholder?.()}
    </View>
};

export default TimelineEventPlaceholder;