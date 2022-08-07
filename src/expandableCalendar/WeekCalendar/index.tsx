import {View, NativeSyntheticEvent, NativeScrollEvent, FlatList} from 'react-native';
import {sameWeek} from '../../dateutils';
import {DateData} from '../../types';
import styleConstructor from '../style';
import asCalendarConsumer from '../asCalendarConsumer';
import {CalendarListProps} from '../../calendar-list';
import WeekDaysNames from '../../commons/WeekDaysNames';
import Week from '../week';
import {
  getDatesArray,
  onScroll,
  shouldComponentUpdate
} from './presenter';
import constants from '../../commons/constants';
import {UpdateSources} from '../commons';

const NUMBER_OF_PAGES = 2; // must be a positive number
const applyAndroidRtlFix = constants.isAndroid && constants.isRTL;

export interface WeekCalendarProps extends CalendarListProps {
  /** whether to have shadow/elevation for the calendar */
  allowShadow?: boolean;
  context?: any;
}

/**
 * @description: Week calendar component
 * @note: Should be wrapped with 'CalendarProvider'
 * @example: https://github.com/wix/react-native-calendars/blob/master/example/src/screens/expandableCalendar.js
 */
const WeekCalendar = React.forwardRef((props: WeekCalendarProps, ref) => {
  const {
    calendarWidth,
    firstDay = 0,
    hideDayNames,
    current,
    markedDates,
    allowShadow = true,
    context,
    theme,
    style: propsStyle,
    onDayPress,
    importantForAccessibility,
    testID,
    accessibilityElementsHidden,
  } = props;
  const style = useRef(styleConstructor(theme));
  const [page, setPage] = useState(NUMBER_OF_PAGES);
  const [items, setItems] = useState(getDatesArray(props));

  const list = useRef<FlatList>(null);
  const [firstAndroidRTLScroll, setFirstAndroidRTLScroll] = useState(constants.isAndroid && constants.isRTL);

  useEffect(() => {
    setItems(getDatesArray(props));
  }, []);

  const containerWidth = useMemo(() => {
    return calendarWidth ?? constants.screenWidth;
  }, [calendarWidth]);

  const onDayPressCallback = useCallback((value: DateData) => {
    if (onDayPress) {
      onDayPress(value);
    } else {
      context.setDate?.(value.dateString, UpdateSources.DAY_PRESS);
    }
  }, [context, onDayPress]);

  const onScrollCallback = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = event.nativeEvent.contentOffset.x;
    setPage(onScroll({context, x, page, items, width: containerWidth, firstAndroidRTLScroll, setFirstAndroidRTLScroll}));
  }, [context, containerWidth, page, items, firstAndroidRTLScroll, setFirstAndroidRTLScroll]);

  const getWeekStyle = useCallback((width, style) => {
    return [{width}, style];
  }, []);

  const isFirstPage = useCallback((page: number) => {
    return page === 0;
  }, []);

  const isLastPage = useCallback((page: number, items: string[]) => {
    return page === items.length - 1;
  }, []);

  const onMomentumScrollEndCallback = useCallback(() => {
    if (isFirstPage(page) || isLastPage(page, items)) {
      setItems(getDatesArray(props));
      scrollToIndex(list);
    }
  }, [isFirstPage, isLastPage, list, page]);

  const renderItem = useCallback(({item}: {item: string}) => {
    const isSameWeek = sameWeek(item, context.date, firstDay);
    const currentContext = isSameWeek ? context : undefined;
    return (
      <Week
        importantForAccessibility={importantForAccessibility}
        testID={testID}
        hideDayNames={hideDayNames}
        accessibilityElementsHidden={accessibilityElementsHidden}
        theme={theme}
        current={item}
        firstDay={firstDay}
        style={getWeekStyle(containerWidth, propsStyle)}
        markedDates={markedDates}
        onDayPress={onDayPressCallback}
        context={currentContext}
        numberOfDays={context.numberOfDays}
        timelineLeftInset={context.timelineLeftInset}
      />
    );
  },[ref, importantForAccessibility, testID, hideDayNames, accessibilityElementsHidden, theme, firstDay, containerWidth, propsStyle, markedDates, onDayPressCallback, context]);

  const keyExtractor = useCallback((_, index: number) => index.toString(), []);

  const renderWeekDaysNames = useMemo(() => {
    return (
      <WeekDaysNames
        firstDay={firstDay}
        style={style.current.dayHeader}
      />
    );
  },[firstDay]);

  const extraData = useMemo(() => Map({
    current,
    date: context.date,
    firstDay
  }), [current, context.date, firstDay]);

  const scrollToIndex = (list: React.RefObject<any>, animated = false) => {
    list?.current?.scrollToIndex({animated, index: NUMBER_OF_PAGES});
  };

  const weekCalendarStyle = useMemo(() => {
    return [
      allowShadow && style.current.containerShadow,
      !hideDayNames && style.current.containerWrapper
    ];
  }, [allowShadow, hideDayNames]);
  const containerStyle = useMemo(() => {
    return [style.current.week, style.current.weekCalendar];
  }, []);
  const flashListContainerStyle = useMemo(() => {
    return style.current.container;
  }, []);

  const getItemLayout = useCallback((_, index: number) => {
    return {
      length: containerWidth,
      offset: containerWidth * index,
      index
    };
  }, [containerWidth]);
  return (
    <View
      testID={props.testID}
      style={weekCalendarStyle}
    >
      {!hideDayNames && (
        <View style={containerStyle}>
          {renderWeekDaysNames}
        </View>
      )}
      <View style={flashListContainerStyle}>
          <FlatList
            ref={list as React.RefObject<FlatList>}
            data={items}
            extraData={extraData}
            style={style.current.container}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            scrollEnabled
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            initialScrollIndex={NUMBER_OF_PAGES}
            getItemLayout={getItemLayout}
            onScroll={onScrollCallback}
            onMomentumScrollEnd={onMomentumScrollEndCallback}
          />
      </View>
    </View>
  );
});

WeekCalendar.displayName = 'WeekCalendar';

function shouldUpdate(prevProps: WeekCalendarProps, nextProps: WeekCalendarProps) {
  if (shouldComponentUpdate(nextProps.context, prevProps.context)) {
    if (!sameWeek(nextProps.context?.date, prevProps.context?.date, nextProps.firstDay ?? 0)) {
      return true;
    }
  }
  return false;
}

export default asCalendarConsumer(React.memo(WeekCalendar, shouldUpdate));
