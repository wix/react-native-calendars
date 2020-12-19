Date marking

**Disclaimer**: Make sure that `markedDates` param is immutable. If you change `markedDates` object content but the reference to it does not change calendar update will not be triggered.

Dot marking

<kbd>
  <img height=50 src="https://github.com/wix-private/wix-react-native-calendar/blob/master/demo/marking1.png?raw=true">
</kbd>
<p></p>

```javascript
<Calendar
  // Collection of dates that have to be marked. Default = {}
  markedDates={{
    '2012-05-16': {selected: true, marked: true, selectedColor: 'blue'},
    '2012-05-17': {marked: true},
    '2012-05-18': {marked: true, dotColor: 'red', activeOpacity: 0},
    '2012-05-19': {disabled: true, disableTouchEvent: true}
  }}
/>
```

You can customize a dot color for each day independently.

Multi-Dot marking

<kbd>
 <img height=50 src="https://github.com/wix-private/wix-react-native-calendar/blob/master/demo/marking4.png?raw=true">
</kbd>
<p></p>

Use `markingType={'multi-dot'}` if you want to display more than one dot. Both the `<Calendar/>` and `<CalendarList/>` support multiple dots by using `dots` array in `markedDates` prop. 
The property `color` is mandatory while `key` and `selectedColor` are optional. If key is omitted then the array index is used as key. If `selectedColor` is omitted then `color` will be used for selected dates.

```javascript
const vacation = {key:'vacation', color: 'red', selectedDotColor: 'blue'};
const massage = {key:'massage', color: 'blue', selectedDotColor: 'blue'};
const workout = {key:'workout', color: 'green'};

<Calendar
  markedDates={{
    '2017-10-25': {dots: [vacation, massage, workout], selected: true, selectedColor: 'red'},
    '2017-10-26': {dots: [massage, workout], disabled: true}
  }}
  markingType={'multi-dot'}
/>
```

Period marking

<kbd>
  <img height=50 src="https://github.com/wix-private/wix-react-native-calendar/blob/master/demo/marking2.png?raw=true">
</kbd>

<kbd>
  <img height=50 src="https://github.com/wix-private/wix-react-native-calendar/blob/master/demo/marking3.png?raw=true">
</kbd>
<p></p>

```javascript
<Calendar
  // Collection of dates that have to be colored in a special way. Default = {}
  markedDates={{
    '2012-05-20': {textColor: 'green'},
    '2012-05-22': {startingDay: true, color: 'green'},
    '2012-05-23': {selected: true, endingDay: true, color: 'green', textColor: 'gray'},
    '2012-05-04': {disabled: true, startingDay: true, color: 'green', endingDay: true}
  }}
  // Date marking style [simple/period/multi-dot/custom]. Default = 'simple'
  markingType={'period'}
/>
```

Multi-period marking

<kbd>
  <img height=50 src="https://github.com/wix-private/wix-react-native-calendar/blob/master/demo/marking6.png?raw=true">
</kbd>
<p></p>

**CAUTION**: This marking is only fully supported by the `<Calendar/>` component because it expands its height. Usage with `<CalendarList/>` might lead to overflow issues.

```javascript
<Calendar
  markedDates={{
    '2017-12-14': {
      periods: [
        {startingDay: false, endingDay: true, color: '#5f9ea0'},
        {startingDay: false, endingDay: true, color: '#ffa500'},
        {startingDay: true, endingDay: false, color: '#f0e68c'}
      ]
    },
    '2017-12-15': {
      periods: [
        {startingDay: true, endingDay: false, color: '#ffa500'},
        {color: 'transparent'},
        {startingDay: false, endingDay: false, color: '#f0e68c'}
      ]
    }
  }}
  // Date marking style [simple/period/multi-dot/custom]. Default = 'simple'
  markingType='multi-period'
/>
```

Custom marking allows you to customize each marker with custom styles.

<kbd>
  <img height=50 src="https://github.com/wix-private/wix-react-native-calendar/blob/master/demo/custom.png?raw=true">
</kbd>
<p></p>

```javascript
<Calendar
  // Date marking style [simple/period/multi-dot/single]. Default = 'simple'
  markingType={'custom'}
  markedDates={{
    '2018-03-28': {
      customStyles: {
        container: {
          backgroundColor: 'green'
        },
        text: {
          color: 'black',
          fontWeight: 'bold'
        }
      }
    },
    '2018-03-29': {
      customStyles: {
        container: {
          backgroundColor: 'white',
          elevation: 2
        },
        text: {
          color: 'blue'
        }
      }
    }
  }}
/>
```

**NEW!** While we still don't support multi marking type, we add the possibility to combine between `period` and `simple`.
```javascript
<Calendar
  markingType={'period'}
  markedDates={{
    '2012-05-15': {marked: true, dotColor: '#50cebb'},
    '2012-05-16': {marked: true, dotColor: '#50cebb'},
    '2012-05-21': {startingDay: true, color: '#50cebb', textColor: 'white'},
    '2012-05-22': {color: '#70d7c7', textColor: 'white'},
    '2012-05-23': {color: '#70d7c7', textColor: 'white', marked: true, dotColor: 'white'},
    '2012-05-24': {color: '#70d7c7', textColor: 'white'},
    '2012-05-25': {endingDay: true, color: '#50cebb', textColor: 'white'},
  }}
/>
```
<kbd>
  <img height=350 src="https://github.com/wix-private/wix-react-native-calendar/blob/master/demo/multi-marking.png?raw=true">
</kbd>
<p></p>

Keep in mind that different marking types are not compatible. You can use just one marking style for a calendar.

#### Displaying data loading indicator

<kbd>
  <img height=50 src="https://github.com/wix-private/wix-react-native-calendar/blob/master/demo/loader.png?raw=true">
</kbd>
<p></p>

The loading indicator next to the month name will be displayed if `<Calendar/>` has `displayLoadingIndicator` prop and the `markedDates` collection does not have a value for every day of the month in question. When you load data for days, just set `[]` or special marking value to all days in `markedDates` collection.
