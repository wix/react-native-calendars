import dayjs, { Dayjs } from "dayjs";
import customParseFormatPlugin from "dayjs/plugin/customParseFormat";
import isSameOrAfterPlugin from "dayjs/plugin/isSameOrAfter";
import isSameOrBeforePlugin from "dayjs/plugin/isSameOrBefore";
import isTodayPlugin from "dayjs/plugin/isToday";
import localeDataPlugin from "dayjs/plugin/localeData";
import localizedFormatPlugin from "dayjs/plugin/localizedFormat";
import objectSupportPlugin from "dayjs/plugin/objectSupport";
import timezonePlugin from "dayjs/plugin/timezone";
import utcPlugin from "dayjs/plugin/utc";
import weekOfYearPlugin from "dayjs/plugin/weekOfYear";

dayjs.extend(customParseFormatPlugin);
dayjs.extend(isSameOrAfterPlugin);
dayjs.extend(isSameOrBeforePlugin);
dayjs.extend(isTodayPlugin);
dayjs.extend(localeDataPlugin);
dayjs.extend(localizedFormatPlugin);
dayjs.extend(weekOfYearPlugin);
dayjs.extend(utcPlugin);
dayjs.extend(timezonePlugin);
dayjs.extend(objectSupportPlugin);

export type CustomDate = Dayjs;

export const LocaleConfig = {
	locales: {},
	defaultLocale: "en",
}

export function isValidDate(date) {
	return dayjs(date).isValid();
}

export function sameMonth(a?: CustomDate, b?: CustomDate) {
	if (!isValidDate(a) || !isValidDate(b)) {
		return false;
	}
	return a?.isSame(b, "year") && a?.isSame(b, "month");
}

export function sameDate(a?: CustomDate, b?: CustomDate) {
	if (!isValidDate(a) || !isValidDate(b)) {
		return false;
	}
	return a?.isSame(b, "date");
}

export function onSameDateRange({
	firstDay,
	secondDay,
	numberOfDays,
	firstDateInRange,
}: {
	firstDay: string;
	secondDay: string;
	numberOfDays: number;
	firstDateInRange: string;
}) {
	const aDate = getDate(firstDay);
	const bDate = getDate(secondDay);
	const firstDayDate = getDate(firstDateInRange);
	const firstDayDateMs = getDateInMs(firstDayDate);
	const aDiff = getDateInMs(aDate) - firstDayDateMs;
	const bDiff = getDateInMs(bDate) - firstDayDateMs;
	const aTotalDays = Math.ceil(aDiff / (1000 * 3600 * 24));
	const bTotalDays = Math.ceil(bDiff / (1000 * 3600 * 24));
	const aWeek = Math.floor(aTotalDays / numberOfDays);
	const bWeek = Math.floor(bTotalDays / numberOfDays);
	return aWeek === bWeek;
}

export function sameWeek(a: string, b: string, firstDayOfWeek: number) {
	const weekDates = getWeekDates(a, firstDayOfWeek, "yyyy-MM-dd");
	const element = weekDates instanceof Dayjs ? getDate(b) : b;
	return weekDates.includes(element as Dayjs & string);
}

export function isPastDate(date: string) {
	return dayjs(date).isBefore(getCurrentDate());
}

export function isToday(date) {
	return dayjs(date).isToday();
}

export function isGTE(a: CustomDate, b: CustomDate) {
	return a.isSameOrAfter(b);
}

export function isLTE(a: CustomDate, b: CustomDate) {
	return a.isSameOrBefore(b);
}

export function formatNumbers(date) {
	const latinNumbersPattern = /[0-9]/g;
	const numbers = getLocale();
	return numbers
		? date.toString().replace(latinNumbersPattern, (char) => numbers[+char])
		: date;
}

