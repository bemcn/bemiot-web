export interface SpacePosition {
  spaceId: number;
  spaceName: string;
  levelId: number;
  spaceRoute: string;
  spaceRouteName: string;
  orderNum: number;
}

export interface SpacePositionTable {
  spaceId: number;
  spaceName: string;
  spaceRoute: string;
  spaceRouteName: string;
  levelId: number;
  orderNum: number;
  children?: SpacePositionTable[] | null;
}

export interface SpacePositionTree {
  id: number;
  label: string;
  children?: SpacePositionTree[] | null;
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

export interface DeviceGroup {
  groupId: number;
  groupName: string;
  remark: string;
  orderNum: number;
}

export interface PageDeviceGroup {
  records: DeviceGroup[];
  total: number;
  current: number;
  pages: number;
  size: number;
}

export interface GeneralModelGroup {
  groupId: number;
  groupName: string;
  remark: string;
  orderNum: number;
}

export interface PageGeneralModelGroup {
  records: GeneralModelGroup[];
  total: number;
  current: number;
  pages: number;
  size: number;
}

export interface Protocols {
  protocolId: number;
  protocolName: string;
  request: string;
  response: string;
  registration?: string;
  heartbeat?: string;
  built: number;
}

export interface PageProtocols {
  records: Protocols[];
  total: number;
  current: number;
  pages: number;
  size: number;
}

export interface Drive {
  driveCode: string;
  driveName: string;
  protocolId: string;
  protocolName?: string;
  driveSource?: number;
  version?: string;
  remark?: string;
  packageUrl?: string;
  status: number;
  defaultDrive: number;
  releaseTime: string;
  runerLoading?: boolean;
}

export interface PageDrive {
  records: Drive[];
  total: number;
  current: number;
  pages: number;
  size: number;
}

export interface DriveParams {
  paramsId: number;
  paramsKey: string;
  driveCode: string;
  groupType: number;
  paramsName: string;
  paramsType: string;
  defaultValue: string;
  showType: string;
  showData: string;
  orderNum: number;
}

export interface Certificate {
  certificateId: number;
  certificateName: string;
  certificateStandard: number;
  caFile: string;
  remark: string;
}

export interface PageCertificate {
  records: Certificate[];
  total: number;
  current: number;
  pages: number;
  size: number;
}
