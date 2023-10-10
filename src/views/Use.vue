<template>
  <div>
    <h3>多语言</h3>
    <div>{{ $t('uisvr.action') }}</div>
    <button @click="handleClick">跳转路由</button>
  </div>
</template>
<script lang="ts" setup>
// 1. 多语言
console.log(gvUtil.t('uisvr.action'));

// 2. 获取主应用参数
const isWujie = window?.__POWERED_BY_WUJIE__;
if (isWujie) {
  // wujie
  const { params } = window?.$wujie?.props || {};
  console.log(params);
} else {
  // iframe
  console.log(gvUtil.appParams);
}

// 3. 跳转主应用路由
function handleClick() {
  const isWujie = window?.__POWERED_BY_WUJIE__;
  if (isWujie) {
    // wujie
    const { parentVue } = window?.$wujie?.props || {};
    parentVue.$router.push({ name: 'Home' });
  } else {
    // iframe
    gvUtil.postMsg({ type: '$router.push', data: { path: '/' } });
    gvUtil.postMsg({ type: 'gvUtil.success', data: '跳转成功' });
  }
  console.log('跳转路由');
}
</script>
