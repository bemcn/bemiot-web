import { h } from 'vue';
import { BasicColumn } from '@/components/Table';
import { RoleAuth } from '@/types/SystemModel';
import { useUserStore } from '@/store/modules/user';
import { NInput } from 'naive-ui';

export const columns: BasicColumn<RoleAuth>[] = [
  {
    type: 'selection',
    key: 'selection',
  } as unknown as BasicColumn<RoleAuth>,
  {
    title: 'ID',
    key: 'roleId',
    width: 100,
  },
  {
    title: '角色名称',
    key: 'roleName',
  },
  {
    title: '备注',
    key: 'remark',
  },
  {
    title: '排序值',
    key: '',
    width: 180,
    render(record, index) {
      const userStore = useUserStore();
      const auth = userStore.parseAuthByModule('role_auth');
      const editAuth = auth.edit;
      return h(NInput, {
        defaultValue: record.orderNum?.toString(),
        onUpdateValue(v) {
          // 保留原有逻辑，但只在失去焦点时触发
        },
        onBlur(v) {
          // 调用父组件方法更新排序值
          const inputValue = (v.target as HTMLInputElement).value;
          const event = new CustomEvent('updateOrderNumber', {
            detail: { index, value: parseInt(inputValue) || 0, record },
          });
          window.dispatchEvent(event);
        },
        style: {
          textAlign: 'center',
        },
        disabled: !editAuth,
      });
    },
  },
];

