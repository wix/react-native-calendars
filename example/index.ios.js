/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  ScrollView,
  Navigator,
  TouchableOpacity
} from 'react-native';
import {Calendar, CalendarList} from 'wix-react-native-calendar';

export default class CalendarExample extends Component {
  constructor() {
    super();
    this.state = {};
    this.onDayPress = this.onDayPress.bind(this);
  }

  onDayPress(day) {
    this.setState({
      selected: day
    });
  }

  navigate(comp, navigator) {
    navigator.push({name: comp});
  }

  renderMenu(navigator) {
    return (
      <ScrollView style={{marginTop: 50}}>
        <TouchableOpacity style={styles.menu} onPress={this.navigate.bind(this, 'Calendars', navigator)}>
          <Text style={styles.menuText}>Calendar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menu} onPress={this.navigate.bind(this, 'List', navigator)}>
          <Text style={styles.menuText}>Calendar List</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  renderList() {
    return (
      <CalendarList current={'2012-05-16'} style={{marginTop: 50}}/>
    )
  }

  renderCalendars() {
    return (
      <ScrollView style={styles.container}>
        <Calendar
          onDayPress={this.onDayPress}
          style={styles.calendar}
          hideExtraDays
          selected={[this.state.selected]}
        />
        <Calendar
          style={styles.calendar}
          current={'2012-05-16'}
          minDate={'2012-05-10'}
          selected={['2012-05-16']}
          markedDates={{'2012-05-24': [true], '2012-05-25': [true]}}
          hideArrows={true}
          />
        <Calendar
          style={styles.calendar}
          current={'2012-05-16'}
          minDate={'2012-05-10'}
          displayLoadingIndicator
          markingType={'interactive'}
          markedDates={{'2012-05-24': [{startingDay: true, color: 'gray'}], '2012-05-25': [{endingDay: true, color: 'gray'}]}}
          hideArrows={true}
          />
      </ScrollView>
    );
  }

  renderScene(route, navigator) {
    if(route.name == 'Menu') {
      return this.renderMenu(navigator);
    } else if(route.name == 'Calendars') {
      return this.renderCalendars(navigator);
    } else if(route.name == 'List') {
      return this.renderList(navigator);
    }
  }

  render() {
    const NavigationBarRouteMapper = {
      LeftButton(route, navigator, index, navState) {
        if(index > 0) {
          return (
            <TouchableOpacity
              underlayColor="transparent"
              onPress={() => { if (index > 0) { navigator.pop() } }}>
              <Text style={styles.backText }>Back</Text>

            </TouchableOpacity>)
        } 
        else { return null }
      },
      RightButton(route, navigator, index, navState) {
        return null;
      },
      Title(route, navigator, index, navState) {
        return <Text style={ styles.title }>Calendars Example</Text>
      }
    };

    return (
      <Navigator
        style={{flex: 1}}
        initialRoute={{name: 'Menu'}}
        renderScene={this.renderScene.bind(this)}
        navigationBar={
          <Navigator.NavigationBar
            style={ styles.nav }
            routeMapper={ NavigationBarRouteMapper } />
        }
      />);
  }
}

const styles = StyleSheet.create({
  calendar: {
    borderBottomWidth: 1,
    borderColor: 'gray',
    height: 350
  },
  container: {
    flex: 1,
    backgroundColor: 'gray',
    marginTop: 50
  },
  nav: {
    backgroundColor: '#aaa',
    height: 50,
  },
  title: {
    color: 'black',
    fontSize: 18
  },
  backText: {
    color: 'black',
    fontSize: 18,
    marginLeft: 10
  },
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

AppRegistry.registerComponent('CalendarExample', () => CalendarExample);
