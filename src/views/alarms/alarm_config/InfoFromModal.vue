<template>
  <!-- 新增/编辑告警设置 -->
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
      <n-grid x-gap="12" :cols="2">
        <n-form-item-gi label="规则名称" path="rulesName">
          <n-input
            maxlength="50"
            placeholder="请输入规则名称"
            v-model:value="localParams.rulesName"
            clearable
          />
        </n-form-item-gi>
        <n-form-item-gi label="产品编号" path="productId">
          <n-input-group>
            <n-input placeholder="请选择产品" v-model:value="localParams.productId" clearable />
            <n-button type="primary" ghost @click="handleProduct">选择</n-button>
          </n-input-group>
        </n-form-item-gi>
        <n-form-item-gi label="产品名称">
          <n-input :value="localParams.productName" disabled />
        </n-form-item-gi>
        <n-form-item-gi label="模型标识" path="modelIdentity">
          <n-input-group>
            <n-input
              placeholder="请选择物模型"
              v-model:value="localParams.modelIdentity"
              clearable
            />
            <n-button type="primary" ghost @click="handleModel">选择</n-button>
          </n-input-group>
        </n-form-item-gi>
        <n-form-item-gi label="模型名称">
          <n-input :value="localParams.modelName" disabled />
        </n-form-item-gi>
        <n-form-item-gi label="模型名称">
          <n-input :value="localParams.modelName" disabled />
        </n-form-item-gi>
        <n-form-item-gi label="数据类型">
          <n-input :value="getDataType(localParams.dataType)" disabled />
        </n-form-item-gi>
      </n-grid>
      <n-form-item label="告警规则" path="rules">
        <n-dynamic-input v-model:value="localParams.rules" :on-create="handleCreateRule">
          <template #create-button-default>添加</template>
          <template #default="{ value, index }">
            <div style="display: flex; align-items: center; width: 100%">
              <n-form-item :show-label="false">
                <n-select
                  v-model:value="value.link"
                  :options="linkOptions"
                  :disabled="index === 0"
                  style="width: 120px; margin-right: 10px"
                />
              </n-form-item>
              <n-form-item :show-label="false">
                <n-select
                  v-model:value="value.model"
                  :options="modelOptions"
                  style="width: 220px; margin-right: 10px"
                />
              </n-form-item>
              <n-form-item :show-label="false">
                <n-select
                  v-model:value="value.operator"
                  :options="operatorOptions"
                  style="width: 120px; margin-right: 10px"
                />
              </n-form-item>
              <n-form-item :show-label="false" :path="`rules.${index}.value`" :rule="ruleValue">
                <n-input maxlength="10" placeholder="阈值" v-model:value="value.value" clearable />
              </n-form-item>
            </div>
          </template>
        </n-dynamic-input>
      </n-form-item>
      <n-grid x-gap="12" :cols="2">
        <n-form-item-gi label="告警级别" path="alarmLevel">
          <n-select
            v-model:value="localParams.alarmLevel"
            :options="levelOptions"
            placeholder="请选择告警级别"
          />
        </n-form-item-gi>
        <n-form-item-gi label="通知方式" path="alertsType">
          <n-select
            v-model:value="localParams.alertsType"
            :options="alertsTypeOptions"
            placeholder="请选择通知方式"
            @update:value="handleAlertsType"
          />
        </n-form-item-gi>
      </n-grid>
      <n-form-item label="指定用户" v-if="localParams.alertsType === '3'">
        <n-select
          v-model:value="localParams.users"
          multiple
          :options="userOptions"
          placeholder="请选择通知人员"
        />
      </n-form-item>
    </n-form>
    <template #action>
      <n-space>
        <n-button @click="() => (showState = false)">取消</n-button>
        <n-button type="info" :loading="formBtnLoading" @click="confirmForm">确定</n-button>
      </n-space>
    </template>
  </n-modal>
  <SelectProduct
    :showModel="showProduct"
    @close="() => (showProduct = false)"
    @checked="checkProduct"
  />
  <SelectModel
    :showModel="showProductModal"
    :id="String(localParams?.productId || '0')"
    class=""
    @close="() => (showProductModal = false)"
    @checked="checkModel"
  />
</template>

