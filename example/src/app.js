import {Navigation} from 'react-native-navigation';
import {registerScreens} from './screens';
registerScreens();

// eslint-disable-next-line no-console
console.ignoredYellowBox = ['Remote debugger'];

/*
import {LocaleConfig} from 'react-native-calendars';

LocaleConfig.locales['fr'] = {
  monthNames: ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'],
  monthNamesShort: ['Janv.','Févr.','Mars','Avril','Mai','Juin','Juil.','Août','Sept.','Oct.','Nov.','Déc.'],
  dayNames: ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'],
  dayNamesShort: ['Dim.','Lun.','Mar.','Mer.','Jeu.','Ven.','Sam.']
};

LocaleConfig.defaultLocale = 'fr';
*/

Navigation.startSingleScreenApp({
  screen: {
    screen: 'Menu',
    title: 'WixCal',
  },
  appStyle: {
    navBarBackgroundColor: '#00adf5',
    navBarTextColor: 'white',
    navBarButtonColor: '#ffffff',
    statusBarTextColorScheme: 'light',
    autoAdjustScrollViewInsets: true
  }
});