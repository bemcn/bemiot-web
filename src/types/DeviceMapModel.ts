export interface DeviceMap {
  keys: string;
  centerLon: number;
  centerLat: number;
  mapStyle: string;
  zoom: number;
  devices: Array<DeviceMapPoints>;
}

export interface DeviceMapPoints {
  deviceId: string;
  deviceName: string;
  types: number;
  status: number;
  productName: string;
  spaceRouteName: string;
  locateMethod: number;
  longitude: number;
  latitude: number;
  installImg: string;
  firmwareVersion: string;
}
