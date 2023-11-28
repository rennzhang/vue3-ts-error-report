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
      </template>
    </n-table>
    <CompareDrawer ref="CompareDrawerRef" :select-table-data="selectTableData" />
  </div>
</template>

<script setup lang="ts">
import { message } from 'n-designv3';
import { useTable } from './hooks/historyListTable';
import CompareDrawer from './Components/CompareDrawer.vue';
const { columns, dataSource } = useTable();
const CompareDrawerRef = ref<typeof CompareDrawer>();
const selectTableData = ref([]);
const handCompare = () => {
  if (selectTableData.value.length < 2) {
    message.warning({
      content: () => '至少选择两项进行比较',
    });
    return;
  }
  CompareDrawerRef.value?.handDrawer(true);
};
const rowSelectionConfig = {
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
