## Report description

This project uses the `unplugin-auto-import` plug-in.

### Operating steps

1. Create a new folder under views, Like "aaa"
2. Create `index.vue` under "aaa"
3. Enter the following code & `npm run dev`

```vue
<template>
  <div></div>
</template>

<script lang="ts" setup>
let a = ref(1);
</script>

<style scoped lang="less"></style>
```

The following error will occur

```
找不到名称“ref”。ts(2304)
```
