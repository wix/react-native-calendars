/// <reference types="xdate" />
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { CalendarProps } from '../calendar';
interface Props extends CalendarProps {
    current: XDate;
}
export declare type WeekProps = Props;
declare class Week extends PureComponent<Props> {
    static displayName: string;
    static propTypes: {
        current: PropTypes.Requireable<any>;
        theme: PropTypes.Requireable<object>;
        style: PropTypes.Requireable<number | object>;
        minDate: PropTypes.Requireable<any>;
        maxDate: PropTypes.Requireable<any>;
        firstDay: PropTypes.Requireable<number>;
        markedDates: PropTypes.Requireable<object>;
        displayLoadingIndicator: PropTypes.Requireable<boolean>;
        showWeekNumbers: PropTypes.Requireable<boolean>;
        hideExtraDays: PropTypes.Requireable<boolean>;
        showSixWeeks: PropTypes.Requireable<boolean>;
        onDayPress: PropTypes.Requireable<(...args: any[]) => any>;
        onDayLongPress: PropTypes.Requireable<(...args: any[]) => any>;
        onMonthChange: PropTypes.Requireable<(...args: any[]) => any>;
        onVisibleMonthsChange: PropTypes.Requireable<(...args: any[]) => any>;
        disableMonthChange: PropTypes.Requireable<boolean>;
        enableSwipeMonths: PropTypes.Requireable<boolean>;
        disabledByDefault: PropTypes.Requireable<boolean>;
        headerStyle: PropTypes.Requireable<number | object>;
        customHeader: PropTypes.Requireable<any>;
        day: PropTypes.Requireable<object>;
        dayComponent: PropTypes.Requireable<any>;
        onLongPress: PropTypes.Requireable<(...args: any[]) => any>;
        onPress: PropTypes.Requireable<(...args: any[]) => any>;
        state: PropTypes.Requireable<string>;
        marking: PropTypes.Requireable<any>;
        markingType: PropTypes.Requireable<import("../calendar/day/marking").MarkingTypes>;
        disableAllTouchEventsForDisabledDays: PropTypes.Requireable<boolean>;
        disableAllTouchEventsForInactiveDays: PropTypes.Requireable<boolean>;
        month: PropTypes.Requireable<import("xdate")>;
        addMonth: PropTypes.Requireable<(...args: any[]) => any>;
        monthFormat: PropTypes.Requireable<string>;
        hideDayNames: PropTypes.Requireable<boolean>;
        hideArrows: PropTypes.Requireable<boolean>;
        renderArrow: PropTypes.Requireable<(...args: any[]) => any>;
        onPressArrowLeft: PropTypes.Requireable<(...args: any[]) => any>;
        onPressArrowRight: PropTypes.Requireable<(...args: any[]) => any>;
        disableArrowLeft: PropTypes.Requireable<boolean>;
        disableArrowRight: PropTypes.Requireable<boolean>;
        disabledDaysIndexes: PropTypes.Requireable<(number | null | undefined)[]>;
        renderHeader: PropTypes.Requireable<any>;
        webAriaLevel: PropTypes.Requireable<number>;
    };
    style: {
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
    getWeek(date: XDate): any;
    renderDay(day: XDate, id: number): JSX.Element;
    render(): JSX.Element;
}
export default Week;
