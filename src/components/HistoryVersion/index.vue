<template>
  <div class="history-version">
    <span><span type="primary" class="btn-compare" @click="handCompare">比较</span></span>
    <n-table
      :columns="columns"
      :data-source="dataSource"
      :row-selection="rowSelectionConfig"
      row-key="objId"
      :pagination="false"
      :scroll="{ x: '100%' }"
    >
      <template #bodyCell="{ column, text }">
        <template v-if="column.dataIndex === 'name'">
          <a>{{ text }}</a>
        </template>
        <template v-if="column.dataIndex === 'operation'">
          <n-space>
            <n-tooltip>
              <template #title>详情</template>
              <eye-outlined class="icon" />
            </n-tooltip>
            <n-tooltip>
              <template #title>删除</template>
              <delete-outlined class="delete icon" />
            </n-tooltip>
          </n-space>
        </template>
      </template>
    </n-table>
    <CompareDrawer ref="CompareDrawerRef" :select-table-data="selectTableData" />
  </div>
</template>

<script setup lang="ts">
interface SelectTableData {
  [key: string]: any;
}
import { message } from 'n-designv3';
import { useTable } from './hooks/historyListTable';
import CompareDrawer from './Components/CompareDrawer.vue';
import type { TableRowSelection } from 'n-designv3/es/table/interface';
const { columns, dataSource } = useTable();
const CompareDrawerRef = ref<typeof CompareDrawer>();
const selectTableData = ref<SelectTableData[]>([]);
const handCompare = () => {
  if (selectTableData.value.length < 2) {
    message.warning({
      content: () => '至少选择两项进行比较',
    });
    return;
  }
  CompareDrawerRef.value?.handDrawer(true);
};
const rowSelectionConfig: TableRowSelection<any> = {
  type: 'checkbox',
  onChange: (_selectedRowKeys, selectedRows) => {
    selectTableData.value = selectedRows;
  },
};
</script>

<style lang="less" scoped>
.btn-compare {
  display: inline-block;
  margin: 10px 10px 10px 20px;
  color: #447dfd;
  cursor: pointer;
}
</style>
./Common/HistoryList
