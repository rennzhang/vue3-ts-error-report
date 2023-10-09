<template>
  <!-- 使用 props -->
  <!-- <Codemirror
    v-model:value="props.formState.formModel['projectType']"
    height="200px"
    width="100%"
    border
  ></Codemirror> -->
  <!-- 使用 inject 数据 -->
  <Codemirror
    v-model:value="formState.formModel['projectType']"
    height="200px"
    width="100%"
    border
  />
</template>

<script lang="ts" setup>
import Codemirror from "codemirror-editor-vue3";

// 可以使用 props 或者 inject 获取 schemaFrom 相关属性方法，参考 form.d.ts  SchemaFormState
// const props = defineProps<{ formState: SchemaFormState }>();

const formState = inject("schemaFormState") as SchemaFormState;
</script>

<style scoped lang="less"></style>
