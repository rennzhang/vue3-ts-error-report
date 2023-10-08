<template>
  <n-drawer title="企业详情" v-model:visible="showDrawer" width="40%"> 企业详情 </n-drawer>
</template>

<script lang="ts" setup>
const showDrawer = ref(false);

const openDrawer = (record?: any) => {
  showDrawer.value = true;
};

defineExpose({
  openDrawer,
  showDrawer,
});
</script>

<style scoped lang="less"></style>
