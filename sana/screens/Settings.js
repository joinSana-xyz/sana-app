import React, {useState, useEffect, useLayoutEffect, useCallback} from "react";
import {StyleSheet, Text, View, Button, TextInput, Image, SafeAreaView, TouchableOpacity, StatusBar, Alert, ActivityIndicator, FlatList} from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import {signOut} from 'firebase/auth';
import {auth, database} from '../config/firebase';
import {collection, doc, addDoc, orderBy, query, onSnapshot, getDoc} from 'firebase/firestore';
export default function Contact({navigation}) {
  var cids;
  var uids;
  var contacts = [];
  const user = auth.currentUser.uid;
    return (
      <View style={[styles.container, {flexDirection:"column"}]}>
        <View style={styles.header}>
          <View style={{flexDirection:"row"}}>
            <View style={{flex:0.5}}/>
            <Image style={styles.headerLogo} source={require('../images/sana-logo-2.png')}/>
            <View style={{flex:6}}/>
            <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <Image style={styles.headerLogo} source={require('../images/settings.png')}/>
            </TouchableOpacity>
            <View style={{flex:0.5}}/>
            <TouchableOpacity onPress={() => navigation.navigate('Chat')}>
            <Image style={styles.headerLogo} source={require('../images/default.svg') }/>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.bottom}>
          <View style={styles.contactList}>
                <Text>{"Settings"}</Text>
            </View>
            <View style={styles.homePart}>
            <Text> Welcome! </Text>
            <Text> Select a chat or icon to get started. </Text>
            </View>
      </View>
      </View>
    );
};


const styles = StyleSheet.create({
    header: {
      flex:1,
      backgroundColor: "grey",
      width: "100vw",
      borderBottomWidth: 6,
    },
    headerLogo: {
      width: 90,
      height: 90,
      resizeMode: "contain",
    },
    bottom: {
      flex:9,
      flexDirection: "row",
      width: "100vw",
      borderRadius:9,
    },
    contactList: {
      flex:1,
      backgroundColor: "white",
      borderRightWidth: 9,
      borderColor: "grey",
    },
    homePart: {
      flex:3,
      backgroundColor: "white",
    },
    container: {
        flex:1,
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: "white"
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
    card: {
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
    button: {
        backgroundColor: "blue",
        height: 58,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
    },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
});

/*

                    <FlatList 
          data={contacts}
          keyExtractor={item=>item.cid}
          renderItem={({item}) => (
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Chat', {userName: item.username, cid: item.cid})}>
                <Text>{item.username}</Text>
            </TouchableOpacity>
          )}
          */