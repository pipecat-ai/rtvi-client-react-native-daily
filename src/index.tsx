

import { VoiceClient, VoiceClientOptions } from 'realtime-ai';
import { RNDailyTransport } from "./transport";

/**
 * Daily RTVI Voice Client for React Native
 */
export class DailyVoiceClient extends VoiceClient {
  constructor({ ...opts }: VoiceClientOptions) {
    const options: VoiceClientOptions = {
      ...opts,
      transport: RNDailyTransport,
      services: opts.services,
      config: opts.config || [],
    };

    super(options);
  }
}

