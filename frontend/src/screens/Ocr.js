import React, { useRef, useState, useEffect } from 'react';

import { View, Platform } from 'react-native';
import RTMPPublisher, {
  RTMPPublisherRefProps,
  StreamState,
  AudioInputType,
  BluetoothDeviceStatuses,
} from 'react-native-rtmp-publisher';

import io from 'socket.io-client'

import styles from './App.styles';

import Button from '../components/Button';
import LiveBadge from '../components/LiveBadge';
import usePermissions from '../hooks/usePermissions';
import MicrophoneSelectModal from '../components/MicrophoneSelectModal';

const STREAM_URL = 'rtmp://localhost:1935/live'; // ex: rtmp://a.rtmp.youtube.com/live2
const STREAM_NAME = 'check'; // ex: abcd-1234-abcd-1234-abcd

export default function App() {
  const ws = new WebSocket("ws://127.0.0.1:8080/ws/chat/")
  // io('http:://127.0.0.1:8080/ws/chat/')

  const publisherRef = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasBluetoothDevice, setHasBluetoothDevice] = useState(false);
  const [microphoneModalVisibility, setMicrophoneModalVisibility] = useState(false);

  const { permissionGranted } = usePermissions();
  ws.onmessage = (e) => {
    console.log('data->',e.data)
  }


  const sendMessage = () => {
    const messageToSend = 'start ocr';
    ws.send(messageToSend);
    console.log('Sent message: ', messageToSend);
  };


  const handleOnConnectionFailed = (data) => {
    console.log('Connection Failed: ' + data);
  };

  const handleOnConnectionStarted = (data) => {
    console.log('Connection Started: ' + data);
  };

  const handleOnConnectionSuccess = () => {
    console.log('Connected');
    setIsStreaming(true);
  };

  const handleOnDisconnect = () => {
    console.log('Disconnected');
    setIsStreaming(false);
  };

  const handleOnNewBitrateReceived = (data) => {
    console.log('New Bitrate Received: ' + data);
  };

  const handleOnStreamStateChanged = (data) => {
    if (data == 'CONNECTING') {
      sendMessage()
    }
    console.log('Stream Status: ' + data);
  };

  const handleUnmute = () => {
    publisherRef.current && publisherRef.current.unmute();
    setIsMuted(false);
  };

  const handleMute = () => {
    publisherRef.current && publisherRef.current.mute();
    setIsMuted(true);
  };

  const handleStartStream = () => {
    publisherRef.current && publisherRef.current.startStream();
  };

  const handleStopStream = () => {
    publisherRef.current && publisherRef.current.stopStream();
  };

  const handleSwitchCamera = () => {
    publisherRef.current && publisherRef.current.switchCamera();
  };

  const handleToggleMicrophoneModal = () => {
    setMicrophoneModalVisibility(!microphoneModalVisibility);
  };

  const handleMicrophoneSelect = (selectedMicrophone) => {
    publisherRef.current && publisherRef.current.setAudioInput(selectedMicrophone);
  };

  const handleBluetoothDeviceStatusChange = (status) => {
    switch (status) {
      case BluetoothDeviceStatuses.CONNECTED: {
        setHasBluetoothDevice(true);
        break;
      }

      case BluetoothDeviceStatuses.DISCONNECTED: {
        setHasBluetoothDevice(false);
        break;
      }

      default:
        break;
    }
  };

  return (
    <View style={styles.container}>
      {permissionGranted && (
        <RTMPPublisher
          ref={publisherRef}
          streamURL={STREAM_URL}
          streamName={STREAM_NAME}
          style={styles.publisher_camera}
          onDisconnect={handleOnDisconnect}
          onConnectionFailed={handleOnConnectionFailed}
          onConnectionStarted={handleOnConnectionStarted}
          onConnectionSuccess={handleOnConnectionSuccess}
          onNewBitrateReceived={handleOnNewBitrateReceived}
          onStreamStateChanged={handleOnStreamStateChanged}
          onBluetoothDeviceStatusChanged={handleBluetoothDeviceStatusChange}
        />
      )}
      <View style={styles.footer_container}>
        <View style={styles.mute_container}>
          {isMuted ? (
            <Button type="circle" title="🔇" onPress={handleUnmute} />
          ) : (
            <Button type="circle" title="🔈" onPress={handleMute} />
          )}
        </View>
        <View style={styles.stream_container}>
          {isStreaming ? (
            <Button type="circle" title="🟥" onPress={handleStopStream} />
          ) : (
            <Button type="circle" title="🔴" onPress={handleStartStream} />
          )}
        </View>
        <View style={styles.controller_container}>
          <Button type="circle" title="📷" onPress={handleSwitchCamera} />
          {(Platform.OS === 'ios' || hasBluetoothDevice) && (
            <Button
              type="circle"
              title="🎙"
              onPress={handleToggleMicrophoneModal}
            />
          )}
        </View>
      </View>
      {isStreaming && <LiveBadge />}
      <MicrophoneSelectModal
        onSelect={handleMicrophoneSelect}
        visible={microphoneModalVisibility}
        onClose={handleToggleMicrophoneModal}
      />
    </View>
  );
}
