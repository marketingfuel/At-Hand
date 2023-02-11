
import React, { useMemo, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { AuthContext } from './src/context/context';
import AppNavigation from './src/navigation/appNavigation';
import AuthNavigation from './src/navigation/authNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import firebase from '@react-native-firebase/app';

FontAwesome.loadFont();
Ionicons.loadFont();
MaterialCommunityIcons.loadFont();
MaterialIcons.loadFont();
Feather.loadFont();
AntDesign.loadFont();

const App = () => {

  const initialLoginState = {
    isLoading: true,
    email: null,
    userToken: null,
  }
  const loginReducer = (prevState, action) => {
    switch (action.type) {
      case 'RETRIEVE_TOKEN':
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGIN':
        return {
          ...prevState,
          email: action.id,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGOUT':
        return {
          ...prevState,
          email: null,
          userToken: null,
          isLoading: false,
        };
    }
  };

  const [loginState, dispatch] = React.useReducer(loginReducer, initialLoginState);
  const authContext = useMemo(() => ({
    signIn: async (email, token) => {
      let userToken;
      try {
        await AsyncStorage.setItem('userToken', token)
        await AsyncStorage.setItem('userId', String(email))
      } catch (e) {
        console.log("abc")
      }
      dispatch({ type: "LOGIN", id: email, token: token });
    },
    signOut: async () => {
      try {
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('userId');
      } catch (e) {
        console.log("abc")
      }
      dispatch({ type: "LOGOUT" })
    }
  }), []);

  useEffect(() => {
    initFirbase();
    setTimeout(async () => {
      let userToken;
      userToken = null;
      try {
        userToken = await AsyncStorage.getItem('userToken');
      } catch (e) {
        console.log("abc")
      }
      dispatch({ type: "RETRIEVE_TOKEN", token: userToken });
    }, 0);
  }, []);

  const initFirbase = async () => {
    if (!firebase.apps.length) {
       await firebase.initializeApp({
            apiKey: "AIzaSyCubpKly5pqV1Q3XPBboZV3tig05EKMZpY",
            authDomain: "upkeep-fdfae.firebaseapp.com",
            databaseURL: "https://upkeep-fdfae-default-rtdb.firebaseio.com",
            projectId: "upkeep-fdfae",
            storageBucket: "upkeep-fdfae.appspot.com",
            messagingSenderId: "19845408331",
            appId: "1:19845408331:web:c091c63553444aa40a8fce",
            measurementId: "G-CYNMN8VX1L"
        });
    }
}

  return (
    <AuthContext.Provider value={authContext}>
      {loginState.userToken === null ?
        <AuthNavigation /> :
        <AppNavigation />
      }
    </AuthContext.Provider>
  )
};

const styles = StyleSheet.create({
});

export default App;
