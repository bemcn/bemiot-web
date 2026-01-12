import { BasicColumn } from '@/components/Table';
import { FirmwareUpdateTask } from '@/types/DeviceModel';
import { h } from 'vue';
import { format } from 'date-fns';

export const taskColumns: BasicColumn<FirmwareUpdateTask>[] = [
  {
    title: 'ID',
    key: 'taskId',
    width: 70,
  },
  {
    title: '任务名称',
    key: 'taskName',
    width: 200,
  },
  {
    title: '升级范围',
    key: 'taskType',
    width: 110,
    render(record) {
      let typeStr = '全部设备';
      if (record.taskType === 2) {
        typeStr = '指定设备';
      }
      return h('span', typeStr);
    },
  },
  {
    title: '设备数量',
    key: 'deviceCount',
    width: 110,
  },
  {
    title: '计划时间',
    key: 'planTime',
    width: 180,
    render(record) {
      if (record.planTime) {
        const date = new Date(record.planTime);
        return format(date, 'yyyy-MM-dd HH:mm:ss');
      } else {
        return '';
      }
    },
  },
  {
    title: '任务描述',
    key: 'remark',
  },
];
