import React, {useState, useEffect, useLayoutEffect, useCallback} from "react";
import {StyleSheet, Text, View, Button, TextInput, Image, SafeAreaView, TouchableOpacity, StatusBar, Alert, ActivityIndicator, FlatList} from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import {signOut} from 'firebase/auth';
import {auth, database} from '../config/firebase';
import {collection, doc, addDoc, orderBy, query, onSnapshot, getDoc} from 'firebase/firestore';
class ContactClass {
    constructor (cid, username) {
      this.cid = cid;
      this.username = username;
    }
}
async function doTheStuffPlease(docSnap, user) {
  var [contacts, setContacts] = useState([]);
  var data;
  if (docSnap.exists()) {
    data = docSnap.data();
  }
  var cids = data != null ? data.cids : [];
      for await (let cid of cids) {
        const chatRef = doc(database, "chat", cid);
        getDoc(chatRef).then(chatSnap => {
          var uids;
          if (chatSnap.exists()) {
            const chatData = chatSnap.data();
            uids = chatData.uids;
            var index = uids.indexOf(user);
            if (index !== -1) {
              uids.splice(index, 1);
            }
            //contacts.push(tempContact);
        }
        else {
          console.log("dont exist ");
        }
        //setContacts(...contacts, makeContact(cid, uids));
      })
    }
    return contacts
    }
async function makeContact(cid, uids) {
  var [contact, setContact] = useState([]);
  var [usernames, setUsernames] = useState([]);
  for await (let uid of uids){
    const userRef = doc(database, "users", uid)
    getDoc(userRef).then(userSnap => {
      var username;
      if(userSnap.exists()) {
        const userData = userSnap.data();
        username = userData.fName + " " + userData.lName
      }
      setUsernames([...usernames, {username}]);
    })
  }
  var userNames = await usernames.toString();
  const tempContact = await new ContactClass(cid, userNames);
  setContact(tempContact);
  return (contact);
}
export default function Contact({navigation}) {
  /*
    var [contacts, setContacts] = useState([]);
  var [contact, setContact] = useState([]);
  var [usernames, setUsernames] = useState([]);
  const 
  const user = auth.currentUser.uid;
  const docRef = doc(database, "users", user);
  getDoc(docRef).then(docSnap => {
    var data;
  if (docSnap.exists()) {
    data = docSnap.data();
  }
  var cids = data != null ? data.cids : [];
      for (let cid of cids) {
        const chatRef = doc(database, "chat", cid);
        getDoc(chatRef).then(chatSnap => {
          var uids;
        if (chatSnap.exists()) {
            const chatData = chatSnap.data();
            uids = chatData.uids;
            var index = uids.indexOf(user);
            if (index !== -1) {
              uids.splice(index, 1);
            }
            //contacts.push(tempContact);
        }
        for  (let uid of uids){
          const userRef = doc(database, "users", uid)
          getDoc(userRef).then(userSnap => {
            var username;
            if(userSnap.exists()) {
              const userData = userSnap.data();
              username = userData.fName + " " + userData.lName
            }
            setUsernames(username);
            //console.log(usernames)
          })
        }
        //var userNames = usernames.toString();
        const tempContact = new ContactClass(cid, "Neeraj Gogate");
        setContact(tempContact);
        setContacts(contact);
      })
      }
    }
  )
  */
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
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Chat', {userName: "Global Chat", cid: "OgrB6M9OcEkMLLoyqbQ5"})}>
                <Text>{"Global Chat"}</Text>
            </TouchableOpacity>
            </View>
            <View style={styles.homePart}>
            <Text style={styles.bigText}> Welcome! </Text>
            <Text style={styles.smallBigText}> Select a chat or icon to get started. </Text>
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
    bigText:{
        fontSize: 100,
        fontFamily: "Futara",
        fontWeight: "bold",
    },
    smallBigText:{
        fontSize: 40,
        fontFamily: "Futara",
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