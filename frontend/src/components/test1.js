import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Animated, StyleSheet, Easing, Image } from 'react-native'; // Import the microphone icon from Expo

const ChatBot = () => {
    const [recognized, setRecognized] = useState('');
    const [pitch, setPitch] = useState('');
    const [error, setError] = useState('');
    const [end, setEnd] = useState('');
    const [started, setStarted] = useState('');
    const [results, setResults] = useState([]);
    const [partialResults, setPartialResults] = useState([]);

    const [loading, setLoading] = useState(true);


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
            fetchData(e.value.pop())
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
        // destroyRecognizer()
        console.log(query)
        // console.log('testing...')
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
        Tts.speak(json.reply)
        setLoading(false)
    }

    const [messages, setMessages] = useState([
        { text: 'Hi, how can I help you today?', user: false },
        { text: 'You can start by asking me a question.', user: false },
    ]);
    const [isListening, setIsListening] = useState(false);
    const scrollViewRef = useRef(null);
    const animatedValue = useRef(new Animated.Value(1)).current;

    const scrollToBottom = () => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({ animated: true });
        }
    };

    const handleBotResponse = () => {
        // Simulate bot typing with a delay
        setMessages([...messages, { text: 'Bot is typing...', user: false }]);
        scrollToBottom();

        // Simulate bot response
        setTimeout(() => {
            setMessages([...messages, { text: 'Hello! How can I assist you?', user: false }]);
            scrollToBottom();
        }, 1500);
    };

    const toggleListening = () => {
        if (isListening) {
            // Stop listening and handle the user's voice input
            setIsListening(false);

            // Handle user's voice input here and then trigger bot response
            handleBotResponse();
        } else {
            // Start listening
            setIsListening(true);

            // Animate the button when it's clicked
            Animated.sequence([
                Animated.timing(animatedValue, {
                    toValue: 1.2,
                    duration: 100,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
                Animated.timing(animatedValue, {
                    toValue: 1,
                    duration: 100,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    };

    useEffect(() => {
        scrollToBottom();

        // You would typically use a voice recognition library here
    }, [messages]);

    return (
        <View style={styles.container}>
            <ScrollView ref={scrollViewRef} contentContainerStyle={styles.scrollViewContent}>
                {messages.map((message, index) => (
                    <View key={index} style={message.user ? styles.userMessage : styles.botMessage}>
                        <Text style={message.user ? styles.userText : styles.botText}>{message.text}</Text>
                    </View>
                ))}
            </ScrollView>
            <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={-30}>
                <View style={styles.microphoneContainer}>
                    <Animated.View
                        style={{
                            transform: [{ scale: animatedValue }],
                        }}
                    >
                        <TouchableOpacity onPress={toggleListening}>
                            <Image source={require('../assets/speaker.png')} style={{ width: 100, height: 100 }} />
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
    },
    scrollViewContent: {
        paddingVertical: 20,
    },
    userMessage: {
        alignSelf: 'flex-end',
        marginBottom: 10,
        backgroundColor: '#007AFF',
        padding: 10,
        marginHorizontal: 20,
        borderRadius: 10,
    },
    botMessage: {
        alignSelf: 'flex-start',
        marginBottom: 10,
        backgroundColor: '#E5E5EA',
        padding: 10,
        marginHorizontal: 20,
        borderRadius: 10,
    },
    userText: {
        color: 'white',
    },
    botText: {
        color: 'black',
    },
    microphoneContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10,
    },
});

export default ChatBot;
