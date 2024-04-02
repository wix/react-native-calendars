import isString from 'lodash/isString';
import XDate from 'xdate';
import {getDefaultLocale} from './services';

export const extractStyles = node => {
  if (!node || !node.props || !node.props.style) {
    return {};
  }
  const {style} = node.props;
  return style.length ? style.reduce((acc, curValue) => ({...acc, ...curValue}), {}) : style;
};

export const getDaysArray = (start: number, end: number) => {
  const days: string[] = [];
  for (let i = start; i <= end; i++) {
    days.push(i.toString());
  }
  return days;
};

export const getMonthTitle = (date: XDate | string) => {
  const d = isString(date) ? new XDate(date) : date;
  const year = d.getFullYear();
  const monthName = getDefaultLocale().monthNames[d.getMonth()];
  return `${monthName} ${year}`;
};

export const partial = obj => expect.objectContaining(obj);
