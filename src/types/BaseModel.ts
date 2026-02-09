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

export interface Platform {
  platformId: string;
  platformName: string;
  appKey: string;
  secretKey: string;
  accessType: number;
  authJumpUrl: string;
  bindRegUrl: string;
  loginJumpUrl: string;
  errorUrl: string;
  remark: string;
  isSystem: number;
  iconImg: string;
  status: number;
}

export interface PagePlatform {
  records: Platform[];
  total: number;
  current: number;
  pages: number;
  size: number;
}

export interface MsgTemplate {
  templateId: number;
  scopeApp: string;
  identity: string;
  title: string;
  content: string;
  example: string;
  subtype: number;
  enumValues: string;
  signName: string;
  createTime: string;
}

export interface PageMsgTemplate {
  records: MsgTemplate[];
  total: number;
  current: number;
  pages: number;
  size: number;
}
