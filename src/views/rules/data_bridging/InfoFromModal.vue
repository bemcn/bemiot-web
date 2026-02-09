<template>
  <!-- 新增/编辑 -->
  <n-modal
    v-model:show="showState"
    :show-icon="false"
    preset="dialog"
    style="width: 860px"
    :title="title"
    @after-leave="closeModalAfter"
  >
    <n-form
      :model="localParams"
      :rules="rules"
      ref="formRef"
      label-placement="left"
      :label-width="120"
      class="py-4"
    >
      <n-form-item label="桥接名称" path="bridgeName">
        <n-input
          maxlength="50"
          placeholder="请输入桥接名称"
          v-model:value="localParams.bridgeName"
          clearable
        />
      </n-form-item>
      <n-form-item label="桥接方向" path="bridgeDirection">
        <n-select
          v-model:value="localParams.bridgeDirection"
          :options="directionOptions"
          placeholder="请选择桥接方向"
        />
      </n-form-item>
      <n-form-item label="桥接类型" path="bridgeType">
        <n-button-group>
          <n-button
            :type="localParams.bridgeType === 'http' ? 'primary' : 'default'"
            @click="handleType('http')"
            >HTTP推送</n-button
          >
          <n-button
            :type="localParams.bridgeType === 'mqtt' ? 'primary' : 'default'"
            @click="handleType('mqtt')"
            >Mqtt桥接</n-button
          >
          <n-button
            :type="localParams.bridgeType === 'database' ? 'primary' : 'default'"
            @click="handleType('database')"
            >数据库存储</n-button
          >
        </n-button-group>
      </n-form-item>
      <n-form-item label="是否生效" path="status">
        <n-switch v-model:value="localParams.status" />
      </n-form-item>
      <!-- HTTP类型配置 -->
      <template v-if="localParams.bridgeType === 'http'">
        <n-form-item label="HTTP URL" path="httpUrl">
          <n-input-group>
            <n-select
              :style="{ width: '120px' }"
              v-model:value="localParams.httpUrlType"
              :options="httpOptions"
            />
            <n-input
              placeholder="请输入HTTP请求地址"
              v-model:value="localParams.httpUrl"
              clearable
            />
          </n-input-group>
        </n-form-item>
        <n-form-item label="HTTP方法" path="httpMethod">
          <n-select
            v-model:value="localParams.httpMethod"
            :options="httpMethodOptions"
            placeholder="请选择HTTP方法"
          />
        </n-form-item>
        <n-form-item label="HTTP请求头" path="httpHeaderArray">
          <n-dynamic-input
            v-model:value="localParams.httpHeaderArray"
            :on-create="onCreateHttpHeader"
          >
            <template #create-button-default>添加请求头</template>
            <template #default="{ value }">
              <div style="display: flex; align-items: center; width: 100%">
                <n-input-group style="margin-right: 8px">
                  <n-input-group-label>键</n-input-group-label>
                  <n-input v-model:value="value.key" placeholder="请输入参数名" clearable />
                </n-input-group>
                <n-input-group style="margin-left: 8px">
                  <n-input-group-label>值</n-input-group-label>
                  <n-input v-model:value="value.value" placeholder="请输入值" clearable />
                </n-input-group>
              </div>
            </template>
          </n-dynamic-input>
        </n-form-item>
        <n-form-item label="HTTP请求参数" path="httpParamsArray">
          <n-dynamic-input
            v-model:value="localParams.httpParamsArray"
            :on-create="onCreateHttpParams"
          >
            <template #create-button-default>添加请求参数</template>
            <template #default="{ value }">
              <div style="display: flex; align-items: center; width: 100%">
                <n-input-group style="margin-right: 8px">
                  <n-input-group-label>键</n-input-group-label>
                  <n-input v-model:value="value.key" placeholder="请输入参数名" clearable />
                </n-input-group>
                <n-input-group style="margin-left: 8px">
                  <n-input-group-label>值</n-input-group-label>
                  <n-input v-model:value="value.value" placeholder="请输入值" clearable />
                </n-input-group>
              </div>
            </template>
          </n-dynamic-input>
        </n-form-item>
        <n-form-item label="HTTP请求体" path="httpBody">
          <n-input
            type="textarea"
            placeholder="请输入HTTP请求体"
            v-model:value="localParams.httpBody"
            clearable
          />
        </n-form-item>
      </template>
      <!-- MQTT类型配置 -->
      <template v-else-if="localParams.bridgeType === 'mqtt'">
        <n-form-item label="MQTT服务地址" path="mqttUrl">
          <n-input-group>
            <n-input-group-label>tcp://</n-input-group-label>
            <n-input
              placeholder="请输入MQTT服务地址"
              v-model:value="localParams.mqttUrl"
              clearable
            />
          </n-input-group>
        </n-form-item>
        <n-form-item label="MQTT客户端ID" path="mqttClientId">
          <n-input
            placeholder="请输入MQTT客户端ID"
            v-model:value="localParams.mqttClientId"
            clearable
          />
        </n-form-item>
        <n-form-item label="MQTT用户名" path="mqttUsername">
          <n-input
            placeholder="请输入MQTT用户名"
            v-model:value="localParams.mqttUsername"
            clearable
          />
        </n-form-item>
        <n-form-item label="MQTT密码" path="mqttPassword">
          <n-input
            type="password"
            placeholder="请输入MQTT密码"
            v-model:value="localParams.mqttPassword"
            clearable
          />
        </n-form-item>
        <n-form-item
          :label="localParams.bridgeDirection === 'input' ? '数据输入主题' : '数据输出主题'"
          path="mqttTopic"
        >
          <n-input placeholder="请输入主题名称" v-model:value="localParams.mqttTopic" clearable />
        </n-form-item>
        <n-collapse>
          <n-collapse-item title="高级配置" name="1">
            <n-form-item label="MQTT版本" path="mqttVersion">
              <n-select
                v-model:value="localParams.mqttVersion"
                :options="versionOptions"
                placeholder="请选择MQTT版本"
              />
            </n-form-item>
            <n-form-item label="连接超时时长" path="mqttTimeout">
              <n-input
                placeholder="请输入连接超时时长"
                v-model:value="localParams.mqttTimeout"
                :allow-input="onlyAllowInt"
                clearable
              />
            </n-form-item>
            <n-form-item label="Keep Alive" path="mqttKeepAlive">
              <n-input
                placeholder="请输入保持激活时长"
                v-model:value="localParams.mqttKeepAlive"
                :allow-input="onlyAllowInt"
                clearable
              />
            </n-form-item>
            <n-form-item label="开启自动连接" path="mqttAutoLink">
              <n-switch v-model:value="localParams.mqttAutoLink" />
            </n-form-item>
            <n-form-item label="Clean Session" path="mqttCleanSession">
              <n-input
                placeholder="请输入清理会话时长"
                v-model:value="localParams.mqttCleanSession"
                :allow-input="onlyAllowInt"
                clearable
              />
            </n-form-item>
          </n-collapse-item>
        </n-collapse>
      </template>
      <!-- Database类型配置 -->
      <template v-else-if="localParams.bridgeType === 'database'">
        <n-form-item label="数据库源" path="dataSource">
          <n-select
            v-model:value="localParams.dataSource"
            :options="dataSourceOptions"
            placeholder="请选择数据库源"
          />
        </n-form-item>
        <n-form-item label="数据库连接地址" path="dataUrl">
          <n-input
            placeholder="请输入数据库连接地址"
            v-model:value="localParams.dataUrl"
            clearable
          />
        </n-form-item>
        <n-form-item label="数据库用户名" path="dataUsername">
          <n-input
            placeholder="请输入数据库用户名"
            v-model:value="localParams.dataUsername"
            clearable
          />
        </n-form-item>
        <n-form-item label="数据库密码" path="dataPassword">
          <n-input
            type="password"
            placeholder="请输入数据库密码"
            v-model:value="localParams.dataPassword"
            clearable
          />
        </n-form-item>
        <n-form-item label="数据库名称" path="dataName">
          <n-input placeholder="请输入数据库名称" v-model:value="localParams.dataName" clearable />
        </n-form-item>
        <n-form-item label="执行SQL语句" path="dataSql">
          <n-input
            type="textarea"
            placeholder="请输入执行SQL语句"
            v-model:value="localParams.dataSql"
            clearable
          />
        </n-form-item>
      </template>
    </n-form>
    <template #action>
      <n-space>
        <n-button @click="() => (showState = false)">取消</n-button>
        <n-button type="info" :loading="formBtnLoading" @click="confirmForm">确定</n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { FormRules } from 'naive-ui';
  import { addDataBridge, editDataBridge } from '@/api/rules/dataBridging';

  const props = defineProps({
    showModel: {
      type: Boolean,
      default: () => true,
    },
    title: {
      type: String,
      default: () => '',
    },
    action: {
      type: String,
      default: () => '',
    },
    params: {
      type: Object as PropType<any>,
      default: () => ({
        bridgeId: '',
        bridgeName: '',
        bridgeDirection: 'input',
        bridgeType: 'http',
        status: 1,
      }),
    },
  });

  // 回调
  const emit = defineEmits(['close', 'submit']);

  const showState = ref(false);
  const fromAction = ref('');
  const localParams: any = ref(null);
  const formBtnLoading = ref(false);
  const formRef: any = ref(null);
  const directionOptions = [
    {
      label: '输入',
      value: 'input',
    },
    {
      label: '输出',
      value: 'output',
    },
  ];

  const httpMethodOptions = [
    {
      label: 'GET',
      value: 'GET',
    },
    {
      label: 'POST',
      value: 'POST',
    },
  ];

  const httpOptions = [
    {
      label: 'http://',
      value: 'http://',
    },
    {
      label: 'https://',
      value: 'https://',
    },
  ];

  const versionOptions = [
    {
      label: '0',
      value: '0',
    },
    {
      label: '3.1.3',
      value: '3.1.3',
    },
    {
      label: '3.1.1',
      value: '3.1.1',
    },
  ];

  const dataSourceOptions = [
    {
      label: 'MySQL',
      value: 'MySQL',
    },
    {
      label: 'SQLServer',
      value: 'SQLServer',
    },
    {
      label: 'PostgreSQL',
      value: 'PostgreSQL',
    },
    {
      label: 'Oracle',
      value: 'Oracle',
    },
  ];

  // 表单验证
  const onlyAllowInt = (value: string) => !value || /^\d+$/.test(value);
  const rules: FormRules = {
    bridgeName: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入桥接名称',
    },
    bridgeDirection: {
      required: true,
      message: '请选择桥接方向',
      trigger: ['blur', 'change'],
    },
    bridgeType: {
      required: true,
      message: '请选择桥接类型',
      trigger: ['blur', 'change'],
    },
    // 根据类型动态验证
  };

  const closeModalAfter = () => {
    emit('close');
  };

  watch(
    [() => props.showModel, () => props.action, () => props.params],
    ([newShowModel, newAction, newParams]) => {
      showState.value = newShowModel;
      fromAction.value = newAction;
      localParams.value = { ...newParams }; // 创建副本避免直接修改props
    }
  );

  // 选择桥接类型
  const handleType = (value: string) => {
    localParams.value.bridgeType = value;
  };

  // 添加请求头
  const onCreateHttpHeader = () => {
    return {
      key: '',
      value: '',
    };
  };

  // 添加请求参数
  const onCreateHttpParams = () => {
    return {
      key: '',
      value: '',
    };
  };

  // 提交表单
  const confirmForm = (e: any) => {
    e.preventDefault();
    formBtnLoading.value = true;
    formRef.value.validate(async (errors: any) => {
      if (!errors) {
        const httpHeaderArray = localParams.value.httpHeaderArray;
        const httpParamsArray = localParams.value.httpParamsArray;
        let headArray: { key: string; value: string }[] = [];
        httpHeaderArray.forEach((item: any) => {
          if (item.key) {
            headArray.push({
              key: item.key,
              value: item.value,
            });
          }
        });
        let paramsArray: { key: string; value: string }[] = [];
        httpParamsArray.forEach((item: any) => {
          if (item.key) {
            paramsArray.push({
              key: item.key,
              value: item.value,
            });
          }
        });
        const httpHeader = headArray.length > 0 ? JSON.stringify(headArray) : '';
        const httpParams = paramsArray.length > 0 ? JSON.stringify(paramsArray) : '';
        const mqttVersion =
          localParams.value.mqttVersion === null ? '' : localParams.value.mqttVersion;
        const mqttTimeout =
          localParams.value.mqttTimeout === null ? 0 : parseInt(localParams.value.mqttTimeout);
        const mqttKeepAlive =
          localParams.value.mqttKeepAlive === null ? 0 : parseInt(localParams.value.mqttKeepAlive);
        const mqttCleanSession =
          localParams.value.mqttCleanSession === null
            ? 0
            : parseInt(localParams.value.mqttCleanSession);
        const dataSource = localParams.value.dataSource === null ? 0 : localParams.value.dataSource;

        const params = {
          bridgeId: localParams.value.bridgeId,
          bridgeName: localParams.value.bridgeName,
          bridgeDirection: localParams.value.bridgeDirection,
          bridgeType: localParams.value.bridgeType,
          httpUrlType: localParams.value.httpUrlType,
          httpUrl: localParams.value.httpUrl,
          httpMethod: localParams.value.httpMethod,
          httpHeader,
          httpParams,
          httpBody: localParams.value.httpBody,
          mqttUrl: localParams.value.mqttUrl,
          mqttClientId: localParams.value.mqttClientId,
          mqttUsername: localParams.value.mqttUsername,
          mqttPassword: localParams.value.mqttPassword,
          mqttTopic: localParams.value.mqttTopic,
          mqttVersion,
          mqttTimeout,
          mqttKeepAlive,
          mqttAutoLink: localParams.value.mqttAutoLink ? 1 : 0,
          mqttCleanSession,
          dataSource,
          dataUrl: localParams.value.dataUrl,
          dataUsername: localParams.value.dataUsername,
          dataPassword: localParams.value.dataPassword,
          dataName: localParams.value.dataName,
          dataSql: localParams.value.dataSql,
          status: localParams.value.status ? 1 : 0,
        };

        let result: { status: any; message: any };
        if (props.action === 'add') {
          result = (await addDataBridge(params)) as unknown as {
            status: string;
            message: string;
          };
        } else {
          result = (await editDataBridge(params)) as unknown as {
            status: string;
            message: string;
          };
        }
        if (result.status === 'success') {
          window['$message'].success('提交成功');
          setTimeout(() => {
            showState.value = false;
            emit('submit');
          });
        } else {
          window['$message'].error(result.message);
        }
      } else {
        window['$message'].error('请填写完整信息');
      }
      formBtnLoading.value = false;
    });
  };
</script>

<style lang="less" scoped>
  :deep(.n-base-icon) {
    color: #2374c6;
  }
  :deep(
    .n-collapse
    .n-collapse-item:not(.n-collapse-item--disabled).n-collapse-item--trigger-area-main
    .n-collapse-item__header
    .n-collapse-item__header-main) {
    font-size: 15px;
    font-weight: 600;
    padding-left: 20px;
    color: #2374c6;
  }
</style>
