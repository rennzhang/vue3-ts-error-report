<template>
  <div class="p-20px">
    <n-table :columns="columns" :data-source="tableData" :loading="loading" row-key="companyCode">
      <template #headerCell="{ column }">
        <template v-if="column.dataIndex === 'operation'">
          <span>
            <n-space>
              {{ column.title }}
              <n-tooltip v-if="!tableData?.length">
                <template #title>添加</template>
                <plus-square-outlined
                  class="align-middle"
                  style="vertical-align: middle"
                  @click="AddCompanyModalRef?.openDrawer()"
                />
              </n-tooltip>
              <n-tooltip>
                <template #title>刷新</template>
                <sync-outlined class="align-middle" style="vertical-align: middle" @click="getList()" />
              </n-tooltip>
            </n-space>
          </span>
        </template>
      </template>
      <template #bodyCell="{ column, text, record }">
        <template v-if="column.dataIndex === 'name'">
          <span>
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
              <plus-square-outlined @click="AddCompanyModalRef?.openDrawer(record)" />
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
  <AddCompanyModal ref="AddCompanyModalRef" @refresh="getList" />
</template>
<script lang="ts" setup>
import { deleteCompanyForGroup, type GroupCompanyRecord } from '@/api/CompanyItem';
import AddCompanyModal from './Components/AddCompanyModal.vue';
import { Modal, message } from 'n-designv3';

const AddCompanyModalRef = ref<typeof AddCompanyModal>();

import { useTable } from './hooks';
import { requestCommonSetUpGetInfoDialog } from '@/api/common';
import { createVNode } from 'vue';
const { loading, columns, tableData, getList } = useTable();

const showDeleteConfirm = (record: GroupCompanyRecord) => {
  Modal.confirm({
    title: '确定删除选中数据吗?',
    content: createVNode(
      'span',
      { style: { color: 'red' } },
      `该操作会同时删除【${record.name || '选中公司'}】以及所有子公司，是否确认删除？`
    ),
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
  // AddCompanyModalRef.value?.openDrawer({});
});
</script>
<style>
.nl-table-cell {
  line-height: 40px;
}
</style>
