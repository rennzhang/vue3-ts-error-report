<template>
  <n-drawer title="添加企业" v-model:visible="showAddDrawer" width="40%">
    添加企业 123
    <schema-form ref="schemaFormRef" :formSchema="formSchema" />
    <n-form>
      <n-select
        v-model:value="state.value"
        label-in-value
        placeholder="Select users"
        style="width: 100%"
        :filter-option="false"
        :not-found-content="state.fetching ? undefined : null"
        :options="state.data"
        showSearch
        @search="fetchUser"
        @change="onSelectChange"
      >
        <template v-if="state.fetching" #notFoundContent>
          <n-spin size="small" />
        </template>
      </n-select>
    </n-form>
  </n-drawer>
</template>

<script lang="ts" setup>
import { debounce } from 'lodash-es';
const showAddDrawer = ref(false);
const state = reactive({
  data: [
    { label: '选项1', value: '1' },
    { label: '选项2', value: '2' },
    { label: '选项3', value: '3' },
  ],
  value: [],
  fetching: false,
});
const onSelectChange = (value: any, args) => {
  console.log('onSelectChange', value, args);
};
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
      field: 'parentId',
      type: 'select',
      label: '归属目录',
      options: [
        { label: '选项1', value: '1' },
        { label: '选项2', value: '2' },
        { label: '选项3', value: '3' },
      ],
      props: {
        labelInValue: true,
      },
      events: {
        onChange: val => {
          console.log('change', val);
        },
        blur: val => {
          console.log('blur', val);
        },
        // onBlur: val => {
        //   console.log('onBlur', val);
        // },
      },
    },
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

let lastFetchId = 0;
const fetchUser = debounce(value => {
  console.log('fetching user', value);
  lastFetchId += 1;
  const fetchId = lastFetchId;
  state.data = [];
  state.fetching = true;
  fetch('https://randomuser.me/api/?results=5')
    .then(response => response.json())
    .then(body => {
      if (fetchId !== lastFetchId) {
        // for fetch callback order
        return;
      }
      const data = body.results.map((user: any) => ({
        label: `${user.name.first} ${user.name.last}`,
        value: user.login.username,
      }));
      state.data = data;
      state.fetching = false;
    });
}, 300);

const openDrawer = (record?: any) => {
  showAddDrawer.value = true;
};

defineExpose({
  openDrawer,
  showAddDrawer,
  fetchUser,
  state,
});
</script>

<style scoped lang="less"></style>
