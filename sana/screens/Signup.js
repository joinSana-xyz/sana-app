import React, { useState } from "react";
import {StyleSheet, Text, View, Button, TextInput, Image, SafeAreaView, TouchableOpacity, StatusBar, Alert} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth} from "../config/firebase"

import Signin from "./screens/Signin"
export default function SignUp({navigation}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onHandleSignUp = () => {
        if (email !== "" && password !== "") {
            createUserWithEmailAndPassword(auth, email, password)
                .then(() => console.log("Succesfully created account"))
                .catch((err) => Alert.alert("Sign Up error", err.message));
        }
    };
    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.form}>
                <Text style={styles.title}> Sign Up</Text>
                <TextInput
                    autoCapitalize="none"
                    placeholder="email place"
                    keyboardType = "email-address"
                    textContentType = "emailAddress"
                    autoFocus={true}
                    value={email}
                    onChangeText={(text) => setEmail(text)} 
                />
                <TextInput
                    autoCapitalize="none"
                    placeholder="password"
                    autoCorrect={false}
                    secureTextEntry={true}
                    textContentType = "password"
                    value={password}
                    onChangeText={(text) => setPassword(text)} 
                />
                <TouchableOpacity style={styles.button} onPress={onHandleSignUp}>
                    <Text style={styles.buttonText}> Sign Up</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Signin")}>
                    <Text style={styles.buttonText}>Already Have An Account? Sign In </Text>
                </TouchableOpacity>
            </SafeAreaView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: "purple",
    },
    title: {
        fontSize:36,
        fontWeight: 'bold',
        color: "orange",
    },
    input: {
        backgroundColor: "red",
        height: 58,
        marginBottom: 20,
        fontSize: 16,
        borderRadius: 10,
        padding: 12,
    },
    form: {
        flex:1,
        justifyContent: 'center',
        marginHorizontal: 30,
    },
    button: {
        backgroundColor: "blue",
        height: 58,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
    },
    buttonText: {
        fontWeight: "bold",
        color: "black",
        fontSize: 18,
    },
});