<<<<<<< HEAD:src/expandableCalendar/Context/Presenter.js
import _ from 'lodash';
import XDate from 'xdate';
import dateutils from '../../dateutils';
import {xdateToData, toMarkingFormat} from '../../interface';
=======
import XDate from 'xdate';

import {sameMonth, isToday, isPastDate} from '../../dateutils';
import {xdateToData, toMarkingFormat} from '../../interface';
import {getDefaultLocale} from '../../services';
import {UpdateSources} from '../commons';
import {CalendarContextProviderProps} from './Provider';
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/expandableCalendar/Context/Presenter.ts

const commons = require('../commons');
const TOP_POSITION = 65;

class Presenter {
<<<<<<< HEAD:src/expandableCalendar/Context/Presenter.js
  _isPastDate(date) {
    const today = XDate();
    const d = XDate(date);

    if (today.getFullYear() > d.getFullYear()) {
      return true;
    }
    if (today.getFullYear() === d.getFullYear()) {
      if (today.getMonth() > d.getMonth()) {
        return true;
      }
      if (today.getMonth() === d.getMonth()) {
        if (today.getDate() > d.getDate()) {
          return true;
        }
      }
    }
    return false;
  }

=======
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/expandableCalendar/Context/Presenter.ts
  _getIconDown = () => {
    return require('../../img/down.png');
  };

  _getIconUp = () => {
    return require('../../img/up.png');
  };

<<<<<<< HEAD:src/expandableCalendar/Context/Presenter.js
  getButtonIcon = (date, showTodayButton = true) => {
=======
  getButtonIcon = (date: string, showTodayButton = true) => {
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/expandableCalendar/Context/Presenter.ts
    if (!showTodayButton) {
      return undefined;
    }
    const icon = isPastDate(date) ? this._getIconDown() : this._getIconUp();
    return icon;
  };

<<<<<<< HEAD:src/expandableCalendar/Context/Presenter.js
  setDate = (props, date, newDate, updateState, updateSource) => {
    const sameMonth = dateutils.sameMonth(XDate(date), XDate(newDate));
=======
  setDate = (
    props: CalendarContextProviderProps,
    date: string,
    newDate: string,
    updateState: (buttonIcon: number) => void,
    updateSource: UpdateSources
  ) => {
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/expandableCalendar/Context/Presenter.ts
    const buttonIcon = this.getButtonIcon(date, props.showTodayButton);

    updateState(buttonIcon);

<<<<<<< HEAD:src/expandableCalendar/Context/Presenter.js
    _.invoke(props, 'onDateChanged', date, updateSource);

    if (!sameMonth) {
      _.invoke(props, 'onMonthChange', xdateToData(XDate(date)), updateSource);
    }
  };

  setDisabled = (showTodayButton, newDisabledValue, oldDisabledValue, updateState) => {
=======
    props.onDateChanged?.(date, updateSource);

    if (!sameMonth(new XDate(date), new XDate(newDate))) {
      props.onMonthChange?.(xdateToData(new XDate(date)), updateSource);
    }
  };

  setDisabled = (
    showTodayButton: boolean,
    newDisabledValue: boolean,
    oldDisabledValue: boolean,
    updateState: (disabled: boolean) => void
  ) => {
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/expandableCalendar/Context/Presenter.ts
    if (!showTodayButton || newDisabledValue === oldDisabledValue) {
      return;
    }
    updateState(newDisabledValue);
  };

  shouldAnimateTodayButton = props => {
    return props.showTodayButton;
  };

<<<<<<< HEAD:src/expandableCalendar/Context/Presenter.js
  _isToday = date => {
    const today = toMarkingFormat(XDate());
    return today === date;
  };

=======
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/expandableCalendar/Context/Presenter.ts
  getTodayDate = () => {
    return toMarkingFormat(XDate());
  };

<<<<<<< HEAD:src/expandableCalendar/Context/Presenter.js
  getPositionAnimation = (date, todayBottomMargin) => {
    const toValue = this._isToday(date) ? TOP_POSITION : -todayBottomMargin || -TOP_POSITION;
=======
  getPositionAnimation = (date: string, todayBottomMargin = 0) => {
    const toValue = isToday(new XDate(date)) ? TOP_POSITION : -todayBottomMargin || -TOP_POSITION;
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/expandableCalendar/Context/Presenter.ts
    return {
      toValue,
      tension: 30,
      friction: 8,
      useNativeDriver: true
    };
  };

  shouldAnimateOpacity = props => {
    return props.disabledOpacity;
  };

  getOpacityAnimation = (props, disabled) => {
    return {
      toValue: disabled ? props.disabledOpacity : 1,
      duration: 500,
      useNativeDriver: true
    };
  };

  getTodayFormatted = () => {
<<<<<<< HEAD:src/expandableCalendar/Context/Presenter.js
    const todayString = XDate.locales[XDate.defaultLocale].today || commons.todayString;
=======
    const todayString = getDefaultLocale().today || commons.todayString;
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/expandableCalendar/Context/Presenter.ts
    const today = todayString.charAt(0).toUpperCase() + todayString.slice(1);
    return today;
  };
}

export default Presenter;