export const roleAuthData = [
  {
    label: '设备管理',
    value: 'device',
    check: false,
    auths: [
      {
        key: 'view',
        label: '查看',
        check: false,
      },
      {
        key: 'add',
        label: '新增',
        check: false,
      },
      {
        key: 'edit',
        label: '编辑',
        check: false,
      },
      {
        key: 'delete',
        label: '删除',
        check: false,
      },
      {
        key: 'import',
        label: '导入',
        check: false,
      },
      {
        key: 'export',
        label: '导出',
        check: false,
      },
    ],
  },
  {
    label: '设备群控',
    value: 'device_controls',
    check: false,
    auths: [
      {
        key: 'view',
        label: '查看',
        check: false,
      },
      {
        key: 'add',
        label: '新增',
        check: false,
      },
      {
        key: 'edit',
        label: '编辑',
        check: false,
      },
      {
        key: 'delete',
        label: '删除',
        check: false,
      },
      {
        key: 'import',
        label: '导入',
        check: false,
      },
      {
        key: 'export',
        label: '导出',
        check: false,
      },
    ],
  },
  {
    label: '设备地图',
    value: 'device_map',
    check: false,
    auths: [],
  },
  {
    label: '设备分组',
    value: 'device_group',
    check: false,
    auths: [
      {
        key: 'add',
        label: '新增',
        check: false,
      },
      {
        key: 'edit',
        label: '编辑',
        check: false,
      },
      {
        key: 'delete',
        label: '删除',
        check: false,
      },
    ],
  },
  {
    label: '产品管理',
    value: 'product',
    check: false,
    auths: [
      {
        key: 'view',
        label: '查看',
        check: false,
      },
      {
        key: 'add',
        label: '新增',
        check: false,
      },
      {
        key: 'edit',
        label: '编辑',
        check: false,
      },
      {
        key: 'delete',
        label: '删除',
        check: false,
      },
      {
        key: 'import',
        label: '导入',
        check: false,
      },
      {
        key: 'export',
        label: '导出',
        check: false,
      },
    ],
  },
  {
    label: '产品分类',
    value: 'product_class',
    check: false,
    auths: [
      {
        key: 'add',
        label: '新增',
        check: false,
      },
      {
        key: 'edit',
        label: '编辑',
        check: false,
      },
      {
        key: 'delete',
        label: '删除',
        check: false,
      },
      {
        key: 'import',
        label: '导入',
        check: false,
      },
      {
        key: 'export',
        label: '导出',
        check: false,
      },
    ],
  },
  {
    label: '产品固件',
    value: 'firmware',
    check: false,
    auths: [
      {
        key: 'view',
        label: '查看',
        check: false,
      },
      {
        key: 'add',
        label: '新增',
        check: false,
      },
      {
        key: 'edit',
        label: '编辑',
        check: false,
      },
      {
        key: 'delete',
        label: '删除',
        check: false,
      },
      {
        key: 'import',
        label: '导入',
        check: false,
      },
      {
        key: 'export',
        label: '导出',
        check: false,
      },
    ],
  },
  {
    label: '数据桥接',
    value: 'data_bridging',
    check: false,
    auths: [
      {
        key: 'view',
        label: '查看',
        check: false,
      },
      {
        key: 'add',
        label: '新增',
        check: false,
      },
      {
        key: 'edit',
        label: '编辑',
        check: false,
      },
      {
        key: 'delete',
        label: '删除',
        check: false,
      },
      {
        key: 'import',
        label: '导入',
        check: false,
      },
      {
        key: 'export',
        label: '导出',
        check: false,
      },
    ],
  },
  {
    label: '场景分组',
    value: 'scene_group',
    check: false,
    auths: [
      {
        key: 'add',
        label: '新增',
        check: false,
      },
      {
        key: 'edit',
        label: '编辑',
        check: false,
      },
      {
        key: 'delete',
        label: '删除',
        check: false,
      },
      {
        key: 'import',
        label: '导入',
        check: false,
      },
      {
        key: 'export',
        label: '导出',
        check: false,
      },
    ],
  },
  {
    label: '场景联动',
    value: 'scene_linkage',
    check: false,
    auths: [
      {
        key: 'view',
        label: '查看',
        check: false,
      },
      {
        key: 'add',
        label: '新增',
        check: false,
      },
      {
        key: 'edit',
        label: '编辑',
        check: false,
      },
      {
        key: 'delete',
        label: '删除',
        check: false,
      },
      {
        key: 'import',
        label: '导入',
        check: false,
      },
      {
        key: 'export',
        label: '导出',
        check: false,
      },
    ],
  },
  {
    label: '分屏显示',
    value: 'split_screen',
    check: false,
    auths: [],
  },
  {
    label: '视频通道',
    value: 'video_record',
    check: false,
    auths: [
      {
        key: 'view',
        label: '查看',
        check: false,
      },
      {
        key: 'add',
        label: '新增',
        check: false,
      },
      {
        key: 'edit',
        label: '编辑',
        check: false,
      },
      {
        key: 'delete',
        label: '删除',
        check: false,
      },
      {
        key: 'import',
        label: '导入',
        check: false,
      },
      {
        key: 'export',
        label: '导出',
        check: false,
      },
    ],
  },
  {
    label: '录像管理',
    value: 'voice_intercom',
    check: false,
    auths: [
      {
        key: 'option',
        label: '操作',
        check: false,
      },
    ],
  },
  {
    label: '视频配置',
    value: 'voice_conf',
    check: false,
    auths: [
      {
        key: 'view',
        label: '查看',
        check: false,
      },
      {
        key: 'add',
        label: '新增',
        check: false,
      },
      {
        key: 'edit',
        label: '编辑',
        check: false,
      },
      {
        key: 'delete',
        label: '删除',
        check: false,
      },
      {
        key: 'import',
        label: '导入',
        check: false,
      },
      {
        key: 'export',
        label: '导出',
        check: false,
      },
    ],
  },
  {
    label: '视频告警',
    value: 'video_alarm',
    check: false,
    auths: [
      {
        key: 'view',
        label: '查看',
        check: false,
      },
      {
        key: 'delete',
        label: '删除',
        check: false,
      },
      {
        key: 'export',
        label: '导出',
        check: false,
      },
    ],
  },
  {
    label: '聚合统计',
    value: 'agg_analysis',
    check: false,
    auths: [
      {
        key: 'view',
        label: '查看',
        check: false,
      },
      {
        key: 'add',
        label: '新增',
        check: false,
      },
      {
        key: 'edit',
        label: '编辑',
        check: false,
      },
      {
        key: 'delete',
        label: '删除',
        check: false,
      },
      {
        key: 'import',
        label: '导入',
        check: false,
      },
      {
        key: 'export',
        label: '导出',
        check: false,
      },
    ],
  },
  {
    label: '数据查询',
    value: 'data_query',
    check: false,
    auths: [
      {
        key: 'option',
        label: '操作',
        check: false,
      },
      {
        key: 'export',
        label: '导出',
        check: false,
      },
    ],
  },
  {
    label: '数据统计',
    value: 'data_analysis',
    check: false,
    auths: [],
  },
  {
    label: '数据维护',
    value: 'data_maint',
    check: false,
    auths: [
      {
        key: 'option',
        label: '操作',
        check: false,
      },
    ],
  },
  {
    label: '资产档案',
    value: 'asset_archives',
    check: false,
    auths: [
      {
        key: 'view',
        label: '查看',
        check: false,
      },
      {
        key: 'edit',
        label: '编辑',
        check: false,
      },
      {
        key: 'export',
        label: '导出',
        check: false,
      },
    ],
  },
  {
    label: '资产属性',
    value: 'asset_attr',
    check: false,
    auths: [
      {
        key: 'add',
        label: '新增',
        check: false,
      },
      {
        key: 'edit',
        label: '编辑',
        check: false,
      },
      {
        key: 'delete',
        label: '删除',
        check: false,
      },
    ],
  },
  {
    label: '资产分配',
    value: 'asset_distribution',
    check: false,
    auths: [
      {
        key: 'view',
        label: '查看',
        check: false,
      },
      {
        key: 'add',
        label: '新增',
        check: false,
      },
      {
        key: 'edit',
        label: '编辑',
        check: false,
      },
      {
        key: 'delete',
        label: '删除',
        check: false,
      },
      {
        key: 'import',
        label: '导入',
        check: false,
      },
      {
        key: 'export',
        label: '导出',
        check: false,
      },
    ],
  },
  {
    label: '资产地图',
    value: 'asset_map',
    check: false,
    auths: [],
  },
  {
    label: '告警统计',
    value: 'alarm_statistics',
    check: false,
    auths: [],
  },
  {
    label: '告警日志',
    value: 'alarm_log',
    check: false,
    auths: [
      {
        key: 'delete',
        label: '删除',
        check: false,
      },
      {
        key: 'export',
        label: '导出',
        check: false,
      },
    ],
  },
  {
    label: '告警设置',
    value: 'alarm_config',
    check: false,
    auths: [
      {
        key: 'edit',
        label: '编辑',
        check: false,
      },
    ],
  },
  {
    label: '平台监控',
    value: 'platform_monitor',
    check: false,
    auths: [],
  },
  {
    label: '任务监控',
    value: 'scheduled_monitor',
    check: false,
    auths: [],
  },
  {
    label: '缓存监控',
    value: 'cache_monitor',
    check: false,
    auths: [],
  },
  {
    label: '消息监控',
    value: 'message_monitor',
    check: false,
    auths: [],
  },
  {
    label: '数据监控',
    value: 'data_monitor',
    check: false,
    auths: [],
  },
  {
    label: '运行监控',
    value: 'run_monitor',
    check: false,
    auths: [],
  },
  {
    label: '空间位置',
    value: 'space',
    check: false,
    auths: [
      {
        key: 'add',
        label: '新增',
        check: false,
      },
      {
        key: 'edit',
        label: '编辑',
        check: false,
      },
      {
        key: 'delete',
        label: '删除',
        check: false,
      },
      {
        key: 'import',
        label: '导入',
        check: false,
      },
      {
        key: 'export',
        label: '导出',
        check: false,
      },
    ],
  },
  {
    label: '通讯协议',
    value: 'protocols',
    check: false,
    auths: [
      {
        key: 'view',
        label: '查看',
        check: false,
      },
      {
        key: 'add',
        label: '新增',
        check: false,
      },
      {
        key: 'edit',
        label: '编辑',
        check: false,
      },
      {
        key: 'delete',
        label: '删除',
        check: false,
      },
    ],
  },
  {
    label: '驱动管理',
    value: 'drive',
    check: false,
    auths: [
      {
        key: 'add',
        label: '新增',
        check: false,
      },
      {
        key: 'edit',
        label: '编辑',
        check: false,
      },
      {
        key: 'delete',
        label: '删除',
        check: false,
      },
    ],
  },
  {
    label: '证书管理',
    value: 'certificate',
    check: false,
    auths: [
      {
        key: 'add',
        label: '新增',
        check: false,
      },
      {
        key: 'edit',
        label: '编辑',
        check: false,
      },
      {
        key: 'delete',
        label: '删除',
        check: false,
      },
      {
        key: 'download',
        label: '下载',
        check: false,
      },
    ],
  },
  {
    label: '外部接口',
    value: 'ext_interface',
    check: false,
    auths: [
      {
        key: 'add',
        label: '新增',
        check: false,
      },
      {
        key: 'edit',
        label: '编辑',
        check: false,
      },
      {
        key: 'delete',
        label: '删除',
        check: false,
      },
    ],
  },
  {
    label: '消息模板',
    value: 'msg_templates',
    check: false,
    auths: [
      {
        key: 'add',
        label: '新增',
        check: false,
      },
      {
        key: 'edit',
        label: '编辑',
        check: false,
      },
      {
        key: 'delete',
        label: '删除',
        check: false,
      },
    ],
  },
  {
    label: '系统设置',
    value: 'sys_param',
    check: false,
    auths: [
      {
        key: 'edit',
        label: '编辑',
        check: false,
      },
    ],
  },
  {
    label: '消息设置',
    value: 'msg_system',
    check: false,
    auths: [
      {
        key: 'edit',
        label: '编辑',
        check: false,
      },
    ],
  },
  {
    label: '角色权限',
    value: 'role_auth',
    check: false,
    auths: [
      {
        key: 'add',
        label: '新增',
        check: false,
      },
      {
        key: 'edit',
        label: '编辑',
        check: false,
      },
      {
        key: 'delete',
        label: '删除',
        check: false,
      },
      {
        key: 'import',
        label: '导入',
        check: false,
      },
      {
        key: 'export',
        label: '导出',
        check: false,
      },
    ],
  },
  {
    label: '用户管理',
    value: 'users',
    check: false,
    auths: [
      {
        key: 'add',
        label: '新增',
        check: false,
      },
      {
        key: 'edit',
        label: '编辑',
        check: false,
      },
      {
        key: 'delete',
        label: '删除',
        check: false,
      },
      {
        key: 'import',
        label: '导入',
        check: false,
      },
      {
        key: 'export',
        label: '导出',
        check: false,
      },
    ],
  },
  {
    label: '黑名单管理',
    value: 'blacklist',
    check: false,
    auths: [
      {
        key: 'add',
        label: '新增',
        check: false,
      },
      {
        key: 'edit',
        label: '编辑',
        check: false,
      },
      {
        key: 'delete',
        label: '删除',
        check: false,
      },
      {
        key: 'import',
        label: '导入',
        check: false,
      },
      {
        key: 'export',
        label: '导出',
        check: false,
      },
    ],
  },
  {
    label: '系统日志',
    value: 'sys_log',
    check: false,
    auths: [
      {
        key: 'delete',
        label: '删除',
        check: false,
      },
      {
        key: 'export',
        label: '导出',
        check: false,
      },
    ],
  },
];
