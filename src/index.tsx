import { RTVIClient, RTVIClientOptions } from '@pipecat-ai/client-js';
import { RNDailyTransport } from "./transport";
import VoiceClientVideoView from './view/VoiceClientVideoView';

/**
 * Daily RTVI Voice Client for React Native
 */
export class DailyVoiceClient extends RTVIClient {
  constructor({ ...opts }: RTVIClientOptions) {
    const options: RTVIClientOptions = {
      ...opts,
      transport: new RNDailyTransport(),
    };
    super(options);
  }
}

export { VoiceClientVideoView, RNDailyTransport }

