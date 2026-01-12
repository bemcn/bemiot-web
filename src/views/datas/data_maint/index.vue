<template>
  <div>
    <div class="n-layout-page-header">
      <n-card :bordered="false" title="数据库备份还原">
        对系统数据库进行备份和还原操作
      </n-card>
    </div>
    
    <n-card
      :bordered="false"
      title="备份操作"
      class="mt-4 proCard"
      size="small"
      :segmented="{ content: true }"
    >
      <n-space vertical>
        <n-alert type="info" :show-icon="false">
          <p>点击下方按钮可以对系统当前数据库进行备份操作，备份文件将保存在服务器指定目录中。</p>
        </n-alert>
        <n-button type="primary" @click="handleBackup">
          <template #icon>
            <n-icon>
              <DiffFilled />
            </n-icon>
          </template>
          一键备份数据库
        </n-button>
      </n-space>
    </n-card>

    <n-card
      :bordered="false"
      title="备份记录"
      class="mt-4 proCard"
      size="small"
      :segmented="{ content: true }"
    >
      <n-data-table
        remote
        ref="actionRef"
        :columns="columns"
        :data="backupList"
        :loading="loading"
        :pagination="pagination"
        @update:page="handlePageChange"
      />
    </n-card>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, h } from 'vue';
  import { useDialog, useMessage, NTag, NButton } from 'naive-ui';
  import { DiffFilled, RedoOutlined } from '@vicons/antd';

  // 模拟备份记录数据
  const backupList = ref([
    {
      id: 1,
      fileName: 'backup_20251031_1420.sql',
      fileSize: '15.2 MB',
      createTime: '2025-10-31 14:20:35',
      status: 'success'
    },
    {
      id: 2,
      fileName: 'backup_20251030_0912.sql',
      fileSize: '14.8 MB',
      createTime: '2025-10-30 09:12:17',
      status: 'success'
    },
    {
      id: 3,
      fileName: 'backup_20251029_1645.sql',
      fileSize: '14.5 MB',
      createTime: '2025-10-29 16:45:22',
      status: 'success'
    }
  ]);

  const loading = ref(false);
  const actionRef = ref();
  const dialog = useDialog();
  const message = useMessage();

  const pagination = ref({
    page: 1,
    pageSize: 10,
    showSizePicker: true,
    pageSizes: [10, 20, 50],
    itemCount: 3,
    onChange: (page: number) => {
      pagination.value.page = page;
    }
  });

  // 处理备份操作
  const handleBackup = () => {
    dialog.info({
      title: '确认备份',
      content: '确定要对当前数据库进行备份操作吗？',
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: () => {
        message.success('开始备份数据库...');
        // 这里应该调用实际的备份API
        // mock备份过程
        setTimeout(() => {
          const now = new Date();
          const timeStr = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}_${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}`;
          backupList.value.unshift({
            id: backupList.value.length + 1,
            fileName: `backup_${timeStr}.sql`,
            fileSize: '15.5 MB',
            createTime: now.toLocaleString(),
            status: 'success'
          });
          pagination.value.itemCount = backupList.value.length;
          message.success('数据库备份完成');
        }, 1500);
      }
    });
  };

  // 处理还原操作
  const handleRestore = (record: any) => {
    dialog.warning({
      title: '确认还原',
      content: `确定要从备份文件 "${record.fileName}" 还原数据库吗？这将覆盖当前数据库中的所有数据。`,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: () => {
        message.loading(`正在从 ${record.fileName} 还原数据库...`);
        // 这里应该调用实际的还原API
        // mock还原过程
        setTimeout(() => {
          message.success('数据库还原完成');
        }, 2000);
      }
    });
  };

  // 处理分页变化
  const handlePageChange = (page: number) => {
    pagination.value.page = page;
    // 实际项目中这里应该重新加载数据
  };

  // 表格列定义
  const columns = [
    {
      title: 'ID',
      key: 'id',
      width: 80
    },
    {
      title: '备份文件名',
      key: 'fileName',
      width: 250
    },
    {
      title: '文件大小',
      key: 'fileSize',
      width: 120
    },
    {
      title: '备份时间',
      key: 'createTime',
      width: 200
    },
    {
      title: '状态',
      key: 'status',
      width: 120,
      render(row) {
        return h(NTag, {
          type: row.status === 'success' ? 'success' : 'error'
        }, {
          default: () => row.status === 'success' ? '备份成功' : '备份失败'
        });
      }
    },
    {
      title: '操作',
      key: 'actions',
      width: 150,
      fixed: 'right',
      render(row) {
        return h(NButton, {
          strong: true,
          tertiary: true,
          size: 'small',
          type: 'info',
          onClick: () => handleRestore(row)
        }, {
          icon: () => h(RedoOutlined),
          default: () => '还原'
        });
      }
    }
  ];

  onMounted(() => {
    // 页面加载时可以获取实际的备份记录列表
  });
</script>

<style lang="less" scoped>
  .proCard {
    border-radius: 4px;
  }
</style>
