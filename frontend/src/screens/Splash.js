import { View, Text, Image, Animated, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect, useState, useRef } from 'react'

const SplashScreen = ({ navigation }) => {
  const [animating, setAnimating] = useState(false)
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true
      }),
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true
      }),
    ]).start();
    setTimeout(async () => {
      setAnimating(false);
      navigation.navigate("Decide")
    }, 3000)
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoContainer, { opacity: fadeAnim, transform: [{ scale: slideAnim }] }]}>
        <Image source={require('../assets/blind.jpg')} style={styles.logo} />
        <Text style={styles.logoText}>VisionaryGuide</Text>
      </Animated.View>
    </View>
  )
}

export default SplashScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'pink',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 16,

  },
  logoText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '500',
    marginTop: 10,
  },
});