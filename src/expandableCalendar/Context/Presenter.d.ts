import { CalendarContextProviderProps } from './Provider';
import { UpdateSource } from '../../types';
declare class Presenter {
    _isPastDate(date: Date): boolean;
    _getIconDown: () => any;
    _getIconUp: () => any;
    getButtonIcon: (date: Date, showTodayButton?: boolean) => any;
    setDate: (props: CalendarContextProviderProps, date: Date, newDate: Date, updateState: (buttonIcon: any) => void, updateSource: UpdateSource) => void;
    setDisabled: (showTodayButton: boolean, newDisabledValue: boolean, oldDisabledValue: boolean, updateState: (disabled: boolean) => void) => void;
    shouldAnimateTodayButton: (props: CalendarContextProviderProps) => boolean | undefined;
    _isToday: (date: Date) => boolean;
    getTodayDate: () => any;
    getPositionAnimation: (date: Date, todayBottomMargin?: number) => {
        toValue: number;
        tension: number;
        friction: number;
        useNativeDriver: boolean;
    };
    shouldAnimateOpacity: (props: CalendarContextProviderProps) => number | undefined;
    getOpacityAnimation: ({ disabledOpacity }: CalendarContextProviderProps, disabled: boolean) => {
        toValue: number;
        duration: number;
        useNativeDriver: boolean;
    };
    getTodayFormatted: () => any;
}
export default Presenter;
