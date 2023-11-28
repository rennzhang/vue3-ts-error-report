<template>
  <div class="drawer-container">
    <n-drawer v-model:visible="isDrawer" :closable="true" width="40%" :mask="false" class="drawer-container-box">
      <template #title> 版本比较 </template>
      <n-table
        :columns="tableColumn"
        :data-source="tableDataSource"
        :pagination="false"
        :loading="isLoading"
        style="word-break: break-all"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex.includes('_')">
            <component
              v-if="record[column.dataIndex]"
              :is="record[column.dataIndex].component"
              :details="record[column.dataIndex]"
            />
          </template>
        </template>
      </n-table>
    </n-drawer>
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  selectTableData: {
    type: Array,
    default: <any>[],
  },
});
interface Column {
  title: string;
  dataIndex: string;
  key: string;
  fixed: boolean;
}
interface DataSource<T> {
  value: T;
  [key: string]: any;
}
import { useTable } from '../hooks/versionComparisonTable';
import { useDetails } from '../../ClassDetails/hooks/index';
const { queryDetailSchema } = useDetails();
const isDrawer = ref<boolean>(false);
const isLoading = ref<boolean>(false);
const labelKeyData = ref<object>({});
const tableColumn = ref<Column[]>([]);
const tableDataSource = ref<DataSource<any>[]>([]);
const getLabelKey = async () => {
  isLoading.value = true;
  let data = await queryDetailSchema();
  isLoading.value = false;
  labelKeyData.value = data;
};
const getTableData = (selectTableData: any) => {
  if (JSON.stringify(labelKeyData.value) !== '{}') {
    const { column, dataSource } = useTable(selectTableData, labelKeyData.value);
    tableColumn.value = column;
    tableDataSource.value = dataSource;
  }
};
watch(
  () => props.selectTableData,
  (newVal) => {
    getTableData(newVal);
  }
);
getLabelKey();
const handDrawer = async (isOpen: boolean) => {
  isDrawer.value = isOpen;
  if (isOpen) {
    //首次调用
    getTableData(props.selectTableData);
  }
};

defineExpose({
  handDrawer,
});
</script>
<style lang="less">
.nl-drawer-content-wrapper {
  .nl-drawer-body {
    padding: 0px;
  }
}
.footer {
  display: flex;
  justify-content: flex-end;
}
.nl-drawer-close {
  margin-right: 0px !important;
}
.drawer-style .nl-drawer-footer {
  border: none !important;
  padding: 16px 24px !important;
}
.drawer-style .nl-drawer-header {
  padding: 15.5px 24px !important;
}
.nl-drawer {
  position: absolute !important;
}
.common-file {
  display: block;
  text-decoration: none;
  font-size: 14px;
  text-decoration: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.nl-table-cell {
  white-space: nowrap !important;
}
::-webkit-scrollbar {
  width: 4px;
  height: 4px;
  border-radius: 4px;
}
.nl-table {
  margin: 0 !important;
}
::-webkit-scrollbar-thumb {
  background-color: #bfbfbf;
  border-radius: 4px;
}
</style>
