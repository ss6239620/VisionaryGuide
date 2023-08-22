import { View, Text ,StyleSheet} from 'react-native'
import React from 'react'
import {useCameraDevices,Camera,useFrameProcessor} from 'react-native-vision-camera'

function App() {
  const devices = useCameraDevices()
  const device = devices.front
  const frameProcessor = useFrameProcessor((frame) => {
    'worklet'
    console.log(frame.toString)
  }, [])

  if (device == null) return <Text>Refreshing....</Text>
  return (
    <Camera
      style={StyleSheet.absoluteFill}
      device={device}
      isActive={true}
      frameProcessor={frameProcessor}
    />
  )
}
export default App