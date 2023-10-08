<template>
  <div id="app">
    <RouterView class="routerWrap" />
  </div>
</template>

<script setup lang="ts"></script>

<style lang="less" scoped>
// wujie 去除统一遮罩和设置高度为100%
#app {
  width: 100%;
  height: 100%;
  background-color: #fff;
  display: flex;
  flex-direction: column;
}
.routerWrap {
  flex: 1;
  overflow: auto;
}
</style>
