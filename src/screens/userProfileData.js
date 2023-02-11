import React, { useState,useContext } from 'react';
import { StyleSheet, SafeAreaView, ScrollView, StatusBar, TouchableOpacity, View, Alert } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import COLORS from '../config/COLORS';
import animation from '../config/animation';
import Font from '../config/Font';
import axios from 'axios';
import { AuthContext } from '../context/context';

const UserProfileData = ({ navigation }) => {
    const [Loader, setLoader] = useState(false);
    const [loading, setLoading] = useState(false);
    const { signOut } = useContext(AuthContext)
    const [user_details, setUserDetails] = useState('');

    useFocusEffect(
        React.useCallback(() => {
            getUserDetails()
        }, [userInfoData])
    )

    const userInfoData = (user_info) => {
        setUserDetails(user_info)
    }

    const getUserDetails = async () => {
        let userToken = await AsyncStorage.getItem('userToken');
        let userId = await AsyncStorage.getItem('userId');
        setLoading(true)
        const res = await axios.get(`https://propertyunkeeptest.marketingfuel.org/api/get-profile-detail?id=${userId}`,
            {
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${userToken}`
                },
            })
            .then(res => {
                if (res.data.success === true) {
                    setLoading(false);
                    userInfoData(res.data.data)
                } else {
                    setLoading(false)
                    Alert.alert("Network or server Error",)
                }
            }
            )
            .catch(err => {
                signOut();
                setLoading(false)
            }
            )
    }
    return (
        <SafeAreaView style={styles.main}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
            <ScrollView keyboardShouldPersistTaps="handled">
                <View style={styles.headerView}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ width: wp('95%'), alignSelf: 'center' }}>
                        <Animatable.Text animation={animation.fade} style={styles.logoutText}>
                            Cancel
                        </Animatable.Text>
                    </TouchableOpacity>
                </View>
                <Animatable.Text animation={animation.fade} style={styles.heading}>
                    Profile
                </Animatable.Text>
                {
                    loading ? (
                        <ActivityIndicator
                            size="large"
                            color={COLORS.primary}
                            style={{ height: hp('80%'), justifyContent: 'center', alignSelf: 'center' }}
                        />
                    ) : (
                        <Animatable.View>
                            <Animatable.Text>
                                Name
                            </Animatable.Text>
                        </Animatable.View>
                    )
                }
            </ScrollView>
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    main: {
        width: wp('100%'),
        height: hp('100%'),
        backgroundColor: COLORS.white
    },
    headerView: {
        width: wp('100%'),
        height: hp('6%'),
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomColor: COLORS.grayniteGray,
        borderBottomWidth: 0.5
    },
    logoutText: {
        fontSize: hp('2%'),
        fontFamily: Font.medium,
        color: COLORS.primary,
        textAlign: 'right',
        alignSelf: 'flex-end',
    },
    heading: {
        width: wp('85%'),
        alignSelf: 'center',
        fontSize: hp('2.5%'),
        marginTop: hp('2%'),
        color: COLORS.primary,
        fontFamily: Font.bold
    },
    emailInput: {
        marginTop: hp('2%')
    },
    btn: {
        marginTop: hp('4%'),
        backgroundColor: COLORS.primary
    }
})
export default UserProfileData;
