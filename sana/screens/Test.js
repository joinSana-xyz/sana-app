import React, {useState, useEffect, useLayoutEffect, useCallback} from "react";
import {StyleSheet, Text, View, Button, TextInput, Image, SafeAreaView, TouchableOpacity, StatusBar, Alert, ActivityIndicator, FlatList} from "react-native";
import { List, ListItem } from "react-native-elements"
import { GiftedChat } from "react-native-gifted-chat";
import {signOut} from 'firebase/auth';
import {auth, database} from '../config/firebase';
import {collection, doc, addDoc, orderBy, query, onSnapshot, getDoc, where} from 'firebase/firestore';


export default function Test({navigation}) {

  const [people, setPeople] = useState([
    { name: 'shaun', id: '1' },
    { name: 'yoshi', id: '2' },
    { name: 'mario', id: '3' },
    { name: 'luigi', id: '4' },
    { name: 'peach', id: '5' },
    { name: 'toad', id: '6' },
    { name: 'bowser', id: '7' },
  ]);
    return (
        <View>
            <FlatList
            keyExtractor={(item) => item.cid}
            data={people}
            renderItem={({item}) => (
                <Text style={styles.item}>{item.name}</Text>
            )}
            />
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  item: {
    flex: 1,
    marginHorizontal: 10,
    marginTop: 24,
    padding: 30,
    backgroundColor: 'pink',
    fontSize: 24,
  },
});