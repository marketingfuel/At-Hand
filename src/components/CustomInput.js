import React from 'react';
import { StyleSheet, TextInput, View, Text } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import COLORS from '../config/COLORS';
import Font from '../config/Font';

const CustomInput = (props) => {
  return (
    <View>
      <Text style={styles.headingText}>{props.title}</Text>
      <TextInput
        style={[styles.input,{height:props.height ? props.height : hp('6%')}]}
        multiline={props.multiline}
        placeholderTextColor={COLORS.grayniteGray}
        numberOfLines={props.numberOfLines}
        placeholder={props.placeholder}
        keyboardType={props.keyboardType}
        defaultValue={props.defaultValue}
        onChangeText={props.onChangeText}
        onBlur={props.onBlur}
        secureTextEntry={props.secureTextEntry}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  input: {
    width: wp('85%'),
    alignSelf: 'center',
    height: hp('6%'),
    minHeight:hp('6%'),
    fontSize: hp('2%'),
    fontFamily: Font.regular,
    color: COLORS.black,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    borderColor: COLORS.grayniteGray,
    borderWidth: 0.5,
    marginTop: hp('0.5%'),
    paddingHorizontal: wp('2.5%'),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
    textAlignVertical: 'top',
  },
  headingText: {
    width: wp('85%'),
    alignSelf: 'center',
    fontSize: hp('2%'),
    fontFamily: Font.medium,
    color: COLORS.black,
  },
});
export default CustomInput;