function fromTo(a: CustomDate, b: CustomDate) {
	const days: CustomDate[] = [];
	let from = +a;
	const to = +b;

	for (; from <= to; from = getDateInMs(addDaysToDate(from, 1))) {
		days.push(getDate(from));
	}
	return days;
}

export function month(date: CustomDate) {
	// exported for tests only
	const days = dayjs(date).daysInMonth();
	const daysArr: number[] = [];
	for (let i = 1; i <= days; i += 1) {
		daysArr.push(i);
	}
	return daysArr;
}

export function weekDayNames(firstDayOfWeek = 0) {
	const weekDaysNames = weekDaysShort();
	const dayShift = firstDayOfWeek % 7;
	if (dayShift) {
		return weekDaysNames
			.slice(dayShift)
			.concat(weekDaysNames.slice(0, dayShift));
	}
	return weekDaysNames;
}

export function page(
	date: CustomDate,
	firstDayOfWeek = 0,
	showSixWeeks = false,
) {
	if (!date) {
		return [];
	}
	const days = month(date);
	let before: CustomDate[] = [];
	let after: CustomDate[] = [];

	const fdow = (7 + firstDayOfWeek) % 7 || 7;
	const ldow = (fdow + 6) % 7;

	firstDayOfWeek = firstDayOfWeek || 0;

	const from = getDate(days[0]);
	const daysBefore = getDay(from);

	if (daysBefore !== fdow) {
		addDaysToDate(from, -(daysBefore + 7 - fdow) % 7);
	}

	const to = getDate(days[days.length - 1]);
	const day = getDay(to);
	if (day !== ldow) {
		addDaysToDate(to, (ldow + 7 - day) % 7);
	}

	const daysForSixWeeks = (daysBefore + days.length) / 6 >= 6;

	if (showSixWeeks && !daysForSixWeeks) {
		addDaysToDate(to, 7);
	}

	const firstDate = getDate(days[0]);
	if (isLTE(from, firstDate)) {
		before = fromTo(from, firstDate);
	}

	const lastDate = getDate(days[days.length - 1]);
	if (isGTE(to, lastDate)) {
		after = fromTo(lastDate, to);
	}

	const slicedDays = days.slice(1, days.length - 1).map((day) => getDate(day));
	return before.concat(slicedDays, after);
}

export function isDateNotInRange(
	date: CustomDate,
	minDate: string,
	maxDate: string,
) {
	return (
		(minDate && !isGTE(date, getDate(minDate))) ||
		(maxDate && !isLTE(date, getDate(maxDate)))
	);
}

export function getWeekDates(date: string, firstDay = 0, format?: string) {
	const d = getDate(date);
	const daysArray: CustomDate[] = [];
	if (date && isValidDate(date)) {
		daysArray.push(d);
		let dayOfTheWeek = getDay(d) - firstDay;
		if (dayOfTheWeek < 0) {
			// to handle firstDay > 0
			dayOfTheWeek = 7 + dayOfTheWeek;
		}

		let newDate = d;
		let index = dayOfTheWeek - 1;
		while (index >= 0) {
			newDate = subtractDaysToDate(newDate, 1);
			daysArray.unshift(newDate);
			index -= 1;
		}

		newDate = d;
		index = dayOfTheWeek + 1;
		while (index < 7) {
			newDate = addDaysToDate(newDate, 1);
			daysArray.push(newDate);
			index += 1;
		}

		if (format) {
			return daysArray.map((d) => formatDate(d, format));
		}
	}
	return daysArray;
}

export function getPartialWeekDates(date?: string, numberOfDays = 7) {
	let index = 0;
	const partialWeek: string[] = [];
	while (index < numberOfDays) {
		partialWeek.push(generateDay(date || getCurrentDate(), index));
		index++;
	}
	return partialWeek;
}

export function generateDay(originDate: string | CustomDate, daysOffset = 0) {
	const baseDate = getDate(originDate);
	return toMarkingFormat(addDaysToDate(baseDate, daysOffset));
}

