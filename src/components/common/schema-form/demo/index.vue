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
const formSchema = reactive<FormSchema>({
  formItem: [
    // !基本语法
    {
      type: 'input',
      label: '项目名称',
      field: 'projectName',
      rules: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
      props: {
        defaultValue: '',
        allowClear: true,
      },
      placeholder: '请输入项目名称',
      noStyle: true,
      // ?包括所有的 a-form-item的属性等等，具体查看https://www.antdv.com/components/form-cn#API
    },
    // !动态校验规则
    {
      type: 'input',
      label: '项目标识',
      field: 'projectId',
      // 根据项目名称是否存在，返回不同的校验规则
      dynamicRules({ formModel }) {
        return [{ required: Boolean(formModel.projectName) }];
      },
    },
    // !动态 props 和 异步options、value
    {
      type: 'input',
      label: 'XXX A',
      field: 'projectA',
      props({ formModel }) {
        return {
          disabled: Boolean(formModel.projectId),
        };
      },
      asyncValue({ formModel }) {
        // return getXXXVal().then(res => {
        //   return res.data;
        // });
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(formModel.projectId);
          }, 1000);
        });
      },
      asyncOptions() {
        // return getXXXOptions().then(res => {
        //   return res.data;
        // });
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                value: '1',
                label: 'XXX A1',
              },
              {
                value: '2',
                label: 'XXX A2',
              },
            ]);
          }, 1000);
        });
      },
    },
    // !表单项后面的问好提示
    // {
    //   type: 'input',
    //   label: 'XXX B',
    //   field: 'projectB',
    //   tips: 'XXX B tips',
    //   // ?换行写法用数组
    //   // tips: [
    //   //   "XXX B tips1",
    //   //   "XXX B tips2"
    //   // ]
    // },
    // !使用作用域插槽，可以配合 rule
    // {
    //   slotName: 'slotA',
    //   label: 'slotA label',
    //   field: 'projectD',
    //   rules: [{ required: true, message: '请输入 slotA', trigger: 'change' }],
    // },
    // !使用component，必须使用 markRak，可以配合 rule
    // {
    //   component: markRaw(Codemirror),
    //   label: 'component label',
    //   field: 'projectE',
    //   rules: [{ required: true, message: '请输入 slotE', trigger: 'change' }],
    // },

    // switch 例子
    {
      type: 'switch',
      label: '是否启用',
      field: 'projectStatus',
      value: 0,
      props: {
        checkedValue: 0,
        unCheckedValue: 1,
      },
    },
  ],

  // !这里可以给初始值
  // 也可以异步之后赋值，比如 getFormSchema().formData.projectName = "异步获取项目名称"
  formData: {
    projectName: '初始名称',
  },
  // 显示提交按钮
  showAction: false,
});

const schemaFormRef = ref<SchemaFormRef>();
// const schemaFormRef = ref<SchemaFormRef<Recordable<FormModel>>>();
// schemaFormRef.value?.formModel.aaa
</script>

<style scoped lang="less"></style>
