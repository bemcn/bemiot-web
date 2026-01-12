export interface StreamProxyParam {
  app: string;
  stream: string;
  url: string;
  rtpType?: number;
  retryCount?: number;
  timeoutSec?: number;
  enableHls?: number;
  enableRtsp?: number;
  enableRtmp?: number;
  enableTs?: number;
  enableAudio?: number;
  enableFmp4?: number;
  enableMp4?: number;
  mp4MaxSecond?: number;
  rtspSpeed?: number;
  autoClose?: number;
}

export interface StreamPushProxyParam {
  app: string;
  stream: string;
  schema: string;
  url: string;
  rtpType?: number;
  timeoutSec?: number;
}

export interface CloseStreamParam {
  app: string;
  stream: string;
  force: string;
  schema: string;
}

export interface CloseStreamsParam {
  app?: string;
  stream?: string;
  force?: string;
  schema?: string;
}

export interface GetMediaListParam {
  app?: string;
  stream?: string;
  schema?: string;
}

export interface MediaQueryParam {
  app: string;
  stream: string;
  schema: string;
}

export interface StartRecordParam {
  app: string;
  stream: string;
  type: number;
  customizedPath?: string;
  maxSecond?: number;
}

export interface StopRecordParam {
  app: string;
  stream: string;
  type: number;
}

export interface RecordStatusParam {
  app: string;
  stream: string;
  type: number;
}

export interface OpenRtpServerParam {
  port: number;
  tcpMode: number;
  stream: string;
}

export interface TranscodeParam {
  url: string;
  app: string;
  enableAudio?: boolean;
  stream: string;
  scaleWidth?: number;
  scaleHeight?: number;
}

export interface VideoStackParamFrm {
  id: string;
  app?: string;
  pushUrl?: string;
  row: number;
  col: number;
  width: number;
  height: number;
  fillImgUrl?: string;
  fillColor?: string;
  gridLineEnable?: boolean;
  gridLineColor?: string;
  gridLineWidth?: number;
  windowListStr?: string;
}

export interface TestVideoParam {
  app: string;
  stream: string;
  width?: number;
  height?: number;
  fps?: number;
  bitRate?: number;
  autoClose?: number;
  enableHls?: number;
  enableRtsp?: number;
  enableRtmp?: number;
  enableTs?: number;
  enableFmp4?: number;
  enableMp4?: number;
  mp4MaxSecond?: number;
}

export interface CloseTestVideoParam {
  app: string;
  stream: string;
}
