<template>
  <div class="drawer-container">
    <n-drawer v-model:visible="visible" :width="300" :closable="false" :mask="false" @close="closeDrawer" :get-container="container">
      <template #title> 版本比较 </template>
      <n-table :columns="$props.comparColumns" :data-source="$props.comparDataSource" :pagination="false" :scroll="{ x: '100%' }" style="word-break: break-all">
        <template #bodyCell="{ column, text }">
          <template v-if="column.dataIndex === 'name'">
            <a>{{ text }}</a>
          </template>
        </template>
      </n-table>
      <template #footer>
        <n-button style="margin-right: 8px" @click="closeDrawer">取消</n-button>
        <n-button type="primary" @click="closeDrawer">确定</n-button>
      </template>
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
</style>
