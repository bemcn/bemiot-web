import {
  CloseStreamParam,
  CloseStreamsParam,
  CloseTestVideoParam,
  GetMediaListParam,
  MediaQueryParam,
  OpenRtpServerParam,
  RecordStatusParam,
  StartRecordParam,
  StopRecordParam,
  StreamProxyParam,
  StreamPushProxyParam,
  TestVideoParam,
  TranscodeParam,
  VideoStackParamFrm,
} from '@/types/MediaParams';
import { Alova } from '@/utils/http/alova/index';

/**
 * @description: 【拉流代理】添加拉流代理
 */
export function addStreamProxy(params: StreamProxyParam) {
  return Alova.Post<InResult>('/media/addStreamProxy', params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 【拉流代理】关闭拉流代理
 */
export function delStreamProxy(params: { key: string }) {
  return Alova.Post<InResult>('/media/delStreamProxy', params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 【推流代理】添加推流代理
 */
export function addStreamPusherProxy(params: StreamPushProxyParam) {
  return Alova.Post<InResult>('/media/addStreamPusherProxy', params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 【推流代理】删除推流代理
 */
export function delStreamPusherProxy(params: { key: string }) {
  return Alova.Post<InResult>('/media/delStreamPusherProxy', params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 【流操作】关闭流
 */
export function closeStream(params: CloseStreamParam) {
  return Alova.Post<InResult>('/media/closeStream', params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 【流操作】关闭流(批量关)
 */
export function closeStreams(params: CloseStreamsParam) {
  return Alova.Post<InResult>('/media/closeStreams', params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 【流操作】获取流列表
 */
export function getMediaList(params: GetMediaListParam) {
  return Alova.Get<InResult>('/media/getMediaList', {
    params,
  });
}

/**
 * @description: 【流操作】获取流信息
 */
export function getMediaInfo(params: MediaQueryParam) {
  return Alova.Get<InResult>('/media/getMediaInfo', {
    params,
  });
}

/**
 * @description: 【流操作】流是否在线
 */
export function isMediaOnline(params: MediaQueryParam) {
  return Alova.Get<InResult>('/media/isMediaOnline', {
    params,
  });
}

/**
 * @description: 【录像】开始录像
 */
export function startRecord(params: StartRecordParam) {
  return Alova.Post<InResult>('/media/startRecord', params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 【录像】停止录像
 */
export function stopRecord(params: StopRecordParam) {
  return Alova.Post<InResult>('/media/stopRecord', params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 【录像】是否录像中
 */
export function isRecording(params: RecordStatusParam) {
  return Alova.Get<InResult>('/media/isRecording', {
    params,
  });
}

/**
 * @description: 【系统】获取内存资源信息
 */
export function getStatistic() {
  return Alova.Get<InResult>('/media/getStatistic');
}

/**
 * @description: 【系统】获取服务器配置
 */
export function getServerConfig() {
  return Alova.Get<InResult>('/media/getServerConfig');
}

/**
 * @description: 【系统】重启流媒体服务
 */
export function restartServer() {
  return Alova.Post<InResult>('/media/restartServer');
}

/**
 * @description: 【系统】设置服务器配置
 */
export function setServerConfig(params: any) {
  return Alova.Post<InResult>('/media/setServerConfig', params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 【系统】开启rtp服务
 */
export function openRtpServer(params: OpenRtpServerParam) {
  return Alova.Post<InResult>('/media/openRtpServer', params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 【系统】关闭rtp服务
 */
export function closeRtpServer(params: { stream: string }) {
  return Alova.Post<InResult>('/media/closeRtpServer', params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 【系统】获取所有RTP服务器
 */
export function listRtpServer() {
  return Alova.Get<InResult>('/media/listRtpServer');
}

/**
 * @description: 【截图】获取截图
 */
export function getSnap(params: { url: string }) {
  return Alova.Get<InResult>('/media/getSnap', {
    params,
  });
}

/**
 * @description: 【转码】拉流代理转码(beta)
 */
export function transcode(params: TranscodeParam) {
  return Alova.Post<InResult>('/media/transcode', params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 【转码】停止转码
 */
export function stopTranscode(params: { stream: string }) {
  return Alova.Post<InResult>('/media/stopTranscode', params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 【拼接屏】开启拼接屏(beta)
 */
export function stackStart(params: VideoStackParamFrm) {
  return Alova.Post<InResult>('/media/stackStart', params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 【拼接屏】重新设置拼接屏(beta)
 */
export function stackReset(params: VideoStackParamFrm) {
  return Alova.Post<InResult>('/media/stackReset', params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 【拼接屏】关闭拼接屏(beta)
 */
export function stackStop(params: { id: string }) {
  return Alova.Post<InResult>('/media/stackStop', params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 【测试视频流】生成一路测试视频流
 */
export function createTestVideo(params: TestVideoParam) {
  return Alova.Post<InResult>('/media/createTestVideo', params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 【测试视频流】停止一路测试视频流
 */
export function stopTestVideo(params: CloseTestVideoParam) {
  return Alova.Post<InResult>('/media/stopTestVideo', params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}
