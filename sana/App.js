import React, { useEffect, useState, createContext, useContext } from "react";
import {StyleSheet, Text, View, Button, TextInput, Image, SafeAreaView, TouchableOpacity, StatusBar, Alert, ActivityIndicator} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { onAuthStateChanged } from "firebase/auth"

import Home from "./screens/Home";
import Chat from "./screens/Chat";
import Video from "./screens/Video";
import Contacts from "./screens/Contacts";
import Signin from "./screens/Signin"
import Signup from "./screens/Signup"
import Verification from "./screens/Verification"
import ResetPassword from "./screens/ResetPassword"
import Test from "./screens/Test"
import Settings from "./screens/Settings"
import {auth} from "./config/firebase"

const Stack = createStackNavigator();
const AuthenticatedUserContext = createContext({});

const AuthenticatedUserProvider = ({children}) => {
  const [user, setUser] = useState(null);
  return (
    <AuthenticatedUserContext.Provider value={{user,setUser}}>
      {children}
    </AuthenticatedUserContext.Provider>
  )
}
/*export default function App() {
  return (
    <View> 
      <Text> Open Up App.js to start working on app!</Text>
    </View>
  )
}
*/
function AuthStack() {
  return (
  <Stack.Navigator defaultScreenOptions={Signin }>
      <Stack.Screen name="Signin" component={Signin} options={{headerShown: false}} />
      <Stack.Screen name="Signup" component={Signup} options={{headerShown: false}}/>
      <Stack.Screen name="ResetPassword" component={ResetPassword} options={{headerShown: false}} />
  </Stack.Navigator>
  )
}
function ChatStack () {
  return (
    <Stack.Navigator defaultScreenOptions={Home}>
      <Stack.Screen name="Contacts" component={Contacts} options={{headerShown: false}} />
      <Stack.Screen name="Settings" component={Settings} options={{headerShown: true}} />
      <Stack.Screen name="Chat" component={Chat} options={({route}) => ({
        title: route.params.userName,
        headerBackTitleVisible: false
      }) }/>
      <Stack.Screen name="Video" component={Video} options={({route}) => ({
        title: route.params.cid,
        headerBackTitleVisible: false,
        headerShown:false
      }) }/>
      <Stack.Screen name="Verification" component={Verification} options={{headerShown: false}} />
      <Stack.Screen name="Home" component={Home} />
    </Stack.Navigator>
  )
}
function VerificationStack () {
  return (
    <Stack.Navigator defaultScreenOptions={Verification}>
      <Stack.Screen name="Verification" component={Verification} options={{headerShown: true}} />
    </Stack.Navigator>
  )
}
/* <Stack.Screen name="Chat" component={Chat}       options={({route}) => ({
        title: route.params.userName,
        headerBackTitleVisible: false,
      })} /> */
function RootNavigator () {
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const unsubscrbe = onAuthStateChanged(auth, async authenticatedUser => {
      authenticatedUser ? setUser(authenticatedUser) : setUser(null);
      setLoading(false);
    });
    return () => unsubscrbe();
  }, [user]);
  if(loading) {
    return (
      <View>
        <ActivityIndicator size="large" />
      </View>
    )
  }   
  return (
    <NavigationContainer>
      { user ? <ChatStack /> : <AuthStack/> }
    </NavigationContainer>
  )
}
export default function App() {
  //Text.defaultProps = Text.defaultProps || {}
  //Text.defaultProps.style =  { fontFamily: 'Futara' }
  return (
    <AuthenticatedUserProvider>
        <RootNavigator />
    </AuthenticatedUserProvider>
  )
}
