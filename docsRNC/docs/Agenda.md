Agenda component  
[(code example)](https://github.com/wix/react-native-calendars/blob/master/example/src/screens/agenda.tsx)
:::info
This component extends **[CalendarList, FlatList](https://github.com/wix/react-native-calendars/blob/master/src/calendar-list/index.tsx,https://reactnative.dev/docs/flatlist)** props.
:::
<div style={{display: 'flex', flexDirection: 'row', overflowX: 'auto', maxHeight: '500px', alignItems: 'center'}}><img style={{maxHeight: '420px'}} src={'https://github.com/wix/react-native-calendars/blob/master/demo/assets/agenda.gif?raw=true'}/>

</div>

## API
### items
the list of items that have to be displayed in agenda. If you want to render item as empty date the value of date key has to be an empty array []. If there exists no value for date key it is considered that the date in question is not yet loaded  
<span style={{color: 'grey'}}>AgendaSchedule</span>

### loadItemsForMonth
Handler which gets executed when items for a certain month should be loaded (month became visible)  
<span style={{color: 'grey'}}>(data: DateData) => void</span>

### onDayChange
Handler which gets executed when day changes while scrolling agenda list  
<span style={{color: 'grey'}}>(data: DateData) => void</span>

### onCalendarToggled
Handler which gets executed when the calendar is opened or closed  
<span style={{color: 'grey'}}>(enabled: boolean) => void</span>

### selected
initially selected day  
<span style={{color: 'grey'}}>string</span>

### renderKnob
Replace default agenda's knob with a custom one  
<span style={{color: 'grey'}}>() => JSX.Element</span>

### hideKnob
Whether to hide the knob  
<span style={{color: 'grey'}}>boolean</span>

### showClosingKnob
Whether the knob should always be visible (when hideKnob = false)  
<span style={{color: 'grey'}}>boolean</span>

### showOnlySelectedDayItems
Whether to show items only for the selected date  
<span style={{color: 'grey'}}>boolean</span>

### renderEmptyData
Replace default ActivityIndicator with a custom one  
<span style={{color: 'grey'}}>() => JSX.Element</span>

