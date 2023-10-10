<template>
  <div class="p-20">
    <n-table :columns="columns" :data-source="tableData">
      <template #headerCell="{ column }">
        <template v-if="column.dataIndex === 'operation'">
          <span>
            {{ column.title }}
            <n-space>
              <n-tooltip>
                <template #title>添加</template>
                <plus-square-outlined @click="AddCompanyDrawerRef?.openDrawer()" />
              </n-tooltip>
              <gv-tips title="sdkfldslf;dsk" icon-color="#333" />
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
              <eye-outlined @click="CompanyDetailsDrawerRef?.openDrawer(record)" />
            </n-tooltip>
            <n-tooltip>
              <template #title>添加</template>
              <plus-square-outlined @click="AddCompanyDrawerRef?.openDrawer(record)" />
            </n-tooltip>
            <n-tooltip>
              <template #title>删除</template>
              <delete-outlined @click="showDeleteConfirm" />
            </n-tooltip>
          </n-space>
        </template>
      </template>
    </n-table>
  </div>
  <AddCompanyDrawer ref="AddCompanyDrawerRef" />
  <CompanyDetailsDrawer ref="CompanyDetailsDrawerRef" />
</template>
<script lang="ts" setup>
// import { usePage1Store } from './store';
import AddCompanyDrawer from './Components/AddCompanyDrawer.vue';
import CompanyDetailsDrawer from './Components/CompanyDetailsDrawer.vue';
import { isObject } from '@/utils/is';
// const page1Store = usePage1Store();

const AddCompanyDrawerRef = ref<typeof AddCompanyDrawer>();
const CompanyDetailsDrawerRef = ref<typeof CompanyDetailsDrawer>();

import { useTable, useOperation } from './hooks';
const { columns, tableData, getList } = useTable();
const { showDeleteConfirm } = useOperation();
</script>
