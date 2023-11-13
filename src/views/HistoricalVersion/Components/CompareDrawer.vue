<template>
  <div class="drawer-container">
    <n-drawer
      v-model:visible="visible"
      width="40%"
      :closable="true"
      :mask="false"
      class="drawer-container-box"
      @close="closeDrawer"
      :get-container="container"
    >
      <template #title> 版本比较 </template>
      <n-table
        :columns="$props.comparColumns"
        :data-source="$props.comparDataSource"
        :pagination="false"
        :loading="$props.isLoading"
        :scroll="{ x: '100%', y: scrollY() }"
        style="word-break: break-all"
      >
        <template #bodyCell="{ column, record, index }">
          <template v-if="record.isImg && column.dataIndex.includes('_')">
            <n-image :src="record[column.dataIndex]" />
          </template>
          <!-- <template v-else>
            <div>
              {{ record[column.key] }}
            </div>
          </template> -->
        </template>
      </n-table>
      <!-- <template #footer>
        <n-button style="margin-right: 8px" @click="closeDrawer">取消</n-button>
        <n-button type="primary" @click="closeDrawer">确定</n-button>
      </template> -->
    </n-drawer>
  </div>
</template>
<script setup lang="ts">
let props = defineProps({
  selectRowsData: {
    type: Array,
    default: <any>[],
  },
  comparColumns: {
    type: Array,
    default: <any>[],
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  comparDataSource: {
    type: Array,
    default: <any>[],
  },
});
const visible = ref(false);
const container = document.querySelector('.history-version');
const openDrawer = () => {
  visible.value = true;
};
const scrollY = () => {
  return document.querySelector('.drawer-container-box')
    ? document.querySelector('.drawer-container-box').offsetHeight - 150
    : 'auto';
};
const closeDrawer = () => {
  visible.value = false;
};
defineExpose({
  openDrawer,
  closeDrawer,
  visible,
});
</script>

<style lang="less">
.nl-drawer-content-wrapper {
  .nl-drawer-body {
    padding: 0px;
  }
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
.nl-drawer-close {
  margin-right: 0px !important;
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
