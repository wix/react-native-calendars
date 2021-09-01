import { Theme } from '../../types';
export default function styleConstructor(theme?: Theme): {
    container: {
        flexDirection: "row";
    };
    innerContainer: {
        flex: number;
    };
    dayNum: {
        fontSize: number;
        fontWeight: "200";
        fontFamily: string;
        color: string;
    };
    dayText: {
        fontSize: number;
        fontWeight: "300" | "600" | "normal" | "bold" | "100" | "200" | "400" | "500" | "700" | "800" | "900";
        fontFamily: string;
        color: string;
        backgroundColor: string;
        marginTop: number;
    };
    day: {
        width: number;
        alignItems: "center";
        justifyContent: "flex-start";
        marginTop: number;
    };
    today: {
        color: string;
    };
    indicator: {
        marginTop: number;
    };
};
