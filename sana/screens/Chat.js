import React, {useState, useEffect, useLayoutEffect, useCallback} from "react";
import {StyleSheet, Text, View, Button, TextInput, Image, SafeAreaView, TouchableOpacity, StatusBar, Alert, ActivityIndicator} from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import {signOut} from 'firebase/auth';
import {auth, database} from '../config/firebase';
import { useNavigation } from "@react-navigation/native";
import {collection, addDoc, orderBY, query, onSnapshot} from 'firebase/firestore';

export default function Chat() {
    const [messages, setMessages] = useState([]);
    const navigation = useNavigation();

    const onSignOut = () => {
        signOut(auth).catch(error => console.log(error));
    };
    /*useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity style ={{marginRight:10}} onPress={onSignOut}></TouchableOpacity>
            )
        })
    }, [navigation]);
    */
    useLayoutEffect(() => {
        const collectionRef = collection(database, "chat");
        const quer = query(collectionRef, ref => ref.orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(quer, snapshot => {
            console.log('snapshot');
            setMessages(
                snapshot.docs.map(doc => ({
                    _id: doc.id,
                    createdAt: doc.data().createdAt,
                    text: doc.data().text,
                    user: doc.data().user
                }))
            )
        });
        return () => unsubscribe();
    }, []);
    const onSend = useCallback((messages= []) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages));

        const {_id, createdAt, text, user} = messages[0];
        addDoc(collection(database, 'chat'), {
            _id, createdAt, text, user
        });
    });
    return (
        <GiftedChat 
            messages={messages}
            onSend={messages => onSend(messages)}
            user={{
                _id: auth?.currentUser?.email,
            }}
            messagesContainerStyle={{
                backgroundColor: `#ffffff`
            }}
        />
    )
}