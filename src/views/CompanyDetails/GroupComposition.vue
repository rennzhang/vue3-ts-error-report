<template>
  <div class="p-20">
    <n-table :columns="columns" :data-source="tableData" :loading="loading">
      <template #headerCell="{ column }">
        <template v-if="column.dataIndex === 'operation'">
          <span>
            {{ column.title }}
            <n-space>
              <n-tooltip v-if="!tableData?.length">
                <template #title>添加</template>
                <plus-square-outlined @click="AddCompanyDrawerRef?.openDrawer()" />
              </n-tooltip>
              <n-tooltip>
                <template #title>刷新</template>
                <sync-outlined @click="getList" />
              </n-tooltip>
            </n-space>
          </span>
        </template>
      </template>
      <template #bodyCell="{ column, text, record }">
        <template v-if="column.dataIndex === 'companyName'">
          <span class="inline-flex items-center">
            <folder-outlined />
            <n-divider type="vertical" />
            {{ text }}
          </span>
        </template>
        <template v-if="column.dataIndex === 'operation'">
          <n-space>
            <n-tooltip>
              <template #title>详情</template>
              <eye-outlined @click="showDetails(record)" />
            </n-tooltip>
            <n-tooltip>
              <template #title>添加</template>
              <plus-square-outlined @click="AddCompanyDrawerRef?.openDrawer(record)" />
            </n-tooltip>
            <n-tooltip>
              <template #title>删除</template>
              <delete-outlined @click="showDeleteConfirm(record)" />
            </n-tooltip>
          </n-space>
        </template>
      </template>
    </n-table>
  </div>
  <AddCompanyDrawer ref="AddCompanyDrawerRef" @refresh="getList" />
  <CompanyDetailsDrawer ref="CompanyDetailsDrawerRef" />
</template>
<script lang="ts" setup>
import { deleteCompanyForGroup, type GroupCompanyRecord } from '@/api/GroupStructure';
import AddCompanyDrawer from './Components/AddCompanyDrawer.vue';
import { Modal, message } from 'n-designv3';

const AddCompanyDrawerRef = ref<typeof AddCompanyDrawer>();

import { useTable } from './hooks';
import { requestCommonSetUpGetInfoDialog } from '@/api/common';
const { loading, columns, tableData, getList } = useTable();

const showDeleteConfirm = (record: GroupCompanyRecord) => {
  Modal.confirm({
    title: '提示',
    content: '确定 删除 选中数据吗?',
    okText: '确定',
    cancelText: '取消',
    async onOk() {
      await deleteCompanyForGroup({
        className: 'CompanyItemRelation',
        thisObj: {
          objId: record.objId,
        },
      })
        .then((res) => {
          if (res.mfail === '0') {
            message.success('删除成功');
          }
        })
        .finally(() => {
          getList();
        });
    },
  });
};

const showDetails = (record: GroupCompanyRecord) => {
  requestCommonSetUpGetInfoDialog({
    className: 'CompanyItem',
    thisObj: {
      objId: record.companyObjId,
      className: 'CompanyItem',
    },
  }).then((res) => {
    window?.gvUtil.h(res.data.scheme);
  });
};

nextTick(() => {
  // AddCompanyDrawerRef.value?.openDrawer({});
});
</script>
