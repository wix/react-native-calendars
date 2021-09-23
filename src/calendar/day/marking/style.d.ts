import { Theme } from '../../../types';
export default function styleConstructor(theme?: Theme): {
    dots: {
        flexDirection: "row";
    };
    periods: {
        alignSelf: "stretch";
    };
    period: {
        height: number;
        marginVertical: number;
        backgroundColor: string | undefined;
    };
    startingDay: {
        borderTopLeftRadius: number;
        borderBottomLeftRadius: number;
        marginLeft: number;
    };
    endingDay: {
        borderTopRightRadius: number;
        borderBottomRightRadius: number;
        marginRight: number;
    };
};
