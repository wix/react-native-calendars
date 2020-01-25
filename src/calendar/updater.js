import {parseDate} from '../interface';

export default function shouldComponentUpdate(nextProps, nextState) {
  let shouldUpdate = (nextProps.selected || []).reduce((prev, next, i) => {
    const currentSelected = (this.props.selected || [])[i];
    if (!currentSelected || !next || parseDate(currentSelected).getTime() !== parseDate(next).getTime()) {
      return {
        update: true,
        field: 'selected'
      };
    }
    return prev;
  }, {update: false});

  shouldUpdate = ['markedDates', 'hideExtraDays', 'displayLoadingIndicator'].reduce((prev, next) => {
    if (!prev.update && nextProps[next] !== this.props[next]) {
      return {
        update: true,
        field: next
      };
    }
    return prev;
  }, shouldUpdate);

  shouldUpdate = ['minDate', 'maxDate', 'current'].reduce((prev, next) => {
    const prevDate = parseDate(this.props[next]);
    const nextDate = parseDate(nextProps[next]);
    if (prev.update) {
      return prev;
    } else if (prevDate !== nextDate) {
      if (prevDate && nextDate && prevDate.getTime() === nextDate.getTime()) {
        return prev;
      } else {
        return {
          update: true,
          field: next
        };
      }
    }
    return prev;
  }, shouldUpdate);

  if (nextState.currentMonth !== this.state.currentMonth) {
    shouldUpdate = {
      update: true,
      field: 'current'
    };
  }
  return shouldUpdate.update;
}
