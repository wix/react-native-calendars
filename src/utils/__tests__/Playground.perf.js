import React from 'react';
import {measurePerformance} from 'reassure';
import {Calendar, CalendarList} from '../../index';

describe('Playground testing', () => {
  const TestCase = () => {
    return <Calendar />;
  };
  const TestCaseList = () => {
    return <CalendarList />;
  };

  it('calendar', async () => {
    const measurement = await measurePerformance(<TestCase />);
    expect(measurement.meanDuration).toBeLessThan(60);
  });

  it('calendar list', async () => {
    const measurement = await measurePerformance(<TestCaseList />);
    expect(measurement.meanDuration).toBeLessThan(100);
  });
});
