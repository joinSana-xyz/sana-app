import React, { useState } from "react";
import {StyleSheet, Text, View, Button, TextInput, Image, SafeAreaView, TouchableOpacity, StatusBar, Alert} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth} from "../config/firebase"

export default function SignIn({navigation}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onHandleSignIn = () => {
        if (email !== "" && password !== "") {
            signInWithEmailAndPassword(auth, email, password)
                .then(() => console.log("Succesfully logged in"))
                .catch((err) => Alert.alert("Login error", err.message));
        }
    };
    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.form}>
                <Text style={styles.title}> Sign In</Text>
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
                <TouchableOpacity style={styles.button} onPress={onHandleSignIn}>
                    <Text style={styles.buttonText}> Sign In</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Signup")}>
                    <Text style={styles.buttonText}>No Account? Sign Up! </Text>
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