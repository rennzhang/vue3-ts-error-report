<template>
  <div class="drawer-container">
    <n-drawer v-model:visible="isDrawer" width="40%" :closable="false" :mask="false" class="drawer-container-box">
      <template #title> 版本比较 </template>
      <n-table
        :columns="tableColumn"
        :data-source="tableDataSource"
        :pagination="false"
        :scroll="{ x: '100%' }"
        :loading="isLoading"
        style="word-break: break-all"
      >
        <template #bodyCell="{ column, record, index }">
          <template v-if="record.isImg && column.dataIndex.includes('_')">
            <n-image :src="record[column.dataIndex]" />
          </template>
        </template>
      </n-table>
      <template #footer>
        <div class="footer">
          <n-button
            style="margin-right: 8px"
            @click="
              () => {
                handDrawer(false);
              }
            "
            >取消</n-button
          >
          <n-button type="primary">确定</n-button>
        </div>
      </template>
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
import { requestCommonGetLabel } from '@/api/common/index';
import { useTable } from '../Common/versionComparison';
const isDrawer = ref(false);
const isLoading = ref(false);
const labelKeyData = ref([]);
const tableColumn = ref([]);
const tableDataSource = ref([]);
const getLabelKey = async () => {
  //获取比较时的key值
  isLoading.value = true;
  let data: any = await requestCommonGetLabel({
    classCode: 'CompanyItem',
    serviceCode: 'nalsvr',
  });
  console.log(data, 'data');
  labelKeyData.value = data.data;
  isLoading.value = false;
};
const getTableData = (selectTableData: any) => {
  if (labelKeyData.value.length) {
    const { column, dataSource } = useTable(selectTableData, labelKeyData.value);
    tableColumn.value = column;
    tableDataSource.value = dataSource;
  }
};
watch(
  () => props.selectTableData,
  (newVal, oldVal) => {
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
