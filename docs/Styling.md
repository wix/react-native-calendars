# Styling

## Customizing look & feel

```javascript
<Calendar
  // Specify style for calendar container element. Default = {}
  style={{
    borderWidth: 1,
    borderColor: 'gray',
    height: 350
  }}
  // Specify theme properties to override specific styles for calendar parts. Default = {}
  theme={{
    backgroundColor: '#ffffff',
    calendarBackground: '#ffffff',
    textSectionTitleColor: '#b6c1cd',
    textSectionTitleDisabledColor: '#d9e1e8',
    selectedDayBackgroundColor: '#00adf5',
    selectedDayTextColor: '#ffffff',
    todayTextColor: '#00adf5',
    dayTextColor: '#2d4150',
    textDisabledColor: '#d9e1e8',
    dotColor: '#00adf5',
    selectedDotColor: '#ffffff',
    arrowColor: 'orange',
    disabledArrowColor: '#d9e1e8',
    monthTextColor: 'blue',
    indicatorColor: 'blue',
    textDayFontFamily: 'monospace',
    textMonthFontFamily: 'monospace',
    textDayHeaderFontFamily: 'monospace',
    textDayFontWeight: '300',
    textMonthFontWeight: 'bold',
    textDayHeaderFontWeight: '300',
    textDayFontSize: 16,
    textMonthFontSize: 16,
    textDayHeaderFontSize: 16
  }}
/>
```
## Customize days titles with disabled styling
```javascript
<Calendar
    theme={{
     textSectionTitleDisabledColor: '#d9e1e8'
    }}
    disabledDaysIndexes={[0, 6]}
    markedDates={{
    ...this.getDisabledDates('2012-05-01', '2012-05-30', [0, 6])
    }}
/>
```

## Advanced styling

If you want to have complete control over the calendar styles you can do it by overriding default `style.js` files. For example, if you want to override `<CalendarHeader/>` style first you have to find stylesheet id for this file:

https://github.com/wix/react-native-calendars/blob/master/src/calendar/header/style.js#L4

In this case it is `stylesheet.calendar.header`. Next you can add overriding stylesheet to your theme with this id.

https://github.com/wix/react-native-calendars/blob/master/example/src/screens/calendars.js#L56

```javascript
theme={{
  arrowColor: 'white',
  'stylesheet.calendar.header': {
    week: {
      marginTop: 5,
      flexDirection: 'row',
      justifyContent: 'space-between'
    }
  }
}}
```

**Disclaimer**: Issues that arise because something breaks after using stylesheet override will not be supported. Use this option at your own risk.

#### Overriding day component

If you need custom functionality not supported by current day component implementations you can pass your own custom day component to the calendar.

```javascript
<Calendar
  style={[styles.calendar, {height: 300}]}
  dayComponent={({date, state}) => {
    return (
      <View>
        <Text style={{textAlign: 'center', color: state === 'disabled' ? 'gray' : 'black'}}>
          {date.day}
        </Text>
      </View>
    );
  }}
/>
```

The `dayComponent` prop has to receive a RN component or a function that receive props. The `dayComponent` will receive such props:

* state - disabled if the day should be disabled (this is decided by base calendar component).
* marking - `markedDates` value for this day.
* date - the date object representing this day.

**Tip**: Don't forget to implement `shouldComponentUpdate()` for your custom day component to make the calendar perform better

If you implement an awesome day component please make a PR so that other people could use it :)
