import { Theme } from '../types';
export declare const HEADER_HEIGHT = 68;
export default function styleConstructor(theme?: Theme): {
    containerShadow: {
        backgroundColor: string;
    } | {
        shadowColor: string;
        shadowOpacity: number;
        shadowRadius: number;
        shadowOffset: {
            height: number;
            width: number;
        };
        zIndex: number;
        elevation?: undefined;
        backgroundColor: string;
    } | {
        elevation: number;
        shadowColor?: undefined;
        shadowOpacity?: undefined;
        shadowRadius?: undefined;
        shadowOffset?: undefined;
        zIndex?: undefined;
        backgroundColor: string;
    };
    containerWrapper: {
        paddingBottom: number;
    };
    container: {
        backgroundColor: string;
    };
    knobContainer: {
        position: "absolute";
        left: number;
        right: number;
        height: number;
        bottom: number;
        alignItems: "center";
        justifyContent: "center";
        backgroundColor: string;
    };
    knob: {
        width: number;
        height: number;
        borderRadius: number;
        backgroundColor: string;
    };
    sectionText: {
        fontWeight: "bold";
        fontSize: number;
        lineHeight: number;
        color: string;
        paddingTop: number;
        paddingBottom: number;
        paddingLeft: number;
        paddingRight: number;
        backgroundColor: string;
        textAlign: "left";
        textTransform: "uppercase";
    };
    header: {
        position: "absolute";
        left: number;
        right: number;
        backgroundColor: string;
    };
    headerTitle: {
        alignSelf: "center";
        paddingTop: number;
        paddingBottom: number;
        fontSize: number;
        fontFamily: string;
        fontWeight: "300" | "600" | "normal" | "bold" | "100" | "200" | "400" | "500" | "700" | "800" | "900";
        color: string;
    };
    weekDayNames: {
        flexDirection: "row";
        justifyContent: "space-between";
    };
    weekday: {
        width: number;
        textAlign: "center";
        fontSize: number;
        fontFamily: string;
        fontWeight: "300" | "600" | "normal" | "bold" | "100" | "200" | "400" | "500" | "700" | "800" | "900" | undefined;
        color: string;
    };
    monthView: {
        backgroundColor: string;
    };
    weekContainer: {
        position: "absolute";
        left: number;
        right: number;
        top: number;
    };
    hidden: {
        opacity: number;
    };
    visible: {
        opacity: number;
    };
    weekCalendar: {
        marginTop: number;
        marginBottom: number;
    };
    week: {
        marginTop: number;
        marginBottom: number;
        paddingRight: number;
        paddingLeft: number;
        flexDirection: "row";
        justifyContent: "space-around";
    };
    dayContainer: {
        flex: number;
        alignItems: "center";
    };
    emptyDayContainer: {
        flex: number;
    };
    dayHeader: {
        width: number;
        textAlign: "center";
        fontSize: number;
        fontFamily: string;
        fontWeight: "300" | "600" | "normal" | "bold" | "100" | "200" | "400" | "500" | "700" | "800" | "900" | undefined;
        color: string;
    };
    arrowImage: {
        tintColor: string;
        transform: {
            scaleX: number;
        }[] | undefined;
    };
    todayButtonContainer: {
        alignItems: "flex-start" | "flex-end";
        position: "absolute";
        left: number;
        right: number;
        bottom: number;
    };
    todayButton: {
        height: number;
        paddingHorizontal: number;
        borderRadius: number;
        flexDirection: "row" | "row-reverse";
        justifyContent: "center";
        alignItems: "center";
        backgroundColor: string;
    } | {
        shadowColor: string;
        shadowOpacity: number;
        shadowRadius: number;
        shadowOffset: {
            height: number;
            width: number;
        };
        elevation?: undefined;
        height: number;
        paddingHorizontal: number;
        borderRadius: number;
        flexDirection: "row" | "row-reverse";
        justifyContent: "center";
        alignItems: "center";
        backgroundColor: string;
    } | {
        elevation: number;
        shadowColor?: undefined;
        shadowOpacity?: undefined;
        shadowRadius?: undefined;
        shadowOffset?: undefined;
        height: number;
        paddingHorizontal: number;
        borderRadius: number;
        flexDirection: "row" | "row-reverse";
        justifyContent: "center";
        alignItems: "center";
        backgroundColor: string;
    };
    todayButtonText: {
        color: string;
        fontSize: number;
        fontWeight: "300" | "600" | "normal" | "bold" | "100" | "200" | "400" | "500" | "700" | "800" | "900";
        fontFamily: string;
    };
    todayButtonImage: {
        tintColor: string;
        marginLeft: number | undefined;
        marginRight: number | undefined;
    };
};
