import {
  MediaDeviceInfo, MediaStreamTrack,
} from '@daily-co/react-native-webrtc';
import TypedEmitter from "typed-emitter";
export class VoiceError extends Error {
  readonly status: number | undefined;
  readonly error: unknown | undefined;
  constructor(message?: string, status?: number | undefined);
}
export class ConnectionTimeoutError extends VoiceError {
  constructor(message?: string | undefined);
}
export class StartBotError extends VoiceError {
  readonly error: string;
  constructor(message?: string | undefined, status?: number, error?: string);
}
export class TransportStartError extends VoiceError {
  constructor(message?: string | undefined);
}
export class BotNotReadyError extends VoiceError {
  constructor(message?: string | undefined);
}
export class ConfigUpdateError extends VoiceError {
  readonly status = 400;
  constructor(message?: string | undefined);
}
export type TransportState = "idle" | "initializing" | "initialized" | "authenticating" | "connecting" | "connected" | "ready" | "disconnected" | "error";
export type Participant = {
  id: string;
  name: string;
  local: boolean;
};
export type Tracks = {
  local: {
    audio?: MediaStreamTrack;
    video?: MediaStreamTrack;
  };
  bot?: {
    audio?: MediaStreamTrack;
    video?: MediaStreamTrack;
  };
};
export abstract class Transport {
  protected _options: VoiceClientOptions;
  protected _callbacks: VoiceEventCallbacks;
  protected _config: VoiceClientConfigOption[];
  protected _onMessage: (ev: VoiceMessage) => void;
  protected _state: TransportState;
  protected _expiry?: number;
  constructor(options: VoiceClientOptions, onMessage: (ev: VoiceMessage) => void);
  abstract initDevices(): Promise<void>;
  abstract connect(authBundle: unknown, abortController: AbortController): Promise<void>;
  abstract disconnect(): Promise<void>;
  abstract sendReadyMessage(): void;
  abstract getAllMics(): Promise<MediaDeviceInfo[]>;
  abstract getAllCams(): Promise<MediaDeviceInfo[]>;
  abstract updateMic(micId: string): void;
  abstract updateCam(camId: string): void;
  abstract get selectedMic(): MediaDeviceInfo | Record<string, never>;
  abstract get selectedCam(): MediaDeviceInfo | Record<string, never>;
  abstract enableMic(enable: boolean): void;
  abstract enableCam(enable: boolean): void;
  abstract get isCamEnabled(): boolean;
  abstract get isMicEnabled(): boolean;
  abstract sendMessage(message: VoiceMessage): void;
  abstract get state(): TransportState;
  abstract set state(state: TransportState);
  get expiry(): number | undefined;
  abstract tracks(): Tracks;
}
export enum VoiceEvent {
  MessageError = "messageError",
  Error = "error",
  Connected = "connected",
  Disconnected = "disconnected",
  TransportStateChanged = "transportStateChanged",
  ConfigUpdated = "configUpdated",
  ConfigDescribe = "configDescribe",
  ActionsAvailable = "actionsAvailable",
  ParticipantConnected = "participantConnected",
  ParticipantLeft = "participantLeft",
  TrackStarted = "trackStarted",
  TrackedStopped = "trackStopped",
  AvailableCamsUpdated = "availableCamsUpdated",
  AvailableMicsUpdated = "availableMicsUpdated",
  CamUpdated = "camUpdated",
  MicUpdated = "micUpdated",
  BotConnected = "botConnected",
  BotReady = "botReady",
  BotDisconnected = "botDisconnected",
  BotStartedSpeaking = "botStartedSpeaking",
  BotStoppedSpeaking = "botStoppedSpeaking",
  RemoteAudioLevel = "remoteAudioLevel",
  UserStartedSpeaking = "userStartedSpeaking",
  UserStoppedSpeaking = "userStoppedSpeaking",
  LocalAudioLevel = "localAudioLevel",
  Metrics = "metrics",
  UserTranscript = "userTranscript",
  BotTranscript = "botTranscript",
  LLMFunctionCall = "llmFunctionCall",
  LLMFunctionCallStart = "llmFunctionCallStart",
  LLMJsonCompletion = "llmJsonCompletion"
}
export type VoiceEvents = Partial<{
  connected: () => void;
  disconnected: () => void;
  transportStateChanged: (state: TransportState) => void;
  configUpdated: (config: VoiceClientConfigOption[]) => void;
  configDescribe: (configDescription: unknown) => void;
  actionsAvailable: (actions: unknown) => void;
  participantConnected: (p: Participant) => void;
  participantLeft: (p: Participant) => void;
  trackStarted: (track: MediaStreamTrack, p?: Participant) => void;
  trackStopped: (track: MediaStreamTrack, p?: Participant) => void;
  availableCamsUpdated: (cams: MediaDeviceInfo[]) => void;
  availableMicsUpdated: (cams: MediaDeviceInfo[]) => void;
  camUpdated: (cam: MediaDeviceInfo) => void;
  micUpdated: (cam: MediaDeviceInfo) => void;
  botReady: (botData: BotReadyData) => void;
  botConnected: (p: Participant) => void;
  botDisconnected: (p: Participant) => void;
  botStartedSpeaking: (p: Participant) => void;
  botStoppedSpeaking: (p: Participant) => void;
  remoteAudioLevel: (level: number, p: Participant) => void;
  userStartedSpeaking: () => void;
  userStoppedSpeaking: () => void;
  localAudioLevel: (level: number) => void;
  metrics: (data: PipecatMetrics) => void;
  userTranscript: (data: Transcript) => void;
  botTranscript: (text: string) => void;
  error: (message: VoiceMessage) => void;
  messageError: (message: VoiceMessage) => void;
  llmFunctionCall: (func: LLMFunctionCallData) => void;
  llmFunctionCallStart: (functionName: string) => void;
  llmJsonCompletion: (data: string) => void;
}>;
export type VoiceEventHandler<E extends VoiceEvent> = E extends keyof VoiceEvents ? VoiceEvents[E] : never;
export type VoiceEventCallbacks = Partial<{
  onGenericMessage: (data: unknown) => void;
  onMessageError: (message: VoiceMessage) => void;
  onError: (message: VoiceMessage) => void;
  onConnected: () => void;
  onDisconnected: () => void;
  onTransportStateChanged: (state: TransportState) => void;
  onConfigUpdated: (config: VoiceClientConfigOption[]) => void;
  onConfigDescribe: (configDescription: unknown) => void;
  onActionsAvailable: (actions: unknown) => void;
  onBotConnected: (participant: Participant) => void;
  onBotReady: (botReadyData: BotReadyData) => void;
  onBotDisconnected: (participant: Participant) => void;
  onParticipantJoined: (participant: Participant) => void;
  onParticipantLeft: (participant: Participant) => void;
  onAvailableCamsUpdated: (cams: MediaDeviceInfo[]) => void;
  onAvailableMicsUpdated: (mics: MediaDeviceInfo[]) => void;
  onCamUpdated: (cam: MediaDeviceInfo) => void;
  onMicUpdated: (mic: MediaDeviceInfo) => void;
  onTrackStarted: (track: MediaStreamTrack, participant?: Participant) => void;
  onTrackStopped: (track: MediaStreamTrack, participant?: Participant) => void;
  onLocalAudioLevel: (level: number) => void;
  onRemoteAudioLevel: (level: number, participant: Participant) => void;
  onBotStartedSpeaking: (participant: Participant) => void;
  onBotStoppedSpeaking: (participant: Participant) => void;
  onUserStartedSpeaking: () => void;
  onUserStoppedSpeaking: () => void;
  onMetrics: (data: PipecatMetrics) => void;
  onUserTranscript: (data: Transcript) => void;
  onBotTranscript: (data: string) => void;
}>;
declare const Client_base: new () => TypedEmitter<VoiceEvents>;
export abstract class Client extends Client_base {
  protected _options: VoiceClientOptions;
  constructor(options: VoiceClientOptions);
  /**
   * Register a new helper to the client
   * This (optionally) provides a way to reference the helper directly
   * from the client and use the event dispatcher
   * @param service - Targer service for this helper
   * @param helper - Helper instance
   */
  registerHelper(service: string, helper: VoiceClientHelper): VoiceClientHelper;
  getHelper<T extends VoiceClientHelper>(service: string): T;
  unregisterHelper(service: string): void;
  /**
   * Initialize the local media devices
   */
  initDevices(): Promise<void>;
  /**
   * Start the voice client session with chosen transport
   * Call async (await) to handle errors
   */
  start(): Promise<unknown>;
  /**
   * Disconnect the voice client from the transport
   * Reset / reinitialize transport and abort any pending requests
   */
  disconnect(): Promise<void>;
  /**
   * Get the current state of the transport
   */
  get state(): TransportState;
  /**
   * Get registered services from voice client constructor options
   */
  get services(): VoiceClientServices;
  set services(services: VoiceClientServices);
  getAllMics(): Promise<MediaDeviceInfo[]>;
  getAllCams(): Promise<MediaDeviceInfo[]>;
  get selectedMic(): MediaDeviceInfo | Record<string, never>;
  get selectedCam(): MediaDeviceInfo | Record<string, never>;
  updateMic(micId: string): void;
  updateCam(camId: string): void;
  enableMic(enable: boolean): void;
  get isMicEnabled(): boolean;
  enableCam(enable: boolean): void;
  get isCamEnabled(): boolean;
  tracks(): Tracks;
  /**
   * Current client configuration
   * For the most up-to-date configuration, use getBotConfig method
   * @returns VoiceClientConfigOption[] - Array of configuration options
   */
  get config(): VoiceClientConfigOption[];
  /**
   * Request the bot to send its current configuration
   * @returns Promise<unknown> - Promise that resolves with the bot's configuration
   */
  getBotConfig(): Promise<unknown>;
  /**
   * Update pipeline and services
   * @param config - VoiceClientConfigOption[] partial object with the new configuration
     * @param interrupt - boolean flag to interrupt the current pipeline, or wait until the next turn
   * @returns Promise<unknown> - Promise that resolves with the updated configuration
   */
    updateConfig(config: VoiceClientConfigOption[], interrupt?: boolean): Promise<unknown>;
  /**
   * Request bot describe the current configuration options
   * @returns Promise<unknown> - Promise that resolves with the bot's configuration description
   */
  describeConfig(): Promise<unknown>;
  /**
   * Returns configuration options for specified service key
   * @param serviceKey - Service name to get options for (e.g. "llm")
     * @returns VoiceClientConfigOption - Configuration options array for the service with specified key
     */
    getServiceOptionsFromConfig(serviceKey: string): VoiceClientConfigOption | undefined;
    /**
     * Returns configuration option value (unknown) for specified service key and option name
     * @param serviceKey - Service name to get options for (e.g. "llm")
     * @optional option Name of option return from the config (e.g. "model")
     * @returns unknown - Service configuration option value
   */
    getServiceOptionValueFromConfig(serviceKey: string, option: string): unknown | undefined;
  /**
     * Returns config with updated option(s) for specified service key and option name
     * Note: does not update current config, only returns a new object (call updateConfig to apply changes)
   * @param serviceKey - Service name to get options for (e.g. "llm")
     * @param option - Service name to get options for (e.g. "model")
     * @param config? - Optional VoiceClientConfigOption[] to update (vs. using current config)
     * @returns VoiceClientConfigOption[] - Configuration options
     */
    setServiceOptionInConfig(serviceKey: string, option: ConfigOption | ConfigOption[], config?: VoiceClientConfigOption[]): VoiceClientConfigOption[];
    /**
     * Returns config object with update properties from passed array
     * @param configOptions - Array of VoiceClientConfigOption[] to update
     * @param config? - Optional VoiceClientConfigOption[] to update (vs. using current config)
   * @returns VoiceClientConfigOption[] - Configuration options
   */
    setConfigOptions(configOptions: VoiceClientConfigOption[], config?: VoiceClientConfigOption[]): VoiceClientConfigOption[];
    /**
     * Returns a full config array by merging partial config with existing config
     * @param config - Service name to get options for (e.g. "llm")
     * @returns VoiceClientConfigOption[] - Configuration options
     */
  partialToConfig(config: VoiceClientConfigOption[]): VoiceClientConfigOption[];
  /**
   * Dispatch an action message to the bot
   * @param action - ActionData object with the action to dispatch
   * @returns Promise<unknown> - Promise that resolves with the action response
   */
  action(action: ActionData): Promise<unknown>;
  /**
   * Describe available / registered actions the bot has
   * @returns Promise<unknown> - Promise that resolves with the bot's actions
   */
  describeActions(): Promise<unknown>;
  /**
   * Get the session expiry time for the transport session (if applicable)
   * @returns number - Expiry time in milliseconds
   */
  get transportExpiry(): number | undefined;
  /**
   * Directly send a message to the bot via the transport
   * @param message - VoiceMessage object to send
   */
  sendMessage(message: VoiceMessage): void;
  protected handleMessage(ev: VoiceMessage): void;
}
export enum VoiceMessageType {
  CLIENT_READY = "client-ready",
  UPDATE_CONFIG = "update-config",
  GET_CONFIG = "get-config",
  DESCRIBE_CONFIG = "describe-config",
  ACTION = "action",
  DESCRIBE_ACTIONS = "describe-actions",
  BOT_READY = "bot-ready",// Bot is connected and ready to receive messages
  TRANSCRIPT = "transcript",// STT transcript (both local and remote) flagged with partial, final or sentence
  CONFIG = "config",// Bot configuration
  ERROR = "error",// Bot initialization error
  ERROR_RESPONSE = "error-response",// Error response from the bot in response to an action
  CONFIG_AVAILABLE = "config-available",// Configuration options available on the bot
  CONFIG_UPDATED = "config-updated",// Configuration options have changed successfully
  CONFIG_ERROR = "config-error",// Configuration options have changed failed
  ACTIONS_AVAILABLE = "actions-available",// Actions available on the bot
  ACTION_RESPONSE = "action-response",
  METRICS = "metrics",// RTVI reporting metrics
  USER_TRANSCRIPTION = "user-transcription",// Local user speech to text
  BOT_TRANSCRIPTION = "tts-text",// Bot speech to text
  USER_STARTED_SPEAKING = "user-started-speaking",// User started speaking
  USER_STOPPED_SPEAKING = "user-stopped-speaking",// User stopped speaking
  BOT_STARTED_SPEAKING = "bot-started-speaking",// Bot started speaking
  BOT_STOPPED_SPEAKING = "bot-stopped-speaking"
}
export type ConfigData = {
  config: VoiceClientConfigOption[];
};
export type BotReadyData = {
  config: VoiceClientConfigOption[];
  version: string;
};
export type ActionData = {
  service: string;
  action: string;
  arguments: {
    name: string;
    value: unknown;
  }[];
};
export type PipecatMetricsData = {
  processor: string;
  value: number;
};
export type PipecatMetrics = {
  processing?: PipecatMetricsData[];
  ttfb?: PipecatMetricsData[];
  characters?: PipecatMetricsData[];
};
export type Transcript = {
  text: string;
  final: boolean;
  timestamp: string;
  user_id: string;
};
export class VoiceMessage {
  id: string;
  label: string;
  type: string;
  data: unknown;
  constructor(type: string, data: unknown, id?: string);
  serialize(): string;
  static clientReady(): VoiceMessage;
  static updateConfig(config: VoiceClientConfigOption[]): VoiceMessage;
  static describeConfig(): VoiceMessage;
  static getBotConfig(): VoiceMessage;
  static describeActions(): VoiceMessage;
  static action(data: ActionData): VoiceMessage;
}
export class VoiceMessageMetrics extends VoiceMessage {
  constructor(data: PipecatMetrics);
}
export class MessageDispatcher {
  constructor(transport: Transport);
  dispatch(message: VoiceMessage, shouldReject?: boolean): Promise<unknown>;
  resolve(message: VoiceMessage): VoiceMessage;
  reject(message: VoiceMessage): VoiceMessage;
}
export type VoiceClientHelpers = Partial<Record<string, VoiceClientHelper>>;
export type VoiceClientHelperCallbacks = Partial<object>;
export interface VoiceClientHelperOptions {
  /**
   * Callback methods for events / messages
   */
  callbacks?: VoiceClientHelperCallbacks;
}
export abstract class VoiceClientHelper {
  protected _options: VoiceClientHelperOptions;
  protected _voiceClient: VoiceClient;
  protected _service: string;
  constructor(options: VoiceClientHelperOptions);
  abstract handleMessage(ev: VoiceMessage): void;
  abstract getMessageTypes(): string[];
  set voiceClient(voiceClient: VoiceClient);
  set service(service: string);
}
export type LLMFunctionCallData = {
  function_name: string;
  tool_call_id: string;
  args: unknown;
  result?: unknown;
};
export type LLMContextMessage = {
  role: string;
  content: string;
};
export type LLMContext = {
  messages?: LLMContextMessage[];
};
export type FunctionCallParams = {
  functionName: string;
  arguments: unknown;
};
export type FunctionCallCallback = (fn: FunctionCallParams) => Promise<unknown>;
export enum LLMMessageType {
  LLM_FUNCTION_CALL = "llm-function-call",
  LLM_FUNCTION_CALL_START = "llm-function-call-start",
  LLM_FUNCTION_CALL_RESULT = "llm-function-call-result",
  LLM_JSON_COMPLETION = "llm-json-completion"
}
export type LLMHelperCallbacks = Partial<{
  onLLMJsonCompletion: (jsonString: string) => void;
  onLLMFunctionCall: (func: LLMFunctionCallData) => void;
  onLLMFunctionCallStart: (functionName: string) => void;
  onLLMMessage: (message: LLMContextMessage) => void;
}>;
export interface LLMHelperOptions extends VoiceClientHelperOptions {
  callbacks?: LLMHelperCallbacks;
}
export class LLMHelper extends VoiceClientHelper {
  protected _options: LLMHelperOptions;
  constructor(options: LLMHelperOptions);
  getMessageTypes(): string[];
  /**
     * Bot's current LLM context.
     * @returns Promise<LLMContextMessage[]>
   */
    getContext(): Promise<LLMContextMessage[]>;
  /**
   * Update the bot's LLM context.
   * If this is called while the transport is not in the ready state, the local context will be updated
   * @param context LLMContext - The new context
   * @param interrupt boolean - Whether to interrupt the bot, or wait until it has finished speaking
   * @returns Promise<unknown>
   */
    setContext(context: LLMContext, interrupt?: boolean): Promise<VoiceClientConfigOption[]>;
  /**
   * Append a new message to the LLM context.
   * If this is called while the transport is not in the ready state, the local context will be updated
   * @param context LLMContextMessage
   * @param runImmediately boolean - wait until pipeline is idle before running
   * @returns
   */
    appendToMessages(context: LLMContextMessage, runImmediately?: boolean): Promise<VoiceClientConfigOption[]>;
  /**
   * Run the bot's current LLM context.
   * Useful when appending messages to the context without runImmediately set to true.
   * Will do nothing if the bot is not in the ready state.
   * @param interrupt boolean - Whether to interrupt the bot, or wait until it has finished speaking
   * @returns Promise<unknown>
   */
  run(interrupt?: boolean): Promise<unknown>;
  /**
   * If the LLM wants to call a function, RTVI will invoke the callback defined
   * here. Whatever the callback returns will be sent to the LLM as the function result.
   * @param callback
   * @returns void
   */
  handleFunctionCall(callback: FunctionCallCallback): void;
  handleMessage(ev: VoiceMessage): void;
}
export interface VoiceClientOptions {
  /**
   * Base URL for auth handlers and transport services
   *
   * Defaults to a POST request with a the config object as the body
   */
  baseUrl: string;
  /**
   * Set transport class for media streaming
   */
  transport?: new (options: VoiceClientOptions, onMessage: (ev: VoiceMessage) => void) => Transport;
  /**
   * Optional callback methods for voice events
   */
  callbacks?: VoiceEventCallbacks;
  /**
   * Service key value pairs (e.g. {llm: "openai"} )
   * A client must have at least one service to connect to a voice server
   */
  services: VoiceClientServices;
  /**
   * Service configuration options for services and further customization
   */
  config?: VoiceClientConfigOption[];
  /**
   * Handshake timeout
   *
   * How long should the client wait for the bot ready event (when authenticating / requesting an agent)
   * Defaults to no timeout (undefined)
   */
  timeout?: number;
  /**
   * Enable user mic input
   *
   * Default to true
   */
  enableMic?: boolean;
  /**
   * Enable user cam input
   *
   * Default to false
   */
  enableCam?: boolean;
  /**
   * Custom HTTP headers to be send with the POST request to baseUrl
   */
  customHeaders?: {
    [key: string]: string;
  };
  /**
   * Custom request parameters to send with the POST request to baseUrl
   */
  customBodyParams?: object;
  /**
   * Custom start method handler for retrieving auth bundle for transport
   * @param abortController
   * @returns Promise<void>
   */
  customAuthHandler?: (baseUrl: string, timeout: number | undefined, abortController: AbortController) => Promise<void>;
}
export type ConfigOption = {
  name: string;
  value: unknown;
};
export type VoiceClientConfigOption = {
  service: string;
  options: ConfigOption[];
};
export type VoiceClientServices = {
  [key: string]: string;
};
/**
 * RTVI Voice Client
 */
export class VoiceClient extends Client {
  constructor({ ...opts }: VoiceClientOptions);
}

//# sourceMappingURL=index.d.ts.map
