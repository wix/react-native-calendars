import React, {useState} from 'react';
import {StyleSheet, View, ScrollView, TouchableOpacity, Text, Image, I18nManager, Switch} from 'react-native';
// import {useNavigation} from '@react-navigation/native';
import testIDs from '../testIDs';

const appIcon = require('../img/logo.png');

interface Props {
  componentId?: string;
  weekView?: boolean;
  horizontalView?: boolean;
}

const MenuScreen = (props: Props) => {
  // const navigation = useNavigation();
  const {componentId} = props;
  const [forceRTL, setForceRTL] = useState(false);

  const toggleRTL = (value) => {
    I18nManager.forceRTL(value);
    setForceRTL(value);
  };

  const renderEntry = (testID: string, title: string, screen: string, options?: Props) => {
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

  const openScreen = (screen: string, options?: Props) => {
    //@ts-expect-error
    // navigation.navigate(screen, options);
  };

  return (
    <ScrollView>
      <View style={styles.container} testID={testIDs.menu.CONTAINER}>
        <Image source={appIcon} style={styles.image}/>
        {renderEntry(testIDs.menu.CALENDARS, 'Calendar', 'Calendar')}
        {renderEntry(testIDs.menu.CALENDARS, 'Calendar Playground', 'CalendarPlayground')}
        {renderEntry(testIDs.menu.CALENDAR_LIST, 'Calendar List', 'CalendarList')}
        {renderEntry(testIDs.menu.HORIZONTAL_LIST, 'Horizontal Calendar List', 'CalendarList', {horizontalView: true})}
        {renderEntry(testIDs.menu.HORIZONTAL_LIST, 'NEW Calendar List', 'NewCalendarList')}
        {renderEntry(testIDs.menu.AGENDA, 'Agenda', 'Agenda')}
        {renderEntry(testIDs.menu.AGENDA_INFINITE, 'Agenda Infinite List', 'AgendaInfiniteList')}
        {renderEntry(testIDs.menu.EXPANDABLE_CALENDAR, 'Expandable Calendar', 'ExpandableCalendar')}
        {renderEntry(testIDs.menu.TIMELINE_CALENDAR, 'Timeline Calendar', 'TimelineCalendar')}
        {renderEntry(testIDs.menu.WEEK_CALENDAR, 'Week Calendar', 'ExpandableCalendar', {weekView: true})}
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
