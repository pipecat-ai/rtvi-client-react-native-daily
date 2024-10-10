import {
  MediaDeviceInfo, MediaStreamTrack,
} from '@daily-co/react-native-webrtc';
import TypedEmitter from "typed-emitter";
export class RTVIError extends Error {
  readonly status: number | undefined;
  constructor(message?: string, status?: number | undefined);
}
export class ConnectionTimeoutError extends RTVIError {
  constructor(message?: string | undefined);
}
export class StartBotError extends RTVIError {
  readonly error: string;
  constructor(message?: string | undefined, status?: number);
}
export class TransportStartError extends RTVIError {
  constructor(message?: string | undefined);
}
export class BotNotReadyError extends RTVIError {
  constructor(message?: string | undefined);
}
export class ConfigUpdateError extends RTVIError {
  readonly status = 400;
  constructor(message?: string | undefined);
}
/**
 * @deprecated Use RTVIError instead.
 */
export class VoiceError extends RTVIError {
}
export type RTVIClientHelpers = Partial<Record<string, RTVIClientHelper>>;
export type RTVIClientHelperCallbacks = Partial<object>;
export interface RTVIClientHelperOptions {
  /**
   * Callback methods for events / messages
   */
  callbacks?: RTVIClientHelperCallbacks;
}
export abstract class RTVIClientHelper {
  protected _options: RTVIClientHelperOptions;
  protected _client: RTVIClient;
  protected _service: string;
  constructor(options: RTVIClientHelperOptions);
  abstract handleMessage(ev: RTVIMessage): void;
  abstract getMessageTypes(): string[];
  set client(client: RTVIClient);
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
  content: unknown;
};
export type LLMContext = Partial<{
  messages?: LLMContextMessage[];
  tools?: [];
}>;
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
export interface LLMHelperOptions extends RTVIClientHelperOptions {
  callbacks?: LLMHelperCallbacks;
}
export class LLMHelper extends RTVIClientHelper {
  protected _options: LLMHelperOptions;
  constructor(options: LLMHelperOptions);
  getMessageTypes(): string[];
  /**
   * Retrieve the bot's current LLM context.
   * @returns Promise<LLMContext>
   */
  getContext(): Promise<LLMContext>;
  /**
   * Update the bot's LLM context.
   * If this is called while the transport is not in the ready state, the local context will be updated
   * @param context LLMContext - The new context
   * @param interrupt boolean - Whether to interrupt the bot, or wait until it has finished speaking
   * @returns Promise<boolean>
   */
  setContext(context: LLMContext, interrupt?: boolean): Promise<boolean>;
  /**
   * Append a new message to the LLM context.
   * If this is called while the transport is not in the ready state, the local context will be updated
   * @param context LLMContextMessage
   * @param runImmediately boolean - wait until pipeline is idle before running
   * @returns boolean
   */
  appendToMessages(context: LLMContextMessage, runImmediately?: boolean): Promise<boolean>;
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
  handleMessage(ev: RTVIMessage): void;
}
export type TransportState = "disconnected" | "initializing" | "initialized" | "authenticating" | "connecting" | "connected" | "ready" | "disconnecting" | "error";
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
  protected _options: RTVIClientOptions;
  protected _onMessage: (ev: RTVIMessage) => void;
  protected _callbacks: RTVIEventCallbacks;
  protected _state: TransportState;
  protected _expiry?: number;
  constructor();
  abstract initialize(options: RTVIClientOptions, messageHandler: (ev: RTVIMessage) => void): void;
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
  abstract sendMessage(message: RTVIMessage): void;
  abstract get state(): TransportState;
  abstract set state(state: TransportState);
  get expiry(): number | undefined;
  abstract tracks(): Tracks;
}
export enum RTVIEvent {
  MessageError = "messageError",
  Error = "error",
  Connected = "connected",
  Disconnected = "disconnected",
  TransportStateChanged = "transportStateChanged",
  Config = "config",
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
  UserText = "userText",
  BotTranscript = "botTranscript",
  BotText = "botText",
  BotLlmStarted = "botLlmStarted",
  BotLlmStopped = "botLlmStopped",
  LLMFunctionCall = "llmFunctionCall",
  LLMFunctionCallStart = "llmFunctionCallStart",
  LLMJsonCompletion = "llmJsonCompletion",
  StorageItemStored = "storageItemStored"
}
export type RTVIEvents = Partial<{
  connected: () => void;
  disconnected: () => void;
  transportStateChanged: (state: TransportState) => void;
  config: (config: RTVIClientConfigOption[]) => void;
  configUpdated: (config: RTVIClientConfigOption[]) => void;
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
  metrics: (data: PipecatMetricsData) => void;
  userTranscript: (data: TranscriptData) => void;
  userText: (text: UserLLMTextData) => void;
  botTranscript: (data: TranscriptData) => void;
  botText: (text: BotLLMTextData) => void;
  botLlmStarted: (p: Participant) => void;
  botLlmStopped: (p: Participant) => void;
  error: (message: RTVIMessage) => void;
  messageError: (message: RTVIMessage) => void;
  llmFunctionCall: (func: LLMFunctionCallData) => void;
  llmFunctionCallStart: (functionName: string) => void;
  llmJsonCompletion: (data: string) => void;
  storageItemStored: (data: StorageItemStoredData) => void;
}>;
export type RTVIEventHandler<E extends RTVIEvent> = E extends keyof RTVIEvents ? RTVIEvents[E] : never;
/**
 * @deprecated Use RTVIEventHandler instead.
 */
