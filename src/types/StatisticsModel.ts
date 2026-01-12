export interface IotStatistics {
  productCount: number;
  productEnableCount: number;
  productDeactivatedCount: number;
  deviceCount: number;
  deviceOnlineCount: number;
  deviceOfflineCount: number;
  optionCount: number;
  optionMonthCount: number;
  optionDayCount: number;
  messageCount: number;
  messageMonthCount: number;
  messageDayCount: number;
  alarmCount: number;
  alarmMonthCount: number;
  alarmDayCount: number;
  eventCount: number;
  eventMonthCount: number;
  eventDayCount: number;
}

export interface DevTypeItem {
  name: string;
  value: number;
}

export interface DevTypeStatistics {
  connection: DevTypeItem;
  gateway: DevTypeItem;
  monitor: DevTypeItem;
  subDevice: DevTypeItem;
  virtual: DevTypeItem;
}

export interface UpdateBaseData {
  totalStatistics: IotStatistics;
  hourStatistics: any; // 可根据实际结构进一步细化
  devTypeStatistics: DevTypeStatistics;
}
