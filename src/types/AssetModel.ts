import { Device, Product } from './DeviceModel';

export interface ProductAttr {
  attrId: number;
  productId: string;
  classRoute: string;
  fieldKey: string;
  fieldLabel: string;
  fieldType: string;
  description?: string;
  product?: Product;
}

export interface PageProductAttr {
  records: ProductAttr[];
  total: number;
  current: number;
  pages: number;
  size: number;
}

export interface DeviceAttr {
  devAttrId: string;
  deviceId: string;
  classRoute: string;
  fieldKey: string;
  fieldLabel: string;
  fieldType: string;
  fieldValue?: string;
  device?: Device;
}

export interface PageDeviceAttr {
  records: DeviceAttr[];
  total: number;
  current: number;
  pages: number;
  size: number;
}
