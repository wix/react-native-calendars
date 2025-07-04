import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { type ScrollView, type ScrollViewProps, View } from 'react-native';
import Calendar, { type CalendarProps } from '../calendar';
import CalendarHeader from '../calendar/header';
import constants from '../commons/constants';
import { extractHeaderProps } from '../componentUpdater';
import {
	addMonthsToDate,
	type CustomDate,
	formatDate,
	getDateAsString,
	getDate as getDateFromUtils,
	setDayOfMonth,
	toMarkingFormat
} from '../dateutils';
import InfiniteList from '../infinite-list';
import styleConstructor from './style';

export interface CalendarListProps {
	/** Initially visible month */
	initialDate?: string;
	/** Whether the scroll is horizontal */
	horizontal?: boolean;
	/** The amount of months allowed to scroll to the past and future. Default = 50 */
	scrollRange?: number;
	/** Whether to use static header that will not scroll with the list (horizontal only) */
	staticHeader?: boolean;
	/** Props to pass the list */
	scrollViewProps?: ScrollViewProps;
	/** Props to pass the list items */
	calendarProps?: CalendarProps;
	/** Identifier for testing */
	testID?: string;
}

const NUMBER_OF_PAGES = 50;
const CALENDAR_HEIGHT = 360;

const CalendarList = (props: CalendarListProps) => {
	const {
		initialDate,
		horizontal,
		scrollRange = NUMBER_OF_PAGES,
		staticHeader,
		scrollViewProps,
		calendarProps,
		testID
	} = props;
	const style = useRef(styleConstructor(calendarProps?.theme));
	const list = useRef<ScrollView>();
	const [items, setItems] = useState<string[]>(getDatesArray(initialDate, scrollRange));
	const [positionIndex, setPositionIndex] = useState(scrollRange);

	/** Static Header */

	const [currentMonth, setCurrentMonth] = useState(initialDate || items[scrollRange]);
	const shouldRenderStaticHeader = staticHeader && horizontal;
	const headerProps = extractHeaderProps(props);
	const staticHeaderStyle = useMemo(() => {
		return [style.current.staticHeader, calendarProps?.headerStyle];
	}, [calendarProps?.headerStyle]);

	useEffect(() => {
		scrollToMonth(currentMonth);
	}, [currentMonth]);

	const getMonthIndex = useCallback(
		(month?: CustomDate) => {
			if (!month) {
				return -1;
			}
			return items.findIndex(item => item.includes(formatDate(month, 'yyyy-MM')));
		},
		[items]
	);

	const scrollToMonth = useCallback(
		(month?: string) => {
			if (month) {
				const index = getMonthIndex(getDateFromUtils(month));
				if (index !== -1) {
					const shouldAnimate = constants.isAndroid && !horizontal ? false : true;
					// @ts-expect-error
					list.current?.scrollToOffset?.(index * constants.screenWidth, 0, shouldAnimate);
				}
			}
		},
		[getMonthIndex]
	);

	const updateMonth = useCallback(
		(count: number, month?: CustomDate) => {
			if (month) {
				const next = addMonthsToDate(month, count);
				const nextNext = addMonthsToDate(month, count * 2);
				const nextNextIndex = getMonthIndex(nextNext);
				if (nextNextIndex !== -1) {
					setCurrentMonth(toMarkingFormat(next));
				}
			}
		},
		[getMonthIndex]
	);

	const scrollToNextMonth = useCallback(
		(method: () => void, month?: CustomDate) => {
			if (calendarProps?.onPressArrowLeft) {
				calendarProps?.onPressArrowLeft?.(method, month);
			} else {
				updateMonth(1, month);
			}
		},
		[updateMonth]
	);

	const scrollToPreviousMonth = useCallback(
		(method: () => void, month?: CustomDate) => {
			if (calendarProps?.onPressArrowRight) {
				calendarProps?.onPressArrowRight?.(method, month);
			} else {
				updateMonth(-1, month);
			}
		},
		[updateMonth]
	);

	const onPageChange = useCallback(
		(pageIndex: number, _: number, info: { scrolledByUser: boolean }) => {
			if (shouldRenderStaticHeader && info.scrolledByUser) {
				setCurrentMonth(items[pageIndex]);
			}
		},
		[items]
	);

	const renderStaticHeader = () => {
		if (shouldRenderStaticHeader) {
			return (
				<CalendarHeader
					{...headerProps}
					month={getDateFromUtils(currentMonth)}
					onPressArrowRight={scrollToNextMonth}
					onPressArrowLeft={scrollToPreviousMonth}
					style={staticHeaderStyle}
					accessibilityElementsHidden // iOS
					importantForAccessibility={'no-hide-descendants'} // Android
					testID={'static-header'}
				/>
			);
		}
	};

	/** Data */

	const reloadPages = useCallback(
		pageIndex => {
			horizontal ? replaceItems(pageIndex) : addItems(pageIndex);
		},
		[items]
	);

	const replaceItems = (index: number) => {
		const newItems = getDatesArray(items[index], scrollRange);
		setItems(newItems);
	};

	const addItems = (index: number) => {
		const array: string[] = [...items];
		const startingDate = items[index];
		const shouldAppend = index > scrollRange;

		if (startingDate) {
			if (shouldAppend) {
				for (let i = 2; i <= scrollRange; i++) {
					const newDate = getDate(startingDate, i);
					array.push(newDate);
				}
			} else {
				for (let i = -1; i > -scrollRange; i--) {
					const newDate = getDate(startingDate, i);
					array.unshift(newDate);
				}
			}

			setPositionIndex(shouldAppend ? index : scrollRange - 1);
			setItems(array);
		}
	};

	/** List */

	const listContainerStyle = useMemo(() => {
		return [style.current.flatListContainer, { flex: horizontal ? undefined : 1 }];
	}, [style, horizontal]);

	const scrollProps = useMemo(() => {
		return {
			...scrollViewProps,
			showsHorizontalScrollIndicator: false,
			showsVerticalScrollIndicator: false
		};
	}, [scrollViewProps]);

	const renderItem = useCallback(
		(_type: any, item: string) => {
			return (
				<Calendar
					{...calendarProps}
					{...headerProps}
					initialDate={item}
					disableMonthChange
					hideArrows={!horizontal}
					onPressArrowRight={scrollToNextMonth}
					onPressArrowLeft={scrollToPreviousMonth}
					hideExtraDays={calendarProps?.hideExtraDays || true}
					style={[style.current.calendar, calendarProps?.style]}
					headerStyle={horizontal ? calendarProps?.headerStyle : undefined}
					testID={`${testID}_${item}`}
				// context={context}
				/>
			);
		},
		[calendarProps, scrollToNextMonth, scrollToPreviousMonth]
	);

	return (
		<View style={listContainerStyle}>
			<InfiniteList
				key="calendar-list"
				ref={list}
				data={items}
				renderItem={renderItem}
				reloadPages={reloadPages}
				onReachNearEdgeThreshold={Math.round(NUMBER_OF_PAGES * 0.4)}
				extendedState={calendarProps?.markedDates}
				isHorizontal={horizontal}
				style={style.current.container}
				initialPageIndex={scrollRange}
				positionIndex={positionIndex}
				pageHeight={CALENDAR_HEIGHT}
				pageWidth={constants.screenWidth}
				onPageChange={onPageChange}
				scrollViewProps={scrollProps}
			/>
			{renderStaticHeader()}
		</View>
	);
};
export default CalendarList;

function getDate(date: string, index: number) {
	let d = getDateFromUtils(date);
	d = addMonthsToDate(d, index);

	// if (index !== 0) {
	d = setDayOfMonth(d, 1);
	// }
	return toMarkingFormat(d);
}

function getDatesArray(date?: string, numberOfPages = NUMBER_OF_PAGES) {
	const d = date || getDateAsString();
	const array: string[] = [];
	for (let index = -numberOfPages; index <= numberOfPages; index++) {
		const newDate = getDate(d, index);
		array.push(newDate);
	}
	return array;
}
