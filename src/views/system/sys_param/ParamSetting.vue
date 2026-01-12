<template>
  <n-grid cols="12" item-responsive responsive="screen">
    <n-grid-item span="12 m:11 l:10 xl:9 2xl:8">
      <n-form
        style="padding: 20px"
        label-placement="left"
        label-width="auto"
        :model="formValue"
        :rules="rules"
        ref="formRef"
      >
        <n-form-item label="设备地图中心点" path="mapCenter" :first="true">
          <n-input-group>
            <n-input
              :readonly="true"
              v-model:value="formValue.mapCenter"
              clearable
              placeholder="请选择设备地图中心点"
            />
            <n-button @click="selectMap">选择</n-button>
          </n-input-group>
        </n-form-item>

        <n-form-item label="系统日志保存时间" path="logExpire" :first="true">
          <n-input-group>
            <n-input-number
              :min="1"
              :max="36"
              v-model:value="formValue.logExpire"
              clearable
              button-placement="both"
              placeholder="请输入系统日志保存时间"
            />
            <n-input-group-label>月</n-input-group-label>
          </n-input-group>
        </n-form-item>

        <n-form-item label="运行日志保存时间" path="runLogExpire" :first="true">
          <n-input-group>
            <n-input-number
              :min="1"
              :max="36"
              v-model:value="formValue.runLogExpire"
              clearable
              button-placement="both"
              placeholder="请输入运行日志保存时间"
            />
            <n-input-group-label>月</n-input-group-label>
          </n-input-group>
        </n-form-item>

        <n-form-item label="采集数据保存时间" path="dataExpire" :first="true">
          <n-input-group>
            <n-input-number
              :min="1"
              :max="36"
              v-model:value="formValue.dataExpire"
              clearable
              button-placement="both"
              placeholder="请输入采集数据保存时间"
            />
            <n-input-group-label>月</n-input-group-label>
          </n-input-group>
        </n-form-item>

        <n-form-item label="监控数据保存时间" path="monitorExpire" :first="true">
          <n-input-group>
            <n-input-number
              :min="1"
              :max="60"
              v-model:value="formValue.monitorExpire"
              clearable
              button-placement="both"
              placeholder="请输入监控数据保存时间"
            />
            <n-input-group-label>日</n-input-group-label>
          </n-input-group>
        </n-form-item>

        <n-form-item label="告警信息保存时间" path="alarmExpire" :first="true">
          <n-input-group>
            <n-input-number
              :min="1"
              :max="36"
              v-model:value="formValue.alarmExpire"
              clearable
              button-placement="both"
              placeholder="请输入告警信息保存时间"
            />
            <n-input-group-label>月</n-input-group-label>
          </n-input-group>
        </n-form-item>

        <n-form-item label="报表统计保存时间" path="statisticsExpire" :first="true">
          <n-input-group>
            <n-input-number
              :min="1"
              :max="36"
              v-model:value="formValue.statisticsExpire"
              clearable
              button-placement="both"
              placeholder="请输入报表统计保存时间"
            />
            <n-input-group-label>月</n-input-group-label>
          </n-input-group>
        </n-form-item>

        <div>
          <n-space>
            <n-button type="primary" style="width: 160px" @click="formSubmit">确 认</n-button>
          </n-space>
        </div>
      </n-form>
    </n-grid-item>
  </n-grid>

  <n-modal
    style="width: 860px"
    v-model:show="showModal"
    :show-icon="false"
    preset="dialog"
    title="选择地图中心点"
  >
    <div id="container" ref="mapRef" class="map-box"></div>

    <template #action>
      <n-space>
        <n-button style="width: 120px" @click="() => (showModal = false)">确 认</n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
  import { onMounted, reactive, ref } from 'vue';
  import { useMessage } from 'naive-ui';
  import { getConfigParams, editConfig } from '@/api/system/systemConfig';
  import { load } from '@amap/amap-jsapi-loader';

  const rules = {
    mapCenter: {
      required: true,
      message: '请选择地图中心点',
      trigger: 'blur',
    },
    logExpire: {
      required: true,
      message: '请输入保存月数',
      type: 'number',
      trigger: ['input', 'blur'],
    },
    runLogExpire: {
      required: true,
      message: '请输入保存月数',
      type: 'number',
      trigger: ['input', 'blur'],
    },
    dataExpire: {
      required: true,
      message: '请输入保存月数',
      type: 'number',
      trigger: ['input', 'blur'],
    },
    monitorExpire: {
      required: true,
      message: '请输入保存月数',
      type: 'number',
      trigger: ['input', 'blur'],
    },
    alarmExpire: {
      required: true,
      message: '请输入保存月数',
      type: 'number',
      trigger: ['input', 'blur'],
    },
    statisticsExpire: {
      required: true,
      message: '请输入保存月数',
      type: 'number',
      trigger: ['input', 'blur'],
    },
  };

  const formRef: any = ref(null);
  const message = useMessage();
  const showModal = ref(false);
  const mapRef = ref(); // 对应地图渲染的 ref 元素 <div ref="mapRef" />
  const mapApiKey = reactive({
    securityJsCode: '',
    key: '00b1616d3c3902594ece183092ae9843',
  });
  const map = ref();

  interface ParamsForm {
    mapCenter: string;
    mapZoom: string;
    logExpire: string;
    runLogExpire: string;
    dataExpire: string;
    monitorExpire: string;
    alarmExpire: string;
    statisticsExpire: string;
  }

  const formValue = ref({
    group: '',
    mapCenter: '',
    mapZoom: 16,
    logExpire: 1,
    runLogExpire: 1,
    dataExpire: 1,
    monitorExpire: 1,
    alarmExpire: 1,
    statisticsExpire: 1,
  });

  const getParameter = async () => {
    const params = {
      group: 'parameter',
    };
    const result = (await getConfigParams(params)) as {
      status: string;
      message: string;
      data: ParamsForm;
    };
    if (result.status === 'success') {
      const { data } = result;
      formValue.value = {
        group: 'parameter',
        mapCenter: data.mapCenter,
        mapZoom: parseFloat(data.mapZoom),
        logExpire: parseInt(data.logExpire),
        runLogExpire: parseInt(data.runLogExpire),
        dataExpire: parseInt(data.dataExpire),
        monitorExpire: parseInt(data.monitorExpire),
        alarmExpire: parseInt(data.alarmExpire),
        statisticsExpire: parseInt(data.statisticsExpire),
      };
    } else {
      message.info(result.message);
    }
  };

  const selectMap = () => {
    showModal.value = true;
    initMapView();
  };

  let amap: any;
  let marker: any;

  // 初始化地图
  const initMapView = async () => {
    try {
      const mapCenter = formValue.value.mapCenter.split(',');
      window._AMapSecurityConfig = {
        securityJsCode: mapApiKey.securityJsCode,
      };
      map.value = await load({
        key: mapApiKey.key,
        version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: ['AMap.Scale', 'AMap.ToolBar', 'AMap.ControlBar', 'AMap.HawkEye'],
      });
      amap = new map.value.Map(mapRef.value, {
        viewMode: '3D', // 是否为3D地图模式
        zoom: formValue.value.mapZoom, // 初始化地图级别
        center: [mapCenter[0], mapCenter[1]],
        resizeEnable: true,
        showIndoorMap: true,
        mapStyle: 'amap://styles/whitesmoke',
      });

      const scale = new map.value.Scale({
        visible: true,
      });
      const toolBar = new map.value.ToolBar({
        visible: true,
        position: {
          top: '110px',
          right: '40px',
        },
      });
      const controlBar = new map.value.ControlBar({
        visible: true,
        position: {
          top: '10px',
          right: '10px',
        },
      });
      const overView = new map.value.HawkEye({
        visible: true,
      });

      amap.on('click', showInfoClick);
      amap.on('zoomend', mapZoomend);

      amap.addControl(scale);
      amap.addControl(toolBar);
      amap.addControl(controlBar);
      amap.addControl(overView);

      if (marker) {
        marker.setMap(null);
        marker = null;
      }
      marker = new map.value.Marker({
        position: [mapCenter[0], mapCenter[1]],
      });
      marker.setMap(amap);
    } catch (error) {
      console.log(error);
    }
  };

  // 地图点击标注
  const showInfoClick = (e: { lnglat: { getLng: () => string; getLat: () => string } }) => {
    formValue.value.mapCenter = e.lnglat.getLng() + ',' + e.lnglat.getLat();
    const text = '您在 [ ' + e.lnglat.getLng() + ',' + e.lnglat.getLat() + ' ] 的位置单击了地图！';
    console.log(text);
    // 实例化点标记
    if (marker) {
      marker.setMap(null);
      marker = null;
    }
    marker = new map.value.Marker({
      position: [e.lnglat.getLng(), e.lnglat.getLat()],
    });
    marker.setMap(amap);
  };

  // 地图缩放
  const mapZoomend = () => {
    formValue.value.mapZoom = amap.getZoom();
  };

  const formSubmit = () => {
    formRef.value.validate(async (errors: any) => {
      if (!errors) {
        const result = (await editConfig(formValue.value)) as {
          status: string;
          message: string;
        };
        if (result.status === 'success') {
          message.success('提交成功');
        } else {
          message.error(result.message);
        }
      } else {
        message.error('验证失败，请填写完整信息');
      }
    });
  };

  onMounted(async () => {
    getParameter();
  });
</script>
<style lang="less" scoped>
  .map-box {
    width: 100%;
    height: 420px;
    border: 1px solid #dddddd;
  }
</style>
