import React from 'react';
import {BasicDayDriver} from '../driver';
import BasicDay from '..';

const TEST_ID = 'basic_day';
const mockOnPress = jest.fn();
const defaultProps = {
  testID: TEST_ID,
  onPress: mockOnPress
};

describe('Basic Day', () => {
  it('should render with correct text', () => {
    const driver = new BasicDayDriver(<BasicDay {...defaultProps}>10</BasicDay>);
    expect(driver.getText()).toEqual('10');
  });

  it('should call onPress when pressed', () => {
    expect(mockOnPress).toHaveBeenCalledTimes(0);
    const driver = new BasicDayDriver(<BasicDay {...defaultProps}>10</BasicDay>);
    driver.press();
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });
});
