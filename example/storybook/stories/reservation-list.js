import React from 'react';
import {Text} from 'react-native';
import ReservationList from '../../../src/agenda/reservation-list';
import {parseDate} from '../../../src/interface';

const selectedDay = parseDate('2020-06-01');

const RESERVATIONS = {
  '2020-06-01': [{name: 'First Item'}, {name: 'Second Item'}],
  '2020-06-02': [],
  '2020-06-03': [{name: 'Third Item'}, {name: 'Fourth Item'}],
};

const renderItem = item => <Text>{item.name}</Text>;

const renderDay = (date, item) =>
  date ? <Text>{`${date.year}-${date.month}-${date.day}`}</Text> : null;

const renderEmptyDate = date => <Text>Empty date: {Number(date)}</Text>;

const renderEmptyData = () => <Text>No Data</Text>;

export default function(storiesOf, module) {
  storiesOf('Reservation List', module)
    .add('No data', () => <ReservationList />)
    .add('Custom empty state', () => (
      <ReservationList renderEmptyData={renderEmptyData} />
    ))
    .add('Default', () => (
      <>
        <ReservationList
          reservations={RESERVATIONS}
          selectedDay={selectedDay}
          topDay={selectedDay}
          renderItem={renderItem}
          renderDay={renderDay}
          renderEmptyDate={renderEmptyDate}
        />
      </>
    ));
}
