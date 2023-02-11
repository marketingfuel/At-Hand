import React, { useContext, useState } from 'react';
import { StyleSheet, SafeAreaView, ScrollView, StatusBar, TouchableOpacity, Alert, Image, Linking, View, Text } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Formik } from 'formik';
import COLORS from '../config/COLORS';
import Font from '../config/Font';
import CustomHeading from '../components/CustomHeading';
import CustomInput from '../components/CustomInput';
import CustomErrorText from '../components/customErrorText';
import { SignInValidationSchema } from '../utils/validation';
import CustomButton from '../components/customButton';
import CustomForgotBtn from '../components/customForgotBtn';
import axios from 'axios';
import CustomLoadingBtn from '../components/customLoadingBtn';
import { AuthContext } from '../context/context';

const SignIn = ({ navigation }) => {
    const { signIn } = useContext(AuthContext)
    const [Loader, setLoader] = useState(false);

    const signInApi = async (values, { resetForm }) => {
        setLoader(true);
        const res = await axios.get(`https://propertyupkeepmanagement.com/api/login?email=${values.email}&password=${values.password}&user_type=${3}`,
            {
                headers: {
                    "Accept": "application/json"
                },
            })
            .then(res => {
                if (res.data.success === true) {
                    setLoader(true);
                    resetForm()
                    signIn(res.data.data.id, res.data.data.api_token)
                } else {
                    setLoader(false)
                    resetForm()
                    Alert.alert("Network or server Error",)
                }
            }
            )
            .catch(err => {
                console.log(err);
                Alert.alert('Invalid Login')
                // resetForm()
                setLoader(false)
            }
            )
    }

    const openURL = () => {
        Linking.openURL("https://propertyupkeepmanagement.com/forgot-password")
    }
    return (
        <SafeAreaView style={styles.main}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
            <ScrollView keyboardShouldPersistTaps="handled">
                <View>
                    <Image
                        source={require('../assets/images/athand.jpeg')}
                        resizeMode="contain"
                        style={{ height: hp('20%'), width: wp('60%'), alignSelf: 'center', marginTop: hp('8%') }}
                    />
                </View>
                {/* <CustomHeading
                    title="AT HAND"
                    style={styles.heading}
                /> */}
                <Formik
                    initialValues={{ email: '', password: '' }}
                    validateOnMount={true}
                    onSubmit={signInApi}
                    validationSchema={SignInValidationSchema}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, touched, errors }) => (
                        <View >
                            <View style={styles.emailInput}>
                                <CustomInput
                                    title="Enter Email"
                                    placeholder="Enter Email"
                                    keyboardType="email-address"
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
                            <CustomForgotBtn
                                title="Forgot Password"
                                onPress={openURL}
                            />
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
                                        title="LOG IN"
                                        style={styles.btn}
                                    />
                                )
                            }
                            <View style={styles.signUpViewMain}>
                                <Text style={styles.dntHaveText}>
                                    {`Don't have an Account?`}
                                </Text>
                                <TouchableOpacity onPress={() => navigation.navigate('Sign Up')}>
                                    <Text style={styles.signUpText}>
                                        {'SignUp'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </Formik>
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
    icon: {
        alignSelf: 'center',
        marginTop: hp('4%')
    },
    heading: {
        marginTop: hp('2%'),
        color: COLORS.primary
    },
    emailInput: {
        marginTop: hp('4%')
    },
    passwordInput: {
        marginTop: hp('1%')
    },
    btn: {
        backgroundColor: COLORS.primary,
        marginTop: hp('4%'),
    },
    signUpViewMain: {
        width: wp('80%'),
        flexDirection: "row",
        justifyContent: 'center',
        alignSelf: 'center',
        marginTop: hp('2%')
    },
    dntHaveText: {
        fontSize: hp('1.6%'),
        fontFamily: Font.regular,
        color: COLORS.grayniteGray,
        alignSelf: 'center'
    },
    signUpText: {
        fontSize: hp('1.8%'),
        fontFamily: Font.bold,
        color: COLORS.primary,
        marginLeft: wp('2%')
    },
})
export default SignIn;
