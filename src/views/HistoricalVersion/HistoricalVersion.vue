<template>
  <div class="history-version">
    <div><n-button type="primary" class="btn-compare" @click="handCompare" :disabled="isLoading">比较</n-button></div>
    <n-table
      :row-selection="rowSelectionConfig"
      :loading="isLoading"
      :columns="columns"
      :data-source="tableData"
      rowKey="objId"
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
    <CompareDrawer
      ref="CompareDrawerRef"
      :selectRowsData="selectRowsData"
      :comparColumns="comparColumnsData"
      :comparDataSource="comparDataSourceData"
    />
  </div>
</template>

<script setup lang="ts">
import { useTable, useDataCompare } from './hooks';
import { message } from 'n-designv3';
import CompareDrawer from './Components/CompareDrawer.vue';
import { requestCommonGetLabel } from '@/api/common/index';
import { type ColumnProps } from 'n-designv3/lib/table';
const { columns, tableData } = useTable();
const CompareDrawerRef = ref<typeof CompareDrawer>();
const selectRowsData = ref<ColumnProps[]>([]);
const comparColumnsData = ref<ColumnProps[]>([]);
const comparDataSourceData = ref<any[]>([]);
const isLoading = ref(false);
const labelData = ref([]);
const getLabelKey = async () => {
  //获取比较时的key值
  isLoading.value = true;
  let data: any = await requestCommonGetLabel({
    classCode: 'CompanyItem',
    serviceCode: 'nalsvr',
  });
  labelData.value = data.data;
  isLoading.value = false;
};
getLabelKey();
const scrollY = () => {
  return document.querySelector('.history-version')
    ? document.querySelector('.history-version').offsetHeight - 100
    : 'auto';
};
const handCompare = () => {
  console.log(selectRowsData.value.length, 'selectRowsData');
  if (selectRowsData.value.length < 2) {
    message.warning({
      content: () => '至少选择两项进行比较',
    });
    return;
  }
  if (CompareDrawerRef.value.visible) {
    //如果已经打开，重复点击禁止重复调用
    return false;
  }
  CompareDrawerRef.value?.openDrawer();
};
const rowSelectionConfig = {
  type: 'checkbox',
  onChange: (selectedRowKeys: any, selectedRows: any) => {
    console.log(selectedRowKeys, 'selectKeys');
    const { comparColumns, comparData, comparDataSource } = useDataCompare(selectedRows, labelData); //比较是否有相同值的字段，如果有则自动不显示
    selectRowsData.value = comparData as any;
    comparColumnsData.value = comparColumns;
    comparDataSourceData.value = comparDataSource;
  },
};
</script>

<style lang="less" scoped>
.btn-compare {
  margin: 10px 20px 10px 20px;
}
.history-version {
  width: 100%;
  height: 100%;
  position: relative;
}
.icon {
  cursor: pointer;
}
</style>
