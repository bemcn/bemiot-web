<template>
  <div class="main-panner">
    <!--地图与告警-->
    <div class="main-box">
      <n-grid cols="12" responsive="screen" :x-gap="15" :y-gap="15" style="height: 100%">
        <n-grid-item span="2">
          <n-card :bordered="false" style="height: 100%; overflow-y: auto; padding-bottom: 15px">
            <n-space vertical>
              <n-input v-model:value="queryKey" placeholder="搜索用户">
                <template #prefix>
                  <n-icon :component="SearchOutlined" />
                </template>
              </n-input>
              <n-scrollbar style="max-height: 500px">
                <n-list hoverable clickable>
                  <n-list-item
                    v-for="user in userData"
                    :key="user.userId"
                    @click="handleUser(user.userId)"
                    :class="{ 'selected-table': selectedUserId === user.userId }"
                  >
                    <n-thing :title="user.userName">
                      <template #description>
                        <n-tag size="small" type="success">
                          {{ user.role.roleName }}
                        </n-tag>
                        <span class="table-label">{{ user.nickName }}</span>
                      </template>
                    </n-thing>
                  </n-list-item>
                </n-list>
              </n-scrollbar>
            </n-space>
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
  import { getUserList, UserParams } from '@/api/system/user';
  import { useMessage } from 'naive-ui';
  import { load } from '@amap/amap-jsapi-loader';
  // @ts-ignore
  import { SearchOutlined } from '@vicons/antd';
  // @ts-ignore
  import MapBox from './MapBox.vue';

  const queryKey = ref('');
  const selectedUserId = ref(0);
  const userData = ref<any[]>([]);
  const message = useMessage();
  const deviceMapData = ref<any>(null);

  /**
   * 获取用户列表
   */
  const getUserInfoList = async () => {
    let params = {} as UserParams;
    if (queryKey.value !== '') {
      params = {
        filed: 'nickName',
        key: queryKey.value,
      };
    }

    const result = (await getUserList(params)) as unknown as {
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

  const handleUser = async (userId: number) => {
    selectedUserId.value = userId;
    deviceMapData.value = await getDeviceMapData();

    // 重新初始化地图视图
    if (mapInstance.value) {
      mapInstance.value.destroy(); // 销毁旧地图实例
    }
    initMapView(); // 重新初始化地图
  };

  // 获取设备类型名称
  const getDeviceTypeName = (type: number): string => {
    const typeMap: Record<number, string> = {
      1: '直连设备',
      2: '网关设备',
      3: '监控设备',
      4: '视频存储设备',
      5: '网关子设备',
      6: '虚拟设备',
    };
    return typeMap[type] || '未知类型';
  };

  // 获取地图设备数据
  const getDeviceMapData = async () => {
    const params: Record<string, any> = {};
    if (selectedUserId.value > 0) {
      params.userId = selectedUserId.value;
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
              <p><strong>设备编码:</strong> ${device.deviceId}</p>
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
    userData.value = await getUserInfoList();
    deviceMapData.value = await getDeviceMapData();
    if (deviceMapData.value) {
      initMapView();
    }
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

  .data-query-container {
    height: 100%;
  }
  .query-container {
    display: flex;
    gap: 16px;
  }
  .table-list-card {
    flex: 0 0 300px;
  }
  .sql-editor-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .sql-input {
    font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  }
  .editor-toolbar {
    display: flex;
    justify-content: flex-start;
  }
  .result-message {
    margin-bottom: 16px;
  }
  .mb-4 {
    margin-bottom: 16px;
  }
  .mt-2 {
    margin-top: 8px;
  }
  .py-8 {
    padding-top: 32px;
    padding-bottom: 32px;
  }
  .flex {
    display: flex;
  }
  .justify-center {
    justify-content: center;
  }
  .table-rows {
    margin-left: 10px;
    font-size: 12px;
    color: #666;
  }
  .selected-table {
    border-left: 3px solid #18a058;
    background-color: #f8f8f8;
  }
  .table-label {
    margin-left: 10px;
    font-size: 13px;
    color: #999999;
  }
</style>
