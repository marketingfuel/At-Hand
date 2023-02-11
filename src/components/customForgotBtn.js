import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import COLORS from '../config/COLORS';
import Font from '../config/Font';
const CustomForgotBtn = (props) => {
    return (
        <View>
            <TouchableOpacity onPress={props.onPress} >
                <Text style={styles.btnText}>
                    {props.title}
                </Text>
            </TouchableOpacity>
        </View>
    );
};
const styles = StyleSheet.create({
    btnText: {
        fontSize: hp('2%'),
        fontFamily: Font.medium,
        color: COLORS.primary,
        marginTop: hp('1%'),
        textAlign: 'right',
        marginRight: wp('7.5%')
    }
})
export default CustomForgotBtn;
