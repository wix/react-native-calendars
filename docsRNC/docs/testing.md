## Testing Calendars

Each component receives a testID as a prop and pass to internal elements by concatenating the testID with the element type/data.

For instance, The `Calendar` component will concatenate a given testID to each `Day` element it renders with its date.  
So each Day element's testID will be in the following format `${testID}.day_${date_string}`.

For example, if you'll pass to `Calendar` a testID called `myCalendar`, the day element representing the 2022-08-21 will have `myCalendar.day_2022-08-21` as testID.

Follow the components testIDs guidelines to learn how to query them in your tests

### Calendar

| Element        | Format                                | Example                                                  |
| -------------- | ------------------------------------- | -------------------------------------------------------- |
| Main Container | `${testID}`                           | `myCalendar`                                             |
| Day            | `${testID}.day_${date_string}`        | `myCalendar.day_2022-08-21`, `myCalendar.day_2022-07-15` |
| Header         | `${testID}.header`                    | `myCalendar.header`                                      |
| Week Numbers   | `${testID}.weekNumber_${weekNumber}`} | `myCalendar.weekNumber_27`                               |

### CalendarList

| Element        | Format                            | Example                       |
| -------------- | --------------------------------- | ----------------------------- |
| Main Container | `${testID}`                       | `myCalendarList`              |
| Calendar Item  | `${testID}.item_${year}-{month}`} | `myCalendarList.item_2022-07` |
| Static Header  | `${testID}.staticHeader`}         | `myCalendarList.staticHeader` |

### Header

| Element        | Format                 | Example                       |
| -------------- | ---------------------- | ----------------------------- |
| Main Container | `${testID}`            | `myCalendarHeader`            |
| Header Title   | `${testID}.title`      | `myCalendarHeader.title`      |
| Day Names      | `${testID}.dayNames`   | `myCalendarHeader.dayNames`   |
| Left Arrow     | `${testID}.leftArrow`  | `myCalendarHeader.leftArrow`  |
| Right Arrow    | `${testID}.rightArrow` | `myCalendarHeader.rightArrow` |
| Loader         | `${testID}.loader`     | `myCalendarHeader.loader`     |

### ExpandableCalendar

| Element              | Format                          | Example                                    |
| -------------------- | ------------------------------- | ------------------------------------------ |
| Main Container       | `${testID}`                     | `myExpandableCalendar`                     |
| Left Arrow           | `${testID}.leftArrow`           | `myExpandableCalendar.leftArrow`           |
| Right Arrow          | `${testID}.rightArrow`          | `myExpandableCalendar.rightArrow`          |
| Knob                 | `${testID}.knob`                | `myExpandableCalendar.knob`                |
| Expandable Container | `${testID}.expandableContainer` | `myExpandableCalendar.expandableContainer` |
| Week Calendar        | `${testID}.weekCalendar`        | `myExpandableCalendar.weekCalendar`        |
| Calendar List        | `${testID}.calendarList`        | `myExpandableCalendar.calendarList`        |

### WeekCalendar

| Element        | Format                         | Example                         |
| -------------- | ------------------------------ | ------------------------------- |
| Main Container | `${testID}`                    | `myWeekCalendar`                |
| Day            | `${testID}.day_${date_string}` | `myWeekCalendar.day_2022-08-21` |

## Notes

Some components render others as internal components and their testIDs are based on the main parent id.  
For instance, if you'll pass `myExpandableCalendar` to ExpandableCalendar testID.  
In order to query a Day element, you'll need to go though all the render hierarchy's testIDs.

In this case. ExpandableCalendar -> CalendarList -> Calendar -> Day.  
And the testID for the Day element will be `myExpandableCalendar.calendarList.item_${year}-${month}.day_${date_string}`.
