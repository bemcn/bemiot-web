<template>
  <!-- 新增/编辑 -->
  <n-modal
    v-model:show="showState"
    :show-icon="false"
    preset="dialog"
    style="width: 960px"
    :title="title"
    @after-leave="closeModalAfter"
  >
    <n-form
      :model="localParams"
      :rules="localParams.serverType === 'BEM SIP' ? rulesSIP : rulesZLM"
      ref="formRef"
      label-placement="left"
      :label-width="120"
      class="py-4"
    >
      <n-grid :cols="24" :x-gap="24">
        <n-form-item-gi :span="12" label="服务名称" path="serverName">
          <n-input
            maxlength="20"
            placeholder="请输入服务名称"
            v-model:value="localParams.serverName"
            clearable
          />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="服务类型" path="serverType">
          <n-select
            v-model:value="localParams.serverType"
            :options="typeOptions"
            placeholder="请选择服务类型"
            :disabled="fromAction === 'edit'"
            @update:value="handleServerType"
          />
        </n-form-item-gi>
        <n-gi :span="24" v-if="localParams.serverType === 'BEM SIP'">
          <n-grid :cols="24" :x-gap="24">
            <n-form-item-gi :span="12" label="SIP ID" path="config.sipId">
              <n-input-group>
                <n-input
                  maxlength="20"
                  placeholder="请输入SIP ID"
                  v-model:value="localParams.config.sipId"
                  :disabled="fromAction === 'edit'"
                  :clearable="fromAction === 'add'"
                  :allow-input="onlyAllowNumber"
                />
                <n-button type="primary" @click="handleGenerateSipId">生成</n-button>
              </n-input-group>
            </n-form-item-gi>
            <n-form-item-gi :span="12" label="SIP服务域" path="config.sipDomain">
              <n-input
                maxlength="10"
                placeholder="请输入SIP服务域"
                v-model:value="localParams.config.sipDomain"
                :disabled="fromAction === 'edit'"
                :clearable="fromAction === 'add'"
                :allow-input="onlyAllowNumber"
              />
            </n-form-item-gi>
            <n-form-item-gi :span="12" label="服务器地址" path="config.sipAddress">
              <n-input
                maxlength="50"
                placeholder="请输入SIP服务器IP或域名"
                v-model:value="localParams.config.sipAddress"
                clearable
              />
            </n-form-item-gi>
            <n-form-item-gi :span="12" label="服务器端口" path="config.sipPort">
              <n-input
                maxlength="8"
                placeholder="请输入SIP服务器端口"
                v-model:value="localParams.config.sipPort"
                clearable
                :allow-input="onlyAllowNumber"
              />
            </n-form-item-gi>
            <n-form-item-gi :span="12" label="认证密码" path="config.sipPass">
              <n-input
                maxlength="50"
                placeholder="请输入SIP认证密码"
                v-model:value="localParams.config.sipPass"
                clearable
              />
            </n-form-item-gi>
            <n-form-item-gi :span="12" label="信令协议" path="config.protocol">
              <n-select
                v-model:value="localParams.config.protocol"
                :options="protocolOptions"
                placeholder="请选择信令协议"
              />
            </n-form-item-gi>
            <n-form-item-gi :span="12" label="传输协议" path="config.transmission">
              <n-select
                v-model:value="localParams.config.transmission"
                :options="transmissionOptions"
                placeholder="请选择视频传输协议"
              />
            </n-form-item-gi>
            <n-form-item-gi :span="12" label="心跳间隔" path="config.heartInterval">
              <n-input-group>
                <n-input
                  maxlength="4"
                  placeholder="请输入心跳间隔"
                  v-model:value="localParams.config.heartInterval"
                  clearable
                  :allow-input="onlyAllowNumber"
                />
                <n-input-group-label>秒</n-input-group-label>
              </n-input-group>
            </n-form-item-gi>
            <n-form-item-gi :span="12" label="注册有效期" path="config.regExpiration">
              <n-input-group>
                <n-input
                  maxlength="4"
                  placeholder="请输入注册有效期"
                  v-model:value="localParams.config.regExpiration"
                  clearable
                  :allow-input="onlyAllowNumber"
                />
                <n-input-group-label>秒</n-input-group-label>
              </n-input-group>
            </n-form-item-gi>
          </n-grid>
        </n-gi>
        <n-gi :span="24" v-else>
          <n-grid :cols="24" :x-gap="24">
            <n-form-item-gi :span="12" label="服务标识" path="config.appId">
              <n-input
                maxlength="20"
                placeholder="请输入服务标识"
                v-model:value="localParams.config.appId"
                :disabled="fromAction === 'edit'"
                :clearable="fromAction === 'add'"
              />
            </n-form-item-gi>
            <n-form-item-gi :span="12" label="服务器地址" path="config.ipAddress">
              <n-input
                maxlength="50"
                placeholder="请输入ZLMediaKit服务器IP或域名"
                v-model:value="localParams.config.ipAddress"
                clearable
              />
            </n-form-item-gi>
            <n-form-item-gi :span="12" label="认证密钥" path="config.secret">
              <n-input
                maxlength="100"
                placeholder="请输入认证密钥"
                v-model:value="localParams.config.secret"
                clearable
              />
            </n-form-item-gi>
            <n-form-item-gi :span="12" label="播放协议" path="config.playProtocol">
              <n-select
                v-model:value="localParams.config.playProtocol"
                :options="playProtocolOptions"
                placeholder="请选择播放协议"
              />
            </n-form-item-gi>
            <n-form-item-gi :span="12" label="收流模式" path="config.receiveType">
              <n-radio-group v-model:value="localParams.config.receiveType" name="receiveType">
                <n-space>
                  <n-radio value="0">单端口</n-radio>
                  <n-radio value="1">多端口</n-radio>
                </n-space>
              </n-radio-group>
            </n-form-item-gi>
            <n-form-item-gi :span="12" label="收流端口">
              <n-input-group>
                <n-input
                  maxlength="8"
                  placeholder="开始端口号"
                  v-model:value="localParams.config.receivePort1"
                  clearable
                  :allow-input="onlyAllowNumber"
                />
                <n-input-group-label>至</n-input-group-label>
                <n-input
                  maxlength="8"
                  placeholder="结束端口号"
                  v-model:value="localParams.config.receivePort2"
                  clearable
                  :allow-input="onlyAllowNumber"
                />
              </n-input-group>
            </n-form-item-gi>
            <n-form-item-gi :span="12" label="http端口" path="config.httpPort">
              <n-input
                maxlength="8"
                placeholder="请输入http端口"
                v-model:value="localParams.config.httpPort"
                clearable
                :allow-input="onlyAllowNumber"
              />
            </n-form-item-gi>
            <n-form-item-gi :span="12" label="https端口" path="config.httpsPort">
              <n-input
                maxlength="8"
                placeholder="请输入https端口"
                v-model:value="localParams.config.httpsPort"
                clearable
                :allow-input="onlyAllowNumber"
              />
            </n-form-item-gi>
            <n-form-item-gi :span="12" label="rtmp端口" path="config.rtmpPort">
              <n-input
                maxlength="8"
                placeholder="请输入rtmp端口"
                v-model:value="localParams.config.rtmpPort"
                clearable
                :allow-input="onlyAllowNumber"
              />
            </n-form-item-gi>
            <n-form-item-gi :span="12" label="rtsp端口" path="config.rtspPort">
              <n-input
                maxlength="8"
                placeholder="请输入rtsp端口"
                v-model:value="localParams.config.rtspPort"
                clearable
                :allow-input="onlyAllowNumber"
              />
            </n-form-item-gi>
            <n-form-item-gi :span="12" label="rtp端口" path="config.rtpPort">
              <n-input
                maxlength="8"
                placeholder="请输入rtp端口"
                v-model:value="localParams.config.rtpPort"
                clearable
                :allow-input="onlyAllowNumber"
              />
            </n-form-item-gi>
            <n-form-item-gi :span="12" label="录像端口" path="config.storagePort">
              <n-input
                maxlength="8"
                placeholder="请输入录像端口"
                v-model:value="localParams.config.storagePort"
                clearable
                :allow-input="onlyAllowNumber"
              />
            </n-form-item-gi>
          </n-grid>
        </n-gi>
      </n-grid>
    </n-form>
    <template #action>
      <n-space>
        <n-button @click="() => (showState = false)">取消</n-button>
        <n-button type="info" :loading="formBtnLoading" @click="confirmForm">确定</n-button>
      </n-space>
    </template>
  </n-modal>

  <GenerateSipId
    :showModel="showGenerateModal"
    @close="() => (showGenerateModal = false)"
    @submit="createGenerate"
  />
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { FormRules } from 'naive-ui';
  import { addVideoServer, editVideoServer } from '@/api/video/videoServer';
  // @ts-ignore
  import GenerateSipId from './GenerateSipId.vue';

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
        certificateId: 0,
        certificateName: '',
        certificateStandard: null,
        caFile: '',
        remark: '',
      }),
    },
  });

  // 回调
  const emit = defineEmits(['close', 'submit']);

  const showState = ref(false);
  const showGenerateModal = ref(false);
  const fromAction = ref('');
  const localParams: any = ref(null);
  const formBtnLoading = ref(false);
  const formRef: any = ref(null);
  const typeOptions = [
    {
      label: 'BEM SIP',
      value: 'BEM SIP',
    },
    {
      label: 'ZLMediaKit',
      value: 'ZLMediaKit',
    },
  ];
  const protocolOptions = [
    {
      label: 'UDP',
      value: 'UDP',
    },
    {
      label: 'TCP',
      value: 'TCP',
    },
  ];
  const transmissionOptions = [
    {
      label: 'UDP',
      value: 'UDP',
    },
    {
      label: 'TCP Active',
      value: 'TCP Active',
    },
    {
      label: 'TCP Passive',
      value: 'TCP Passive',
    },
  ];
  const playProtocolOptions = [
    {
      label: 'http',
      value: 'http',
    },
    {
      label: 'https',
      value: 'https',
    },
    {
      label: 'rtmp',
      value: 'rtmp',
    },
    {
      label: 'hls',
      value: 'hls',
    },
    {
      label: 'webscoket',
      value: 'webscoket',
    },
  ];

  // 表单验证
  const onlyAllowNumber = (value: string) => !value || /^\d+$/.test(value);
  const rulesSIP: FormRules = {
    certificateName: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入服务器名称',
    },
    serverType: {
      required: true,
      message: '请选择服务类型',
      trigger: ['blur', 'change'],
    },
    'config.sipId': [
      {
        required: true,
        trigger: ['blur', 'input'],
        message: '请输入SIP ID',
      },
      {
        trigger: ['blur', 'input'],
        validator: (_rule, value) => {
          if (value && value.length !== 20) {
            return new Error('SIP ID长度必须是20位');
          }
          return true;
        },
      },
    ],
    'config.sipDomain': [
      {
        required: true,
        trigger: ['blur', 'input'],
        message: '请输入SIP服务域',
      },
      {
        trigger: ['blur', 'input'],
        validator: (_rule, value) => {
          if (value && value.length !== 10) {
            return new Error('SIP服务域长度必须是10位');
          }
          return true;
        },
      },
      {
        trigger: ['blur', 'input'],
        validator: (_rule, value) => {
          const sipId = localParams.value?.config?.sipId;
          if (value && sipId && value !== sipId.substring(0, 10)) {
            return new Error('SIP服务域必须是SIP ID的前10个字符');
          }
          return true;
        },
      },
    ],
    'config.sipAddress': {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入SIP服务器地址',
    },
    'config.sipPort': {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入SIP服务器端口',
    },
    'config.sipPass': {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入SIP认证密码',
    },
    'config.protocol': {
      required: true,
      message: '请选择信令协议',
      trigger: ['blur', 'change'],
    },
    'config.transmission': {
      required: true,
      message: '请选择视频传输协议',
      trigger: ['blur', 'change'],
    },
    'config.heartInterval': {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入心跳间隔',
    },
    'config.regExpiration': {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入注册有效期',
    },
  };
  const rulesZLM: FormRules = {
    certificateName: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入服务器名称',
    },
    serverType: {
      required: true,
      message: '请选择服务类型',
      trigger: ['blur', 'change'],
    },
    'config.appId': {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入服务器标识',
    },
    'config.ipAddress': {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入服务器地址',
    },
    'config.secret': {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入认证密钥',
    },
    'config.playProtocol': {
      required: true,
      message: '请选择播放协议',
      trigger: ['blur', 'change'],
    },
  };

  const closeModalAfter = () => {
    emit('close');
  };

  watch(
    [() => props.showModel, () => props.action, () => props.params],
    ([newShowModel, newAction, newParams]) => {
      showState.value = newShowModel;
      fromAction.value = newAction;
      localParams.value = newParams;
    }
  );

  const handleServerType = (value: string) => {
    if (value === 'BEM SIP') {
      localParams.value.config = {
        sipId: '',
        sipDomain: '',
        sipAddress: '',
        sipPort: '5060',
        sipPass: '',
        protocol: 'UDP',
        transmission: 'UDP',
        heartInterval: '30',
        regExpiration: '3600',
      };
    } else {
      localParams.value.config = {
        appId: '',
        ipAddress: '',
        secret: '',
        playProtocol: 'http',
        receiveType: '1',
        receivePort1: '30000',
        receivePort2: '50000',
        httpPort: '8080',
        httpsPort: '443',
        rtmpPort: '19351',
        rtspPort: '5554',
        rtpPort: '5544',
        storagePort: '8090',
      };
    }
  };

  const handleGenerateSipId = () => {
    showGenerateModal.value = true;
  };

  const createGenerate = (id: any) => {
    localParams.value.config.sipId = id;
    localParams.value.config.sipDomain = id.substring(0, 10);
  };

  // 提交表单
  const confirmForm = (e: any) => {
    e.preventDefault();
    formBtnLoading.value = true;
    formRef.value.validate(async (errors: any) => {
      if (!errors) {
        let serverKey = '';
        if (props.action === 'add') {
          if (localParams.value.serverType === 'BEM SIP') {
            serverKey = localParams.value.config.sipDomain;
          } else {
            serverKey = localParams.value.config.appId;
          }
        } else {
          serverKey = localParams.value.serverKey;
        }

        const params = {
          serverId: localParams.value.serverId,
          serverKey,
          serverName: localParams.value.serverName,
          serverType: localParams.value.serverType,
          serviceConfig: JSON.stringify(localParams.value.config),
        };

        let result: { status: any; message: any };
        if (props.action === 'add') {
          result = (await addVideoServer(params)) as unknown as {
            status: string;
            message: string;
          };
        } else {
          result = (await editVideoServer(params)) as unknown as {
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
