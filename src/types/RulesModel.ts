export interface DataBridge {
  bridgeId: string;
  bridgeName: string;
  bridgeDirection: string;
  bridgeType: string;
  httpUrlType: string;
  httpUrl?: string;
  httpMethod?: string;
  httpHeader?: string;
  httpParams?: string;
  httpBody?: string;
  mqttUrl?: string;
  mqttClientId?: string;
  mqttUsername?: string;
  mqttPassword?: string;
  mqttTopic?: string;
  mqttVersion?: string;
  mqttTimeout?: number;
  mqttKeepAlive?: number;
  mqttAutoLink?: number;
  mqttCleanSession?: number;
  dataSource?: string;
  dataUrl?: string;
  dataUsername?: string;
  dataPassword?: string;
  dataName?: string;
  dataSql?: string;
  status?: number;
}

export interface PageDataBridge {
  records: DataBridge[];
  total: number;
  current: number;
  pages: number;
  size: number;
}

export interface SceneGroup {
  sceneGroupId: number;
  groupName: string;
  orderNum: number;
  remark: string;
}

export interface PageSceneGroup {
  records: SceneGroup[];
  total: number;
  current: number;
  pages: number;
  size: number;
}

export interface SceneLinkage {
  sceneId: number;
  sceneGroupId: number;
  sceneName: string;
  executionMethod: number;
  silentPeriod: number;
  timeConditions: string;
  elData: string;
  remark: string;
  status: number;
  createTime: string;
}

export interface PageSceneLinkage {
  records: SceneLinkage[];
  total: number;
  current: number;
  pages: number;
  size: number;
}
