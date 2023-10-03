import React, { useState } from "react";
import {StyleSheet, Text, View, Button, TextInput, Image, SafeAreaView, TouchableOpacity, StatusBar, Alert} from "react-native";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth} from "../config/firebase"

export default function ResetPassword({navigation}) {
    const [email, setEmail] = useState("");
    const onHandleReset = () => {
        if (email !== "") {
            sendPasswordResetEmail(auth, email)
                .then(() => {
                    navigation.navigate("Signin")
                }
                )
                .catch((err) => Alert.alert("Login error", err.message));
        }
    };
    return (
        <View style={[styles.container, {flexDirection:'row'}]}>
            <View style={[styles.headerBigBox, {flex:2}]}>
                <Text style={styles.bigText}>Welcome to</Text>
                <Image style={styles.logo} source={require('../images/sana-logo.png')}/>
                <Text style={styles.smallBigText}>Please Reset your Password to Continue</Text>
            </View>
            <View style={[styles.signInBigBox, {flex:1}]}>
            <View style={styles.signInSmallBox}>
            <SafeAreaView style={styles.form}>
                <Text style={styles.title}>Password Reset</Text>
                <Text style={styles.headerTitle}>Email</Text>
                <TextInput style={styles.input}
                    autoCapitalize="none"
                    placeholder="Enter Email Address"
                    keyboardType = "email-address"
                    textContentType = "emailAddress"
                    autoFocus={true}
                    value={email}
                    onChangeText={(text) => setEmail(text)} 
                />
                <View style={styles.hairline} />
                <TouchableOpacity style={styles.button} onPress={onHandleReset}>
                    <Text style={styles.buttonText}>Send Reset Password Email</Text>
                </TouchableOpacity>
                <Text> Remember your Password?
                <Text style={{color:"red"}}onPress={() => navigation.navigate("Signin")}> Sign In! </Text>
                </Text>
            </SafeAreaView>
            </View>
        </View>
        </View>
    )
}

const styles = StyleSheet.create({
    headerBigBox:{
        alignItems: "center",
        justifyContent: "center",
    },
    bigText:{
        fontSize: 100,
        fontFamily: "Futara",
        fontWeight: "bold",
    },
    smallBigText:{
        fontSize: 40,
        fontFamily: "Futara",
    },
    logo: {
        width: 400,
        height: 250,
        resizeMode: "contain",

    },
    signInBigBox:{
        backgroundColor: "#c3cfe1",
        alignItems: 'center',
        justifyContent: 'center',
    },
    hairline: {
        backgroundColor: '#c3cfe1',
        height: 2,
        width: 200,
        marginBottom: 15,
    },
    signInSmallBox: {
        backgroundColor: "white",
        padding:40,
        borderRadius: 10,
        alignItems: 'start',
        justifyContent: 'left',
    },
    headerTitle: {
        marginBottom:10,
    },
    container: {
        flex:1,
        backgroundColor: "white",
    },
    title: {
        fontSize:36,
        fontWeight: 'bold',
        color: "black",
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20,
    },
    input: {
        color:"#cbcbcb"
    },
    form: {
        flex:1,
        justifyContent: 'center',
        marginHorizontal: 30,
    },
    button: {
        backgroundColor: "#6073b7",
        height: 40,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20,
        color: "white",
    },
    buttonText: {
        fontWeight: "bold",
        color: "white",
        fontSize: 18,
    },
});