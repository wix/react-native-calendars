import { Theme } from '../types';
export default function getStyle(theme?: Theme): {
    flatListContainer: {
        flex: number | undefined;
    };
    container: {
        backgroundColor: string;
    };
    placeholder: {
        backgroundColor: string;
        alignItems: "center";
        justifyContent: "center";
    };
    placeholderText: {
        fontSize: number;
        fontWeight: "200";
        color: string;
    };
    calendar: {
        paddingLeft: number;
        paddingRight: number;
    };
    staticHeader: {
        position: "absolute";
        left: number;
        right: number;
        top: number;
        backgroundColor: string;
        paddingLeft: number;
        paddingRight: number;
    };
};
