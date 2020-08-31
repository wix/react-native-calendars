import React, { useState } from 'react';
import { View, Text, Animated } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import styled, { withTheme } from 'styled-components';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

const AnimatedSdgList = ({ theme, children, buttonTitle, sectionHeight }) => {
  const [isOpen, setIsOpen] = useState(true);
  const height = new Animated.Value(wp('5%'));
  const [animVal] = useState(height);

  const handleArrowClick = () => {
    setTimeout(() => {
      setIsOpen(!isOpen);
    }, 100);
    if (!isOpen) {
      Animated.spring(animVal, {
        toValue: wp('5%'),
        speed: 20,
        bounciness: 6,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.spring(animVal, {
        toValue: wp(sectionHeight),
        speed: 10,
        bounciness: 10,
        useNativeDriver: false,
      }).start();
    }
  };

  return (
    <OuterView>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => handleArrowClick()}
        style={{ flexDirection: 'row' }}
      >
        <ActionDetailsButtonView>
          <ActionDetailsText>{buttonTitle}</ActionDetailsText>
          <Ionicons
            name={isOpen ? 'ios-arrow-down' : 'ios-arrow-up'}
            color={theme.colors.palette.skyBlue}
            size={wp('5%')}
          />
        </ActionDetailsButtonView>
      </TouchableOpacity>
      <AnimatedView style={{ height: animVal }}>{!isOpen && children}</AnimatedView>
    </OuterView>
  );
};

const OuterView = styled.View`
  flex: 1;
`;

const ActionDetailsButtonView = styled.View`
  flex: 1;
  height: ${wp('6%')};
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  border-radius: 4px;
  padding-horizontal: ${wp('5%')};
  margin-vertical: 3px;
`;

const ActionDetailsText = styled.Text`
  font-family: ${(props) => props.theme.typography.fontFamily.defaultBold};
  font-size: ${(props) => props.theme.typography.h5.fontSize};
  color: ${(props) => props.theme.colors.palette.text.primaryBlack};
  text-transform: capitalize;
`;

const AnotherView = styled.View`
  flex: 1;
`;
const AnimatedView = Animated.createAnimatedComponent(AnotherView);

export default withTheme(AnimatedSdgList);
