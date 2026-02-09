export interface DeviceChannel {
  channelId: string;
  deviceId: string;
  productId: string;
  channelName: string;
  serverKey: string;
  videoCode: string;
  channelType: number;
  channelCode: number;
  ipAddress: string;
  port: number;
  account: string;
  password: string;
  ptzType: number;
  pushStatus: number;
  videoStatus: number;
  storageStatus: number;
  associatDevice: string;
  associatScenario: string;
  status: number;
  createTime: string;
  device: any;
  server: any;
}

export interface VideoServer {
  serverId: number;
  serverKey: string;
  serverName: string;
  serverType: string;
  serviceConfig: string;
  config: any;
  status: number;
  createTime: string;
}

export interface PageVideoServer {
  records: VideoServer[];
  total: number;
  current: number;
  pages: number;
  size: number;
}
