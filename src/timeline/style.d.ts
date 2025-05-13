import { Theme } from '../types';
export default function styleConstructor(theme: Theme | undefined, calendarHeight: number): {
    container: {
        backgroundColor: string;
    };
    contentStyle: {
        flexDirection: "row";
        height: number;
        backfaceVisibility?: "visible" | "hidden" | undefined;
        backgroundColor: import("react-native/types").ColorValue;
        borderBlockColor?: import("react-native/types").ColorValue | undefined;
        borderBlockEndColor?: import("react-native/types").ColorValue | undefined;
        borderBlockStartColor?: import("react-native/types").ColorValue | undefined;
        borderBottomColor?: import("react-native/types").ColorValue | undefined;
        borderBottomEndRadius?: import("react-native/types").AnimatableNumericValue | undefined;
        borderBottomLeftRadius?: import("react-native/types").AnimatableNumericValue | undefined;
        borderBottomRightRadius?: import("react-native/types").AnimatableNumericValue | undefined;
        borderBottomStartRadius?: import("react-native/types").AnimatableNumericValue | undefined;
        borderColor?: import("react-native/types").ColorValue | undefined;
        borderCurve?: "circular" | "continuous" | undefined;
        borderEndColor?: import("react-native/types").ColorValue | undefined;
        borderEndEndRadius?: import("react-native/types").AnimatableNumericValue | undefined;
        borderEndStartRadius?: import("react-native/types").AnimatableNumericValue | undefined;
        borderLeftColor?: import("react-native/types").ColorValue | undefined;
        borderRadius?: import("react-native/types").AnimatableNumericValue | undefined;
        borderRightColor?: import("react-native/types").ColorValue | undefined;
        borderStartColor?: import("react-native/types").ColorValue | undefined;
        borderStartEndRadius?: import("react-native/types").AnimatableNumericValue | undefined;
        borderStartStartRadius?: import("react-native/types").AnimatableNumericValue | undefined;
        borderStyle?: "solid" | "dotted" | "dashed" | undefined;
        borderTopColor?: import("react-native/types").ColorValue | undefined;
        borderTopEndRadius?: import("react-native/types").AnimatableNumericValue | undefined;
        borderTopLeftRadius?: import("react-native/types").AnimatableNumericValue | undefined;
        borderTopRightRadius?: import("react-native/types").AnimatableNumericValue | undefined;
        borderTopStartRadius?: import("react-native/types").AnimatableNumericValue | undefined;
        opacity?: import("react-native/types").AnimatableNumericValue | undefined;
        elevation?: number | undefined;
        pointerEvents?: "auto" | "none" | "box-none" | "box-only" | undefined;
        alignContent?: "center" | "flex-start" | "flex-end" | "stretch" | "space-between" | "space-around" | undefined;
        alignItems?: import("react-native/types").FlexAlignType | undefined;
        alignSelf?: "auto" | import("react-native/types").FlexAlignType | undefined;
        aspectRatio?: string | number | undefined;
        borderBottomWidth?: number | undefined;
        borderEndWidth?: number | undefined;
        borderLeftWidth?: number | undefined;
        borderRightWidth?: number | undefined;
        borderStartWidth?: number | undefined;
        borderTopWidth?: number | undefined;
        borderWidth?: number | undefined;
        bottom?: import("react-native/types").DimensionValue | undefined;
        display?: "none" | "flex" | undefined;
        end?: import("react-native/types").DimensionValue | undefined;
        flex?: number | undefined;
        flexBasis?: import("react-native/types").DimensionValue | undefined;
        rowGap?: number | undefined;
        gap?: number | undefined;
        columnGap?: number | undefined;
        flexGrow?: number | undefined;
        flexShrink?: number | undefined;
        flexWrap?: "wrap" | "nowrap" | "wrap-reverse" | undefined;
        justifyContent?: "center" | "flex-start" | "flex-end" | "space-between" | "space-around" | "space-evenly" | undefined;
        left?: import("react-native/types").DimensionValue | undefined;
        margin?: import("react-native/types").DimensionValue | undefined;
        marginBottom?: import("react-native/types").DimensionValue | undefined;
        marginEnd?: import("react-native/types").DimensionValue | undefined;
        marginHorizontal?: import("react-native/types").DimensionValue | undefined;
        marginLeft?: import("react-native/types").DimensionValue | undefined;
        marginRight?: import("react-native/types").DimensionValue | undefined;
        marginStart?: import("react-native/types").DimensionValue | undefined;
        marginTop?: import("react-native/types").DimensionValue | undefined;
        marginVertical?: import("react-native/types").DimensionValue | undefined;
        maxHeight?: import("react-native/types").DimensionValue | undefined;
        maxWidth?: import("react-native/types").DimensionValue | undefined;
        minHeight?: import("react-native/types").DimensionValue | undefined;
        minWidth?: import("react-native/types").DimensionValue | undefined;
        overflow?: "visible" | "hidden" | "scroll" | undefined;
        padding?: import("react-native/types").DimensionValue | undefined;
        paddingBottom?: import("react-native/types").DimensionValue | undefined;
        paddingEnd?: import("react-native/types").DimensionValue | undefined;
        paddingHorizontal?: import("react-native/types").DimensionValue | undefined;
        paddingLeft?: import("react-native/types").DimensionValue | undefined;
        paddingRight?: import("react-native/types").DimensionValue | undefined;
        paddingStart?: import("react-native/types").DimensionValue | undefined;
        paddingTop?: import("react-native/types").DimensionValue | undefined;
        paddingVertical?: import("react-native/types").DimensionValue | undefined;
        position?: "absolute" | "relative" | undefined;
        right?: import("react-native/types").DimensionValue | undefined;
        start?: import("react-native/types").DimensionValue | undefined;
        top?: import("react-native/types").DimensionValue | undefined;
        width?: import("react-native/types").DimensionValue | undefined;
        zIndex?: number | undefined;
        direction?: "ltr" | "rtl" | "inherit" | undefined;
        shadowColor?: import("react-native/types").ColorValue | undefined;
        shadowOffset?: Readonly<{
            width: number;
            height: number;
        }> | undefined;
        shadowOpacity?: import("react-native/types").AnimatableNumericValue | undefined;
        shadowRadius?: number | undefined;
        transform?: string | readonly (({
            perspective: import("react-native/types").AnimatableNumericValue;
        } & {
            rotate?: undefined;
            rotateX?: undefined;
            rotateY?: undefined;
            rotateZ?: undefined;
            scale?: undefined;
            scaleX?: undefined;
            scaleY?: undefined;
            translateX?: undefined;
            translateY?: undefined;
            skewX?: undefined;
            skewY?: undefined;
            matrix?: undefined;
        }) | ({
            rotate: import("react-native/types").AnimatableStringValue;
        } & {
            perspective?: undefined;
            rotateX?: undefined;
            rotateY?: undefined;
            rotateZ?: undefined;
            scale?: undefined;
            scaleX?: undefined;
            scaleY?: undefined;
            translateX?: undefined;
            translateY?: undefined;
            skewX?: undefined;
            skewY?: undefined;
            matrix?: undefined;
        }) | ({
            rotateX: import("react-native/types").AnimatableStringValue;
        } & {
            perspective?: undefined;
            rotate?: undefined;
            rotateY?: undefined;
            rotateZ?: undefined;
            scale?: undefined;
            scaleX?: undefined;
            scaleY?: undefined;
            translateX?: undefined;
            translateY?: undefined;
            skewX?: undefined;
            skewY?: undefined;
            matrix?: undefined;
        }) | ({
            rotateY: import("react-native/types").AnimatableStringValue;
        } & {
            perspective?: undefined;
            rotate?: undefined;
            rotateX?: undefined;
            rotateZ?: undefined;
            scale?: undefined;
            scaleX?: undefined;
            scaleY?: undefined;
            translateX?: undefined;
            translateY?: undefined;
            skewX?: undefined;
            skewY?: undefined;
            matrix?: undefined;
        }) | ({
            rotateZ: import("react-native/types").AnimatableStringValue;
        } & {
            perspective?: undefined;
            rotate?: undefined;
            rotateX?: undefined;
            rotateY?: undefined;
            scale?: undefined;
            scaleX?: undefined;
            scaleY?: undefined;
            translateX?: undefined;
            translateY?: undefined;
            skewX?: undefined;
            skewY?: undefined;
            matrix?: undefined;
        }) | ({
            scale: import("react-native/types").AnimatableNumericValue;
        } & {
            perspective?: undefined;
            rotate?: undefined;
            rotateX?: undefined;
            rotateY?: undefined;
            rotateZ?: undefined;
            scaleX?: undefined;
            scaleY?: undefined;
            translateX?: undefined;
            translateY?: undefined;
            skewX?: undefined;
            skewY?: undefined;
            matrix?: undefined;
        }) | ({
            scaleX: import("react-native/types").AnimatableNumericValue;
        } & {
            perspective?: undefined;
            rotate?: undefined;
            rotateX?: undefined;
            rotateY?: undefined;
            rotateZ?: undefined;
            scale?: undefined;
            scaleY?: undefined;
            translateX?: undefined;
            translateY?: undefined;
            skewX?: undefined;
            skewY?: undefined;
            matrix?: undefined;
        }) | ({
            scaleY: import("react-native/types").AnimatableNumericValue;
        } & {
            perspective?: undefined;
            rotate?: undefined;
            rotateX?: undefined;
            rotateY?: undefined;
            rotateZ?: undefined;
            scale?: undefined;
            scaleX?: undefined;
            translateX?: undefined;
            translateY?: undefined;
            skewX?: undefined;
            skewY?: undefined;
            matrix?: undefined;
        }) | ({
            translateX: import("react-native/types").AnimatableNumericValue;
        } & {
            perspective?: undefined;
            rotate?: undefined;
            rotateX?: undefined;
            rotateY?: undefined;
            rotateZ?: undefined;
            scale?: undefined;
            scaleX?: undefined;
            scaleY?: undefined;
            translateY?: undefined;
            skewX?: undefined;
            skewY?: undefined;
            matrix?: undefined;
        }) | ({
            translateY: import("react-native/types").AnimatableNumericValue;
        } & {
            perspective?: undefined;
            rotate?: undefined;
            rotateX?: undefined;
            rotateY?: undefined;
            rotateZ?: undefined;
            scale?: undefined;
            scaleX?: undefined;
            scaleY?: undefined;
            translateX?: undefined;
            skewX?: undefined;
            skewY?: undefined;
            matrix?: undefined;
        }) | ({
            skewX: import("react-native/types").AnimatableStringValue;
        } & {
            perspective?: undefined;
            rotate?: undefined;
            rotateX?: undefined;
            rotateY?: undefined;
            rotateZ?: undefined;
            scale?: undefined;
            scaleX?: undefined;
            scaleY?: undefined;
            translateX?: undefined;
            translateY?: undefined;
            skewY?: undefined;
            matrix?: undefined;
        }) | ({
            skewY: import("react-native/types").AnimatableStringValue;
        } & {
            perspective?: undefined;
            rotate?: undefined;
            rotateX?: undefined;
            rotateY?: undefined;
            rotateZ?: undefined;
            scale?: undefined;
            scaleX?: undefined;
            scaleY?: undefined;
            translateX?: undefined;
            translateY?: undefined;
            skewX?: undefined;
            matrix?: undefined;
        }) | ({
            matrix: import("react-native/types").AnimatableNumericValue[];
        } & {
            perspective?: undefined;
            rotate?: undefined;
            rotateX?: undefined;
            rotateY?: undefined;
            rotateZ?: undefined;
            scale?: undefined;
            scaleX?: undefined;
            scaleY?: undefined;
            translateX?: undefined;
            translateY?: undefined;
            skewX?: undefined;
            skewY?: undefined;
        }))[] | undefined;
        transformOrigin?: string | (string | number)[] | undefined;
        transformMatrix?: number[] | undefined;
        rotation?: import("react-native/types").AnimatableNumericValue | undefined;
        scaleX?: import("react-native/types").AnimatableNumericValue | undefined;
        scaleY?: import("react-native/types").AnimatableNumericValue | undefined;
        translateX?: import("react-native/types").AnimatableNumericValue | undefined;
        translateY?: import("react-native/types").AnimatableNumericValue | undefined;
    };
    line: {
        position: "absolute";
        height: number;
        backgroundColor: string;
    };
    verticalLine: {
        position: "absolute";
        height: "105%";
        width: number;
        backgroundColor: string;
    };
    nowIndicator: {
        position: "absolute";
        right: number;
    };
    nowIndicatorLine: {
        position: "absolute";
        left: number;
        right: number;
        height: number;
        backgroundColor: string;
    };
    nowIndicatorKnob: {
        position: "absolute";
        left: number;
        top: number;
        width: number;
        height: number;
        borderRadius: number;
        backgroundColor: string;
    };
    timeLabel: {
        position: "absolute";
        color: string;
        fontSize: number;
        fontWeight: "500";
        fontFamily: string;
        paddingLeft: number;
        textAlign: "center";
    };
    unavailableHoursBlock: {
        position: "absolute";
        right: number;
        backgroundColor: string;
    };
    event: {
        position: "absolute";
        flex: number;
        flexDirection: "column";
        alignItems: "flex-start";
        overflow: "hidden";
        minHeight: number;
        opacity: number;
        paddingLeft: number;
        paddingTop: number;
        paddingBottom: number;
        backgroundColor: string;
        borderColor: string;
        borderWidth: number;
    };
    eventTitle: {
        minHeight: number;
        color: string;
        fontWeight: "600";
    };
    eventSummary: {
        flexWrap: "wrap";
        color: string;
        fontSize: number;
    };
    eventTimes: {
        flexWrap: "wrap";
        marginTop: number;
        color: string;
        fontSize: number;
        fontWeight: "bold";
    };
    eventsContainer: {
        flex: number;
    };
};
