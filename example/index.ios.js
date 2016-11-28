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
  View,
  ScrollView,
  Navigator,
  TouchableOpacity
} from 'react-native';
import {Calendar, CalendarList, Agenda} from 'wix-react-native-calendar';

export default class CalendarExample extends Component {
  constructor() {
    super();
    this.state = {
      items: {}
    };
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
        <TouchableOpacity style={styles.menu} onPress={this.navigate.bind(this, 'Agenda', navigator)}>
          <Text style={styles.menuText}>Agenda</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  renderList() {
    return (
      <CalendarList current={'2012-05-16'} style={{marginTop: 50}}/>
    )
  }

  timeToString(time) {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  }

  loadItems(day) {
    setTimeout(() => {
      for (let i = -15; i < 45; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strtime = this.timeToString(time);
        if (!this.state.items[strtime]) {
          this.state.items[strtime] = [];
          const numItems = Math.floor(Math.random() * 5);
          for (let j = 0; j < numItems; j++) {
            this.state.items[strtime].push({
              name: 'Item for ' + strtime,
              height: Math.max(50, Math.floor(Math.random() * 150))
            });
          }
        }
      }
      this.setState({
        items: this.state.items
      });
    }, 1000);
    console.log(`Load Items for ${day.year}-${day.month}`);
  }

  renderItem(item) {
    return (
      <View style={{backgroundColor: 'white', height: item.height, marginTop: 12, flex:1}}><Text>{item.name}</Text></View>
    )
  }

  renderEmptyDate(item) {
    return (
      <View style={{backgroundColor: 'white', height: 75, marginTop: 12, flex:1}}><Text>This is empty date!</Text></View>
    )
  }

  rowHasChanged(r1, r2) {
    return r1.name !== r2.name;
  }

  renderAgenda() {
    return (
      <Agenda
        style={{marginTop: 50}}
        items={this.state.items}
        loadItemsForMonth={this.loadItems.bind(this)}
        selected={'2012-05-16'}
        renderItem={this.renderItem.bind(this)}
        renderEmptyDate={this.renderEmptyDate.bind(this)}
        rowHasChanged={this.rowHasChanged.bind(this)}
      />
    );
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
    } else if(route.name == 'Agenda') {
      return this.renderAgenda(navigator);
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
