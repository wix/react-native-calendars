# Changelog

## [1.188.0] - 2019-06-16
### Added
- src/expandableCalendar/AgendaList.js - invoking used SectionList's events.
### Removed
- example/src/screens/ExpandableCalendar.js - removing unnecessary 'data' prop sent to AgendaList.


## [1.189.0] - 2019-06-24
### Bug Fix
- CalendarProvider - fix for 'date' prop update.

## [1.190.0] - 2019-06-24
### Added
- CalendarContext - 'disabledOpacity' prop to control the opacity of the today button when it is disabled (default is now undefined, meaning no opacity).
- src/style.js - adding support for today button's font size, weight, family.
### Bug Fix
- CalendarContext - fix for today button's width to allow button to take content's width.

## [1.191.0] - 2019-06-24
### Bug Fix
- ExpandableCalendar - limit calendar min height to closed height.

## [1.192.0] - 2019-06-25
### Fix
- CalendarProvider - fix for warning on Image 'source' type.
- ExpandableCalendar - fix shadow/elevation style.

## [1.193.0] - 2019-06-26
### Bug Fix
- ExpandableCalendar - fix for week paddings. Changing knob container height and weekDays style.
- CalendarList/item - limit headerStyle to horizontal only.

## [1.194.0] - 2019-06-30
### Added
- CalendarProvider - 'onMonthChange' event returning date object and updateSource.

## [1.195.0] - 2019-07-04
### Change
- Components' props comment format.

## [1.196.0] - 2019-07-04
### Added
- CalendarList - passing 'testID' to static CalendarHeader.

## [1.197.0] - 2019-07-14
### Added
- asCalendarConsumer - hoist non-react statics.

## [1.198.0] - 2019-07-14
### Fix
- ExpandableCalendar - fix example screen.

## [1.199.0] - 2019-07-18
### Changed
- CalendarHeader - editing 'testID' for static CalendarHeader.

## [1.200.0] - 2019-07-18
### Added
- ExpandableCalendar - adding testID for knob.

## [1.201.0] - 2019-07-25
### Change
- eslint - updating to version 6.1.0.
- lodash - importing library instead of sub-libraries.

## [1.202.0] - 2019-07-25
### Added
- CalendarHeader - adding 'firstDay' (PR #826), 'monthFormat' (PR #787) and 'weekNumbers' to shouldComponentUpdate.
- Agenda - adding support for weekdays name's 'fontSize', 'fontFamily' and 'fontWeight' (PR #711).
- ReservationList - adding support for Day number's 'fontFamily', and to Day text's 'fontFamily' and 'fontWeight' (PR #711).

## [1.203.0] - 2019-07-31
### Fix
- ExpandableCalendar - fix for vertical open height.

## [1.204.0] - 2019-08-6
### Fix
- CalendarProvider - adding 'buttonTopPosition' prop to control the button's y position.

## [1.205.0] - 2019-08-15
### Fix
- Week - fix for style - removing width to allow flex.

## [1.206.0] - 2019-08-15
### Fix
- CalendarProvider - fix header in vertical mode when initial position is 'open'.

## [1.207.0] - 2019-08-15
### Added
- CalendarProvider - 'todayButtonStyle' prop to allow passing style to the today button.

## [1.208.0] - 2019-08-15
### Added
- CalendarProvider - today button size for tablet. 
  Passing style prop to a container View.
- ExpandableCalendar - adjusting vertical mode open height for tablet in both orientations.

## [1.209.0] - 2019-08-20
### Fix
- CalendarProvider - fix for children wrapper view.

## [1.213.0] - 2019-11-13
### Changed
- Upgrading react-native to version 61.4.0.

## [1.214.0] - 2019-12-12
### Fix
- Agenda - fix typo on 'scrollEnable' prop.
- ExpandableCalendar - fix passed props to CalendarList.

## [1.215.0] - 2019-12-23
### Added
- ExpandableCalendar - adding week scroll to closed position.

## [1.216.0] - 2019-12-24
### Fix
- Week - moving width style to style file.

## [1.217.0] - 2019-12-24
### Fix
- Week - moving width style to WeekCalendar.
