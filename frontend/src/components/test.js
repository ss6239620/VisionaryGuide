import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Image } from 'react-native';
import Voice from '@react-native-voice/voice';


const ChatScreen = () => {
    const [recognized, setRecognized] = useState('');
    const [pitch, setPitch] = useState('');
    const [error, setError] = useState('');
    const [end, setEnd] = useState('');
    const [started, setStarted] = useState('');
    const [results, setResults] = useState([]);
    const [partialResults, setPartialResults] = useState([]);

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [data, setData] = useState({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const onSpeechStart = (e) => {
            console.log('onSpeechStart: ', e);
            setStarted('√');
        };

        const onSpeechRecognized = (e) => {
            console.log('onSpeechRecognized: ', e);
            setRecognized('√');
        };

        const onSpeechEnd = (e) => {
            console.log('onSpeechEnd: ', e);
            setEnd('√');
        };

        const onSpeechError = (e) => {
            console.log('onSpeechError: ', e);
            setError(JSON.stringify(e.error));
        };

        const onSpeechResults = (e) => {
            console.log('onSpeechResults: ', e);
            setResults(e.value);
        };

        const onSpeechPartialResults = (e) => {
            console.log('onSpeechPartialResults: ', e);
            setPartialResults(e.value);
        };

        Voice.onSpeechStart = onSpeechStart;
        Voice.onSpeechRecognized = onSpeechRecognized;
        Voice.onSpeechEnd = onSpeechEnd;
        Voice.onSpeechError = onSpeechError;
        Voice.onSpeechResults = onSpeechResults;
        Voice.onSpeechPartialResults = onSpeechPartialResults;
        Voice.onSpeechVolumeChanged = onSpeechVolumeChanged;

        return () => {
            Voice.destroy().then(Voice.removeAllListeners);
        };
    }, []);

    const onSpeechVolumeChanged = (e) => {
        console.log('onSpeechVolumeChanged: ', e);
        setPitch(e.value);
    };

    const startRecognizing = async () => {
        setRecognized('');
        setPitch('');
        setError('');
        setStarted('');
        setResults([]);
        setPartialResults([]);
        setEnd('');

        try {
            await Voice.start('en-US');
        } catch (e) {
            console.error(e);
        }
    };

    const stopRecognizing = async () => {
        try {
            await Voice.stop();
        } catch (e) {
            console.error(e);
        }
    };

    const cancelRecognizing = async () => {
        try {
            await Voice.cancel();
        } catch (e) {
            console.error(e);
        }
    };

    const destroyRecognizer = async () => {
        try {
            await Voice.destroy();
        } catch (e) {
            console.error(e);
        }
        setRecognized('');
        setPitch('');
        setError('');
        setStarted('');
        setResults([]);
        setPartialResults([]);
        setEnd('');
    };

    const fetchData = async (query) => {
        console.log(query)
        const response = await fetch(`http://localhost:9000/bot`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ query: query }),
        });
        const json = await response.json()
        console.log("json is ", json)
        setData(json.reply)
        setLoading(false)
    }

    const handleSend = () => {
        if (newMessage.trim() === '') return;

        const updatedMessages = [...messages, { text: newMessage, user: 'user' }];
        setMessages(updatedMessages);
        setNewMessage('');
    };


    return (
        <View style={styles.container}>
            {loading ? <Text>Loading....</Text> : <Text>{data}</Text>}

            <View style={styles.inputContainer}>
                <TouchableOpacity style={styles.sendButton} onPress={startRecognizing}>
                    <Image style={{
                        width: 50,
                        height: 50,
                    }} source={require('../assets/mic.png')} />
                </TouchableOpacity>
                {started ?
                    <Text style={{ marginLeft: 16, fontSize: 16 }}>Started...</Text>
                    :
                    <Text style={{ marginLeft: 16, fontSize: 16 }}>Waiting...</Text>
                }
                <TouchableOpacity onPress={destroyRecognizer}>
                    <Text style={{ marginLeft: 16, fontSize: 16 }}>Destroy</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f0f0f0',
    },
    userMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#3498db',
        padding: 8,
        borderRadius: 8,
        marginBottom: 8,
        maxWidth: '70%',
    },
    partnerMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#e1e1e1',
        padding: 8,
        borderRadius: 8,
        marginBottom: 8,
        maxWidth: '70%',
    },
    messageText: {
        color: '#fff',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16,
        justifyContent: 'center',

    },
    input: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 12,
    },
    sendButton: {
        backgroundColor: '#3498db',
        borderRadius: 24,
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginLeft: 8,

    },
    sendButtonText: {
        color: '#fff',
    },
});

export default ChatScreen;
