import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  ScrollView,
  View,
} from 'react-native';
import {Calendar} from 'react-native-calendars';

export default class calendarListWithStickyHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onDayPress = this.onDayPress.bind(this);
  }

  render() {
    return (
      <View style={styles.container}>
      <View
      style={{ height:80 }}
    >
      <Calendar
      theme={{
        backgroundColor: "#fff",
        calendarBackground: "#00adf5",
        textSectionTitleColor: "rgba(255, 255, 255, 1)",
        selectedDayBackgroundColor: "#00adf5",
        selectedDayTextColor: "#ffffff",
        todayTextColor: "#00adf5",
        dayTextColor: "#2d4150",
        textDisabledColor: "#d9e1e8",
        dotColor: "#00adf5",
        selectedDotColor: "red",
        arrowColor: "#fff",
        monthTextColor: "#fff",
        textDayFontSize: 15,
        textMonthFontSize: 15,
        textDayHeaderFontSize: 15
      }}
      onDayPress={day => {
        console.log("selected day", day);
      }}
      dayComponent={({ date, state }) => {
        this.setState({ date: date.dateString });
        return (
          <View style={{ flex: 1 }}>
           
          </View>
        );
      }}
    />
    </View>
    <ScrollView>
    
<Text style={styles.text}>Weekend Menu</Text>
<Text style={styles.text}>Special Menu</Text>
<Text style={styles.text}>Testing Menu</Text>
<Text style={styles.text}>Check More Menu's</Text>
<Text style={styles.text}>You can add more list views with this awesome calendar sticky header</Text>
    </ScrollView>
      </View>
    );
  }

  onDayPress(day) {
    this.setState({
      selected: day.dateString
    });
  }
}

const styles = StyleSheet.create({
  calendar: {
    borderTopWidth: 1,
    paddingTop: 5,
    borderBottomWidth: 1,
    borderColor: 'green',
    height: 350
  },
  text: {
    textAlign: 'center',
    borderColor: 'red',
    padding: 10,
    backgroundColor: '#fff'
  },
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
});
