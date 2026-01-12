import { Device, Product, ProductModel } from './DeviceModel';

export interface LogModelAlarm {
  ts: number;
  logId: string;
  deviceId: string;
  productId: string;
  modelIdentity: string;
  type: string;
  level: number;
  alarmValue: string;
  judgement: string;
  threshold: string;
  rulesId: number;
  alarmStatus: number;
  device: Device;
  product: Product;
  model: ProductModel;
}
export interface PageLogModelAlarm {
  records: LogModelAlarm[];
  total: number;
  current: number;
  pages: number;
  size: number;
}
