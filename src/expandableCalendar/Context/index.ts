import React from 'react';

interface CalendarContextProps {
  date: string;
  setDate: (date: string, source: string) => void;
  updateSource: string;
}

// @ts-expect-error
const CalendarContext = React.createContext<CalendarContextProps>({});
export default CalendarContext;
