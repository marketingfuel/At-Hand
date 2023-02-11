import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, ScrollView, StatusBar, Alert, Image, View, Text,TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Formik } from 'formik';
import COLORS from '../config/COLORS';
import CustomHeading from '../components/CustomHeading';
import CustomInput from '../components/CustomInput';
import CustomErrorText from '../components/customErrorText';
import { SignUpValidationSchema } from '../utils/validation';
import CustomButton from '../components/customButton';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import axios from "axios";
import CustomLoadingBtn from '../components/customLoadingBtn';
import Font from '../config/Font';

const SignUp = ({ navigation }) => {
    const [Loader, setLoader] = useState(false);

    const signUpApi = async (values, { resetForm }) => {
        setLoader(true);
        const res = await axios.post(`https://propertyupkeepmanagement.com/api/register?email=${values.email}&password=${values.password}&name=${values.fullName}&phone=${values.telephone}&trade_name=${values.tradingName}&address=${values.address}`,
            {
                headers: {
                    "Accept": "application/json"
                },
            })
            .then(res => {
                if (res.data.success === true) {
                    setLoader(true);
                    resetForm()
                    Alert.alert('Your account has been created successfully')
                    navigation.navigate("Sign In")
                } else {
                    setLoader(false)
                    resetForm()
                    Alert.alert("Email already registered",)
                }
            }
            )
            .catch(err => {
                Alert.alert("Email already registered")
                setLoader(false)
            })
    }

    return (
        <SafeAreaView style={{backgroundColor:COLORS.white}} >
            <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
            <View style={styles.headerView}>
                <TouchableOpacity style={{ alignSelf: 'center' }} onPress={() => navigation.navigate('Sign In')}>
                    <Text style={styles.logoutText}>
                        Log In
                    </Text>
                </TouchableOpacity>
            </View>
            <ScrollView keyboardShouldPersistTaps="handled">
                <View>
                    <Image
                        source={require('../assets/images/athand.jpeg')}
                        resizeMode="contain"
                        style={{ height: hp('20%'), width: wp('60%'), alignSelf: 'center', marginTop: hp('4%') }}
                    />
                </View>
                <CustomHeading
                    title="Sign Up"
                    style={styles.heading}
                />
                <Formik
                    initialValues={{ fullName: '', telephone: '', address: '', tradingName: '', email: '', password: '', confirmPassword: '' }}
                    validateOnMount={true}
                    onSubmit={signUpApi}
                    validationSchema={SignUpValidationSchema}
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
                            {/* <View style={styles.passwordInput}>
                                    <CustomInput
                                        title="Enter Trading Name"
                                        placeholder="Enter Trading Name"
                                        keyboardType="default"
                                        onChangeText={handleChange('tradingName')}
                                        onBlur={handleBlur('tradingName')}
                                        defaultValue={values.tradingName}
                                    />
                                    {(errors.tradingName && touched.tradingName) &&
                                        <CustomErrorText title={errors.tradingName} />
                                    }
                                </View> */}
                            <View style={styles.passwordInput}>
                                <CustomInput
                                    title="Contact Number"
                                    placeholder="Enter Contact Number"
                                    keyboardType="phone-pad"
                                    onChangeText={handleChange('telephone')}
                                    onBlur={handleBlur('telephone')}
                                    defaultValue={values.telephone}
                                />
                                {(errors.telephone && touched.telephone) &&
                                    <CustomErrorText title={errors.telephone} />
                                }
                            </View>
                            <View style={styles.passwordInput}>
                                <CustomInput
                                    title="Address"
                                    placeholder="Enter Address"
                                    keyboardType="default"
                                    onChangeText={handleChange('address')}
                                    onBlur={handleBlur('address')}
                                    defaultValue={values.address}
                                />
                                {(errors.address && touched.address) &&
                                    <CustomErrorText title={errors.address} />
                                }
                            </View>
                            <View style={styles.passwordInput}>
                                <CustomInput
                                    title="Email"
                                    placeholder="Enter Email"
                                    keyboardType="default"
                                    onChangeText={handleChange('email')}
                                    onBlur={handleBlur('email')}
                                    defaultValue={values.email}
                                />
                                {(errors.email && touched.email) &&
                                    <CustomErrorText title={errors.email} />
                                }
                            </View>
                            <View style={styles.passwordInput}>
                                <CustomInput
                                    title="Password"
                                    placeholder="Enter Password"
                                    keyboardType="default"
                                    secureTextEntry={true}
                                    onChangeText={handleChange('password')}
                                    onBlur={handleBlur('password')}
                                    defaultValue={values.password}
                                />
                                {(errors.password && touched.password) &&
                                    <CustomErrorText title={errors.password} />
                                }
                            </View>
                            <View style={styles.passwordInput}>
                                <CustomInput
                                    title="Confirm Password"
                                    placeholder="Retype Password"
                                    keyboardType="default"
                                    secureTextEntry={true}
                                    onChangeText={handleChange('confirmPassword')}
                                    onBlur={handleBlur('confirmPassword')}
                                    defaultValue={values.confirmPassword}
                                />
                                {(errors.confirmPassword && touched.confirmPassword) &&
                                    <CustomErrorText title={errors.confirmPassword} />
                                }
                            </View>
                            {Loader ? (
                                <CustomLoadingBtn
                                    color={COLORS.white}
                                    size="small"
                                    style={styles.btn}
                                />
                            ) : (
                                <CustomButton
                                    onPress={handleSubmit}
                                    title="SIGNUP"
                                    style={styles.btn}
                                />
                            )}
                        </View>
                    )}
                </Formik>
                <View style={{paddingBottom:350}}></View>
            </ScrollView>
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    headerView: {
        width: wp('100%'),
        height: hp('6%'),
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomColor: COLORS.grayniteGray,
        borderBottomWidth: 0.5
    },
    logoutText: {
        width: wp('25%'),
        paddingLeft: hp('2.5%'),
        fontSize: hp('2%'),
        fontFamily: Font.medium,
        color: COLORS.primary,
    },
    main: {
        width: wp('100%'),
        height: hp('100%'),
        backgroundColor: COLORS.white
    },
    icon: {
        alignSelf: 'center',
        marginTop: hp('4%')
    },
    heading: {
        marginTop: hp('2%'),
        color: COLORS.primary
    },
    emailInput: {
        marginTop: hp('2%')
    },
    passwordInput: {
        marginTop: hp('1%')
    },
    btn: {
        marginVertical: hp('4%'),
        backgroundColor: COLORS.primary
    },
})
export default SignUp;
