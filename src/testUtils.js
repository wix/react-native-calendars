import {getDefaultLocale} from './services';

export const extractStyles = node => {
  if (!node?.props?.style) {
    return {};
  }
  const {style} = node.props;
  return style.length ? style.reduce((acc, curValue) => ({...acc, ...curValue}), {}) : style;
};

export const getDaysArray = (start, end) => {
  const days = [];
  for (let i = start; i <= end; i++) {
    days.push(i.toString());
  }
  return days;
};

export const getMonthTitle = date => {
  const year = new Date(date).getFullYear();
  const monthName = getDefaultLocale().monthNames[new Date(date).getMonth()];
  return `${monthName} ${year}`;
};

export const partial = obj => expect.objectContaining(obj);