export type VoiceEventHandler = RTVIEventHandler<RTVIEvent>;
/**
 * @deprecated Use RTVIEvents instead.
 */
export type VoiceEvents = RTVIEvents;
export type ConfigOption = {
  name: string;
  value: unknown;
};
export type RTVIClientConfigOption = {
  service: string;
  options: ConfigOption[];
};
export type RTVIURLEndpoints = "connect" | "action";
export type RTVIClientParams = {
  baseUrl: string;
} & Partial<{
  headers?: Headers;
  endpoints: Record<RTVIURLEndpoints, string>;
  requestData?: object;
  config?: RTVIClientConfigOption[];
}> & {
  [key: string]: unknown;
};
export interface RTVIClientOptions {
  /**
   * Parameters passed as JSON stringified body params to all endpoints (e.g. connect)
   */
  params: RTVIClientParams;
  /**
   * Transport class for media streaming
   */
  transport: Transport;
  /**
   * Optional callback methods for RTVI events
   */
  callbacks?: RTVIEventCallbacks;
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
   * Custom start method handler for retrieving auth bundle for transport
   * @param baseUrl
   * @param params
   * @param timeout
   * @param abortController
   * @returns Promise<void>
   */
  customConnectHandler?: (params: RTVIClientParams, timeout: ReturnType<typeof setTimeout> | undefined, abortController: AbortController) => Promise<void>;
  /**
   * Base URL for auth handlers and transport services
   *
   * Defaults to a POST request with a the config object as the body
   * @deprecated Use params.baseUrl instead
   */
  baseUrl?: string;
  /**
   * Service key value pairs (e.g. {llm: "openai"} )
   * @deprecated Use params.services instead
   */
  services?: VoiceClientServices;
  /**
   * Service configuration options for services and further customization
   * @deprecated Use params.config instead
   */
  config?: VoiceClientConfigOption[];
  /**
   * Custom HTTP headers to be send with the POST request to baseUrl
   * @deprecated Use startHeaders instead
   */
  customHeaders?: {
    [key: string]: string;
  };
  /**
   * Custom request parameters to send with the POST request to baseUrl
   * @deprecated Use params instead
   */
  customBodyParams?: object;
}
export type RTVIEventCallbacks = Partial<{
  onGenericMessage: (data: unknown) => void;
  onMessageError: (message: RTVIMessage) => void;
  onError: (message: RTVIMessage) => void;
  onConnected: () => void;
  onDisconnected: () => void;
  onTransportStateChanged: (state: TransportState) => void;
  onConfig: (config: RTVIClientConfigOption[]) => void;
  onConfigDescribe: (configDescription: unknown) => void;
  onActionsAvailable: (actions: unknown) => void;
  onBotConnected: (participant: Participant) => void;
  onBotReady: (botReadyData: BotReadyData) => void;
  onBotDisconnected: (participant: Participant) => void;
  onParticipantJoined: (participant: Participant) => void;
  onParticipantLeft: (participant: Participant) => void;
  onMetrics: (data: PipecatMetricsData) => void;
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
  onUserTranscript: (data: TranscriptData) => void;
  onBotTranscript: (data: TranscriptData) => void;
  onUserText: (text: UserLLMTextData) => void;
  onBotText: (text: BotLLMTextData) => void;
  onBotLlmStarted: (participant: Participant) => void;
  onBotLlmStopped: (participant: Participant) => void;
  onStorageItemStored: (data: StorageItemStoredData) => void;
}>;
declare const RTVIEventEmitter_base: new () => TypedEmitter<RTVIEvents>;
declare abstract class RTVIEventEmitter extends RTVIEventEmitter_base {
}
export class RTVIClient extends RTVIEventEmitter {
  params: RTVIClientParams;
  protected _options: RTVIClientOptions;
  protected _transport: Transport;
  protected _messageDispatcher: MessageDispatcher;
  constructor(options: RTVIClientOptions);
  constructUrl(endpoint: RTVIURLEndpoints): string;
  /**
   * Initialize local media devices
   */
  initDevices(): Promise<void>;
  /**
   * Connect the voice client session with chosen transport
   * Call async (await) to handle errors
   */
  connect(): Promise<unknown>;
  /**
   * Disconnect the voice client from the transport
   * Reset / reinitialize transport and abort any pending requests
   */
  disconnect(): Promise<void>;
  /**
   * Get the current state of the transport
   */
  get connected(): boolean;
  get state(): TransportState;
  get version(): string;
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
   * Request the bot to send the current configuration
   * @returns Promise<RTVIClientConfigOption[]> - Promise that resolves with the bot's configuration
   */
  getConfig(): Promise<RTVIClientConfigOption[]>;
  /**
   * Update pipeline and services
   * @param config - RTVIClientConfigOption[] partial object with the new configuration
   * @param interrupt - boolean flag to interrupt the current pipeline, or wait until the next turn
   * @returns Promise<RTVIMessage> - Promise that resolves with the updated configuration
   */
  updateConfig(config: RTVIClientConfigOption[], interrupt?: boolean): Promise<RTVIMessage>;
  /**
   * Request bot describe the current configuration options
   * @returns Promise<unknown> - Promise that resolves with the bot's configuration description
   */
  describeConfig(): Promise<unknown>;
  /**
   * Returns configuration options for specified service key
   * @param serviceKey - Service name to get options for (e.g. "llm")
   * @param config? - Optional RTVIClientConfigOption[] to update (vs. using remote config)
   * @returns RTVIClientConfigOption | undefined - Configuration options array for the service with specified key or undefined
   */
  getServiceOptionsFromConfig(serviceKey: string, config?: RTVIClientConfigOption[]): Promise<RTVIClientConfigOption | undefined>;
  /**
   * Returns configuration option value (unknown) for specified service key and option name
   * @param serviceKey - Service name to get options for (e.g. "llm")
   * @optional option Name of option return from the config (e.g. "model")
   * @returns Promise<unknown | undefined> - Service configuration option value or undefined
   */
  getServiceOptionValueFromConfig(serviceKey: string, option: string, config?: RTVIClientConfigOption[]): Promise<unknown | undefined>;
  /**
   * Returns config with updated option(s) for specified service key and option name
   * Note: does not update current config, only returns a new object (call updateConfig to apply changes)
   * @param serviceKey - Service name to get options for (e.g. "llm")
   * @param option - Service name to get options for (e.g. "model")
   * @param config - Optional RTVIClientConfigOption[] to update (vs. using current config)
   * @returns Promise<RTVIClientConfigOption[] | undefined> - Configuration options array with updated option(s) or undefined
   */
  setServiceOptionInConfig(serviceKey: string, option: ConfigOption | ConfigOption[], config?: RTVIClientConfigOption[]): Promise<RTVIClientConfigOption[] | undefined>;
  /**
   * Returns config object with update properties from passed array
   * @param configOptions - Array of RTVIClientConfigOption[] to update
   * @param config? - Optional RTVIClientConfigOption[] to update (vs. using current config)
   * @returns Promise<RTVIClientConfigOption[]> - Configuration options
   */
  setConfigOptions(configOptions: RTVIClientConfigOption[], config?: RTVIClientConfigOption[]): Promise<RTVIClientConfigOption[]>;
  /**
   * Dispatch an action message to the bot or http single-turn endpoint
   */
  action(action: RTVIActionRequestData): Promise<RTVIActionResponse>;
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
   * @param message - RTVIMessage object to send
   */
  sendMessage(message: RTVIMessage): void;
  protected handleMessage(ev: RTVIMessage): void;
  /**
   * Register a new helper to the client
   * This (optionally) provides a way to reference helpers directly
   * from the client and use the event dispatcher
   * @param service - Target service for this helper
   * @param helper - Helper instance
   * @returns RTVIClientHelper - Registered helper instance
   */
  registerHelper(service: string, helper: RTVIClientHelper): RTVIClientHelper;
  getHelper<T extends RTVIClientHelper>(service: string): T | undefined;
  unregisterHelper(service: string): void;
  /**
   * @deprecated use connect() instead
   */
  start(): Promise<unknown>;
  /**
   * @deprecated use getConfig instead
   * @returns Promise<RTVIClientConfigOption[]> - Promise that resolves with the bot's configuration
   */
  getBotConfig(): Promise<RTVIClientConfigOption[]>;
  /**
   * @deprecated This getter is deprecated and will be removed in future versions. Use getConfig instead.
   * Current client configuration
   * For the most up-to-date configuration, use getBotConfig method
   * @returns RTVIClientConfigOption[] - Array of configuration options
   */
  get config(): RTVIClientConfigOption[];
  /**
   * Get registered services from voice client constructor options
   * @deprecated Services not accessible via the client instance
   */
  get services(): VoiceClientServices;
  /**
   * @deprecated Services not accessible via the client instance
   */
  set services(services: VoiceClientServices);
}
/**
 * @deprecated Use RTVIClientConfigOption.
 */
