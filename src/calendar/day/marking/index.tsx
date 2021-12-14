import filter from 'lodash/filter';

import React, {Component} from 'react';
import {View, ViewStyle, TextStyle, StyleProp} from 'react-native';

import {Theme, MarkingTypes} from '../../../types';
import {shouldUpdate, extractComponentProps} from '../../../componentUpdater';
import styleConstructor from './style';
import Dot, {DotProps} from '../dot';


export enum Markings {
  DOT = 'dot',
  MULTI_DOT = 'multi-dot',
  PERIOD = 'period',
  MULTI_PERIOD = 'multi-period',
  CUSTOM = 'custom'
}

type CustomStyle = {
  container?: ViewStyle;
  text?: TextStyle;
}

type DOT = {
  key?: string;
  color: string;
  selectedDotColor?: string;
};

type PERIOD = {
  color: string;
  startingDay?: boolean;
  endingDay?: boolean;
};

export interface MarkingProps extends DotProps {
  type?: MarkingTypes;
  theme?: Theme;
  selected?: boolean;
  marked?: boolean;
  today?: boolean;
  disabled?: boolean;
  inactive?: boolean;
  disableTouchEvent?: boolean;
  activeOpacity?: number;
  textColor?: string;
  selectedColor?: string;
  selectedTextColor?: string;
  customTextStyle?: StyleProp<TextStyle>;
  customContainerStyle?: StyleProp<ViewStyle>;
  dotColor?: string;
  //multi-dot
  dots?: DOT[];
  //multi-period
  periods?: PERIOD[];
  startingDay?: boolean;
  endingDay?: boolean;
  accessibilityLabel?: string;
  customStyles?: CustomStyle;
}

export default class Marking extends Component<MarkingProps> {
  static displayName = 'Marking';

  static markings = Markings;
  
  style: any;
  
  constructor(props: MarkingProps) {
    super(props);

    this.style = styleConstructor(props.theme);
  }

  shouldComponentUpdate(nextProps: MarkingProps) {
    return shouldUpdate(this.props, nextProps, [
      'type',
      'selected',
      'marked',
      'today',
      'disabled',
      'inactive',
      'disableTouchEvent',
      'activeOpacity',
      'selectedColor',
      'selectedTextColor',
      'dotColor',
      'dots',
      'periods'
    ]);
  }

  getItems(items?: DOT[] | PERIOD[]) {
    const {type} = this.props;

    if (items && Array.isArray(items) && items.length > 0) {
      // Filter out items so that we process only those which have color property
      const validItems = filter(items, function(o: DOT | PERIOD) { return o.color; });

      return validItems.map((item, index) => {
        return type === Markings.MULTI_DOT ? this.renderDot(index, item) : this.renderPeriod(index, item);
      });
    }
  }

  renderMarkingByType() {
    const {type, dots, periods} = this.props;
    switch (type) {
      case Markings.MULTI_DOT:
        return this.renderMultiMarkings(this.style.dots, dots);
      case Markings.MULTI_PERIOD:
        return this.renderMultiMarkings(this.style.periods, periods);
      default:
        return this.renderDot();
    }
  }

  renderMultiMarkings(containerStyle: object, items?: DOT[] | PERIOD[]) {
    return <View style={containerStyle}>{this.getItems(items)}</View>;
  }

  renderPeriod(index: number, item: any) {
    const {color, startingDay, endingDay} = item;
    const style = [
      this.style.period,
      {
        backgroundColor: color
      }
    ];
    if (startingDay) {
      style.push(this.style.startingDay);
    }
    if (endingDay) {
      style.push(this.style.endingDay);
    }
    return <View key={index} style={style}/>;
  }

  renderDot(index?: number, item?: any) {
    const {selected, dotColor} = this.props;
    const dotProps = extractComponentProps(Dot, this.props);
    let key = index;
    let color = dotColor;

    if (item) {
      if (item.key) {
        key = item.key;
      }
      color = selected && item.selectedDotColor ? item.selectedDotColor : item.color;
    }

    return <Dot {...dotProps} key={key} color={color} />;
  }

  render() {
    return this.renderMarkingByType();
  }
}
