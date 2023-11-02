<template>
  <div class="card-container p-8 bg-gray-100 h-full">
    <n-card title="乐仓批量操作工具" class="shadow-gray" :tab-list="tabList" :active-tab-key="activeKey">
      <component :is="tabsMap[activeKey]"></component>
    </n-card>
  </div>
</template>
<script lang="ts" setup>
import type { Component } from 'vue';
import HandleLOV from './components/HandleLOV.vue';
const tabsMap = reactive<{ [key: string]: Component }>({
  '批量操作 LOV': markRaw(HandleLOV),
});
const tabList = Object.entries(tabsMap).map(([key, component]) => ({ tab: key, key, component }));
const activeKey = ref(tabList[0].key);

console.log(tabList);
</script>
<style></style>
