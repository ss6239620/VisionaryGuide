import { View, Text, TouchableOpacity, ImageEditor } from 'react-native'
import React from 'react'

export default function Ocr() {
    const imgPath = '../assets/text.png'
    const imageUrl = 'https://cdn-icons-png.flaticon.com/512/29/29072.png'
    const test = async () => {
        const data = await fetch(imageUrl);
        console.log(data)
        const blob = await data.blob();
        return new Promise(resolve => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
                const base64data = reader.result;
                resolve(base64data);
                console.log(base64data)
            };
        });
    };
    return (
        <View>
            <TouchableOpacity onPress={test}>
                <Text>Convert</Text>
            </TouchableOpacity>
        </View>
    )
}