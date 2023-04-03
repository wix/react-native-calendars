---
sidebar_position: 1
---

[![Stand With Ukraine](https://raw.githubusercontent.com/vshymanskyy/StandWithUkraine/main/banner2-direct.svg)](https://stand-with-ukraine.pp.ua)

# React Native Calendars 🗓️ 📆

## A declarative cross-platform React Native calendar component for iOS and Android.

[![Version](https://img.shields.io/npm/v/react-native-calendars.svg)](https://www.npmjs.com/package/react-native-calendars)
[![Build Status](https://travis-ci.org/wix/react-native-calendars.svg?branch=master)](https://travis-ci.org/wix/react-native-calendars)

<br/>

This module includes information on how to use this customizable **React Native** calendar component.

The package is compatible with both **Android** and **iOS**

<br/>

## Features ✨

- Pure JS. No Native code required
- Date marking - dot, multi-dot, period, multi-period and custom marking
- Customization of style, content (days, months, etc) and dates
- Detailed documentation and examples
- Swipeable calendar with flexible custom rendering
- Scrolling to today, selecting dates, and more
- Allowing or blocking certain dates
- Accessibility support
- Automatic date formatting for different locales

## Try it out ⚡

You can run a sample module using these steps:

```
$ git clone git@github.com:wix/react-native-calendars.git

$ cd react-native-calendars

$ npm install

$ cd ios && pod install && cd ..

$ react-native run-ios
```

You can check example screens source code in [example module screens](https://github.com/wix-private/wix-react-native-calendar/tree/master/example/src/screens)

This project is compatible with Expo/CRNA (without ejecting), and the examples have been [published on Expo](https://expo.io/@community/react-native-calendars-example)

## Getting Started 🔧

Here's how to get started with react-native-calendars in your React Native project:

### Install the package:

Using `npm`:

```
$ npm install --save react-native-calendars
```

Using `Yarn`:

```
$ yarn add react-native-calendars
```

**RN Calendars is implemented in JavaScript, so no native module linking is required.**

<br/>

## Usage Example

<br/>

`import {[Calendar](#calendar), [CalendarList](#calendarlist), [Agenda](#agenda)} from 'react-native-calendars';`

All parameters for components are optional. By default the month of current local date will be displayed.

Event handler callbacks are called with `calendar objects` like this:

```javascript
{
  day: 1,      // day of month (1-31)
  month: 1,    // month of year (1-12)
  year: 2017,  // year
  timestamp,   // UTC timestamp representing 00:00 AM of this date
  dateString: '2016-05-13' // date formatted as 'YYYY-MM-DD' string
}
```

Parameters that require date types accept `YYYY-MM-DD` formatted `date-strings`, JavaScript date objects, `calendar objects` and `UTC timestamps`.

Calendars can be localized by adding custom locales to `LocaleConfig` object:

```javascript
import {LocaleConfig} from 'react-native-calendars';

LocaleConfig.locales['fr'] = {
  monthNames: [
    'Janvier',
    'Février',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juillet',
    'Août',
    'Septembre',
    'Octobre',
    'Novembre',
    'Décembre'
  ],
  monthNamesShort: ['Janv.', 'Févr.', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'],
  dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
  dayNamesShort: ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'],
  today: "Aujourd'hui"
};
LocaleConfig.defaultLocale = 'fr';
```

## Authors

- [Tautvilas Mecinskas](https://github.com/tautvilas/) - Initial code - [@tautvilas](https://twitter.com/Tautvilas)
- Katrin Zotchev - Initial design - [@katrin_zot](https://twitter.com/katrin_zot)

- [Inbal Tish](https://github.com/Inbal-Tish) - Main maintainer

See also the list of [contributors](https://github.com/wix/react-native-calendar-components/contributors) who participated in this project.

## Contributing

Pull requests are most welcome!
Please `npm run test` and `npm run lint` before push.
Don't forget to add a **title** and a **description** that explain the issue you're trying to solve and your suggested solution.
Screenshots and gifs are VERY helpful.
Please do NOT format the files as we are trying to keep a unified syntax and the reviewing process fast and simple.

## License

React Native Calendars is MIT licensed
