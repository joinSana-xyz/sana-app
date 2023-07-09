import React, { useEffect, useState, createContext, useContext } from "react";
import {StyleSheet, Text, View, Button, TextInput, Image, SafeAreaView, TouchableOpacity, StatusBar, Alert, ActivityIndicator} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { onAuthStateChanged } from "firebase/auth"

import Home from "./screens/Home";
import Chat from "./screens/Chat";
import Signin from "./screens/Signin"
import Signup from "./screens/Signup"
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
  <Stack.Navigator defaultScreenOptions={Signin}>
      <Stack.Screen name="Signin" component={Signin} />
      <Stack.Screen name="Signup" component={Signup} />
  </Stack.Navigator>
  )
}
function ChatStack () {
  return (
    <Stack.Navigator defaultScreenOptions={Home}>
      <Stack.Screen name="Chat" component={Chat} />
      <Stack.Screen name="Home" component={Home} />
    </Stack.Navigator>
  )
}
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
  return (
    <AuthenticatedUserProvider>
        <RootNavigator />
    </AuthenticatedUserProvider>
  )
}
