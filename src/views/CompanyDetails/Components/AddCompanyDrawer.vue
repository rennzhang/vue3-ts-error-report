<template>
  <n-drawer title="添加企业" v-model:visible="showAddDrawer" width="40%">
    添加企业 123
    <schema-form ref="schemaFormRef" :formSchema="formSchema" />
  </n-drawer>
</template>

<script lang="ts" setup>
const showAddDrawer = ref(false);

const schemaFormRef = ref<SchemaFormRef>();

const formSchema = reactive<FormSchema>({
  formItem: [
    {
      field: 'catalogName',
      type: 'input',
      label: '目录名称',
      tips: '目录名称不能为空',
      events: {
        onChange: val => {
          console.log('change', val);
        },
      },
    },
    {
      field: 'user',
      type: 'selectSearch',
      label: '选择用户',
      searchRequest: async value => {
        return fetch('https://randomuser.me/api/?results=' + value)
          .then(response => response.json())
          .then(async body => {
            const data = body.results.map((user: any) => ({
              label: `${user.name.first} ${user.name.last}`,
              value: user.login.username,
            }));
            return data;
          });
      },
    },
    // {
    //   field: 'parentId',
    //   type: 'select',
    //   label: '归属目录',
    //   options: [
    //     { label: '选项1', value: '1' },
    //     { label: '选项2', value: '2' },
    //     { label: '选项3', value: '3' },
    //   ],
    //   props: {
    //     labelInValue: true,
    //   },
    //   events: {
    //     onChange: val => {
    //       console.log('change', val);
    //     },
    //     blur: val => {
    //       console.log('blur', val);
    //     },
    //     // onBlur: val => {
    //     //   console.log('onBlur', val);
    //     // },
    //   },
    // },
    {
      field: 'catalogDesc',
      type: 'textarea',
      label: '目录描述',
      required: false,
      events: {
        onChange: val => {
          console.log('change', val);
        },
      },
    },
  ],
  required: true,
  // showAction: false,
  formData: {},
});

const openDrawer = (record?: any) => {
  showAddDrawer.value = true;
};

defineExpose({
  openDrawer,
  showAddDrawer,
});
</script>

<style scoped lang="less"></style>
