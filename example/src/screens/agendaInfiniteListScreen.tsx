import React, {useRef, useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import {ExpandableCalendar, AgendaList, CalendarProvider, WeekCalendar} from 'react-native-calendars';
import testIDs from '../testIDs';
import {agendaItems, getMarkedDates} from '../mocks/agendaItems';
import AgendaItem from '../mocks/AgendaItem';
import {getTheme, themeColor, lightThemeColor} from '../mocks/theme';

const leftArrowIcon = require('../img/previous.png');
const rightArrowIcon = require('../img/next.png');
const ITEMS: any[] = agendaItems;

interface Props {
  weekView?: boolean;
}

const AgendaInfiniteListScreen = (props: Props) => {
  const {weekView} = props;
  const marked = useRef(getMarkedDates());
  const theme = useRef(getTheme());
  const todayBtnTheme = useRef({
    todayButtonTextColor: themeColor
  });

  const renderItem = useCallback(({item}: any) => {
    const isLongItem = item.itemCustomHeightType === 'LongEvent';
    return <View style={{paddingTop: isLongItem ? 40 : 0}}><AgendaItem item={item}/></View>;
  }, []);

  return (
    <CalendarProvider
      date={ITEMS[1]?.title}
      showTodayButton
      theme={todayBtnTheme.current}
    >
      {weekView ? (
        <WeekCalendar testID={testIDs.weekCalendar.CONTAINER} firstDay={1} markedDates={marked.current}/>
      ) : (
        <ExpandableCalendar
          testID={testIDs.expandableCalendar.CONTAINER}
          theme={theme.current}
          firstDay={1}
          markedDates={marked.current}
          leftArrowImageSource={leftArrowIcon}
          rightArrowImageSource={rightArrowIcon}
        />
      )}
      <AgendaList
        sections={ITEMS}
        renderItem={renderItem}
        sectionStyle={styles.section}
        infiniteListProps={
          {
            itemHeight: 80,
            titleHeight: 50,
            itemHeightByType: {
              LongEvent: 120
            }
          }
        }
      />
    </CalendarProvider>
  );
};

export default AgendaInfiniteListScreen;

const styles = StyleSheet.create({
  calendar: {
    paddingLeft: 20,
    paddingRight: 20
  },
  header: {
    backgroundColor: 'lightgrey'
  },
  section: {
    backgroundColor: lightThemeColor,
    color: 'grey',
    textTransform: 'capitalize'
  }
});