export function getLocale() {
	return dayjs().locale();
}

export function weekDaysShort() {
	return dayjs.weekdaysShort();
}

export function padNumber(n: number) {
	if (n < 10) {
		return `0${n}`;
	}
	return n;
}

export function dateToData(date: CustomDate | string) {
	const d = getDate(date);
	const dateString = toMarkingFormat(d);
	return {
		year: getYear(d),
		month: getMonth(d) + 1,
		day: getDay(d),
		timestamp: getDateInMs(dateString),
		dateString: dateString,
	};
}

export function parseDate(d?) {
	return getDate(d);
}

export function toMarkingFormat(d) {
	if (Number.isNaN(getDateInMs(d))) {
		return "Invalid Date";
	}
	const year = `${getYear(d)}`;
	const month = getMonth(d) + 1;
	const doubleDigitMonth = month < 10 ? `0${month}` : `${month}`;
	const day = getDay(d);
	const doubleDigitDay = day < 10 ? `0${day}` : `${day}`;
	return `${year}-${doubleDigitMonth}-${doubleDigitDay}`;
}

export function getCurrentDate() {
	return dayjs();
}

export function getDate(date) {
	return dayjs(date);
}

export function getTodayInMarkingFormat() {
	return toMarkingFormat(getCurrentDate());
}

export function formatDate(date, formatPattern: string) {
	return dayjs(date).format(formatPattern);
}

export function getDay(date) {
	return dayjs(date).get("day");
}

export function getDayOfWeek(date) {
	return dayjs(date).day();
}

export function getMonth(date?: CustomDate | string) {
	if (!date) {
		return getCurrentDate().month() + 1
	}
	return dayjs(date).month() + 1;
}

export function getYear(date?: CustomDate | string) {
	if (!date) {
		return getCurrentDate().year();
	}
	return dayjs(date).year();
}

export function getDateInMs(date: CustomDate | string) {
	return dayjs(date).valueOf();
}

export function getTimezoneOffset(date) {
	return dayjs(date).utcOffset();
}

export function getUTCDate(date: CustomDate) {
	return date.utc().valueOf()
}

export function getUTCDayOfWeek(date: CustomDate) {
	return date.utc().day()
}

export function getUTCDayOfMonth(date: CustomDate) {
	return date.utc().date()
}

export function getStartOfDay(date: CustomDate) {
	return dayjs(date).startOf("day");
}

export function addHourToDate(date, manyHours: number) {
	return dayjs(date).add(manyHours, "hour");
}

export function addDaysToDate(date, manyDays: number) {
	return dayjs(date).add(manyDays, "day");
}

export function addWeeksToDate(date, manyWeeks: number) {
	return dayjs(date).add(manyWeeks, "week");
}

export function subtractDaysToDate(date, manyDays: number) {
	return dayjs(date).subtract(manyDays, "day");
}

export function addMonthsToDate(date, manyMonths: number) {
	return dayjs(date).add(manyMonths, "month");
}

export function subtractMonthsToDate(date, manyMonths: number) {
	return dayjs(date).subtract(manyMonths, "month");
}

export function getDiffInHour(start: CustomDate, end: CustomDate) {
	return start.diff(end, "hour");
}

export function getDiffInDays(start: CustomDate, end: CustomDate) {
	return start.diff(end, "day");
}

export function getDiffInMonths(start: CustomDate, end: CustomDate) {
	return start.diff(end, "month");
}

export function setDayOfMonth(date, dayOfMonth: number) {
	return dayjs(date).date(dayOfMonth);
}

export function getWeekOfYear(date) {
	return dayjs(date).week();
}

export function getDateAsString(date?): string {
	if (date) {
		return dayjs(date).toString();
	}
	return getCurrentDate().toString();
}

export function getISODateString(date) {
	return dayjs(date).toISOString();
}

export function buildDate(year: number, month: number, day: number) {
	return dayjs({ year, month, day });
}
