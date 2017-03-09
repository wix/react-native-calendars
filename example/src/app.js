import {Navigation} from 'react-native-navigation';
import {registerScreens} from './screens';
registerScreens();

Navigation.startSingleScreenApp({
  screen: {
    screen: 'Menu',
    title: 'WixCal',
  },
  appStyle: {
    navBarBackgroundColor: '#00adf5',
    navBarTextColor: 'white',
    navBarButtonColor: '#ffffff',
    statusBarTextColorScheme: 'light'
  }
});