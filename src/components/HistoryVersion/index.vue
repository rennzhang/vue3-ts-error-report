<template>
  <div class="history-version">
    <div><n-button type="primary" class="btn-compare" @click="handCompare">比较</n-button></div>
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
import { message } from 'n-designv3';
import CompareDrawer from './Components/CompareDrawer.vue';
const CompareDrawerRef = ref<typeof CompareDrawer>();
import { useTable } from './Common/historyList';
const selectTableData = ref([]);
const { columns, dataSource } = useTable();
const rowSelectionConfig = {
  type: 'checkbox',
  onChange: (selectedRowKeys: any, selectedRows: any) => {
    selectTableData.value = selectedRows;
    console.log(selectTableData, 'selectTableData');
  },
};
const handCompare = () => {
  if (selectTableData.value.length < 2) {
    message.warning({
      content: () => '至少选择两项进行比较',
    });
    return;
  }
  CompareDrawerRef.value?.handDrawer(true);
};
</script>

<style lang="less" scoped>
.btn-compare {
  margin: 10px;
}
</style>
