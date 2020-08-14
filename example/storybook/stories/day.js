import React from 'react';
import {View, Text, Alert} from 'react-native';
import BasicDay from '../../../src/calendar/day/basic';
import MultiDotDay from '../../../src/calendar/day/multi-dot';
import PeriodDay from '../../../src/calendar/day/period';
import MultiPeriodDay from '../../../src/calendar/day/multi-period';
import CustomDay from '../../../src/calendar/day/custom';

const DayContainer = ({title, children}) => (
  <View
    style={{paddingVertical: 4, flexDirection: 'row', alignItems: 'center'}}>
    {children}
    <Text style={{marginLeft: 4}}>{title}</Text>
  </View>
);

const date = new Date('2020-06-01');

const onPress = date => Alert.alert('You pressed me!', date.toISOString());

const DEFAULT_PROPS = {onPress, date};

const types = [
  {
    name: 'Basic',
    component: BasicDay,
  },
  {
    name: 'Period',
    component: PeriodDay,
  },
  {
    name: 'Multi-dot',
    component: MultiDotDay,
  },
  {
    name: 'Multi-period',
    component: MultiPeriodDay,
  },
  {
    name: 'Custom',
    component: CustomDay,
  },
];

const testCases = [
  {
    name: 'No Props',
    props: {},
  },
  {
    name: 'Today',
    props: {...DEFAULT_PROPS, state: 'today'},
  },
  {
    name: 'Disabled',
    props: {...DEFAULT_PROPS, state: 'disabled'},
  },
  {
    name: 'Disabled via marking prop',
    props: {...DEFAULT_PROPS, marking: {disabled: true}},
  },
  {
    name: 'Selected',
    props: {...DEFAULT_PROPS, marking: {selected: true}},
  },
  {
    name: 'Marked',
    props: {...DEFAULT_PROPS, marking: {marked: true}},
  },
  {
    name: 'Today + Selected + Marked',
    props: {
      ...DEFAULT_PROPS,
      state: 'today',
      marking: {selected: true, marked: true},
    },
  },
  {
    name: 'With dots',
    props: {
      ...DEFAULT_PROPS,
      marking: {
        dots: [
          {key: 'vacation', color: 'red'},
          {key: 'massage', color: 'blue', selectedDotColor: 'blue'},
          {key: 'workout', color: 'green'},
        ],
      },
    },
  },
  {
    name: 'Custom styles',
    props: {
      ...DEFAULT_PROPS,
      state: 'today',
      marking: {
        customStyles: {
          container: {
            backgroundColor: 'green',
          },
          text: {
            color: 'black',
            fontWeight: 'bold',
          },
        },
      },
    },
  },
];

export default function(storiesOf, module) {
  const story = storiesOf('Day', module);
  for (const type of types) {
    const DayComp = type.component;
    story.add(type.name, () => (
      <>
        {testCases.map(testCase => (
          <DayContainer
            title={testCase.name}
            key={`${type.name}-${testCase.name}`}>
            <DayComp {...testCase.props}>21</DayComp>
          </DayContainer>
        ))}
      </>
    ));
  }
}
