import React, {useState, useEffect} from 'react'
import {Button, Image, View, StyleSheet, ActivityIndicator, SafeAreaView, Text, FlatList} from 'react-native'
import * as FileSystem from 'expo-file-system';

const imgDir = FileSystem.documentDirectory + 'images/';
const vidDir = FileSystem.documentDirectory + 'videos/';

const ensureDirExists = async () => {
    const dirInfo = await FileSystem.getInfoAsync(imgDir);
    if (!dirInfo.exists){
        await FileSystem.makeDirectoryAsync(imgDir, {intermediates:true});

    }
}

export default function TestImage() {
    const selectImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
        })
    };
    return (
        <SafeAreaView style={{flex:1,gap:20}}> 
            <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}> 
                <Button title="Photo Library" onPress={() => selectImage(true)}/>
                <Button title="Capture Image" onPress={() => selectImage(false)}/>
            </View>
        </SafeAreaView>
    )
}