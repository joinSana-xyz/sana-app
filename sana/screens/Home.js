import React from "react";
import {StyleSheet, Text, View, Button, TextInput, Image, SafeAreaView, TouchableOpacity, StatusBar, Alert, ActivityIndicator} from "react-native";

import Chat from "./Chat"
export default function Home() {
    return (
        <View>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Chat")}>
                <Text style={styles.buttonText}>Messages Place </Text>
            </TouchableOpacity>
        </View>
    )
}