<template>
  <!-- 普通 schema-form -->
  <schema-form ref="schemaFormRef" :form-schema="formSchema" />
  <!--  -->
  <!-- 插槽 schema-form -->
  <!-- <schema-form :formSchema="formSchema">
    <template #slotA="{ formModel }">
      <Codemirror
        v-model:value="formModel['projectType']"
        height="200px"
        width="100%"
        border
      ></Codemirror>
    </template>
  </schema-form> -->
</template>

<script lang="ts" setup>
// import Codemirror from "codemirror-editor-vue3";
import schemaForm from '../schema-form.vue';
import { getFormSchema, type FormModel } from './getFormSchema';
const formSchema = getFormSchema();

const schemaFormRef = ref<SchemaFormRef<FormModel>>();
// const schemaFormRef = ref<SchemaFormRef<Recordable<FormModel>>>();
// schemaFormRef.value?.formModel.aaa
</script>

<style scoped lang="less"></style>