<script lang="ts" setup>
  import { PropType, ref, watch } from 'vue';
  import { FormItemRule, FormRules, SelectOption } from 'naive-ui';
  import { getProductModelList, ProductModelParams } from '@/api/devices/productModel';
  import { ProductModel } from '@/types/DeviceModel';
  import { addModelAlarmRules, editModelAlarmRules } from '@/api/devices/modelAlarmRules';
  import { getUserNameArray } from '@/api/system/user';
  // @ts-ignore
  import SelectProduct from '@/components/SelectProduct/SelectProduct.vue';
  // @ts-ignore
  import SelectModel from '@/components/SelectModel/SelectModel.vue';

  const props = defineProps({
    showModel: {
      type: Boolean,
      default: () => true,
    },
    action: {
      type: String,
      default: () => '',
    },
    params: {
      type: Object as PropType<any>,
      default: () => ({
        rulesId: '',
        rulesName: '',
        productId: '',
        productName: '',
        modelIdentity: '',
        modelName: '',
        dataType: '',
        alarmLevel: '1',
        alarmRules: '',
        rules: [
          {
            link: '',
            model: '',
            operator: '==',
            value: '',
          },
        ],
        alertsType: '1',
        specifyUsers: '',
        users: [],
      }),
    },
  });

  // 回调
  const emit = defineEmits(['close', 'submit']);

  const showState = ref(false);
  const showProduct = ref(false);
  const showProductModal = ref(false);
  const fromAction = ref('');
  const title = ref('');
  const localParams: any = ref(null);
  const formBtnLoading = ref(false);
  const formRef: any = ref(null);

  const levelOptions = [
    {
      label: '一般告警',
      value: '1',
    },
    {
      label: '重要告警',
      value: '2',
    },
    {
      label: '紧急告警',
      value: '3',
    },
  ];
  const linkOptions = [
    {
      label: 'and',
      value: 'and',
    },
    {
      label: 'or',
      value: 'or',
    },
  ];
  const modelOptions = ref<SelectOption[]>([]);
  const operatorOptions = [
    {
      label: '==',
      value: '==',
    },
    {
      label: '!=',
      value: '!=',
    },
    {
      label: '>',
      value: '>',
    },
    {
      label: '>=',
      value: '>=',
    },
    {
      label: '<',
      value: '<',
    },
    {
      label: '<=',
      value: '<=',
    },
  ];
  const alertsTypeOptions = [
    {
      label: '所有用户',
      value: '1',
    },
    {
      label: '设备所有者',
      value: '2',
    },
    {
      label: '指定用户',
      value: '3',
    },
  ];
  const userOptions = ref<SelectOption[]>([]);

  // 单个阈值的验证规则
  const ruleValue: FormItemRule = {
    required: true,
    message: '阈值不能为空',
    trigger: ['blur', 'input'],
  };
  // 验证规则
  const rules: FormRules = {
    rulesName: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入规则名称',
    },
    modelIdentity: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入模型标识',
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
      title.value = newAction === 'add' ? '添加告警规则' : '编辑告警规则';
      initLocalParams(newParams);
      initLoadModels(newParams);
    }
  );

  const getDataType = (value: any) => {
    if (value === 'int') {
      return '整数';
    } else if (value === 'number') {
      return '小数';
    } else if (value === 'text') {
      return '字符串';
    } else if (value === 'timestamp') {
      return '时间戳';
    } else if (value === 'bool') {
      return '布尔值';
    } else if (value === 'enum') {
      return '枚举';
    } else {
      return '数组';
    }
  };

  const handleCreateRule = () => {
    return {
      link: 'and',
      operator: '==',
      value: '',
    };
  };

  // 确保本地参数初始化时包含规则数组
  const initLocalParams = (params: any) => {
    // 解构参数以确保响应式
    localParams.value = {
      ...params,
      rules: params.rules
        ? [...params.rules]
        : [
            {
              link: 'and',
              operator: '==',
              value: '',
            },
          ],
    };
  };
  const initLoadModels = async (paramDb: any) => {
    let params = {} as ProductModelParams;
    params.productId = paramDb.productId;

    const result = (await getProductModelList(params)) as unknown as {
      status: string;
      message: string;
      data: ProductModel[];
    };
    if (result.status === 'success') {
      const data = result.data;
      const modelArray: Array<{ label: string; value: string }> = [];
      for (let i = 0; i < data.length; i++) {
        modelArray.push({
          label: data[i].modelIdentity,
          value: data[i].modelIdentity,
        });
      }
      modelOptions.value = modelArray;
    } else {
      modelOptions.value = [];
    }
  };

  const handleProduct = () => {
    showProduct.value = true;
  };
  const checkProduct = (product: any) => {
    showProduct.value = false;
    localParams.value.productId = product.productId;
    localParams.value.productName = product.productName;
    localParams.value.modelIdentity = '';
    localParams.value.modelName = '';
    localParams.value.dataType = '';
    localParams.value.alarmRules = '';
    localParams.value.rules = [
      {
        link: '',
        model: '',
        operator: '==',
        value: '',
      },
    ];
    initLoadModels(product);
  };

  const handleModel = () => {
    if (localParams.value.productId === '') {
      window['$message'].warning('请先选择产品');
      return;
    } else {
      showProductModal.value = true;
    }
  };
  const checkModel = (model: any) => {
    showProductModal.value = false;
    localParams.value.modelIdentity = model.modelIdentity;
    localParams.value.modelName = model.modelName;
    localParams.value.dataType = getDataType(model.dataType);
  };

  const handleAlertsType = async (value: string) => {
    if (value === '3') {
      const result = (await getUserNameArray()) as unknown as {
        status: string;
        message: string;
        data: string[];
      };
      if (result.status === 'success') {
        const data = result.data;
        const userArray: Array<{ label: string; value: string }> = [];
        for (let i = 0; i < data.length; i++) {
          userArray.push({
            label: data[i],
            value: data[i],
          });
        }
        userOptions.value = userArray; // 现在类型匹配了
      } else {
        userOptions.value = [];
      }
    }
  };

  // 提交表单
  const confirmForm = async (e: any) => {
    e.preventDefault();
    formBtnLoading.value = true;

    try {
      await formRef.value.validate();
      let specifyUsers = '';
      if (localParams.value.users.length > 0) {
        specifyUsers = localParams.value.users.join(',');
      }
      const params = {
        rulesId: localParams.value.rulesId,
        rulesName: localParams.value.rulesName,
        productId: localParams.value.productId,
        modelIdentity: localParams.value.modelIdentity,
        alarmLevel: localParams.value.alarmLevel,
        alarmRules: JSON.stringify(localParams.value.rules),
        alertsType: localParams.value.alertsType,
        specifyUsers,
      };

      let result: { status: any; message: any };
      if (props.action === 'add') {
        result = (await addModelAlarmRules(params)) as unknown as {
          status: string;
          message: string;
        };
      } else {
        result = (await editModelAlarmRules(params)) as unknown as {
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
    } catch (errors) {
      window['$message'].error('请填写完整信息');
    } finally {
      formBtnLoading.value = false;
    }
  };
</script>
