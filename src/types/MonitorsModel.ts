export interface CpuData {
  bit: number;
  physicalNum: number;
  logicalNumber: number;
  vendorFreq: string;
  vendor: string;
  microarchitecture: string;
}

export interface MemoryData {
  total: number;
  number: number;
  swapTotal: string;
}

export interface DiskData {
  number: number;
  diskName: string;
  size: string;
}

export interface NetData {
  number: number;
  netName: string;
  address: string;
}

export interface ServerData {
  cpu: CpuData;
  memory: MemoryData;
  disk: DiskData;
  net: NetData;
}

export interface MonitorServer {
  timeData: string[];
  usageData: number[];
  currentUsage?: number;
}

export interface MonitorServerNetwork {
  timeData: string[];
  uploadData: number[];
  downloadData: number[];
  currentUpload?: number;
  currentDownload?: number;
}

export interface MonitorServerDisk {
  timeData: string[];
  readData: number[];
  writeData: number[];
  currentRead?: number;
  currentWrite?: number;
}

export interface MonitorDataOne {
  timeData: string[];
  usageData: number[];
}
export interface MonitorDataTwo {
  timeData: string[];
  usageData1: number[];
  usageData2: number[];
}
