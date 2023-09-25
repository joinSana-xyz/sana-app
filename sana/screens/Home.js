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
                <Text style={styles.title}> HOME</Text>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Contacts")}>
                    <Text style={styles.buttonText}>Contacts </Text>
                </TouchableOpacity>
            </SafeAreaView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: "blue",
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
        backgroundColor: "red",
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