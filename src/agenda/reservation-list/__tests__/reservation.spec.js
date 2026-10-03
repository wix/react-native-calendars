import React from 'react';
import {Text} from 'react-native';
import {render} from '@testing-library/react-native';
import XDate from 'xdate';

import Reservation from '../reservation';
import ReservationList from '../index';

const renderItem = item => <Text>{item.name}</Text>;

describe('Agenda reservations', () => {
  it.each([false, true])(
    'updates subsequent rows after selecting an earlier day (custom comparator: %s)',
    useComparator => {
      const items = {
        '2024-01-04': [{name: 'Thursday first'}, {name: 'Thursday second'}],
        '2024-01-05': [{name: 'Friday first'}, {name: 'Friday second'}]
      };
      const props = {
        items,
        topDay: new XDate('2024-01-05'),
        renderItem,
        rowHasChanged: useComparator ? (a, b) => a.name !== b.name : undefined
      };
      const {getByText, getAllByText, rerender} = render(
        <ReservationList {...props} selectedDay={new XDate('2024-01-05')}/>
      );
      expect(getByText('Friday second')).toBeTruthy();

      rerender(<ReservationList {...props} selectedDay={new XDate('2024-01-04')}/>);

      expect(getByText('Thursday second')).toBeTruthy();
      expect(getAllByText('Friday second')).toHaveLength(1);
    }
  );

  it('honors rowHasChanged for an item without a date label', () => {
    const item = {name: 'original'};
    const nextItem = {name: 'replacement'};
    const rowHasChanged = jest.fn(() => false);
    const {getByText, queryByText, rerender} = render(
      <Reservation item={item} renderItem={renderItem} rowHasChanged={rowHasChanged}/>
    );

    rerender(<Reservation item={nextItem} renderItem={renderItem} rowHasChanged={rowHasChanged}/>);

    expect(rowHasChanged).toHaveBeenCalledWith(item, nextItem);
    expect(getByText('original')).toBeTruthy();
    expect(queryByText('replacement')).toBeNull();
  });

  it('renders transitions between an empty row and an item without a date label', () => {
    const renderEmptyDate = () => <Text>empty</Text>;
    const {getByText, queryByText, rerender} = render(
      <Reservation renderItem={renderItem} renderEmptyDate={renderEmptyDate}/>
    );
    expect(getByText('empty')).toBeTruthy();

    rerender(<Reservation item={{name: 'loaded'}} renderItem={renderItem} renderEmptyDate={renderEmptyDate}/>);
    expect(getByText('loaded')).toBeTruthy();
    expect(queryByText('empty')).toBeNull();

    rerender(<Reservation renderItem={renderItem} renderEmptyDate={renderEmptyDate}/>);
    expect(getByText('empty')).toBeTruthy();
    expect(queryByText('loaded')).toBeNull();
  });

  it('updates the date label even when the item comparator reports no change', () => {
    const renderDay = date => <Text>{date ? date.toString('yyyy-MM-dd') : 'no date'}</Text>;
    const props = {item: {name: 'same item'}, renderItem, renderDay, rowHasChanged: () => false};
    const {getByText, rerender} = render(<Reservation {...props} date={new XDate('2024-01-04')}/>);

    rerender(<Reservation {...props} date={new XDate('2024-01-05')}/>);
    expect(getByText('2024-01-05')).toBeTruthy();

    rerender(<Reservation {...props}/>);
    expect(getByText('no date')).toBeTruthy();

    rerender(<Reservation {...props} date={new XDate('2024-01-04')}/>);
    expect(getByText('2024-01-04')).toBeTruthy();
  });
});
