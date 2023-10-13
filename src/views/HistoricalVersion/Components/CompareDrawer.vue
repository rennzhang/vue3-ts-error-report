<template>
  <div class="drawer-container">
    <n-drawer
      v-model:visible="visible"
      width="40%"
      :closable="false"
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
        :scroll="{ x: '100%', y: scrollY() }"
        style="word-break: break-all"
      >
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
import { message } from 'n-designv3';
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
const scrollY = () => {
  return document.querySelector('.drawer-container-box')
    ? document.querySelector('.drawer-container-box').offsetHeight - 150
    : 'auto';
};
// watch(
//   () => props.selectRowsData,
//   () => {
//     message.warning({
//       content: () => '至少选择两项进行比较',
//     });
//   }
// );
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
