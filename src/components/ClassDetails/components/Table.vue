<template>
  <n-table
    bordered
    :data-source="dataSource"
    :columns="props.details?.columns"
    class="w-full mr-24px"
    :pagination="false"
  >
    <template #bodyCell="{ column, value, record }">
      <template v-if="column.lov"> {{ store.getLovLabel(column.dataIndex, value) }}</template>
      <template v-if="['action'].includes(column.dataIndex)">
        <n-button type="link" class="!p-0" @click="viewDetailsForId(record, props.details?.otherClassCode as string)">
          <eye-outlined />
        </n-button>
      </template>
    </template>
  </n-table>
</template>

<script lang="ts" setup>
import { DetailsItem } from '../types';
import { useDetailsStore } from '../store';
import { requestCommonSetUpGetInfoDialog } from '@/api/common';
const props = defineProps<{
  details?: DetailsItem;
}>();
const store = useDetailsStore();

const viewDetailsForId = async (record: Recordable, otherClassCode: string) => {
  if (!otherClassCode || !record.objId) return;
  requestCommonSetUpGetInfoDialog({ className: otherClassCode, thisObj: { objId: record.objId } }).then((res) => {
    window?.gvUtil.h(res.data.scheme);
  });
};

const dataSource = ref<any>([]);

const initData = () => {
  const { value, otherClassCode } = props.details || {};

  // 如果是关联表格
  if (otherClassCode) {
    dataSource.value = (value as any)?.data || [];
  } else {
    try {
      dataSource.value = JSON.parse(value || '[]');
    } catch (error) {
      console.log(error);
    }
  }
};

initData();
</script>

<style scoped lang="less"></style>
