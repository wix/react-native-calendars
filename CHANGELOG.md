# Changelog

## [1.188.0] - 2019-6-16

### Added

- AgendaList - invoking used SectionList's events.

### Removed

- ExpandableCalendar screen - removing unnecessary 'data' prop sent to AgendaList.

## [1.189.0] - 2019-6-24

### Bug Fix

- CalendarProvider - fix for 'date' prop update.

## [1.190.0] - 2019-6-24

### Added

- CalendarContext - 'disabledOpacity' prop to control the opacity of the today button when it is disabled (default is now undefined, meaning no opacity).
- src/style.js - adding support for today button's font size, weight, family.

### Bug Fix

- CalendarContext - fix for today button's width to allow button to take content's width.

## [1.191.0] - 2019-6-24

### Bug Fix

- ExpandableCalendar - limit calendar min height to closed height.

## [1.192.0] - 2019-6-25

### Fix

- CalendarProvider - fix for warning on Image 'source' type.
- ExpandableCalendar - fix shadow/elevation style.

## [1.193.0] - 2019-6-26

### Bug Fix

- ExpandableCalendar - fix for week paddings. Changing knob container height and weekDays style.
- CalendarList/item - limit 'headerStyle' to horizontal only.

## [1.194.0] - 2019-6-30

### Added

- CalendarProvider - 'onMonthChange' event returning date object and updateSource.

## [1.195.0] - 2019-7-04

### Changed

- Components' props comment format.

## [1.196.0] - 2019-7-04

### Added

- CalendarList - passing 'testID' to static CalendarHeader.

## [1.197.0] - 2019-7-14

### Added

- asCalendarConsumer - hoist non-react statics.

## [1.198.0] - 2019-7-14

### Fix

- ExpandableCalendar - fix example screen.

## [1.199.0] - 2019-7-18

### Changed

- CalendarHeader - editing 'testID' for static CalendarHeader.

## [1.200.0] - 2019-7-18

### Added

- ExpandableCalendar - adding 'testID' for knob.

## [1.201.0] - 2019-7-25

### Changed

- eslint - updating to version 6.1.0.
- lodash - importing library instead of sub-libraries.

## [1.202.0] - 2019-7-25

### Added

