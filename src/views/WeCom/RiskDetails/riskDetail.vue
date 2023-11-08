<template>
  <div class="risk-detail-container">
    <div class="title">
      <p>风险预警：{{ companyName }}</p>
    </div>
    <n-descriptions>
      <n-descriptions-item
        v-for="item in listData"
        :label="item.name"
        :labelStyle="{
          'white-space': 'normal',
          'text-align': 'right',
        }"
        >{{ item.value }}</n-descriptions-item
      >
      <!-- <n-descriptions-item label="列入日期">2023/2/28</n-descriptions-item>
      > -->
    </n-descriptions>
  </div>
</template>

<script lang="ts" setup>
interface ListItem {
  // 定义列表项的属性
  value: string;
  name: string;
  key: string;
  // 其他属性...
}
import { requestCommonSetUpGetInfoDialog } from '@/api/common/index';
import { useRoute } from 'vue-router';
import { getUrlParams } from '@/utils';
const companyName: any = ref('');
console.log(useRoute, 'useRoute');
const route = useRoute();
companyName.value = route.query.companyName || '华为技术有限公司';
console.log(route.query.companyName, 'toutee');
const listData = ref<Array<ListItem>>([]);
type renderList = {
  value: string;
  name: string;
  key: string;
};
const params = getUrlParams();
const getRiskDetail = () => {
  requestCommonSetUpGetInfoDialog({
    className: 'CompanyRiskWarning',
    thisObj: {
      objId: params.objId,
      className: 'CompanyRiskWarning',
    },
  }).then((res) => {
    const values = res.data.scheme.values;
    const form = res.data.scheme.form[0].children;
    const renderList: Array<renderList> = [];
    form.map((item) => {
      if (values.hasOwnProperty(item.field)) {
        renderList.push({
          name: item.name,
          value: values[item.field],
          key: item.field,
        });
      }
    });
    listData.value = renderList;
  });
};
getRiskDetail();
</script>

<style lang="less" scoped>
.risk-detail-container {
  height: 100%;
  background: #fafafa;
  .nl-descriptions {
    height: calc(100% - 7%);
    overflow: auto;
  }
  .title {
    padding-top: 3%;
    p {
      font-size: 16px;
      color: #000;
      font-weight: 600;
      margin-left: 16%;
      // text-align: center;
      // margin-left: -7%;
      margin-bottom: 0.5em;
      // margin-top: 3%;
    }
  }
  .nl-descriptions {
    padding-left: 7%;
    padding-right: 5%;
  }
}
</style>
