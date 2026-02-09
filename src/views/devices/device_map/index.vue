<template>
  <div class="main-panner">
    <!--地图与告警-->
    <div class="main-box">
      <n-grid cols="12" responsive="screen" :x-gap="15" :y-gap="15" style="height: 100%">
        <n-grid-item span="2">
          <n-card title="查询条件" size="small" :bordered="false">
            <div class="card-content">
              <n-form ref="formRef" :model="queryParams">
                <n-form-item label="设备位置" path="spaceId">
                  <n-cascader
                    v-model:value="queryParams.spaceId"
                    placeholder="请选择安装位置"
                    expand-trigger="click"
                    check-strategy="child"
                    :options="positionOptions"
                    clearable
                  />
                </n-form-item>
                <n-form-item label="设备分组" path="groupId">
                  <n-select
                    v-model:value="queryParams.groupId"
                    :options="groupOptions"
                    placeholder="请选择分组"
                    clearable
                  />
                </n-form-item>
                <n-form-item label="设备类型" path="types">
                  <n-select
                    v-model:value="queryParams.types"
                    :options="typesOptions"
                    placeholder="请选择类型"
                    clearable
                  />
                </n-form-item>
                <n-form-item label="所属产品" path="productId">
                  <n-select
                    v-model:value="queryParams.productId"
                    filterable
                    placeholder="请输入关键字"
                    :options="productOptions"
                    clearable
                  />
                </n-form-item>
              </n-form>
              <n-flex justify="space-around" size="large">
                <n-button type="primary" style="width: 80px" @click="handleQuery">查询</n-button>
                <n-button style="width: 80px" @click="handleReset">重置</n-button>
              </n-flex>
            </div>
          </n-card>
        </n-grid-item>
        <n-grid-item span="10" style="height: 100%">
          <n-card title="设备地图" size="small" :bordered="false" style="height: 100%">
            <template #header-extra
              ><span class="map-dev-count"
                >{{ deviceMapData?.devices?.length }} 个设备</span
              ></template
            >
            <div class="card-content" style="height: 100%">
              <div
                id="container"
                ref="mapRef"
                class="flex justify-between px-1 py-1 map-height"
              ></div>
            </div>
          </n-card>
        </n-grid-item>
      </n-grid>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import { getDevicesMap } from '@/api/devices/device';
  import { getPositionTree } from '@/api/base/position';
  import { getDeviceGroupList } from '@/api/base/deviceGroup';
  import { getProductList } from '@/api/devices/product';
  import { useMessage } from 'naive-ui';
  import { load } from '@amap/amap-jsapi-loader';
  // @ts-ignore
  import MapBox from './MapBox.vue';

  const queryParams = ref({
    types: null,
    groupId: null,
    userId: null,
    spaceId: null,
    productId: null,
  });
  const positionOptions = ref<any[]>([]);
  const groupOptions = ref<any[]>([]);
  const typesOptions = [
    {
      label: '直连设备',
      value: '1',
    },
    {
      label: '网关设备',
      value: '2',
    },
    {
      label: '监控设备',
      value: '3',
    },
    {
      label: '网关子设备',
      value: '4',
    },
    {
      label: '虚拟设备',
      value: '5',
    },
  ];
  const productOptions = ref<any[]>([]);
  const message = useMessage();
  const deviceMapData = ref<any>(null);

  /**
   * 获取设备位置树
   */
  const createTreeData = async () => {
    const result = (await getPositionTree()) as unknown as {
      status: string;
      message: string;
      data: any[];
    };
    if (result.status === 'success') {
      return result.data;
    } else {
      return [];
    }
  };

  /**
   * 获取设备分组
   */
  const createGroupData = async () => {
    const result = (await getDeviceGroupList()) as unknown as {
      status: string;
      message: string;
      data: any[];
    };
    if (result.status === 'success') {
      const list = result.data;
      let groupList = list.map((item: any) => {
        return {
          label: item.groupName,
          value: item.groupId + '',
        };
      });
      return groupList;
    } else {
      return [];
    }
  };

  /**
   * 获取产品
   */
  const createProductData = async () => {
    const params = {};
    const result = (await getProductList(params)) as unknown as {
      status: string;
      message: string;
      data: any[];
    };
    if (result.status === 'success') {
      const list = result.data;
      let productList = list.map((item: any) => {
        return {
          label: item.productName,
          value: item.productId + '',
        };
      });
      return productList;
    } else {
      return [];
    }
  };

  // 查询点击
  const handleQuery = async () => {
    console.log('查询点击', queryParams.value);
    const newData = await getDeviceMapData();
    if (newData) {
      deviceMapData.value = newData;
      // 重新初始化地图视图
      if (mapInstance.value) {
        mapInstance.value.destroy(); // 销毁旧地图实例
      }
      initMapView(); // 重新初始化地图
    }
  };

  // 重置点击
  const handleReset = async () => {
    // 重置查询参数
    queryParams.value = {
      types: null,
      groupId: null,
      userId: null,
      spaceId: null,
      productId: null,
    };

    // 重新获取设备地图数据
    const newData = await getDeviceMapData();
    if (newData) {
      deviceMapData.value = newData;
      // 重新初始化地图视图
      if (mapInstance.value) {
        mapInstance.value.destroy(); // 销毁旧地图实例
      }
      initMapView(); // 重新初始化地图
    }
  };

  // 获取设备类型名称
  const getDeviceTypeName = (type: number): string => {
    const typeMap: Record<number, string> = {
      1: '直连设备',
      2: '网关设备',
      3: '监控设备',
      4: '网关子设备',
      5: '虚拟设备',
    };
    return typeMap[type] || '未知类型';
  };

  // 获取地图设备数据
  const getDeviceMapData = async () => {
    const queryParamData = queryParams.value;
    const params: Record<string, any> = {};
    if (queryParamData.types) {
      params.types = parseInt(queryParamData.types);
    }
    if (queryParamData.groupId) {
      params.groupId = parseInt(queryParamData.groupId);
    }
    if (queryParamData.spaceId) {
      params.spaceId = parseInt(queryParamData.spaceId);
    }
    if (queryParamData.productId) {
      params.types = parseInt(queryParamData.productId);
    }
    console.log('查询点击', params);

    const result = (await getDevicesMap(params)) as {
      status: string;
      message: string;
      data: any;
    };
    if (result.status === 'success') {
      mapApiKey.value = {
        securityJsCode: '',
        key: result.data.keys,
      };
      return result.data;
    } else {
      message.info(result.message || '获取统计地图数据失败');
    }
  };

  const mapRef = ref<any>(null); // 对应地图渲染的 ref 元素 <div ref="mapRef" />
  const mapApiKey = ref<any>(null);
  const mapLoader = ref<any>(null); // AMapLoader
  const mapInstance = ref<any>(null); // 实际的地图实例

  // 添加标记点到地图上的函数
  const addMarkersToMap = () => {
    if (!deviceMapData.value?.devices || !mapLoader.value || !mapInstance.value) return;

    deviceMapData.value.devices.forEach((device: any) => {
      const marker = new mapLoader.value.Marker({
        position: [device.longitude, device.latitude],
        title: device.deviceName,
        icon: new mapLoader.value.Icon({
          image: '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png',
          size: new mapLoader.value.Size(25, 34),
          imageSize: new mapLoader.value.Size(25, 34),
        }),
      });

      marker.setMap(mapInstance.value);

      // 绑定点击事件
      marker.on('click', () => {
        const infoWindow = new mapLoader.value.InfoWindow({
          content: `
            <div style="padding: 10px;">
              <h3>${device.deviceName}</h3>
              <p><strong>设备编码:</strong> ${device.deviceCode}</p>
              <p><strong>设备类型:</strong> ${getDeviceTypeName(device.types)}</p>
              <p><strong>状态:</strong> ${device.status === 0 ? '在线' : '离线'}</p>
              <p><strong>安装位置:</strong> ${device.spaceRouteName || '未指定'}</p>
            </div>
          `,
          offset: new mapLoader.value.Pixel(0, -30),
        });
        infoWindow.open(mapInstance.value, marker.getPosition());
      });
    });
  };

  const initMapView = async () => {
    try {
      window._AMapSecurityConfig = {
        securityJsCode: mapApiKey.value.securityJsCode,
      };

      mapLoader.value = await load({
        key: mapApiKey.value.key,
        version: '2.0',
        plugins: ['AMap.Scale', 'AMap.ToolBar', 'AMap.ControlBar', 'AMap.HawkEye'],
      });

      mapInstance.value = new mapLoader.value.Map(mapRef.value, {
        viewMode: '3D',
        zoom: deviceMapData.value.zoom,
        center: [deviceMapData.value.centerLon, deviceMapData.value.centerLat],
        resizeEnable: true,
        showIndoorMap: true,
        mapStyle: 'amap://styles/whitesmoke',
      });

      const scale = new mapLoader.value.Scale({
        visible: true,
      });
      const toolBar = new mapLoader.value.ToolBar({
        visible: true,
        position: {
          top: '110px',
          right: '40px',
        },
      });
      const controlBar = new mapLoader.value.ControlBar({
        visible: true,
        position: {
          top: '10px',
          right: '10px',
        },
      });
      const overView = new mapLoader.value.HawkEye({
        visible: true,
      });

      mapInstance.value.addControl(scale);
      mapInstance.value.addControl(toolBar);
      mapInstance.value.addControl(controlBar);
      mapInstance.value.addControl(overView);

      // 地图加载完成后添加标记点
      mapInstance.value.on('complete', () => {
        addMarkersToMap();
      });
    } catch (error) {
      console.log(error);
    }
  };

  onMounted(async () => {
    positionOptions.value = await createTreeData();
    groupOptions.value = await createGroupData();
    productOptions.value = await createProductData();
    deviceMapData.value = await getDeviceMapData();
    if (deviceMapData.value) {
      initMapView();
    }
    console.log('deviceMapData.value', deviceMapData.value);
  });
</script>

<style lang="less" scoped>
  .main-panner {
    width: 100%;
    height: 100%;
    padding-right: 220px;
    padding-bottom: 128px;
    padding-top: 10px;
    position: fixed;
    top: 108px;
    left: 210px;
    z-index: 1;
    .main-box {
      width: 100%;
      height: 100%;
    }
  }
  .card-content {
    width: 100%;
    height: 100%;
    padding: 20px 0px;
    color: #333333;
    font-size: 14px;
    .card-info {
      width: 100%;
      height: 48px;
      margin-bottom: 15px;
      padding: 10px 10px 10px 10px;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
    }
  }

  .map-height {
    height: 100%;
  }
</style>
