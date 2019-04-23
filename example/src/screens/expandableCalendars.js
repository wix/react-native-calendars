import _ from 'lodash';
import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  SectionList,
  Text,
  TouchableOpacity,
  Button
} from 'react-native';
import {Calendar, ExpandableCalendar} from 'react-native-calendars';


// const data = [
//   {date: '2019-04-22', hour: '4pm', duration: '1h', title: 'Pilates ABC'},
//   {date: '2019-04-22', hour: '5pm', duration: '1h', title: 'Vinyasa Yoga'},
//   {date: '2019-04-23', hour: '1pm', duration: '1h', title: 'Ashtanga Yoga'},
//   {date: '2019-04-23', hour: '2pm', duration: '1h', title: 'Deep Streches'},
//   {date: '2019-04-23', hour: '3pm', duration: '1h', title: 'Private Yoga'},
//   {date: '2019-04-24', hour: '12am', duration: '1h', title: 'Ashtanga Yoga'},
//   {date: '2019-04-25', hour: '8pm', duration: '1h', title: 'Vinyasa Yoga for Beginners'},
//   {date: '2019-04-26', hour: '9pm', duration: '1h', title: 'Pilates Reformer'},
//   {date: '2019-04-26', hour: '10pm', duration: '1h', title: 'Ashtanga'},
//   {date: '2019-04-26', hour: '11pm', duration: '1h', title: 'TRX'},
//   {date: '2019-04-26', hour: '12pm', duration: '1h', title: 'Running Group'},
//   {}
// ];

const data = [
  {date: '2019-04-22', items: [{hour: '4pm', duration: '1h', title: 'Pilates ABC'}, {hour: '5pm', duration: '1h', title: 'Vinyasa Yoga'}]},
  {date: '2019-04-23', items: [{hour: '1pm', duration: '1h', title: 'Ashtanga Yoga'}, {hour: '2pm', duration: '1h', title: 'Deep Streches'}, {hour: '3pm', duration: '1h', title: 'Private Yoga'}]},
  {date: '2019-04-24', items: [{hour: '12am', duration: '1h', title: 'Ashtanga Yoga'}]},
  {date: '2019-04-25', items: [{}]},
  {date: '2019-04-26', items: [{hour: '9pm', duration: '1h', title: 'Pilates Reformer'}, {hour: '10pm', duration: '1h', title: 'Ashtanga'}, {hour: '11pm', duration: '1h', title: 'TRX'}, {hour: '12pm', duration: '1h', title: 'Running Group'}]},
];

export default class ExpandableCalendarsScreen extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      
    };
  }

  // getSections() {
  //   let sectionTitle;
  //   const sections = _.compact(_.map(data, (item) => {
  //     if (sectionTitle !== item.date) {
  //       sectionTitle = item.date;
  //       const items = _.filter(data, {'date': sectionTitle});
  //       if (!items) {
  //         return {title: sectionTitle, data: {}};
  //       }
  //       return {title: sectionTitle, data: items};
  //     }
  //   }));
  //   return sections;
  // }

  getSections() {
    const sections = _.compact(_.map(data, (item) => {
      return {title: item.date, data: item.items};
    }));
    return sections;
  }

  onViewableItemsChanged = (data) => {
    if (data) {
      const topSection = _.get(data.viewableItems[0], 'section.title');
      if (topSection !== this._topSection) {
        this._topSection = topSection;
        // console.log('INBAL this._topSection: ', this._topSection);
        // Report date change
      }
    }
  }

  renderEmptyItem() {
    return <View style={{height: 70, backgroundColor: '#ffce5c'}}/>;
  }

  renderItem = ({item}) => {
    if (_.isEmpty(item)) {
      return this.renderEmptyItem();
    }
    const id = item.title;
    const props = {
      hour: item.hour,
      duration: item.duration,
      title: item.title,
      button: {label: 'info', onPress: () => alert('show more')},
      onPress: () => alert(id),
    };
    return (
      <TouchableOpacity 
        onPress={props.onPress} 
        style={{padding: 12, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: 'grey', flexDirection: 'row'}}
      >
        <View>
          <Text style={{color: 'black'}}>{props.hour}</Text>
          <Text style={{color: 'grey', fontSize: 12, marginTop: 4}}>{props.duration}</Text>
        </View>
        <Text style={{color: 'black', marginLeft: 16, fontWeight: 'bold', fontSize: 16}}>{props.title}</Text>
        <View style={{flex: 1, alignItems: 'flex-end'}}>
          <Button title={props.button.label} onPress={props.button.onPress}/>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <ExpandableCalendar/>
        <SectionList
          // style={{borderWidth: 1}}
          data={data}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => String(index)}
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled
          renderSectionHeader={({section: {title}}) => (
            <Text style={{fontWeight: 'bold', padding: 6, backgroundColor: 'grey', color: 'white'}}>{title}</Text>
          )}
          sections={this.getSections()}
          onViewableItemsChanged={this.onViewableItemsChanged}
          viewabilityConfig={{
            itemVisiblePercentThreshold: 10 //50 means if 50% of the item is visible
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#d9e1e8'
  }
});
