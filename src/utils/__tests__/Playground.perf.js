import React from 'react';
import {measurePerformance} from 'reassure';
import {Calendar, CalendarList} from '../../index';

const INITIAL_DATE = '2022-07-07';

describe('Playground testing', () => {
  const TestCase = () => {
    return <Calendar current={INITIAL_DATE} />;
  };
  const TestCaseList = () => {
    return <CalendarList current={INITIAL_DATE} />;
  };
  const TestCaseExpandable = () => {
    return <ExpandableCalendar current={INITIAL_DATE} />;
  };

  it('calendar', async () => {
    const measurement = await measurePerformance(<TestCase />);
    expect(measurement.meanDuration).toBeLessThan(60);
  });

  it('calendar list', async () => {
    const measurement = await measurePerformance(<TestCaseList />);
    expect(measurement.meanDuration).toBeLessThan(100);
  });

  it('expandable calendar', async () => {
    const measurement = await measurePerformance(<TestCaseExpandable />);
    expect(measurement.meanDuration).toBeLessThan(100);
  });
});
