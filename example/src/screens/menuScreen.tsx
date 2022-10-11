import React, {useState} from 'react';
import {Platform, StyleSheet, View, ScrollView, TouchableOpacity, Text, Image, I18nManager, Switch} from 'react-native';
import {Navigation} from 'react-native-navigation';
import testIDs from '../testIDs';

const appIcon = require('../img/logo.png');

interface Props {
  componentId?: string;
  weekView?: boolean;
  horizontalView?: boolean;
}

const MenuScreen = (props: Props) => {
  const {componentId} = props;
  const [forceRTL, setForceRTL] = useState(false);
  
  const toggleRTL = (value) => {
    I18nManager.forceRTL(value);
    setForceRTL(value);
  };

  const renderEntry = (testID: string, title: string, screen: string, options?: any) => {
    return (
      <TouchableOpacity
        testID={testID}
        style={styles.menu}
        onPress={() => openScreen(screen, options)}
      >
        <Text style={styles.menuText}>{title}</Text>
      </TouchableOpacity>
    );
  };

  const pushScreen = (screen: string, props?: Props) => {
    Navigation.push(componentId, {
      component: {
        name: screen,
        passProps: props,
        options: {
          topBar: {
            title: {
              text: props?.weekView ? 'WeekCalendar' : screen
            },
            backButton: {
              testID: 'back',
              showTitle: false, // iOS only
              color: Platform.OS === 'ios' ? '#2d4150' : undefined
            }
          }
        }
      }
    });
  };

  const openScreen = (screen: string, options: any) => {
    pushScreen(screen, options);
  };

  return (
    <ScrollView>
      <View style={styles.container} testID={testIDs.menu.CONTAINER}>
        <Image source={appIcon} style={styles.image}/>
        {renderEntry(testIDs.menu.CALENDARS, 'Calendar', 'CalendarScreen')}
        {renderEntry(testIDs.menu.CALENDARS, 'Calendar Playground', 'CalendarPlaygroundScreen')}
        {renderEntry(testIDs.menu.CALENDAR_LIST, 'Calendar List', 'CalendarListScreen')}
        {renderEntry(testIDs.menu.HORIZONTAL_LIST, 'Horizontal Calendar List', 'CalendarListScreen', {horizontalView: true})}
        {renderEntry(testIDs.menu.HORIZONTAL_LIST, 'NEW Calendar List', 'NewCalendarListScreen')}
        {renderEntry(testIDs.menu.AGENDA, 'Agenda', 'AgendaScreen')}
        {renderEntry(testIDs.menu.EXPANDABLE_CALENDAR, 'Expandable Calendar', 'ExpandableCalendarScreen')}
        {renderEntry(testIDs.menu.TIMELINE_CALENDAR, 'Timeline Calendar', 'TimelineCalendarScreen')}
        {renderEntry(testIDs.menu.WEEK_CALENDAR, 'Week Calendar', 'ExpandableCalendarScreen', {weekView: true})}
        {renderEntry(testIDs.menu.PLAYGROUND, 'Playground', 'Playground')}
        <View style={styles.switchContainer}>
          <Text>Force RTL</Text>
          <Switch value={forceRTL} onValueChange={toggleRTL}/>
        </View>
      </View>
    </ScrollView>
  );
};

export default MenuScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  image: {
    margin: 30,
    width: 90,
    height: 90
  },
  menu: {
    width: 300,
    padding: 10,
    margin: 10,
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#7a92a5'
  },
  menuText: {
    fontSize: 18,
    color: '#2d4150'
  },
  switchContainer: {
    margin: 20
  }
});
