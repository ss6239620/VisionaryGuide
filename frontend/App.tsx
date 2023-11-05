import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './src/screens/Home';
import SplashScreen from './src/screens/Splash';
import Decide from './src/screens/Decide';
import Chatbot from './src/screens/Chatbot';
import Ocr from './src/screens/Ocr';

export type RootStackParamList = {
  Home: {};
  Splash: { streamName: string };
  Decide: { streamName: string };
  ChatBot: { streamName: string };
  OCR: { streamName: string };

};

const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Splash'>
        <Stack.Screen
          name='Splash'
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='Decide'
          component={Decide}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="ChatBot" component={Chatbot} />
        <Stack.Screen name="OCR" component={Ocr} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