export type VoiceClientConfigOption = RTVIClientConfigOption;
/**
 * @deprecated No longer used.
 */
export type VoiceClientServices = {
  [key: string]: string;
};
export const RTVI_MESSAGE_LABEL = "rtvi-ai";
export enum RTVIMessageType {
  CLIENT_READY = "client-ready",
  UPDATE_CONFIG = "update-config",
  GET_CONFIG = "get-config",
  DESCRIBE_CONFIG = "describe-config",
  DESCRIBE_ACTIONS = "describe-actions",
  BOT_READY = "bot-ready",// Bot is connected and ready to receive messages
  ERROR = "error",// Bot initialization error
  ERROR_RESPONSE = "error-response",// Error response from the bot in response to an action
  CONFIG = "config",// Bot configuration
  CONFIG_AVAILABLE = "config-available",// Configuration options available on the bot
  CONFIG_ERROR = "config-error",// Configuration options have changed failed
  ACTIONS_AVAILABLE = "actions-available",// Actions available on the bot
  ACTION_RESPONSE = "action-response",// Action response from the bot
  METRICS = "metrics",// RTVI reporting metrics
  USER_TRANSCRIPTION = "user-transcription",// Local user speech to text transcription
  BOT_TRANSCRIPTION = "bot-transcription",// Bot full text transcription
  USER_STARTED_SPEAKING = "user-started-speaking",// User started speaking
  USER_STOPPED_SPEAKING = "user-stopped-speaking",// User stopped speaking
  BOT_STARTED_SPEAKING = "bot-started-speaking",// Bot started speaking
  BOT_STOPPED_SPEAKING = "bot-stopped-speaking",// Bot stopped speaking
  USER_LLM_TEXT = "user-llm-text",// Aggregated user text which is sent to LLM
  BOT_LLM_TEXT = "bot-llm-text",// Streaming chunk/word, directly after LLM
  BOT_LLM_STARTED = "bot-llm-started",// Unused
  BOT_LLM_STOPPED = "bot-llm-stopped",// Unused
  BOT_TTS_TEXT = "bot-tts-text",// Unused
  BOT_TTS_STARTED = "bot-tts-started",// Unused
  BOT_TTS_STOPPED = "bot-tts-stopped",// Unused
  STORAGE_ITEM_STORED = "storage-item-stored"
}
export type ConfigData = {
  config: RTVIClientConfigOption[];
};
export type BotReadyData = {
  config: RTVIClientConfigOption[];
  version: string;
};
export type PipecatMetricData = {
  processor: string;
  value: number;
};
export type PipecatMetricsData = {
  processing?: PipecatMetricData[];
  ttfb?: PipecatMetricData[];
  characters?: PipecatMetricData[];
};
export type TranscriptData = {
  text: string;
  final: boolean;
  timestamp: string;
  user_id: string;
};
export type UserLLMTextData = {
  text: string;
};
export type BotLLMTextData = {
  text: string;
};
export type StorageItemStoredData = {
  action: string;
  items: unknown;
};
export type RTVIMessageActionResponse = {
  id: string;
  label: string;
  type: string;
  data: {
    result: unknown;
  };
};
export class RTVIMessage {
  id: string;
  label: string;
  type: string;
  data: unknown;
  constructor(type: string, data: unknown, id?: string);
  static clientReady(): RTVIMessage;
  static updateConfig(config: RTVIClientConfigOption[], interrupt?: boolean): RTVIMessage;
  static describeConfig(): RTVIMessage;
  static getBotConfig(): RTVIMessage;
  static describeActions(): RTVIMessage;
}
export const RTVI_ACTION_TYPE = "action";
export type RTVIActionRequestData = {
  service: string;
  action: string;
  arguments?: {
    name: string;
    value: unknown;
  }[];
};
export class RTVIActionRequest extends RTVIMessage {
  constructor(data: RTVIActionRequestData);
}
export type RTVIActionResponse = {
  id: string;
  label: string;
  type: string;
  data: {
    result: unknown;
  };
};
export class MessageDispatcher {
  constructor(client: RTVIClient);
  dispatch(message: RTVIMessage): Promise<RTVIMessage>;
  dispatchAction(action: RTVIActionRequest, onMessage: (message: RTVIMessage) => void): Promise<RTVIMessageActionResponse>;
  resolve(message: RTVIMessage): RTVIMessage;
  reject(message: RTVIMessage): RTVIMessage;
}
/**
 * @deprecated Use RTVIMessageActionResponse instead.
 */
export type VoiceMessageActionResponse = RTVIMessageActionResponse;
/**
 * @deprecated Use RTVIMessageType instead.
 */
export type VoiceMessageType = RTVIMessageType;
/**
 * @deprecated Use RTVIMessage instead.
 */
export class VoiceMessage extends RTVIMessage {
}
export function httpActionGenerator(actionUrl: string, action: RTVIActionRequest, params: RTVIClientParams, handleResponse: (response: RTVIActionResponse) => void): Promise<void>;
