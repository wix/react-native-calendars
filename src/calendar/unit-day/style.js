import {StyleSheet} from 'react-native';
import * as appStyle from '../../style';

const FILLER_HEIGHT = 34;

export default StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    alignSelf: 'stretch',
    marginLeft: -1
  },
  base: {
    //borderWidth: 1,
    width: 38,
    height: FILLER_HEIGHT,
    alignItems: 'center'
  },
  fillers: {
    position: 'absolute',
    height: FILLER_HEIGHT,
    flexDirection: 'row',
    left: 0,
    right: 0
  },
  leftFiller: {
    height: FILLER_HEIGHT,
    flex: 1
  },
  rightFiller: {
    height: FILLER_HEIGHT,
    flex: 1
  },
  text: {
    marginTop: 7,
    fontSize: 16,
    fontWeight: '300',
    color: '#2d4150',
    backgroundColor: 'rgba(255, 255, 255, 0)'
  },
  todayText: {
    fontWeight: '500',
    //color: appStyle.text.linkColor
  },
  disabledText: {
    color: appStyle.text.disabledText
  },
  quickAction: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#c1e4fe'
  },
  quickActionText: {
    marginTop: 6,
    color: appStyle.text.color
  },
  firstQuickAction: {
    backgroundColor: appStyle.text.linkColor
  },
  firstQuickActionText: {
    color: 'white'
  },
  naText: {
    color: '#b6c1cd'
  }
});

