import React from "react";
import {StyleSheet, Text, View, Button, TextInput, Image, SafeAreaView, TouchableOpacity, StatusBar, Alert} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Chat from "./screens/Chat";
import Signin from "./screens/Signin"
import Signup from "./screens/Signup"
const Stack = createStackNavigator();

/*export default function App() {
  return (
    <View> 
      <Text> Open Up App.js to start working on app!</Text>
    </View>
  )
}
*/
function ChatStack () {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Signup" component={Signup} />
    </Stack.Navigator>
  )
}
function RootNavigator () {
  return (
    <NavigationContainer>
      <ChatStack />
    </NavigationContainer>
  )
}
export default function App() {
  return <RootNavigator />
}
