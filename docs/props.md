# API Reference

## Props

| **Name** | **Type** | **Default** | **Description** | **Code Example** |
|----------|----------|----------|----------|----------|
| `current`                 | `string` or `Date`  |          | The current date that is displayed in the calendar.         | `<Calendar current={new Date()}/>`         |
|  `minDate`                | `string` or `Date` |          | The minimum date that can be selected in the calendar.         | `<Calendar minDate={new Date(2022, 5, 15)}/>`         |
| `maxDate`                 | `string` or `Date` |          | The maximum date that can be selected in the calendar.         | `<Calendar maxDate={new Date(2022, 6, 15)}/>`         |
| `firstDay`                | `integer`         | 0         | The first day of the week. 0 for Sunday, 1 for Monday, 2 for Tuesday, etc.         | `<Calendar firstDay={1}/>`         |
| `markedDates`             | `object`       |          | Allows you to mark certain dates on the calendar and customize their appearance. The keys of the object should be the date strings (yyyy-mm-dd) and the values can be a boolean or an object.         |          |
| `theme`                   | `object`         |          | Allows you to change the style of the calendar component by passing in a style object.         |          |
| `displayLoadingIndicator` | `bool`         | false         | A boolean prop that allows you to show or hide a loading indicator while the calendar is rendering         |          |
| `MarkingType`             | `string`         |          | Allows you to specify the type of marker that you want to use for the marked dates, you can choose between 'period' or 'simple'         |          |
| `onDayPress`              | `function`          |          | A function that is called when the user taps on a day on the calendar. The function is passed an object containing information about the selected day.         |          |
| `onDayLongPress`          | `function`         |          | A function that is called when the user long presses on a day on the calendar. The function is passed an object containing information about the selected day.         |          |
| `onMonthChange`           | `function`         |          | A function that is called when the user changes the month being displayed on the calendar. The function is passed an object containing information about the new month.         |          |
| `renderDay`               | `function`         |          | A function that allows you to customize the rendering of the days in the calendar. The function is passed an object containing information about the day being rendered.         |          |
| `monthFormat`             | `string`         |          | Allows you to specify the format for the month label in the calendar.         |          |
| `disabledByDefault`       | `bool`         | false         | Allows you to disable all dates by default.        |          |



