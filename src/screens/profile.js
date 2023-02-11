import React, { useState, useEffect,useContext } from 'react';
import { StyleSheet, SafeAreaView, ScrollView, StatusBar, TouchableOpacity, View, Alert, Text, Image } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native-paper';
import { Formik } from 'formik';
import COLORS from '../config/COLORS';
import Font from '../config/Font';
import * as ImagePicker from 'react-native-image-picker';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import CustomInput from '../components/CustomInput';
import CustomErrorText from '../components/customErrorText';
import { ProfileValidation } from '../utils/validation';
import CustomButton from '../components/customButton';
import CustomLoadingBtn from '../components/customLoadingBtn';
import axios from 'axios';
import { AuthContext } from '../context/context';

const options = {
    title: 'Select Image',
    type: 'library',
    options: {
        maxHeight: 200,
        maxWidth: 200,
        selectionLimit: 1,
        mediaType: 'photo',
        includeBase64: false,
    }
}

const Profile = ({ navigation }) => {
    const baseURL = 'https://propertyupkeepmanagement.com';
    const [Loader, setLoader] = useState(false);
    const [loading, setLoading] = useState(false);
    const [user_details, setUserDetails] = useState('');
    const { signOut } = useContext(AuthContext)
    const [photo, setPhotoURI] = useState(`${baseURL}${user_details.profile_pic}`);

    // useFocusEffect(
    //     React.useCallback(() => {
    //         getUserDetails()
    //     }, [userInfoData])
    // )
    useEffect(() => {
        getUserDetails()
    }, [])

    const openGallery = async () => {
        const images = await ImagePicker.launchImageLibrary(options, (response) => {
            if (response.didCancel) {
            } else {
                setPhotoURI(response.assets[0]);
            }
        })
    }

    const userInfoData = (user_info) => {
        setUserDetails(user_info)
    }

    const getUserDetails = async () => {
        let userToken = await AsyncStorage.getItem('userToken');
        let userId = await AsyncStorage.getItem('userId');
        setLoading(true)
        const res = await axios.get(`https://propertyupkeepmanagement.com/api/get-profile-detail?id=${userId}`,
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
    const DeleteAccount= async ()=>{
        let userId = await AsyncStorage.getItem('userId');
        let userToken = await AsyncStorage.getItem('userToken');
        console.log(userId);
        const res = await axios.get(`https://propertyupkeepmanagement.com/api/delete_account/${userId}`,
            {
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${userToken}`
                },
            })
            .then(res => {
                console.log(res);
                if (res.status === 200) {
                    setLoading(false);
                    signOut();
                } else {
                    setLoading(false)
                    Alert.alert("Network or server Error",)
                }
            }
            )
            .catch(err => {
                setLoading(false)
            }
            )
    }

    const UpdateProfile = async (values) => {
        let userToken = await AsyncStorage.getItem('userToken');
        let userId = await AsyncStorage.getItem('userId');
        setLoader(true);
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${userToken}`);
        var formdata = new FormData();
        formdata.append("name", values.fullName);
        formdata.append("phone", values.number);
        formdata.append("address", values.street);
        formdata.append("postal_code", values.postalCode);
        formdata.append("user_id", userId);
        formdata.append("trade_name", values.tradingName);
        formdata.append('profile_pic', photo === null ? 'null' :
            {
                uri: photo.uri,
                name: photo.fileName,
                type: photo.type,
            });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: formdata,
            redirect: 'follow'
        };

        fetch("https://propertyupkeepmanagement.com/api/update-profile", requestOptions)
            .then(response => response.text())
            .then(
                setLoader(false),
                Alert.alert('Update user details Successfully'),
                navigation.navigate("Home")
            )
            .catch(error => console.log('error', error));
    }
    return (
        <KeyboardAwareScrollView style={styles.main} showsVerticalScrollIndicator={true}>
            {
                loading ? (
                    <ActivityIndicator
                        size="small"
                        color={COLORS.primary}
                        style={{ height: hp('100%'), justifyContent: 'center', alignSelf: 'center' }}
                    />
                ) : (
                    <SafeAreaView>
                        <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
                        <ScrollView keyboardShouldPersistTaps="handled">
                                <View style={styles.headerView}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            Alert.alert(
                                                "Are your sure?",
                                                "Are you sure you want to remove this beautiful box?",
                                                [
                                                  {
                                                    text: "Yes",
                                                    onPress: () => {
                                                        DeleteAccount();
                                                    },
                                                  },
                                                  {
                                                    text: "No",
                                                  },
                                                ]
                                              );
                                        }}
                                        style={{ flex: 1 }}>
                                        <Text style={{ color: 'red' }}>
                                            Delete account
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => navigation.goBack()}
                                        style={{ flex: 1, }}>
                                        <Text style={styles.logoutText}>
                                            Cancel
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            <Text style={styles.heading}>
                                Profile
                            </Text>
                            {
                                photo === `${baseURL}` ? (
                                    <View style={styles.imgView} >
                                        <TouchableOpacity onPress={openGallery}>
                                            <Entypo
                                                name="plus"
                                                size={50}
                                                color={COLORS.gray52}
                                                style={{ alignSelf: 'center' }}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                ) : photo === `${baseURL}${user_details.profile_pic}`
                                    || photo === `${baseURL}undefined`
                                    ? (
                                        <View style={styles.imgView}>
                                            <Image
                                                source={{ uri: `${baseURL}${user_details.profile_pic}` }}
                                                resizeMode='cover'
                                                style={styles.image}
                                            />
                                            <View style={styles.cameraIcon}>
                                                <TouchableOpacity onPress={openGallery} >
                                                    <FontAwesome
                                                        name="camera"
                                                        size={22}
                                                        color={COLORS.primary}
                                                        style={{ alignSelf: 'center' }}
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    ) : (
                                        <View style={styles.imgView}>
                                            <Image
                                                source={{ uri: photo.uri }}
                                                resizeMode='cover'
                                                style={styles.image}
                                            />
                                            <View style={styles.cameraIcon}>
                                                <TouchableOpacity onPress={openGallery} >
                                                    <FontAwesome
                                                        name="camera"
                                                        size={22}
                                                        color={COLORS.primary}
                                                        style={{ alignSelf: 'center' }}
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    )
                            }
                            <Formik
                                initialValues={{
                                    fullName: user_details.name, number: user_details.phone,
                                    street: user_details.address, postalCode: user_details.postal_code,
                                    tradingName: user_details.trade_name
                                }}
                                validateOnMount={true}
                                onSubmit={UpdateProfile}
                                validationSchema={ProfileValidation}
                                enableReinitialize={true}
                            >
                                {({ handleChange, handleBlur, handleSubmit, values, touched, errors }) => (
                                    <View>
                                        <View style={styles.emailInput}>
                                            <CustomInput
                                                title="Full Name"
                                                placeholder="Enter Full Name"
                                                keyboardType="default"
                                                onChangeText={handleChange('fullName')}
                                                onBlur={handleBlur('fullName')}
                                                defaultValue={values.fullName}
                                            />
                                            {(errors.fullName && touched.fullName) &&
                                                <CustomErrorText title={errors.fullName} />
                                            }
                                        </View>
                                        <View style={styles.emailInput}>
                                            <CustomInput
                                                title="Contact number"
                                                placeholder="Enter Contact number"
                                                keyboardType="default"
                                                onChangeText={handleChange('number')}
                                                onBlur={handleBlur('number')}
                                                defaultValue={values.number}
                                            />
                                            {(errors.number && touched.number) &&
                                                <CustomErrorText title={errors.number} />
                                            }
                                        </View>
                                        <View style={styles.emailInput}>
                                            <CustomInput
                                                title="Address"
                                                placeholder="12 street Avenue"
                                                keyboardType="default"
                                                onChangeText={handleChange('street')}
                                                onBlur={handleBlur('street')}
                                                defaultValue={values.street}
                                            />
                                            {(errors.street && touched.street) &&
                                                <CustomErrorText title={errors.street} />
                                            }
                                        </View>
                                        <View style={styles.emailInput}>
                                            <CustomInput
                                                title="Post Code"
                                                placeholder="Enter Post Code"
                                                keyboardType="default"
                                                onChangeText={handleChange('postalCode')}
                                                onBlur={handleBlur('postalCode')}
                                                defaultValue={values.postalCode}
                                            />
                                            {(errors.postalCode && touched.postalCode) &&
                                                <CustomErrorText title={errors.postalCode} />
                                            }
                                        </View>
                                        {
                                            Loader ? (
                                                <CustomLoadingBtn
                                                    color={COLORS.white}
                                                    size="small"
                                                    style={styles.btn}
                                                />
                                            ) : (
                                                <CustomButton
                                                    onPress={handleSubmit}
                                                    title="CONFIRM"
                                                    style={styles.btn}
                                                />
                                            )
                                        }
                                    </View>
                                )}
                            </Formik>
                        </ScrollView>
                    </SafeAreaView>
                )
            }
        </KeyboardAwareScrollView>
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
        padding:5,
        flexDirection: 'row',
        // justifyContent: 'space-between',
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
        backgroundColor: COLORS.primary,
        marginBottom: hp('4%')
    },
    imgView: {
        width: 120,
        height: 120,
        backgroundColor: COLORS.white,
        marginBottom: hp('1%'),
        alignSelf: 'center',
        borderRadius: 100,
        justifyContent: 'center',
        shadowColor: "#636363",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4.65,
        elevation: 10,
    },
    image: {
        width: '100%',
        height: '100%',
        alignSelf: 'center',
        borderRadius: 100,
    },
    cameraIcon: {
        position: 'absolute',
        bottom: hp('0%'),
        right: wp('0%'),
        backgroundColor: COLORS.white,
        height: hp('5%'),
        width: wp('10%'),
        borderRadius: 100,
        justifyContent: 'center'
    }
})
export default Profile;
