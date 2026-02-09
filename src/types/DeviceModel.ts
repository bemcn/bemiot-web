import { GeneralModelGroup, ProductClass, Drive, SpacePosition, DeviceGroup } from './BaseModel';
import { UserInfo } from './SystemModel';

export interface GeneralModel {
  modelIdentity: string;
  modelName: string;
  groupId: number;
  modelType: number;
  dataType: string;
  dataDefinition: string;
  charts: number;
  monitor: number;
  history: number;
  readonly: number;
  share: number;
  remark: string;
  createTime: string;
  group?: GeneralModelGroup;
}

export interface PageGeneralModel {
  records: GeneralModel[];
  total: number;
  current: number;
  pages: number;
  size: number;
}

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
  deviceId: number;
  deviceCode: string;
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
  productId: number;
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
  productId: number;
  modelType: number;
  dataType: string;
  dataDefinition: string;
  charts: number;
  monitor: number;
  history: number;
  readonly: number;
  share: number;
  createTime: string;
}

export interface Device {
  deviceId: number;
  deviceCode: string;
  deviceName: string;
  productId: number;
  groupId: number;
  userId: number;
  spaceId: number;
  spaceRoute: number;
  gatewayId: number;
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
  deviceId: number;
  deviceCode: string;
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
  deviceId: number;
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
  modelId: string;
  modelIdentity: string;
  modelName: string;
  deviceId: number;
  deviceCode: string;
  modelType: number;
  dataType: string;
  dataDefinition: string;
  charts: number;
  monitor: number;
  history: number;
  readonly: number;
  share: number;
  createTime: string;
}

export interface DeviceControls {
  controlId: number;
  controlName: string;
  controlFunc: string;
  controlRule: string;
  remark: string;
  createTime: string;
}
