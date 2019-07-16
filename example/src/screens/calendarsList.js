import React, { Component } from "react";

import { CalendarList } from "react-native-calendars";

export default class CalendarsList extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <CalendarList
        current={"2012-05-16"}
        hideArrows={false}
        // onHeaderPress={date => console.log("Header Pressed!", date)}
        pastScrollRange={24}
        futureScrollRange={24}
      />
    );
  }
}
