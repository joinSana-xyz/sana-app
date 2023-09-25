import React, {useState, useEffect, useLayoutEffect, useCallback} from "react";
import {StyleSheet, Text, View, Button, TextInput, Image, SafeAreaView, TouchableOpacity, StatusBar, Alert, ActivityIndicator, FlatList} from "react-native";
import { GiftedChat, Bubble, 
  IMessage,
  InputToolbar,
  InputToolbarProps,
  MessageProps, } from "react-native-gifted-chat";
import {signOut} from 'firebase/auth';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {auth, database} from '../config/firebase';
import {useRoute } from "@react-navigation/native";
import {doc, collection, addDoc, arrayUnion, orderBy, query, onSnapshot} from 'firebase/firestore';
//import InChatFileTransfer from '../components/InChatFileTranfer';
//import InChatViewFile from '../components/InChatViewFile';
//import * as DocumentPicker from 'react-native-document-picker';

import EmojiPicker from "../components/emoji/EmojiPicker";

import ReplyMessageBar from '../components/ReplyMessageBar';
export default function Chat({navigation}) {

    const route = useRoute()
    const [messages, setMessages] = useState([]);
    const [replyMessage, setReplyMessage] = useState([]);
  const [isAttachImage, setIsAttachImage] = useState(false);
  const [isAttachFile, setIsAttachFile] = useState(false);
  const [fileVisible, setFileVisible] = useState(false);
  const [imagePath, setImagePath] = useState('');
  const [filePath, setFilePath] = useState('');
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const clearReplyMessage = () => setReplyMessage(null);
    //const navigation = useNavigation();
    //const route = useRoute();
    //const cid = route.params?.cid;
    const cid = "hello";
    //const cid = route.params?.cid;
    const docRef = doc(database, "chat", cid);
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
   /*
   const _pickDocument = async () => {
  try {
    const result = await DocumentPicker.pick({
      type: [DocumentPicker.types.allFiles],
      copyTo: 'documentDirectory',
      mode: 'import',
      allowMultiSelection: true,
    });
    const fileUri = result[0].fileCopyUri;
    console.log(fileUri);
    if (!fileUri) {
      console.log('File URI is undefined or null');
      return;
    }
    if (fileUri.indexOf('.png') !== -1 || fileUri.indexOf('.jpg') !== -1) {
      setImagePath(fileUri);
      setIsAttachImage(true);
    } else {
      setFilePath(fileUri);
      setIsAttachFile(true);
    }
  } catch (err) {
    if (DocumentPicker.isCancel(err)) {
      console.log('User cancelled file picker');
    } else {
      console.log('DocumentPicker err => ', err);
      throw err;
    }
  }
};

const renderChatFooter = useCallback(() => {
  if (imagePath) {
    return (
      <View style={styles.chatFooter}>
        <Image source={{uri: imagePath}} style={{height: 75, width: 75}} />
        <TouchableOpacity
          onPress={() => setImagePath('')}
          style={styles.buttonFooterChatImg}
        >
          <Text style={styles.textFooterChat}>X</Text>
        </TouchableOpacity>
      </View>
    );
  }
  if (filePath) {
    return (
      <View style={styles.chatFooter}>
        <InChatFileTransfer
          filePath={filePath}
        />
        <TouchableOpacity
          onPress={() => setFilePath('')}
          style={styles.buttonFooterChat}
        >
          <Text style={styles.textFooterChat}>X</Text>
        </TouchableOpacity>
      </View>
    );
  }
  return null;
}, [filePath, imagePath]);
   const renderCustomInputToolbar = (props) => (
    <InputToolbar
      {...props}
      containerStyle={styles.inputContainer}
      accessoryStyle={styles.replyBarContainer}
    />
  );
   const renderAccessory = () => (
    <ReplyMessageBar
    message = {{text:replyMessage}} clearReply={clearReplyMessage}
    />
    );
    const renderBubble = (props) => {
  const {currentMessage} = props;
  if (currentMessage.file && currentMessage.file.url) {
    return (
      <TouchableOpacity
      style={{
        ...styles.fileContainer,
        backgroundColor: props.currentMessage.user._id === 2 ? '#2e64e5' : '#efefef',
        borderBottomLeftRadius: props.currentMessage.user._id === 2 ? 15 : 5,
        borderBottomRightRadius: props.currentMessage.user._id === 2 ? 5 : 15,
      }}
      onPress={() => setFileVisible(true)}
      >
        <InChatFileTransfer
          style={{marginTop: -10}}
          filePath={currentMessage.file.url}
        />
        <InChatViewFile
            props={props}
            visible={fileVisible}
            onClose={() => setFileVisible(false)}
          />
        <View style={{flexDirection: 'column'}}>
          <Text style={{
                ...styles.fileText,
                color: currentMessage.user._id === 2 ? 'white' : 'black',
              }} >
            {currentMessage.text}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
  return (
    <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: '#2e64e5',
        },
      }}
      textStyle={{
        right: {
          color: '#efefef',
        },
      }}
    />
  );
};
    const renderReplyMessageView = (props) =>
    props.currentMessage &&
    props.currentMessage.replyMessage && (
      <View style={styles.replyMessageContainer}>
        <Text>{props.currentMessage.replyMessage.text}</Text>
        <View style={styles.replyMessageDivider} />
      </View>
    );
    const scrollToBottomComponent = () => {
        return <FontAwesome name="angle-double-down" size={22} color="#333" />;
    };
    */
      const renderCustomInputToolbar = (props) => (
    <InputToolbar
      {...props}
      containerStyle={styles.inputContainer}
      accessoryStyle={styles.replyBarContainer}
    />
      )
      const renderAccessory = () => (
    <ReplyMessageBar
    message = {{text:replyMessage}} clearReply={clearReplyMessage}
    />
    );
    useLayoutEffect(() => {
        const collectionRef = collection(database, "chat", cid, "chat");
        const quer = query(collectionRef, orderBy('createdAt', 'desc'));
        console.log(quer);
        const unsubscribe = onSnapshot(quer, snapshot => {
            console.log('snapshot');
            setMessages(
                snapshot.docs.map(doc => ({
                    _id: doc.id,
                    createdAt: doc.data().createdAt.toDate(),
                    text: doc.data().text,
                    user: doc.data().user,
                    reply: doc.data().reply,
                }))
            )
        });
        return () => unsubscribe();
    }, []);
    const onSend = useCallback((messages= []) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages));
        const {_id, createdAt, text, user, reply} = messages[0];
        addDoc(collection(database, 'chat', cid, "chat"), {
            _id, createdAt, text, user, reply
        });
        console.log(messages)
        console.log(messages)
    });
    return (
        <GiftedChat
            messages={messages}
            onSend={messages => onSend(messages)}
            user={{
                _id: auth?.currentUser?.email,
                name:auth?.currentUser?.email,
            }}
            renderUsernameOnMessage={true}
            onPress = {(_, message) => setReplyMessage(message.text)}
            renderAccessory = {renderAccessory}

        />
    )
}

const styles = StyleSheet.create({
    
  inputContainer: {
    position: 'relative',
    flexDirection: 'column-reverse',
  },
  replyBarContainer: {
    height: 'auto',
  },
  messagesContainer: {
    flex: 1,
  },
  replyMessageContainer: {
    padding: 8,
    paddingBottom: 0,
  },
  replyMessageDivider: {
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
    paddingTop: 6,
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
    contactListContainer:{
        position: 'absolute',
        bottom: 0,
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor:'red',
        width: 200 // add width 
    },
    container: {
        flex:1,
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: "purple"
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