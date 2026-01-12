<template>
  <div class="data-query-container">
    <div class="n-layout-page-header">
      <n-card :bordered="false" title="数据查询"> 执行SQL语句查询或操作数据库内的各个表 </n-card>
    </div>

    <n-card :bordered="false" class="mt-4 proCard">
      <div class="query-container">
        <!-- 左侧表列表 -->
        <n-card title="数据库表" size="small" class="table-list-card">
          <n-space vertical>
            <n-input v-model:value="tableFilter" placeholder="搜索表名">
              <template #prefix>
                <n-icon :component="SearchOutlined" />
              </template>
            </n-input>
            <n-scrollbar style="max-height: 500px">
              <n-list hoverable clickable>
                <n-list-item
                  v-for="table in filteredTables"
                  :key="table.name"
                  @click="selectTable(table.name)"
                  :class="{ 'selected-table': selectedTable === table.name }"
                >
                  <n-thing :title="table.name">
                    <template #description>
                      <n-tag :type="getTableTagType(table.type)">
                        {{ table.type }}
                      </n-tag>
                      <span class="table-label">{{ table.label }}</span>
                    </template>
                  </n-thing>
                </n-list-item>
              </n-list>
            </n-scrollbar>
          </n-space>
        </n-card>

        <!-- 右侧SQL编辑器和结果 -->
        <div class="sql-editor-container">
          <n-card title="SQL编辑器" size="small" class="mb-4">
            <n-input
              v-model:value="sqlQuery"
              type="textarea"
              placeholder="请输入SQL语句，例如: SELECT * FROM users LIMIT 10;"
              :autosize="{ minRows: 6, maxRows: 12 }"
              class="sql-input"
            />
            <div class="editor-toolbar mt-2">
              <n-space>
                <n-button type="primary" @click="executeQuery" :loading="executing">
                  <template #icon>
                    <n-icon><PlayCircleOutlined /></n-icon>
                  </template>
                  执行查询
                </n-button>
                <n-button @click="clearQuery">
                  <template #icon>
                    <n-icon><DeleteOutlined /></n-icon>
                  </template>
                  清空
                </n-button>
                <n-button @click="formatSQL">
                  <template #icon>
                    <n-icon><FormatPainterOutlined /></n-icon>
                  </template>
                  格式化
                </n-button>
              </n-space>
            </div>
          </n-card>

          <n-card title="执行结果" size="small">
            <n-tabs type="line" v-model:value="activeTab">
              <n-tab-pane name="result" tab="查询结果">
                <div v-if="resultMessage" class="result-message">
                  <n-alert :type="resultType" :show-icon="false">
                    {{ resultMessage }}
                  </n-alert>
                </div>

                <div v-if="queryResult && queryResult.length > 0">
                  <n-data-table
                    :columns="resultColumns"
                    :data="queryResult"
                    :pagination="pagination"
                    :bordered="true"
                    striped
                    remote
                    @update:page="handlePageChange"
                  />
                </div>

                <n-empty
                  v-else-if="!executing && queryResult !== null"
                  description="查询结果为空"
                  class="py-8"
                />
                <n-spin v-if="executing" size="large" class="py-8 flex justify-center" />
              </n-tab-pane>

              <n-tab-pane name="history" tab="历史记录">
                <n-data-table
                  :columns="historyColumns"
                  :data="queryHistory"
                  :pagination="false"
                  :bordered="true"
                  striped
                  :max-height="400"
                />
              </n-tab-pane>
            </n-tabs>
          </n-card>
        </div>
      </div>
    </n-card>
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed, onMounted } from 'vue';
  import { useMessage } from 'naive-ui';
  import type { DataTableColumns } from 'naive-ui';
  // @ts-ignore
  import {
    PlayCircleOutlined,
    DeleteOutlined,
    FormatPainterOutlined,
    SearchOutlined,
  } from '@vicons/antd';

  // 定义表结构
  interface TableInfo {
    name: string;
    type: string;
    label: string;
  }

  // 定义查询历史记录的类型
  interface QueryHistory {
    id: number;
    sql: string;
    time: string;
    result: string;
  }

  // 定义组件状态
  const sqlQuery = ref('');
  const executing = ref(false);
  const resultMessage = ref('');
  const resultType = ref<'success' | 'error' | 'warning' | 'info'>('info');
  const queryResult = ref<Record<string, any>[]>([]);
  const resultColumns = ref<DataTableColumns>([]);
  const activeTab = ref('result');
  const tableFilter = ref('');
  const selectedTable = ref('');

  // 数据库表数据（从public.sql文件中提取）
  const tables = ref<TableInfo[]>([
    { name: 'app_auth', type: '基础表', label: '运用授权' },
    { name: 'blacklist', type: '基础表', label: '黑名单' },
    { name: 'certificate', type: '基础表', label: '证书' },
    { name: 'data_bridge', type: '业务表', label: '数据桥接' },
    { name: 'device', type: '基础表', label: '设备信息' },
    { name: 'device_channel', type: '业务表', label: '设备通道' },
    { name: 'device_controls', type: '业务表', label: '设备群控' },
    { name: 'device_group', type: '基础表', label: '设备分组' },
    { name: 'device_model', type: '业务表', label: '设备物模型' },
    { name: 'device_params', type: '业务表', label: '设备驱动参数' },
    { name: 'device_user', type: '业务表', label: '设备用户' },
    { name: 'drive_params', type: '业务表', label: '驱动参数' },
    { name: 'drives', type: '基础表', label: '设备驱动' },
    { name: 'firmware', type: '基础表', label: '产品固件' },
    { name: 'firmware_update_log', type: '日志表', label: '固件升级日志' },
    { name: 'firmware_update_task', type: '业务表', label: '固件升级任务' },
    { name: 'firmware_version', type: '业务表', label: '产品固件-版本' },
    { name: 'gb_area_code', type: '字典表', label: 'GB28181区域编码' },
    { name: 'general_model', type: '业务表', label: '通用物模型' },
    { name: 'general_model_group', type: '基础表', label: '通用物模型分组' },
    { name: 'monitor_system', type: '监控表', label: '系统监控' },
    { name: 'msg_statistics', type: '统计表', label: '消息时统计' },
    { name: 'platform', type: '基础表', label: '第3方平台接入' },
    { name: 'product', type: '基础表', label: '产品信息' },
    { name: 'product_auth_code', type: '业务表', label: '产品授权码' },
    { name: 'product_class', type: '基础表', label: '产品分类' },
    { name: 'product_model', type: '业务表', label: '产品物模型' },
    { name: 'protocols', type: '基础表', label: '通讯协议' },
    { name: 'role', type: '基础表', label: '角色权限' },
    { name: 'scene_group', type: '基础表', label: '联动分组' },
    { name: 'scene_linkage', type: '业务表', label: '场景联动' },
    { name: 'schedule', type: '业务表', label: '定时任务' },
    { name: 'spatial_position', type: '基础表', label: '空间位置' },
    { name: 'system_config', type: '配置表', label: '系统参数' },
    { name: 'system_dict', type: '字典表', label: '系统字典' },
    { name: 'system_dict_type', type: '字典表', label: '系统字典类型' },
    { name: 'system_log', type: '日志表', label: '系统日志' },
    { name: 'system_menu', type: '基础表', label: '系统菜单' },
    { name: 'system_notice', type: '业务表', label: '系统公告' },
    { name: 'user_info', type: '基础表', label: '用户信息' },
    { name: 'video_server', type: '业务表', label: '视频服务' },
  ]);

  // 过滤后的表列表
  const filteredTables = computed(() => {
    if (!tableFilter.value) {
      return tables.value;
    }
    const filter = tableFilter.value.toLowerCase();
    return tables.value.filter((table) => table.name.toLowerCase().includes(filter));
  });

  // 分页配置
  const pagination = computed(() => {
    return {
      page: 1,
      pageSize: 20,
      showSizePicker: true,
      pageSizes: [10, 20, 50, 100],
      onChange: (page: number) => {
        console.log('Page changed to:', page);
      },
      onUpdatePageSize: (pageSize: number) => {
        console.log('Page size changed to:', pageSize);
      },
    };
  });

  // 查询历史
  const queryHistory = ref<QueryHistory[]>([
    {
      id: 1,
      sql: 'SELECT * FROM user_info LIMIT 10',
      time: '2025-10-31 10:30:25',
      result: '查询成功，返回10条记录',
    },
    {
      id: 2,
      sql: 'UPDATE product SET status = 1 WHERE product_id = 5',
      time: '2025-10-31 09:15:42',
      result: '更新成功，影响1行',
    },
  ]);

  // 历史记录表格列
  const historyColumns: DataTableColumns = [
    {
      title: 'ID',
      key: 'id',
      width: 80,
    },
    {
      title: 'SQL语句',
      key: 'sql',
    },
    {
      title: '执行时间',
      key: 'time',
      width: 180,
    },
    {
      title: '结果',
      key: 'result',
      width: 200,
    },
  ];

  // 消息提示
  const message = useMessage();

  // 获取表标签类型
  const getTableTagType = (type: string) => {
    switch (type) {
      case '基础表':
        return 'success';
      case '业务表':
        return 'info';
      case '字典表':
        return 'warning';
      case '日志表':
        return 'error';
      case '监控表':
      case '统计表':
      case '配置表':
        return 'primary';
      default:
        return 'default';
    }
  };

  // 选择表
  const selectTable = (tableName: string) => {
    selectedTable.value = tableName;
    sqlQuery.value = `SELECT * FROM ${tableName} LIMIT 10;`;
  };

  // 执行查询
  const executeQuery = () => {
    if (!sqlQuery.value.trim()) {
      message.warning('请输入SQL语句');
      return;
    }

    executing.value = true;
    resultMessage.value = '';

    // 模拟API调用
    setTimeout(() => {
      try {
        // 这里应该调用实际的API执行SQL查询
        // 根据SQL类型生成不同的模拟结果
        if (sqlQuery.value.toLowerCase().startsWith('select')) {
          // 模拟查询结果
          queryResult.value = generateMockData();
          resultColumns.value = generateColumnsFromData(queryResult.value[0] || {});
          resultMessage.value = `查询成功，返回 ${queryResult.value.length} 条记录`;
          resultType.value = 'success';
        } else {
          // 模拟操作结果（INSERT, UPDATE, DELETE等）
          const affectedRows = Math.floor(Math.random() * 100) + 1;
          resultMessage.value = `执行成功，影响 ${affectedRows} 行`;
          resultType.value = 'success';
          queryResult.value = [];
          resultColumns.value = [];
        }
        // 添加到历史记录
        addToHistory(sqlQuery.value, resultMessage.value);
      } catch (error) {
        resultMessage.value = '执行SQL时发生错误: ' + (error as Error).message;
        resultType.value = 'error';
        queryResult.value = [];
        resultColumns.value = [];
      } finally {
        executing.value = false;
      }
    }, 1000);
  };

  // 生成模拟数据
  const generateMockData = () => {
    const data: Record<string, any>[] = []; // 显式声明类型
    const rowCount = Math.floor(Math.random() * 50) + 10;

    for (let i = 0; i < rowCount; i++) {
      data.push({
        id: i + 1,
        name: `记录${i + 1}`,
        email: `record${i + 1}@example.com`,
        created_at: `2025-10-${String(Math.floor(Math.random() * 30) + 1).padStart(
          2,
          '0'
        )} 10:30:25`,
        status: Math.random() > 0.5 ? 'active' : 'inactive',
      });
    }

    return data;
  };

  // 根据数据生成表格列
  const generateColumnsFromData = (data: Record<string, any>) => {
    return Object.keys(data).map((key) => {
      return {
        title: key.charAt(0).toUpperCase() + key.slice(1),
        key: key,
      };
    });
  };

  // 添加到历史记录
  const addToHistory = (sql: string, result: string) => {
    const now = new Date();
    const timeString = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      '0'
    )}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(
      2,
      '0'
    )}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    queryHistory.value.unshift({
      id: queryHistory.value.length + 1,
      sql: sql,
      time: timeString,
      result: result,
    });

    // 保持历史记录在合理范围内
    if (queryHistory.value.length > 100) {
      queryHistory.value.pop();
    }
  };

  // 清空查询
  const clearQuery = () => {
    sqlQuery.value = '';
    message.info('已清空SQL编辑器');
  };

  // 格式化SQL
  const formatSQL = () => {
    if (!sqlQuery.value.trim()) {
      message.warning('没有可格式化的SQL语句');
      return;
    }

    // 简单的SQL格式化（实际项目中可以使用更专业的库）
    let formatted = sqlQuery.value
      .replace(
        /(\b(SELECT|FROM|WHERE|ORDER BY|GROUP BY|HAVING|INSERT INTO|UPDATE|SET|DELETE FROM|JOIN|ON|LEFT JOIN|RIGHT JOIN|INNER JOIN|VALUES)\b)/gi,
        '\n$1'
      )
      .replace(/;/g, ';\n')
      .replace(/\n+/g, '\n')
      .trim();

    // 添加缩进
    const lines = formatted.split('\n');
    let indent = 0;
    const indentedLines = lines.map((line) => {
      const trimmedLine = line.trim();
      if (
        /^(SELECT|FROM|WHERE|ORDER BY|GROUP BY|HAVING|INSERT INTO|UPDATE|DELETE FROM|VALUES)/i.test(
          trimmedLine
        )
      ) {
        return '  '.repeat(Math.max(0, indent)) + trimmedLine;
      } else {
        indent++;
        return '  '.repeat(Math.max(0, indent)) + trimmedLine;
      }
    });

    sqlQuery.value = indentedLines.join('\n');
    message.success('SQL已格式化');
  };

  // 处理分页变化
  const handlePageChange = (page: number) => {
    console.log('切换到第', page, '页');
    // 实际项目中这里会重新请求数据
  };

  // 组件挂载时的初始化
  onMounted(() => {
    // 可以在这里添加初始化逻辑
    console.log('数据查询页面已加载');
  });
</script>

<style scoped>
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