- CalendarHeader - adding 'firstDay' (PR #826), 'monthFormat' (PR #787) and 'weekNumbers' to shouldComponentUpdate.
- Agenda - adding support for weekdays name's 'fontSize', 'fontFamily' and 'fontWeight' (PR #711).
- ReservationList - adding support for Day number's 'fontFamily', and to Day text's 'fontFamily' and 'fontWeight' (PR #711).

## [1.203.0] - 2019-7-31

### Fix

- ExpandableCalendar - fix for vertical open height.

## [1.204.0] - 2019-8-6

### Fix

- CalendarProvider - adding 'buttonTopPosition' prop to control the button's y position.

## [1.205.0] - 2019-8-15

### Fix

- Week - fix for style - removing width to allow flex.

## [1.206.0] - 2019-8-15

### Fix

- CalendarProvider - fix header in vertical mode when initial position is 'open'.

## [1.207.0] - 2019-8-15

### Added

- CalendarProvider - 'todayButtonStyle' prop to allow passing style to the today button.

## [1.208.0] - 2019-8-15

### Added

- CalendarProvider - today button size for tablet.
  Passing style prop to a container View.
- ExpandableCalendar - adjusting vertical mode open height for tablet in both orientations.

## [1.209.0] - 2019-8-20

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

## [1.218.0] - 2020-1-12

### Added

- AgendaList - allow text transform override for section header text.

## [1.221.0] - 2020-1-16

### Bug Fix

- ExpandableCalendar - fix 'renderArrow' (PR #1037).

## [1.223.0] - 2020-1-16

### Added

- WeekCalendar - new component.

## [1.224.0] - 2020-1-16

### Added

- AgendaList - allow passing 'keyExtractor'.

## [1.225.0] - 2020-1-19

### Bug Fix

- package.json - adding 'hoist-non-react-statics' dependency (fix issue #900).

## [1.226.0] - 2020-1-19

### Added

- Life cycle methods - renaming with UNSAFE\_ prefix 'componentWillMount()' and 'componentWillReceiveProps()'.

## [1.227.0] - 2020-1-19

### Added

- AgendaList - allow passing 'stickySectionHeadersEnabled' (PR #1004).

## [1.228.0] - 2020-1-19

### Bug Fix

- Day custom - fix for 'selectedDayTextColor' not working (PR #995).

## [1.229.0] - 2020-1-19

### Added

- Calendar - adding ref to CalendarHeader (PR #986).

## [1.230.0] - 2020-1-19

### Fix

- Agenda - fix for calendar offset (PR #953).

## [1.231.0] - 2020-1-19

### Change

- Agenda - use 'initialScrollPadPosition()' (PR #948).

## [1.232.0] - 2020-1-19

### Bug Fix

- Day components - fix for 'disableTouchEvent' marking to disable interactions for all marking types.

## [1.233.0] = 2020-1-19

### Added

- Calendar - update when 'displayLoadingIndicator' changes (PR #939).

## [1.234.0] - 2020-1-19

### Fix

- Calendar and README - typo (PR #).

## [1.235.0] - 2020-1-19

### Fix

- README - typo (Pr #912).

## [1.236.0] - 2020-1-20

### Changed

- Agenda - 'scrollEventThrottle' from 1 to 8 (Pr #908).

## [1.237.0] - 2020-1-20

### Added

- CalendarHeader - re-render when 'renderArrow' changes (PR #907).

## [1.238.0] - 2020-1-20

### Added

- CalendarList - pass 'onEndReached' and 'onEndReachedThreshold' to FlatList (PR #893).

## [1.239.0] - 2020-1-20

### Added

- CalendarList - pass 'keyExtractor' (PR #883).

## [1.240.0] - 2020-1-20

### Added

- Day - adding 'onLongPress' support to type multi-period.

## [1.241.0] - 2020-1-20

### Fix

- README - add 'disabledByDefault' prop (Pr #774).

## [1.242.0] - 2020-1-20

### Added

- Agenda - invoking 'onVisibleMonthsChange()' directly (PR #746).

## [1.243.0] - 2020-1-20

### Added

- Calendar - adding 'disableArrowLeft' and 'disableArrowRight' (PR #530).

## [1.244.0] - 2020-1-20

### Added

- Agenda - allow showing extra days (by passing hideExtraDays={false}).

### Changed

- Calendars screen - remove redundant prop.

## [1.245.0] - 2020-1-21

### Changed

- README - editing.

## [1.246.0] - 2020-1-21

### Changed

- Example - refresh demo app style.

## [1.247.0] - 2020-1-22

### Added

- iOS - app icon.

## [1.248.0] - 2020-1-22

### Changed

- iOS - demo app name.

## [1.249.0] - 2020-1-22

### Added

- CalendarList - passing 'keyboardShouldPersistTaps' to FlatList.

## [1.250.0] - 2020-1-22

### Added

- Agenda - passing 'testId' to knob.

## [1.251.0] - 2020-1-22

### Bug Fix

- CalendarList - 'keyboardShouldPersistTaps' PropTypes.

## [1.252.0] - 2020-1-22

### Changed

- Agenda - Animated.ScrollView invoke 'scrollTo' using ref.getNode() for RN62 compatibility (PR #1040).

## [1.253.0] - 2020-1-23

### Added

- CalendarHeader - 'aria-level' for web accessability support (PR #792).

## [1.254.0] - 2020-1-23

### Added

- ExpandableCalendar - default value to height style to avoid NaN value (PR #1044).

## [1.255.0] - 2020-1-23

### Added

- .eslintrc - new roles.
- src files - fix lint errors.

## [1.256.0] - 2020-1-23

### Fix

- README - fix examples.

## [1.257.0] - 2020-1-23

### Bug fix

- Reservation - secure calls to prop functions to avoid crashes.

## [1.258.0] - 2020-1-25

### Fix

- file cosmetics.

## [1.259.0] - 2020-1-25

### Added

- Android - app icon and demo app name.

## [1.260.0] - 2020-2-3

### Fix

- Fix app icon.

## [1.261.0] - 2020-2-5

### Added

- Calendar - adding accessibility features.

## [1.262.0] - 2020-2-18

### Added

- Agenda - adding scroll events callbacks (PR #1063).

## [1.263.0] - 2020-2-18

### Added

- Calendar - passing testID to header (PR #1058).

## [1.264.0] - 2020-3-3

### Bug fix

- CalendarListItem - fix previous months bug (PR #1069).

## [1.265.0] - 2020-3-12

### Added

- Setup Detox for e2e tests (iOS).

## [1.282.0] - 2020-6-4

### New Feature

- Calendar - enable swipe.

## [1.291.0] - 2020-6-10

### New Feature

- Calendar - render custom header.

## [1.292.0] - 2020-6-10

### New Feature

- Calendar - show should show six weeks by passing 'showSixWeeks'.

## [1.297.0] - 2020-6-17

### Bug fix

- Calendar isn't getting re-rendered if the first day prop is changed.

## [1.298.0] - 2020-6-17

### New Feature

- Calendar - control the swipe with new 'enableSwipeMonths' prop.

## [1.299.0] - 2020-8-5

### Fix

- Android RNN version and configuration (PR #1251).

## [1.300.0] - 2020-8-5

### Fix

- ExpandableCalendar and AgendaList RTL style.

## [1.309.0] - 2020-8-12

### Fix

- AgendaList - check 'dayFormat' prop before passing to XDate.toString().

## [1.310.0] - 2020-8-13

### Fix

- Calendar - remove default gesture wrapper (PR #1248).

## [1.311.0] - 2020-8-13

### Fix

- Fix E2E tests (PR #1255).

## [1.312.0] - 2020-8-13

### Added

- Test E2E on CI (PR #1264).

## [1.313.0] - 2020-8-16

### Added

- Prettier (PR #1265).

## [1.314.0] - 2020-8-16

### Fix

- Fix iOS example bundle identifier.
- ExpandableCalendar style - using I18nManager from common constants.

### Added

- Updating CHANGELOG.
- Configuring github stale bot.

## [1.315.0] - 2020-8-23

### Added

- AgendaList - adding 'useMoment' to allow using moment.js for section header's date string formatting.

## [1.316.0] - 2020-8-27

### Fix

- Calendar Header - fix issue on 'react-native-web' where the calendar arrows were not appearing (PR #934).

## [1.334.0] - 2020-8-29

### Fix

- Calendar Header style - fix for arrows not showing in mobile due to PR #934.

## [1.340.0] - 2020-8-30

### Fix

- README - edit (PR #1219).

## [1.344.0] - 2020-9-3

### Added

- Calendar - adding 'customHeader' prop (PR #1225).

## [1.404.0] - 2020-11-24

- Moving inline styles to StyleSheets.

## [1.406.0] - 2020-11-24

- Unify library code - this.styles to this.style.

## [1.407.0] - 2020-11-26

### Fix

- Calendar - fix for 'disableArrowLeft', 'disableArrowRight' update (PR #1309).

## [1.490.0] - 2020-11-29

### Added

- AgendaList - allow passing 'renderSectionHeader' prop (PR #1306).

## [1.491.0] - 2020-11-29

### Added

- Agenda - add 'showOnlySelectedDayItems' prop (PR #1317).

## [1.492.0] - 2020-11-29

### Fix

- example - fix formatting.

## [1.493.0] - 2020-11-29

### Fix

- CalendarList - Forwarding missing 'disabledDaysIndexes' prop from CalendarListItem to Calendar (PR #1323).

## [1.494.0] - 2020-11-29

- Code cleanup.

## [1.494.0] - 2020-11-29

### Added

- why-did-you-render setup.

## [1.495.0] - 2020-12-01

- Edit README.

## [1.496.0] - 2020-12-02

- AgendaList, ExpandableCalendar, WeekCalendar - adding a note to wrap with CalendarProvider.

## [1.497.0] - 2020-12-02

### Fix

- Day multi-period - Fix day text align on multi-period (PR #1344).

## [1.498.0] - 2020-12-02

### Added

- ExpandableCalendar - added 'onCalendarToggled' prop (PR #1334).

## [1.499.0] - 2020-12-02

### Added

- Detox configuration - run on iOS 13.7 simulator to fix CI builds.

## [1.500.0] - 2020-12-02

### Fix

- CalendarHeader - Fix alignment for 'showWeekNumbers'.
