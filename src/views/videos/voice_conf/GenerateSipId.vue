<template>
  <!-- 生成设备编号和通道 -->
  <n-modal
    v-model:show="showState"
    :show-icon="false"
    preset="dialog"
    style="width: 640px"
    title="生成SIP ID"
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
      <n-form-item label="行政区划" path="district">
        <n-cascader
          v-model:value="localParams.district"
          placeholder="请选择行政区划"
          expand-trigger="hover"
          check-strategy="all"
          :options="areaOptions"
          clearable
        />
      </n-form-item>
      <n-form-item label="单位编号" path="flats">
        <n-input
          maxlength="2"
          placeholder="请输入单位编号(最长2位数字)"
          v-model:value="localParams.flats"
          :allow-input="onlyAllowNumber"
          clearable
        />
      </n-form-item>
      <n-form-item label="行业类型" path="industry">
        <n-select
          v-model:value="localParams.industry"
          :options="industryOptions"
          placeholder="请选择行业类型"
        />
      </n-form-item>
      <n-form-item label="服务编号" path="code">
        <n-input
          maxlength="4"
          placeholder="请输入服务编号(最长4位数字)"
          v-model:value="localParams.code"
          :allow-input="onlyAllowNumber"
          clearable
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
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { FormRules } from 'naive-ui';
  import { verifyServerKey } from '@/api/video/videoServer';
  import { getGbAreaTree } from '@/api/devices/device';

  const props = defineProps({
    showModel: {
      type: Boolean,
      default: () => true,
    },
  });

  // 回调
  const emit = defineEmits(['close', 'submit']);

  const showState = ref(false);
  const localParams: any = ref({
    district: null,
    flats: '00',
    industry: null,
    code: '1',
  });
  const areaOptions = ref<any[]>([]);
  const formBtnLoading = ref(false);
  const formRef: any = ref(null);

  const industryOptions = [
    {
      label: '社会治安路面接入',
      value: '00',
    },
    {
      label: '社会治安社区接入',
      value: '01',
    },
    {
      label: '社会治安内部接入',
      value: '02',
    },
    {
      label: '社会治安其他接入',
      value: '03',
    },
    {
      label: '交通路面接入',
      value: '04',
    },
    {
      label: '交通卡口接人',
      value: '05',
    },
    {
      label: '交通内部接入',
      value: '06',
    },
    {
      label: '交通其他接入',
      value: '07',
    },
    {
      label: '城市管理接人',
      value: '08',
    },
    {
      label: '卫生环保接入',
      value: '09',
    },
    {
      label: '商检海关接入',
      value: '10',
    },
    {
      label: '教育部门接入',
      value: '11',
    },
    {
      label: '农林牧渔业接入',
      value: '40',
    },
    {
      label: '采矿企业接入',
      value: '41',
    },
    {
      label: '制造企业接入',
      value: '42',
    },
    {
      label: '冶金企业接入',
      value: '43',
    },
    {
      label: '电力企业接入',
      value: '44',
    },
    {
      label: '燃气企业接入',
      value: '45',
    },
    {
      label: '建筑企业接入',
      value: '46',
    },
    {
      label: '物流企业接入',
      value: '47',
    },
    {
      label: '邮政企业接入',
      value: '48',
    },
    {
      label: '信息企业接入',
      value: '49',
    },
    {
      label: '住宿和餐饮业接入',
      value: '50',
    },
    {
      label: '金融企业接人',
      value: '51',
    },
    {
      label: '房地产业接入',
      value: '52',
    },
    {
      label: '商务服务业接人',
      value: '53',
    },
    {
      label: '水利企业接入',
      value: '54',
    },
    {
      label: '娱乐企业接入',
      value: '55',
    },
    {
      label: '家庭自用1',
      value: '80',
    },
    {
      label: '家庭自用2',
      value: '81',
    },
    {
      label: '家庭自用3',
      value: '82',
    },
    {
      label: '家庭自用4',
      value: '83',
    },
    {
      label: '家庭自用5',
      value: '84',
    },
    {
      label: '家庭自用6',
      value: '85',
    },
    {
      label: '家庭自用7',
      value: '86',
    },
    {
      label: '家庭自用8',
      value: '87',
    },
    {
      label: '家庭自用9',
      value: '808',
    },
    {
      label: '家庭自用10',
      value: '89',
    },
    {
      label: '其他主体1',
      value: '90',
    },
    {
      label: '其他主体2',
      value: '91',
    },
    {
      label: '其他主体3',
      value: '92',
    },
    {
      label: '其他主体4',
      value: '93',
    },
    {
      label: '其他主体5',
      value: '94',
    },
    {
      label: '其他主体6',
      value: '95',
    },
    {
      label: '其他主体7',
      value: '96',
    },
    {
      label: '其他主体8',
      value: '97',
    },
    {
      label: '其他主体9',
      value: '98',
    },
    {
      label: '其他主体10',
      value: '99',
    },
  ];

  // 表单验证
  const onlyAllowNumber = (value: string) => !value || /^\d+$/.test(value);
  const rules: FormRules = {
    district: {
      required: true,
      trigger: ['blur', 'change'],
      message: '请选择行政区划',
    },
    flats: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入单位编号',
    },
    industry: {
      required: true,
      trigger: ['blur', 'change'],
      message: '请选择行业类型',
    },
    code: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入服务编号',
    },
  };

  const closeModalAfter = () => {
    emit('close');
  };

  watch([() => props.showModel], async ([newShowModel]) => {
    showState.value = newShowModel;
    if (newShowModel && newShowModel === true) {
      areaOptions.value = await createAreaData();
    }
  });

  /**
   * 获取国家区域编码
   */
  const createAreaData = async () => {
    const result = (await getGbAreaTree()) as unknown as {
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

  // 提交表单
  const confirmForm = (e: any) => {
    e.preventDefault();
    formBtnLoading.value = true;
    formRef.value.validate(async (errors: any) => {
      if (!errors) {
        console.log('提交表单', localParams.value);
        const district = localParams.value.district;
        let flats = localParams.value.flats;
        if (flats.length < 2) {
          flats = '0' + flats;
        }
        const industry = localParams.value.industry;
        let code = localParams.value.code;
        const len = 4 - code.length;
        for (let i = 0; i < len; i++) {
          code = '0' + code;
        }
        const idKey = district + flats + industry + '200000' + code;
        const keyStr = district + flats + industry;

        //获取可用主通道号
        const params = {
          key: keyStr,
        };
        const result = (await verifyServerKey(params)) as unknown as {
          status: string;
          message: string;
          data: number;
        };
        if (result.status === 'success') {
          emit('submit', idKey);
          closeModalAfter();
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
