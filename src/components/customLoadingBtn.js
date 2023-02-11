import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import animation from '../config/animation';
const CustomLoadingBtn = (props) => {
    return (
        <View animation={animation.fade} style={{ ...styles.btn, ...props.style }}>
            <ActivityIndicator
                size="small"
                size={props.size}
                color={props.color}
                style={{ justifyContent: 'center' }}
            />
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
})
export default CustomLoadingBtn;
