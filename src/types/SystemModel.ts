export interface Notice {
  noticeId: number;
  noticeTitle: string;
  noticeType: number;
  noticeContent: string;
  userId: number;
  createTime: string;
  user: UserInfo;
}

export interface PageNotice {
  records: Notice[];
  total: number;
  current: number;
  pages: number;
  size: number;
}

export interface Role {
  roleId: number;
  roleName: string;
  roleAuth: string;
}

export interface RoleAuth {
  roleId: number;
  roleName: string;
  roleAuth: string;
  orderNum: number;
  remark: string;
}

export interface PageRoleAuth {
  records: RoleAuth[];
  total: number;
  current: number;
  pages: number;
  size: number;
}

export interface UserInfo {
  userId: number;
  userName: string;
  role: Role;
  nickName: string;
  headImg: string;
  sex: number;
  phone: string;
  email: string;
  status: number;
  remark: string;
  createTime: string;
  lastLoginIp: string;
  lastLoginTime: string;
}

export interface PageUserInfo {
  records: UserInfo[];
  total: number;
  current: number;
  pages: number;
  size: number;
}

export interface Blacklist {
  blackId: number;
  ipStart: string;
  ipEnd: string;
  remark: string;
  createTime: string;
}

export interface PageBlacklist {
  records: Blacklist[];
  total: number;
  current: number;
  pages: number;
  size: number;
}

export interface Log {
  ts: number;
  logId: string;
  clientSource: string;
  clientIp: string;
  userId: number;
  userName: string;
  nickName: string;
  modelName: string;
  operation: string;
  description: string;
}

export interface PageLog {
  records: Log[];
  total: number;
  current: number;
  pages: number;
  size: number;
}
