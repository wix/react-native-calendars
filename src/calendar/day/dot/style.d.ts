import { Theme } from '../../../types';
export default function styleConstructor(theme?: Theme): {
    dot: {
        width: number;
        height: number;
        marginTop: number;
        marginHorizontal: number;
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
    inactiveDot: {
        backgroundColor: string;
    };
    todayDot: {
        backgroundColor: string;
    };
};
