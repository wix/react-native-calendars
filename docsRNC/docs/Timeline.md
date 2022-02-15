Timeline component  
[(code example)](https://github.com/wix/react-native-calendars/blob/master/example/src/screens/timelineCalendar.tsx)
:::info
This component extends **[ScrollView](https://reactnative.dev/docs/scrollview)** props.
:::

<div style={{display: 'flex', flexDirection: 'row', overflowX: 'auto', maxHeight: '500px', alignItems: 'center'}}><img style={{maxHeight: '420px'}} src={'https://github.com/wix/react-native-calendars/blob/master/demo/assets/timeline-calendar.gif?raw=true'}/>

</div>

## API

### theme

Specify theme properties to override specific styles for calendar parts  
<span style={{color: 'grey'}}>Theme</span>

### style

Specify style for calendar container element  
<span style={{color: 'grey'}}>ViewStyle</span>

### events

List of events to render on the timeline  
<span style={{color: 'grey'}}>Event[]</span>

### start

The timeline day start time  
<span style={{color: 'grey'}}>number</span>

### end

The timeline day end time  
<span style={{color: 'grey'}}>number</span>

### onEventPress

Handler which gets executed when event is pressed  
<span style={{color: 'grey'}}>(event: Event) => void</span>

### onBackgroundLongPress

Handler which gets executed when background is long pressed. Pass to handle creation of a new event  
<span style={{color: 'grey'}}>(timeString: string, time: NewEventTime) => void</span>

### onBackgroundLongPressOut

Handler which gets executed when background's long pressed released. Pass to handle creation of a new event  
<span style={{color: 'grey'}}>(timeString: string, time: NewEventTime) => void</span>

### renderEvent

Specify a custom event block  
<span style={{color: 'grey'}}>(event: PackedEvent) => JSX.Element</span>

### scrollToFirst

Whether to scroll to the first event  
<span style={{color: 'grey'}}>boolean</span>

### format24h

Whether to use 24 hours format for the timeline hours  
<span style={{color: 'grey'}}>boolean</span>
