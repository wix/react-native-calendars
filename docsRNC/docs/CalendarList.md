Calendar list component  
[(code example)](https://github.com/wix/react-native-calendars/blob/master/example/src/screens/calendarsList.tsx)
:::info
This component extends **[Calendar, FlatList](https://github.com/wix/react-native-calendars/blob/master/src/calendar/index.tsx,https://reactnative.dev/docs/flatlist)** props.
:::
<div style={{display: 'flex', flexDirection: 'row', overflowX: 'auto', maxHeight: '500px', alignItems: 'center'}}><img style={{maxHeight: '420px'}} src={'https://github.com/wix/react-native-calendars/blob/master/demo/assets/calendar-list.gif?raw=true'}/>

</div>

## API
### pastScrollRange
Max amount of months allowed to scroll to the past  
<span style={{color: 'grey'}}>number</span>

### futureScrollRange
Max amount of months allowed to scroll to the future  
<span style={{color: 'grey'}}>number</span>

### calendarStyle
Specify style for calendar container element  
<span style={{color: 'grey'}}>ViewStyle</span>

### calendarHeight
Dynamic calendar height  
<span style={{color: 'grey'}}>number</span>

### calendarWidth
Used when calendar scroll is horizontal, (when pagingEnabled = false)  
<span style={{color: 'grey'}}>number</span>

### staticHeader
Whether to use a fixed header that doesn't scroll (when horizontal = true)  
<span style={{color: 'grey'}}>boolean</span>

### showScrollIndicator
Whether to enable or disable vertical / horizontal scroll indicator  
<span style={{color: 'grey'}}>boolean</span>

