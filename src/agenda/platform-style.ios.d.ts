import { Theme } from '../types';
export default function platformStyles(appStyle: Theme): {
    knob: {
        width: number;
        height: number;
        marginTop: number;
        borderRadius: number;
        backgroundColor: string | undefined;
    };
    weekdays: {
        position: string;
        left: number;
        right: number;
        top: number;
        flexDirection: string;
        justifyContent: string;
        marginLeft: number;
        marginRight: number;
        paddingTop: number;
        paddingBottom: number;
        backgroundColor: string | undefined;
    };
};
