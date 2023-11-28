<template>
  <div class="drawer-container">
    <n-drawer v-model:visible="isDrawer" :closable="true" width="40%" :mask="false" class="drawer-container-box">
      <template #title> 版本比较 </template>
      <n-table
        :columns="tableColumn"
        :data-source="tableDataSource"
        :pagination="false"
        :scroll="{ x: '100%' }"
        :loading="isLoading"
        style="word-break: break-all"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex.includes('_')">
            <!-- {{ console.log(record[column.dataIndex], 'record================>>>>') }} -->
            <component :is="record[column.dataIndex]" />
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
// import { requestCommonGetLabel } from '@/api/common/index';
import { useTable } from '../hooks/versionComparisonTable';
import { useDetails } from '../../ClassDetails/hooks/index';
// import { requestCommonGetLOV } from '@/api/common';
const { queryDetailSchema } = useDetails();
// const route = useRoute();
const isDrawer = ref(false);
const isLoading = ref(false);
const labelKeyData = ref({});
const tableColumn = ref([]);
const tableDataSource = ref([]);
const useNameData = ref([]);
const getLabelKey = async () => {
  //获取比较时的key值
  // const objId = window.$wujie?.props.params.record.objId;
  const className = window.$wujie?.props.params.record.className;
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
const handDrawer = async (isOpen: boolean) => {
  isDrawer.value = isOpen;
  if (isOpen) {
    await getLabelKey();
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
::-webkit-scrollbar {
  width: 4px;
  height: 4px;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb {
  background-color: #bfbfbf;
  border-radius: 4px;
}
</style>
../Common/VersionComparison
