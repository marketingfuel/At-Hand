import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Font from '../config/Font';
const CustomHeading = (props) => {
    return (
        <Text style={{ ...styles.heading, ...props.style }}>
            {props.title}
        </Text>
    );
};
const styles = StyleSheet.create({
    heading: {
        fontSize: hp('3%'),
        fontFamily: Font.medium,
        alignSelf: "center"
    }
})
export default CustomHeading;
