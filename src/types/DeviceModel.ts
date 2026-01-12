import { Drive, SpacePosition, DeviceGroup } from './BaseModel';
import { UserInfo } from './SystemModel';

export interface Firmware {
  firmwareId: number;
  firmwareName: string;
  version: string;
  installType: number;
  remark: string;
}

export interface PageFirmware {
  records: Firmware[];
  total: number;
  current: number;
  pages: number;
  size: number;
}

export interface FirmwareVersion {
  versionId: number;
  firmwareId: number;
  version: string;
  url: string;
  releaseTime: string;
}

export interface PageFirmwareVersion {
  records: FirmwareVersion[];
  total: number;
  current: number;
  pages: number;
  size: number;
}

export interface FirmwareUpdateTask {
  taskId: number;
  taskName: string;
  firmwareId: number;
  version: string;
  taskType: number;
  devices: string;
  deviceCount: number;
  planTime: string;
  remark: string;
  createTime: string;
}

export interface PageFirmwareUpdateTask {
  records: FirmwareUpdateTask[];
  total: number;
  current: number;
  pages: number;
  size: number;
}

export interface FirmwareUpdateLog {
  logId: number;
  taskId: number;
  taskName: string;
  deviceId: string;
  deviceName: string;
  version: string;
  status: number;
  progress: number;
  updateTime: string;
}

export interface PageFirmwareUpdateLog {
  records: FirmwareUpdateLog[];
  total: number;
  current: number;
  pages: number;
  size: number;
}

export interface Product {
  productId: string;
  productName: string;
  classId: number;
  models: string;
  images: string;
  attribute: string;
  types: number;
  manufacturer: string;
  supplier: string;
  firmwareId: number;
  driveCode: string;
  trans: string;
  collectType: number;
  authMethod: number;
  netMethod: number;
  locateMethod: number;
  authEquipment: number;
  remark: string;
  status: number;
  createTime: string;
  productClass: ProductClass;
  firmware: Firmware;
  drive: Drive;
}

export interface PageProduct {
  records: Product[];
  total: number;
  current: number;
  pages: number;
  size: number;
}

export interface ProductModel {
  modelId: string;
  modelIdentity: string;
  modelName: string;
  productId: string;
  modelType: number;
  modelClass: number;
  dataType: string;
  dataDefinition: string;
  charts: number;
  monitor: number;
  history: number;
  readonly: number;
  share: number;
  createTime: string;
}

export interface ProductClass {
  classId: number;
  className: string;
  levelId: number;
  classRoute: string;
  classRouteName: string;
  orderNum: number;
  remark: string;
}

export interface ProductClassTable {
  classId: number;
  className: string;
  levelId: number;
  remark: string;
  orderNum: number;
  children?: ProductClassTable[] | null;
}

export interface ProductClassTree {
  id: number;
  label: string;
  children?: ProductClassTree[] | null;
}

export interface Device {
  deviceId: string;
  deviceName: string;
  productId: string;
  groupId: number;
  userId: number;
  spaceId: number;
  spaceRoute: number;
  gatewayId: string;
  locateMethod: number;
  openShadow: number;
  netRssi: number;
  address: string;
  ipAddress: string;
  longitude: number;
  latitude: number;
  installImg: string;
  summary: string;
  firmwareVersion: string;
  channelId: string;
  erCode: string;
  remark: string;
  status: number;
  activeTime: string;
  createTime: string;
  areaCode: string;
  videoCode: string;
  typeCode: string;
  netCode: number;
  paramsData?: string;
  params?: DeviceParams[];
  online?: number;
  alarm?: number;
  product?: Product;
  group?: DeviceGroup;
  user?: UserInfo;
  position?: SpacePosition;
  gateway?: Device;
}

export interface PageDevice {
  records: Product[];
  total: number;
  current: number;
  pages: number;
  size: number;
}

export interface DeviceMap {
  keys: string;
  centerLon: number;
  centerLat: number;
  mapStyle: string;
  zoom: number;
  devices: DeviceMapPoints[];
}

export interface DeviceMapPoints {
  deviceId: string;
  deviceName: string;
  types: number;
  status: number;
  spaceRouteName: string;
  locateMethod: number;
  longitude: number;
  latitude: number;
  installImg: string;
  firmwareVersion: string;
}

export interface DeviceParams {
  id: string;
  modelId: string;
  deviceId: string;
  paramsId: number;
  driveCode: string;
  groupType: number;
  paramsName: string;
  paramsKey: string;
  paramsType: string;
  paramsValue: string;
  showData: string;
  orderNum: number;
}

export interface DeviceModel {
  status: number;
  modelId: string;
  modelIdentity: string;
  modelName: string;
  deviceId: string;
  types: number;
  spaceRoute: string;
  modelType: number;
  modelClass: number;
  dataType: string;
  dataDefinition: string;
  charts: number;
  monitor: number;
  history: number;
  readonly: number;
  share: number;
  orderNum: number;
  createTime: string;
  paramsData: string;
  params: DeviceParams[];
  value: string;
  outputValue: string;
  device: Device;
}

export interface DeviceControls {
  controlId: number;
  controlName: string;
  controlFunc: string;
  controlRule: string;
  remark: string;
  createTime: string;
}
export interface LogModelEvent {
  ts: number;
  logId: string;
  deviceId: string;
  productId: string;
  modelIdentity: string;
  type: string;
  data: string;
  description: string;
  device: Device;
  product: Product;
  model: ProductModel;
}
export interface PageLogModelEvent {
  records: LogModelEvent[];
  total: number;
  current: number;
  pages: number;
  size: number;
}
export interface ModelAlarmRules {
  rulesId: number;
  productId: string;
  modelIdentity: string;
  alarmLevel: number;
  alarmRules: string;
  alertsType: number;
  specifyUsers: string;
  product: Product;
  model: ProductModel;
}
export interface PageModelAlarmRules {
  records: ModelAlarmRules[];
  total: number;
  current: number;
  pages: number;
  size: number;
}
