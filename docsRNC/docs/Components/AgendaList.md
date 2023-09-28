Agenda list component for the `ExpandableCalendar` component.  
[(code example)](https://github.com/wix/react-native-calendars/blob/master/example/src/screens/expandableCalendarScreen.tsx)
:::info
This component extends **[FlatList](https://reactnative.dev/docs/flatlist)** props.
:::
**NOTE: This component should be wrapped with `CalendarProvider` component.**

<div style={{display: 'flex', flexDirection: 'row', overflowX: 'auto', maxHeight: '500px', alignItems: 'center'}}><img style={{maxHeight: '420px'}} src={'https://github.com/wix/react-native-calendars/blob/master/demo/assets/expandable-calendar.gif?raw=true'}/>

</div>

## API

### theme

Specify theme properties to override specific styles for calendar parts  
<span style={{color: 'grey'}}>Theme</span>

### dayFormat

Day format in section title. Formatting values: http://arshaw.com/xdate/#Formatting  
<span style={{color: 'grey'}}>string</span>

### dayFormatter

A function to custom format the section header's title  
<span style={{color: 'grey'}}>(arg0: string) => string</span>

### useMoment

Whether to use moment.js for date string formatting  
<span style={{color: 'grey'}}>boolean</span>

### markToday

Whether to mark today's title with the 'Today, ...' string  
<span style={{color: 'grey'}}>boolean</span>

### avoidDateUpdates

Whether to block the date change in calendar (and calendar context provider) when agenda scrolls  
<span style={{color: 'grey'}}>boolean</span>

### scrollToNextEvent

Whether to enable scrolling the agenda list to the next date with content when pressing a day without content  
<span style={{color: 'grey'}}>boolean</span>

### viewOffset

Offset scroll to the section  
<span style={{color: 'grey'}}>number</span>

### sectionStyle

The style passed to the section view  
<span style={{color: 'grey'}}>ViewStyle</span>
