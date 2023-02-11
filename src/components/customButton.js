import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import COLORS from '../config/COLORS';
import Font from '../config/Font';
const CustomButton = (props) => {
    return (
        <View>
            <TouchableOpacity onPress={props.onPress} style={{ ...styles.btn, ...props.style }} >
                <Text style={styles.btnText}>
                    {props.title}
                </Text>
            </TouchableOpacity>
        </View>
    );
};
const styles = StyleSheet.create({
    btn: {
        width: wp('85%'),
        height: hp('7%'),
        justifyContent: 'center',
        alignSelf: 'center',
        borderRadius: 8,
        marginTop: hp('2%'),
        shadowColor: "#636363",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4.65,
        elevation: 10,
    },
    btnText: {
        fontSize: hp('2.5%'),
        fontFamily: Font.bold,
        color: COLORS.white,
        textAlign: 'center',
        alignSelf: 'center',
    }
})
export default CustomButton;
