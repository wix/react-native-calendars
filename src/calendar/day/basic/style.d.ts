import { Theme } from '../../../commons/types';
export default function styleConstructor(theme?: Theme): {
    container: {
        alignSelf: "stretch";
        alignItems: "center";
    };
    base: {
        width: number;
        height: number;
        alignItems: "center";
    };
    text: {
        marginTop: number;
        fontSize: number;
        fontFamily: string;
        fontWeight: string;
        color: string;
        backgroundColor: string;
    };
    alignedText: {
        marginTop: number;
    };
    selected: {
        backgroundColor: string;
        borderRadius: number;
    };
    today: {
        backgroundColor: string | undefined;
        borderRadius: number;
    };
    todayText: {
        color: string;
    };
    selectedText: {
        color: string;
    };
    disabledText: {
        color: string;
    };
    dot: {
        width: number;
        height: number;
        marginTop: number;
        borderRadius: number;
        opacity: number;
    };
    visibleDot: {
        opacity: number;
        backgroundColor: string;
    };
    selectedDot: {
        backgroundColor: string;
    };
    disabledDot: {
        backgroundColor: string;
    };
    todayDot: {
        backgroundColor: string;
    };
};
