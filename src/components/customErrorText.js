import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Font from '../config/Font';
const CustomErrorText = (props) => {
    return (
        <Text style={{ ...styles.errorText, ...props.style }}>
            {props.title}
        </Text>
    );
};
const styles = StyleSheet.create({
    errorText: {
        width: wp('85%'),
        alignSelf: "center",
        fontSize: hp('1.5%'),
        fontFamily: Font.medium,
        color: 'red',
        marginTop: hp('0.5%'),
        textAlign: 'left'
    },
})
export default CustomErrorText;
