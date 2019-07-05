import React, {Component} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {Navigation} from 'react-native-navigation';


export default class MenuScreen extends Component {

  render() {
    return (
      <View>
        <TouchableOpacity style={styles.menu} onPress={this.onCalendarsPress.bind(this)}>
          <Text style={styles.menuText}>Calendars</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menu} onPress={this.onCalendarListPress.bind(this)}>
          <Text style={styles.menuText}>Calendar List</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menu} onPress={this.onHorizontalCalendarListPress.bind(this)}>
          <Text style={styles.menuText}>Horizontal Calendar List</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menu} onPress={this.onAgendaPress.bind(this)}>
          <Text style={styles.menuText}>Agenda</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menu} onPress={this.onExpandablePress.bind(this)}>
          <Text style={styles.menuText}>Expandable Calendar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  pushScreen(screen) {
    Navigation.push(this.props.componentId, {
      component: {
        name: screen,
        options: {
          topBar: {
            title: {
              text: screen
            }
          }
        }
      }
    });
  }

  onCalendarsPress() {
    this.pushScreen('Calendars');
  }

  onCalendarListPress() {
    this.pushScreen('CalendarsList');
  }

  onHorizontalCalendarListPress() {
    this.pushScreen('HorizontalCalendarList');
  }

  onAgendaPress() {
    this.pushScreen('Agenda');
  }

  onExpandablePress() {
    this.pushScreen('ExpandableCalendar');
  }
}

const styles = StyleSheet.create({
  menu: {
    height: 50,
    justifyContent: 'center',
    paddingLeft: 15,
    borderBottomWidth: 1
  },
  menuText: {
    fontSize: 18
  }
});
