import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Feather from 'react-native-vector-icons/Feather';
import COLORS from '../config/COLORS';
import Font from '../config/Font';
const CustomEmptyCard = (props) => {
    return (
        <View>
            <TouchableOpacity style={styles.emptyCard} activeOpacity={0.8} onPress={props.onPress}>
                <Feather
                    name='folder-plus'
                    size={50}
                    color={COLORS.grayniteGray}
                    style={{ alignSelf: 'center' }}
                />
                <Text style={styles.btnText} >
                    {"Sorry You have not reported any issue. Click here to report an issue"}
                </Text>
            </TouchableOpacity>
        </View>
    );
};
const styles = StyleSheet.create({
    emptyCard: {
        width: wp('90%'),
        height: hp('40%'),
        alignSelf: 'center',
        justifyContent: 'center',
        marginTop: hp('20%'),
        backgroundColor: COLORS.white,
        borderRadius: 16,
        shadowColor: "#636363",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4.65,
        elevation: 10,
        marginBottom: hp('2%')
    },
    icon: {
        height: hp('6%'),
        width: wp('12%'),
        alignSelf: 'center',
    },
    btnText: {
        width: wp('80%'),
        textAlign: 'center',
        alignSelf: 'center',
        fontSize: hp('2%'),
        color: COLORS.grayniteGray,
        fontFamily: Font.regular,
        marginTop: hp('2%')
    }
})
export default CustomEmptyCard;
