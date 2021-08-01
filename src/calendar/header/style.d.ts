import { Theme } from '../../commons/types';
export default function (theme?: Theme): {
    header: {
        flexDirection: "row";
        justifyContent: "space-between";
        paddingLeft: number;
        paddingRight: number;
        marginTop: number;
        alignItems: "center";
    };
    headerContainer: {
        flexDirection: "row";
    };
    monthText: {
        fontSize: number;
        fontFamily: string;
        fontWeight: string;
        color: string;
        margin: number;
    };
    arrow: {
        padding: number;
    };
    arrowImage: {
        width?: number | undefined;
        height?: number | undefined;
        tintColor: string;
    };
    disabledArrowImage: {
        tintColor: string;
    };
    week: {
        marginTop: number;
        flexDirection: "row";
        justifyContent: "space-around";
    };
    dayHeader: {
        marginTop: number;
        marginBottom: number;
        width: number;
        textAlign: "center";
        fontSize: number;
        fontFamily: string;
        fontWeight: string | undefined;
        color: string;
    };
    disabledDayHeader: {
        color: string;
    };
};
