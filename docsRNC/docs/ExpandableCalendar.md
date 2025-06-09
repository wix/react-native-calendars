Expandable calendar component  
[(code example)](https://github.com/wix/react-native-calendars/blob/master/example/src/screens/expandableCalendar.tsx)
:::info
This component extends **[CalendarList](https://github.com/wix/react-native-calendars/blob/master/src/calendar-list/index.tsx)** props.
:::
**NOTE: This component should be wrapped with `CalendarProvider` component.**
<div style={{display: 'flex', flexDirection: 'row', overflowX: 'auto', maxHeight: '500px', alignItems: 'center'}}><img style={{maxHeight: '420px'}} src={'https://github.com/wix/react-native-calendars/blob/master/demo/assets/expandable-calendar.gif?raw=true'}/>

</div>

## API
### initialPosition
The initial position of the calendar ('open' | 'closed')  
<span style={{color: 'grey'}}>Positions</span>

### onCalendarToggled
Handler which gets executed when the calendar is opened or closed  
<span style={{color: 'grey'}}>(isOpen: boolean) => void</span>

### disablePan
Whether to disable the pan gesture and disable the opening and closing of the calendar (initialPosition will persist)  
<span style={{color: 'grey'}}>boolean</span>

### hideKnob
Whether to hide the knob  
<span style={{color: 'grey'}}>boolean</span>

### leftArrowImageSource
The source for the left arrow image  
<span style={{color: 'grey'}}>ImageSourcePropType</span>

### rightArrowImageSource
The source for the right arrow image  
<span style={{color: 'grey'}}>ImageSourcePropType</span>

### allowShadow
Whether to have shadow/elevation for the calendar  
<span style={{color: 'grey'}}>boolean</span>

### disableWeekScroll
Whether to disable the week scroll in closed position  
<span style={{color: 'grey'}}>boolean</span>

### openThreshold
The threshold for opening the calendar with the pan gesture  
<span style={{color: 'grey'}}>number</span>

### closeThreshold
The threshold for closing the calendar with the pan gesture  
<span style={{color: 'grey'}}>number</span>

### closeOnDayPress
Whether to close the calendar on day press  
<span style={{color: 'grey'}}>boolean</span>

