<template>
  <n-drawer title="添加企业" v-model:visible="showAddDrawer" width="40%">
    添加企业 123
    <n-form>
      <n-select
        v-model:value="state.value"
        label-in-value
        placeholder="Select users"
        style="width: 100%"
        :filter-option="false"
        :not-found-content="state.fetching ? undefined : null"
        :options="state.data"
        @search="fetchUser"
      >
        <template v-if="state.fetching" #notFoundContent>
          <n-spin size="small" />
        </template>
      </n-select>
    </n-form>
  </n-drawer>
</template>

<script lang="ts" setup>
import debounce from 'lodash.debounce';
const showAddDrawer = ref(false);
const state = reactive({
  data: [],
  value: [],
  fetching: false,
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
