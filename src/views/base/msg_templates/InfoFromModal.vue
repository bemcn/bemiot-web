<template>
  <!-- 新增/编辑 -->
  <n-modal
    v-model:show="showState"
    :show-icon="false"
    preset="dialog"
    style="width: 940px"
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
      <n-grid :cols="24" :x-gap="24">
        <n-gi :span="12">
          <n-form-item label="模板标识" path="identity">
            <n-input
              maxlength="50"
              placeholder="请输入模板标识"
              v-model:value="localParams.identity"
              clearable
              v-if="localParams.scopeApp === 'mail'"
            />
            <n-input-group v-else>
              <n-input
                maxlength="50"
                placeholder="请选择平台模板"
                v-model:value="localParams.identity"
                disabled
              />
              <n-button ghost @click="handleTemplate">选择</n-button>
            </n-input-group>
          </n-form-item>
        </n-gi>
        <n-gi :span="12">
          <n-form-item label="模板标题" path="title">
            <n-input
              maxlength="50"
              placeholder="请输入模板标题"
              v-model:value="localParams.title"
              :clearable="localParams.scopeApp === 'mail'"
              :disabled="localParams.scopeApp !== 'mail'"
            />
          </n-form-item>
        </n-gi>
        <n-gi :span="12">
          <n-form-item label="运用类型" path="scopeApp">
            <n-input
              :value="
                localParams.scopeApp === 'wechat'
                  ? '微信消息模板'
                  : localParams.scopeApp === 'sms'
                  ? '短信消息模板'
                  : '邮件消息模板'
              "
              disabled
            />
          </n-form-item>
        </n-gi>
        <n-gi :span="12">
          <n-form-item label="模版类型" path="subtype">
            <n-select
              v-model:value="localParams.subtype"
              :options="subtypeOptions"
              placeholder="请选择模版类型"
            />
          </n-form-item>
        </n-gi>
        <n-gi :span="24">
          <n-form-item label="模板内容" path="example">
            <n-input
              type="textarea"
              placeholder="请输入模板内容"
              :autosize="{
                minRows: 3,
              }"
              v-model:value="localParams.content"
              :clearable="localParams.scopeApp === 'mail'"
              :disabled="localParams.scopeApp !== 'mail'"
            />
          </n-form-item>
        </n-gi>
        <n-gi :span="24">
          <n-form-item label="内容示例" path="example">
            <n-input
              type="textarea"
              placeholder="请输入内容示例"
              :autosize="{
                minRows: 3,
              }"
              v-model:value="localParams.content"
              clearable
            />
          </n-form-item>
        </n-gi>
        <n-gi :span="12">
          <n-form-item label="短信签名" path="signName" v-if="localParams.scopeApp === 'sms'">
            <n-input v-model:value="localParams.signName" disabled />
          </n-form-item>
        </n-gi>
        <n-gi :span="localParams.scopeApp === 'sms' ? 12 : 24">
          <n-form-item label="数据来源" path="dataSource">
            <n-select
              v-model:value="localParams.dataSource"
              :options="dataSourceOptions"
              placeholder="请选择数据来源"
            />
          </n-form-item>
        </n-gi>
        <n-gi :span="24">
          <n-form-item label="模板数据" path="enumArray">
            <n-dynamic-input v-model:value="localParams.enumArray" placeholder="请输入参数值">
              <template #create-button-default> 添加条件 </template>
              <template #default="{ item }">
                <n-form-item :show-label="false">
                  <div style="display: flex; align-items: center; width: 100%">
                    <n-input
                      maxlength="100"
                      placeholder="Key"
                      :value="item?.key || ''"
                      @update:value="(value) => (item.key = value)"
                      clearable
                    />
                    <n-select
                      :value="item?.type || 'string'"
                      @update:value="(value) => (item.type = value)"
                      :options="valTypeOptions"
                      style="width: 120px"
                    />
                    <n-input
                      maxlength="100"
                      placeholder="Value"
                      :value="item?.value || ''"
                      @update:value="(value) => (item.value = value)"
                      clearable
                    />
                  </div>
                </n-form-item>
              </template>
            </n-dynamic-input>
          </n-form-item>
        </n-gi>
        <n-gi :span="24">
          <n-form-item label="推送用户" path="userSource">
            <n-select
              v-model:value="localParams.userSource"
              :options="userSourceOptions"
              placeholder="请选择推送用户"
            />
          </n-form-item>
        </n-gi>
        <n-gi :span="24">
          <n-form-item
            label="指定用户"
            path="userSource"
            v-if="localParams.userSource === 'specified'"
          >
            <n-dynamic-tags v-model:value="tags" :max="3">
              <template #trigger="{}">
                <n-button size="small" type="primary" dashed @click="handleCheckUser">
                  <template #icon>
                    <n-icon>
                      <PlusOutlined />
                    </n-icon>
                  </template>
                </n-button>
              </template>
            </n-dynamic-tags>
          </n-form-item>
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
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { FormRules } from 'naive-ui';
  import { addMsgTemplate, editMsgTemplate } from '@/api/base/msgTemplate';
  // @ts-ignore
  import { PlusOutlined } from '@vicons/antd';

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
        groupId: 0,
        groupName: '',
        orderNum: '',
        remark: '',
      }),
    },
  });

  // 回调
  const emit = defineEmits(['close', 'submit']);

  const showState = ref(false);
  const localParams: any = ref(null);
  const formBtnLoading = ref(false);
  const formRef: any = ref(null);
  const subtypeOptions = [];
  const valTypeOptions = [
    {
      label: '字符串',
      value: 'string',
    },
    {
      label: '数字',
      value: 'number',
    },
    {
      label: '布尔值',
      value: 'boolean',
    },
  ];
  const dataSourceOptions = [
    {
      label: '设备信息',
      value: 'device',
    },
    {
      label: '物模型信息',
      value: 'model',
    },
  ];
  const userSourceOptions = [
    {
      label: '所有用户',
      value: 'all',
    },
    {
      label: '设备所有者',
      value: 'owner',
    },
    {
      label: '指定用户',
      value: 'specified',
    },
  ];
  const tags = ref(['教师', '程序员']);

  // 表单验证
  const rules: FormRules = {
    groupName: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入分组名称',
    },
  };

  const closeModalAfter = () => {
    emit('close');
  };

  watch([() => props.showModel, () => props.params], ([newShowModel, newParams]) => {
    showState.value = newShowModel;
    localParams.value = newParams;
  });

  const handleTemplate = () => {
    console.log('handleTemplate');
  };

  const handleCheckUser = () => {
    console.log('handleCheckUser');
  };

  // 提交表单
  const confirmForm = (e: any) => {
    e.preventDefault();
    formBtnLoading.value = true;
    formRef.value.validate(async (errors: any) => {
      if (!errors) {
        const enumValues = JSON.stringify(localParams.value.enumArray);
        let userData = '';
        if (
          localParams.value.userSource === 'specified' &&
          localParams.value.userDataArray &&
          localParams.value.userDataArray.length > 0
        ) {
          userData = JSON.stringify(localParams.value.userDataArray);
        }
        const params = {
          templateId: localParams.value.templateId,
          scopeApp: localParams.value.scopeApp,
          identity: localParams.value.identity,
          title: localParams.value.title,
          content: localParams.value.content,
          example: localParams.value.example,
          subtype: localParams.value.subtype,
          dataSource: localParams.value.dataSource,
          enumValues: enumValues,
          signName: localParams.value.signName,
          userSource: localParams.value.userSource,
          userData: userData,
        };

        let result: { status: any; message: any };
        if (props.action === 'add') {
          result = (await addMsgTemplate(params)) as unknown as {
            status: string;
            message: string;
          };
        } else {
          result = (await editMsgTemplate(params)) as unknown as {
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
