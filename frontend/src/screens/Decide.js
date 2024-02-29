import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  TouchableOpacity
} from 'react-native';

import Voice from '@react-native-voice/voice';

const VoiceTest = ({navigation}) => {
  const [recognized, setRecognized] = useState('');
  const [pitch, setPitch] = useState('');
  const [error, setError] = useState('');
  const [end, setEnd] = useState('');
  const [started, setStarted] = useState('');
  const [results, setResults] = useState([]);
  const [partialResults, setPartialResults] = useState([]);

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

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={startRecognizing}>
        <Image style={{
          width: 100,
          height: 100,
        }} source={require('../assets/mic.png')} />
      </TouchableOpacity>
      {started ?
        <Text style={styles.header}>Started...</Text>
        :
        <Text style={styles.header}>Waiting...</Text>
      }
      {results.map((result, index) =>{
          if(result=='start detection'){
            destroyRecognizer()
            navigation.navigate('Home')
          }
          if(result=="start"){
            destroyRecognizer()
            navigation.navigate('ChatBot')
          }
          if(result=="document"){
            destroyRecognizer()
            navigation.navigate('OCR')
          }
      }
      )}
      <TouchableOpacity onPress={destroyRecognizer}>
        <Text style={styles.destroy}>Destroy</Text>
      </TouchableOpacity>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  header: {
    fontSize: 20,
    fontWeight: '400'
  },
  destroy: {
    fontSize: 30,
    fontWeight: '600'
  }
});

export default VoiceTest;
