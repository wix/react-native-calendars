import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const Container = ({title, children}) => (
  <View style={styles.container}>
    {children}
    <Text style={styles.title}>{title}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingLeft: 20,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {marginLeft: 4},
});

export default Container;
