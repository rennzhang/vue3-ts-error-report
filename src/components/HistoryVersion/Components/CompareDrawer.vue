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
          <template v-if="record.isImg && column.dataIndex.includes('_')">
            <n-image v-for="item in record[column.dataIndex]" :src="item" />
          </template>
          <template v-if="record.isFile && column.dataIndex.includes('_')">
            <!-- <n-image v-for="item in record[column.dataIndex]" :src="item" /> -->
            <a v-for="item in record[column.dataIndex]" :title="item.name" class="common-file" :href="item.url">{{
              item.name
            }}</a>
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
import { requestCommonGetLabel } from '@/api/common/index';
import { useTable } from '../Common/versionComparison';
import { requestCommonGetLOV } from '@/api/common';
const route = useRoute();
const isDrawer = ref(false);
const isLoading = ref(false);
const labelKeyData = ref([]);
const tableColumn = ref([]);
const tableDataSource = ref([]);
const useNameData = ref([]);
const getLabelKey = async () => {
  //获取比较时的key值
  // const objId = window.$wujie?.props.params.record.objId;
  const className = window.$wujie?.props.params.record.className;
  isLoading.value = true;
  let data: any = await requestCommonGetLabel({
    classCode: className || 'ActivityItem',
    serviceCode: 'nalsvr',
  });
  await getActivityPersonnel();
  labelKeyData.value = data.data;
  isLoading.value = false;
};
const getTableData = (selectTableData: any) => {
  if (labelKeyData.value.length) {
    const { column, dataSource } = useTable(selectTableData, labelKeyData.value, useNameData.value);
    tableColumn.value = column;
    tableDataSource.value = dataSource;
  }
};
const getActivityPersonnel = async () => {
  let data: any = await requestCommonGetLOV({
    code: (route.query.LOVCode as string) || 'usrName',
    thisObj: {},
  });
  useNameData.value = data.data.details;
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
