Calendar list component  
[(code example)](https://github.com/wix/react-native-calendars/blob/master/example/src/screens/calendarListScreen.tsx)
:::info
This component extends **[Calendar](https://github.com/wix/react-native-calendars/blob/master/src/calendar/index.tsx), [FlatList](https://reactnative.dev/docs/flatlist)** props.
:::

<div style={{display: 'flex', flexDirection: 'row', overflowX: 'auto', maxHeight: '500px', alignItems: 'center'}}>
  <img style={{maxHeight: '420px'}} src={'https://github.com/wix/react-native-calendars/blob/master/demo/assets/calendar-list.gif?raw=true'}/>
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

<br/>

## Calendar List Examples

<br/>

`<CalendarList/>` is scrollable semi-infinite calendar composed of `<Calendar/>` components. Currently it is possible to scroll 4 years back and 4 years to the future. All parameters that are available for `<Calendar/>` are also available for this component. There are also some additional params that can be used:

```javascript
<CalendarList
  // Callback which gets executed when visible months change in scroll view. Default = undefined
  onVisibleMonthsChange={(months) => {console.log('now these months are visible', months);}}
  // Max amount of months allowed to scroll to the past. Default = 50
  pastScrollRange={50}
  // Max amount of months allowed to scroll to the future. Default = 50
  futureScrollRange={50}
  // Enable or disable scrolling of calendar list
  scrollEnabled={true}
  // Enable or disable vertical scroll indicator. Default = false
  showScrollIndicator={true}
  ...calendarParams
/>
```

#### Horizontal CalendarList

  <img src="https://github.com/wix-private/wix-react-native-calendar/blob/master/demo/assets/horizontal-calendar-list.gif?raw=true"/>

You can also make the `CalendarList` scroll horizontally. To do that you need to pass specific props to the `CalendarList`:

```javascript
<CalendarList
  // Enable horizontal scrolling, default = false
  horizontal={true}
  // Enable paging on horizontal, default = false
  pagingEnabled={true}
  // Set custom calendarWidth.
  calendarWidth={320}
  ...calendarListParams
  ...calendarParams
/>
```
