import React, {useState, useEffect, useLayoutEffect, useCallback} from "react";
import {StyleSheet, Text, View, Button, TextInput, Image, SafeAreaView, TouchableOpacity, StatusBar, Alert, ActivityIndicator, FlatList} from "react-native";
import { GiftedChat, Bubble, 
  IMessage,
  InputToolbar,
  InputToolbarProps,
  MessageProps, Composer, Send } from "react-native-gifted-chat";
import {signOut} from 'firebase/auth';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {auth, database} from '../config/firebase';
import {useRoute } from "@react-navigation/native";
import { Icon } from 'react-native-elements';
import {doc, collection, addDoc, arrayUnion, orderBy, query, onSnapshot} from 'firebase/firestore';
import Animated, {
	useSharedValue,
} from "react-native-reanimated";
///import InChatFileTransfer from '../components/InChatFileTransfer';
//import InChatViewFile from '../components/InChatViewFile';

import ReplyMessageBar from '../components/ReplyMessageBar';
export default function Chat({navigation}) {

    const route = useRoute()
    const [messages, setMessages] = useState([]);
    const [replyMessage, setReplyMessage] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  //const height = useSharedValue(70);


    const clearReplyMessage = () => setReplyMessage(null);
    //const navigation = useNavigation();
    //const route = useRoute();
    //const cid = route.params?.cid;
    //const cid = "hello";
    const cid = route.params?.cid;
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

/*const pickImageasync = async () => {
 const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

 let imgURI = null;
 const hasStoragePermissionGranted = status === "granted";

if(!hasStoragePermissionGranted) return null;

 
 let result = await ImagePicker.launchImageLibraryAsync({
   mediaTypes: ImagePicker.MediaTypeOptions.Images,
   allowsEditing: true,
   aspect: [4, 4],
   quality: 1,
 });

 if (!result.cancelled) {
   imgURI = result.uri;
 }

 return imgURI;
};
pickImageasync();
const uploadImageToStorage= async (imgURI ) => {
  const ref = `messages/${[FILE_REFERENCE_HERE]}`

  const imgRef = firebase.storage().ref(ref);

  const metadata = { contentType: "image/jpg" };
  

  // Fetch image data as BLOB from device file manager 

  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
      reject(new TypeError("Network request failed"));
    };
    xhr.responseType = "blob";
    xhr.open("GET", imgURI, true);
    xhr.send(null);
  });
  // Put image Blob data to firebase servers
  await imgRef.put(blob, metadata);

  // We're done with the blob, close and release it
  blob.close();

  // Image permanent URL
  const url = await imgRef.getDownloadURL();

 
  return url
};

uploadImageToStorage("what");
*/

    const renderReplyMessageView = (props) => {
      if (typeof props.currentMessage.replyMessage == 'string'){
      return (
      <View style={styles.replyMessageContainer}>
        <Text>{props.currentMessage.replyMessage}</Text>
        <View style={styles.replyMessageDivider} />
      </View>
    );
      }
    }
    const RenderMessageBox = (props) => {
      <ChatMessageBox 
      {...props}
      />
    }
    const renderBubble = (props) => {
  const {currentMessage} = props;
  if (currentMessage.replyMessage)
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
    const scrollToBottomComponent = () => {
        return <FontAwesome name="angle-double-down" size={22} color="#333" />;
    };
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
                    replyMessage: doc.data().replyMessage,
                }))
            )
        });
        return () => unsubscribe();
    }, []);
    const onSend = useCallback((messages= []) => {
      if (replyMessage){
        messages[0].replyMessage = replyMessage;
      }
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages));
        const {_id, createdAt, text, user} = messages[0];
        addDoc(collection(database, 'chat', cid, "chat"), {
            _id, createdAt, text, user, replyMessage
        });
        console.log(messages)
    });
    const renderSend = (props) => {
      return (
      <View style={{flexDirection: 'row'}}>
        
        <Send {...props}>
        <View style={styles.sendContainer}>
          <Icon
            type="font-awesome"
            name="send"
            size={28}
            color='orange'
          />
        </View>
      </Send>
              <TouchableOpacity onPress={() => setShowEmojiPicker((value) => value)}>
          <Icon
          type="font-awesome"
          name="smile-o"
          size={28}
          color='gray'/>
          </TouchableOpacity>
            </View>
            
  );
};
    return (
        <GiftedChat
            messages={messages}
            onSend={messages => onSend(messages)}
            user={{
                _id: auth?.currentUser?.email,
                name:auth?.currentUser?.email,
            }}
            renderUsernameOnMessage={true}
            renderSend={renderSend}
            onPress = {(_, message) => setReplyMessage(message.text)}
            renderAccessory = {renderAccessory}
            renderCustomView={renderReplyMessageView}
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

/*

        <TouchableOpacity onPress={() => setShowEmojiPicker((value) => !value)}>
          <Icon
          type="font-awesome"
          name="smile-o"
          size={28}
          color='gray'/>
          </TouchableOpacity>
          */