import { Theme } from '../../../types';
export default function styleConstructor(theme?: Theme): {
    wrapper: {
        alignItems: "center";
        alignSelf: "stretch";
        marginLeft: number;
    };
    base: {
        width: number;
        height: number;
        alignItems: "center";
    };
    fillers: {
        position: "absolute";
        height: number;
        flexDirection: "row";
        left: number;
        right: number;
    };
    leftFiller: {
        height: number;
        flex: number;
    };
    rightFiller: {
        height: number;
        flex: number;
    };
    text: {
        marginTop: number;
        fontSize: number;
        fontFamily: string;
        fontWeight: "300" | "600" | "normal" | "bold" | "100" | "200" | "400" | "500" | "700" | "800" | "900";
        color: string;
        backgroundColor: string;
    };
    today: {
        backgroundColor: string | undefined;
    };
    todayText: {
        fontWeight: "500";
        color: string;
    };
    selectedText: {
        color: string;
    };
    disabledText: {
        color: string;
    };
    inactiveText: {
        color: string;
    };
};
