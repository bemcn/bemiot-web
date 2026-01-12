import { BasicColumn } from '@/components/Table';
import { format } from 'date-fns';
import { h } from 'vue';
import { NTag, NSwitch } from 'naive-ui';
import { ModelAlarmRules } from '@/types/DeviceModel';

export const columns: BasicColumn<ModelAlarmRules>[] = [
  {
    type: 'selection',
    key: 'selection',
  } as unknown as BasicColumn<ModelAlarmRules>,
  {
    title: '规则名称',
    key: 'rulesName',
    width: 150,
  },
  {
    title: '产品名称',
    key: 'product.productName',
    width: 200,
  },
  {
    title: '物模型标识',
    key: 'modelIdentity',
    width: 150,
  },
  {
    title: '物模型',
    key: 'model.modelName',
    width: 150,
  },
  {
    title: '物模型类别',
    key: 'modelClass',
    width: 100,
    render(record) {
      let typeStr = '属性';
      if (record.model.modelClass === 2) {
        typeStr = '功能';
      } else if (record.model.modelClass === 3) {
        typeStr = '事件';
      }
      return h(
        NTag,
        {
          type:
            record.model.modelClass === 1
              ? 'info'
              : record.model.modelClass === 2
              ? 'success'
              : 'warning',
        },
        {
          default: () => typeStr,
        }
      );
    },
  },
  {
    title: '告警规则',
    key: 'alarmRules',
    render(record) {
      let rules = '';
      if (record.alarmRules && record.alarmRules.length > 0) {
        try {
          const parsedRules = JSON.parse(record.alarmRules);
          if (Array.isArray(parsedRules)) {
            parsedRules.forEach(
              (
                item: { link: string; model: string; operator: string; value: string },
                index: number
              ) => {
                if (index > 0) {
                  if (item.link === 'and') {
                    rules += ' <span style="color: #781481ff">与</span> ';
                  } else {
                    rules += ' <span style="color: #781481ff">或</span> ';
                  }
                }
                rules +=
                  '<span style="color: #2d8cf0">' +
                  item.model +
                  '</span> <span style="color: #a15f14ff">' +
                  item.operator +
                  '</span> ' +
                  item.value;
              }
            );
          }
        } catch (error) {}
      }
      return h('span', { innerHTML: rules });
    },
  },
  {
    title: '告警等级',
    key: 'alarmLevel',
    width: 100,
    render(record) {
      let levelStr = '无';
      if (record.alarmLevel === 1) {
        levelStr = '一般告警';
      } else if (record.alarmLevel === 2) {
        levelStr = '重要告警';
      } else if (record.alarmLevel === 3) {
        levelStr = '紧急告警';
      }
      return h(
        NTag,
        {
          type:
            record.alarmLevel === 1
              ? 'info'
              : record.alarmLevel === 2
              ? 'warning'
              : record.alarmLevel === 3
              ? 'error'
              : 'success',
        },
        {
          default: () => levelStr,
        }
      );
    },
  },
  {
    title: '通知方式',
    key: 'alertsType',
    width: 100,
    render(record) {
      let alertTypeStr = '所有用户';
      if (record.alertsType === 1) {
        alertTypeStr = '设备所有者';
      } else if (record.alertsType === 2) {
        alertTypeStr = '指定用户';
      }
      return h('span', alertTypeStr);
    },
  },
];
