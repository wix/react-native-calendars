import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import PropTypes from 'prop-types';

class CalendarFooterComponent extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const highDemandImage = require('../images/high-demand.png');

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.iconInfo}>
            <View style={[styles.soldOutCircle, styles.circle]} />
            <Text style={[styles.infoText, styles.red]}>ROOMS SOLD OUT</Text>
          </View>
          <View style={styles.iconInfo}>
            <View style={[styles.blockedCircle, styles.circle]} />
            <Text style={styles.infoText}>BLOCKED</Text>
          </View>
          <View style={[styles.iconInfo, styles.highDemandInfo]}>
            <Image source={highDemandImage} style={styles.smallIcon} />
            <Text style={styles.infoText}>HIGH DEMAND</Text>
          </View>
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerText}>{this.props.calendarDateString}</Text>
        </View>
      </View>
    );
  }
}

CalendarFooterComponent.propTypes = {
  calendarDateString: PropTypes.string.isRequired
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#eceef1',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  iconInfo: {
    flexDirection: 'row',
    marginRight: 10,
    alignItems: 'center'
  },
  highDemandInfo: {
    marginRight: 0
  },
  infoText: {
    fontSize: 12,
    color: '#2D3332',
    marginLeft: 6
  },
  circle: {
    width: 12,
    height: 12,
    borderRadius: 50
  },
  soldOutCircle: {
    backgroundColor: '#e35052'
  },
  blockedCircle: {
    backgroundColor: '#c1c2c1'
  },
  footer: {
    marginTop: 12,
    marginBottom: 10
  },
  smallIcon: {
    width: 12,
    height: 12,
    marginLeft: 4
  },
  footerText: {
    color: '#2D3332',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 17
  },
  red: {
    color: '#e35052'
  }
});

export default CalendarFooterComponent;
