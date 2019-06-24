# Changelog

## [1.188.0] - 06-16-2019
### Added
- src/expandableCalendar/AgendaList.js invoking used SectionList's events.
### Removed
- example/src/screens/ExpandableCalendar.js - removing unnecessary 'data' prop sent to AgendaList.


## [1.189.0] - 06-24-2019
### Bug Fix
- CalendarProvider: fix for 'date' prop update.

## [1.190.0] - 06-24-2019
### Added
- CalendarContext - 'disabledOpacity' prop to control the opacity of the today button when it is disabled (default is now undefined, meaning no opacity).
- src/style.js - adding support for today button's font size, weight, family.
### Bug Fix
- CalendarContext - fix for today button's width to allow button to take content's width.
