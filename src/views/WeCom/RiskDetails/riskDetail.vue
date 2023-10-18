<template>
  <div class="risk-detail-container">
    <div class="title">
      <p>风险控制:华为技术有限公司</p>
    </div>
    <n-descriptions :column="1">
      <n-descriptions-item v-for="(item, index) in listData" :label="item.name" :labelStyle="labelStyle">{{
        item.value
      }}</n-descriptions-item>
      <!-- <n-descriptions-item label="列入日期">2023/2/28</n-descriptions-item>
      > -->
    </n-descriptions>
  </div>
</template>

<script lang="ts" setup>
import { requestCommonSetUpGetInfoDialog } from '@/api/common/index';
const listData = ref([]);
const labelStyle = {
  'white-space': 'normal',
};
const getRiskDetail = (record: GroupCompanyRecord) => {
  requestCommonSetUpGetInfoDialog({
    className: 'CompanyRiskWarning',
    thisObj: {
      objId: '1714570235433975808',
      className: 'CompanyRiskWarning',
    },
  }).then((res) => {
    console.log(res.data.scheme, 'res-->>');
    const values = res.data.scheme.values;
    const form = res.data.scheme.form[0].children;
    const renderList = [];
    form.map((item, index) => {
      if (values.hasOwnProperty(item.field)) {
        renderList.push({
          name: item.name,
          value: values[item.field],
          key: item.field,
        });
      }
    });
    console.log(listData, 'listData');
    listData.value = renderList;
  });
};
getRiskDetail();
</script>

<style lang="less" scoped>
.risk-detail-container {
  .title {
    p {
      font-size: 18px;
      color: #000;
      font-weight: 600;
      text-align: center;
      margin-top: 3%;
    }
  }
  .nl-descriptions {
    padding-left: 5%;
    padding-right: 5%;
  }
}
</style>
