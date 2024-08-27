import {
  View,
  SafeAreaView,
  StyleSheet,
  Text,
  Button,
  TextInput,
} from "react-native"

import React, { useEffect, useState } from "react"

import { DailyVoiceClient } from 'react-native-realtime-ai-daily'
import { TransportState } from 'realtime-ai';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f7f9fa",
    width: "100%",
  },
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    color: '#333',
  },
  baseUrlInput: {
    borderRadius: 8,
    marginVertical: 8,
    padding: 12,
    fontStyle: "normal",
    fontWeight: "normal",
    borderWidth: 1,
    width: "100%",
  },
})

const ROOM_URL_TEMPLATE = process.env.EXPO_PUBLIC_BASE_URL

export default function App() {

  const [roomUrl, setRoomUrl] = useState<String>(ROOM_URL_TEMPLATE)

  const [voiceClient, setVoiceClient] = useState<DailyVoiceClient|undefined>()

  const [inCall, setInCall] = useState<boolean>(false)
  const [currentState, setCurrentState] = useState<TransportState>("idle")

  const createVoiceClient = () => {
    let voiceClient = new DailyVoiceClient({
      baseUrl: roomUrl,
      enableMic: true,
      services: {
        llm: "together",
        tts: "cartesia",
      },
      config: [
        {
          service: "tts",
          options: [
            { name: "voice", value: "79a125e8-cd45-4c13-8a67-188112f4dd22" },
          ],
        },
        {
          service: "llm",
          options: [
            { name: "model", value: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo" },
            {
              name: "initial_messages",
              value: [
                {
                  role: "system",
                  content:
                    "You are a assistant called Frankie. You can ask me anything. Keep responses brief and legible. Introduce yourself first.",
                },
              ],
            },
            { name: "run_on_config", value: true },
          ],
        },
      ],
      // Note: In a production environment, it is recommended to avoid calling Daily's API endpoint directly.
      // Instead, you should route requests through your own server to handle authentication, validation,
      // and any other necessary logic. Therefore, the baseUrl should be set to the URL of your own server.
      customHeaders: {
        "Authorization": `Bearer ${process.env.EXPO_PUBLIC_DAILY_API_KEY}`
      },
      customBodyParams: {
        "bot_profile": "voice_2024_08",
        "max_duration": 680
      },
      timeout: 15 * 1000,
      enableCam: false,
    })
    return voiceClient
  }

  const start = async () => {
    try {
      let voiceClient = createVoiceClient()
      setVoiceClient(voiceClient)
      await voiceClient?.start()
    } catch (e) {
      console.log("Failed to start the bot", e)
    }
  }

  const leave = async () => {
    try {
      if (voiceClient) {
        await voiceClient.disconnect()
        setCurrentState(voiceClient.state)
        setVoiceClient(undefined)
      }
    } catch (e) {
      console.log("Failed to disconnect", e)
    }
  }

  //Add the listeners
  useEffect(() => {
    if (!voiceClient) {
      return
    }
    voiceClient
      .on("transportStateChanged", (state) => {
        setCurrentState(voiceClient.state)
        const inCallStates = ["authenticating", "connecting", "connected", "ready"];
        setInCall(inCallStates.includes(state))
      })
      .on("error", (error) => {
        console.log("error", error)
      })
    return () => {}
  }, [voiceClient])

  return (
    <SafeAreaView style={styles.safeArea}>
      {inCall ? (
        <View style={styles.mainContainer}>
          <Text style={styles.title}>RTVI session state:</Text>
          <Text style={styles.text}>{currentState}</Text>
          <Button
            onPress={() => leave()}
            color="#FF0000" // Red color
            title="Disconnect"
          ></Button>
        </View>
        ) : (
        <View style={styles.mainContainer}>
          <Text style={styles.title}>Connect to an RTVI server</Text>
          <Text style={styles.text}>Backend URL</Text>
          <TextInput
            style={styles.baseUrlInput}
            value={roomUrl}
            onChangeText={(newRoomURL) => {
              setRoomUrl(newRoomURL)
            }}
          />
          <Button
            onPress={() => start()}
            title="Connect"
          ></Button>
        </View>
      )}
    </SafeAreaView>
  )
}
