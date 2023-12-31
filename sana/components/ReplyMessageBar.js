import React from 'react';
import { Text, StyleSheet, View, Image, TouchableOpacity } from 'react-native';



const ReplyMessageBar = ({ clearReply, message }) => {
  return (
    <View style={styles.container}>

      <View style={styles.messageContainer}>
        <Text>{message.text}</Text>
      </View>

      <TouchableOpacity style={styles.crossButton} onPress={clearReply}>
        <Image
          style={styles.crossButtonIcon}
          source={require('../images/cross-button.png')}
        />
      </TouchableOpacity>
    </View>
  );
};

export default ReplyMessageBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
    height: 50,
  },
  replyImage: {
    width: 20,
    height: 20,
  },
  replyImageContainer: {
    paddingLeft: 8,
    paddingRight: 6,
    borderRightWidth: 2,
    borderRightColor: '#2196F3',
    marginRight: 6,
    height: '100%',
    justifyContent: 'center',
  },
  crossButtonIcon: {
    width: 24,
    height: 24,
  },
  crossButton: {
    padding: 4,
  },
  messageContainer: {
    flex: 1,
  },
});