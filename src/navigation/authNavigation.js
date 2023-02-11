import * as React from 'react';
import { Easing, } from 'react-native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Font from '../config/Font';
import COLORS from '../config/COLORS';
import SignIn from '../screens/signIn';
import SignUp from '../screens/signUp';

const Stack = createStackNavigator();
const config = {
    animation: 'spring',
    config: {
        duration: 300,
        easing: Easing.linear
    },
};
const closeConfig = {
    animation: 'timing',
    config: {
        duration: 300,
        easing: Easing.linear
    }
}
const AuthNavigation = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{
                headerTitleAlign: 'center',
                headerTitleStyle: {
                    fontSize: hp('2.5%'),
                    fontFamily: Font.medium,
                    color: COLORS.black
                },
                headerBackgroundContainerStyle: { backgroundColor: COLORS.white },
                headerStyle: {
                    backgroundColor: COLORS.white, borderBottomLeftRadius: 25, borderBottomRightRadius: 25,
                    shadowColor: "#000", shadowOffset: { width: 0, height: 3, }, shadowOpacity: 0.27, shadowRadius: 4.65, elevation: 6,
                },
                headerTintColor: COLORS.black,
                cardStyleInterpolator: CardStyleInterpolators.forScaleFromCenterAndroid,
                transitionSpec: {
                    open: config,
                    close: closeConfig
                }
            }}  >
                <Stack.Screen name="Sign In" component={SignIn} options={{ headerShown: false }} />
                <Stack.Screen name="Sign Up" component={SignUp} options={{ headerShown: false }} />

            </Stack.Navigator>
        </NavigationContainer>
    );
};
export default AuthNavigation;