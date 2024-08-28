# Daily Real-Time Voice Inference React Native SDK

[RTVI-AI](https://github.com/rtvi-ai/) is an open standard for Real-Time Voice [and Video] Inference.

This library exports a VoiceClient that has the [Daily](https://www.daily.co/) transport associated.

## Minimum OS/SDK versions

This package introduces some constraints on what OS/SDK versions your project can support:

- **iOS**: Deployment target >= 13
- **Android**: `minSdkVersion` >= 24

## Installation

Install `react-native-realtime-ai-daily` along with its peer dependencies:

```bash
npm i react-native-realtime-ai-daily
npm i @daily-co/react-native-daily-js@^0.68.0
npm i @daily-co/react-native-webrtc@^118.0.3-daily.2
npm i @react-native-async-storage/async-storage@^1.23.1
npm i react-native-background-timer@^2.4.1
npm i react-native-get-random-values@^1.11.0
```

If you are using Expo, you will also need to add the following dependencies:
```bash
npm i @config-plugins/react-native-webrtc@^9.0.0
npm i @daily-co/config-plugin-rn-daily-js@0.0.6
```

All the details about Expo can be found [here](https://github.com/daily-co/rn-daily-js-expo-config-plugin).

A full demo can be found [here](https://github.com/daily-demos/daily-bots-react-native-demo/)

## Quick Start

Instantiate a `VoiceClient` instance, wire up the bot's audio, and start the conversation:

```typescript
let voiceClient = new DailyVoiceClient({
  baseUrl: baseUrl,
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
  timeout: 15 * 1000,
  enableCam: false,
})

await voiceClient.start()
```

## References
- [RTVI-AI overview](https://github.com/rtvi-ai/).
- [RTVI-AI reference docs](https://rtvi.mintlify.app/api-reference/introduction).

## Contributing

We are welcoming contributions to this project in form of issues and pull request. For questions about RTVI head over to the [Pipecat discord server](https://discord.gg/pipecat) and check the [#rtvi](https://discord.com/channels/1239284677165056021/1265086477964935218) channel.
