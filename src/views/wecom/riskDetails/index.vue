<template>
  <div class="risk-detail-container">
    <div class="title">
      <p>风险控制:华为技术有限公司</p>
    </div>
    <n-descriptions>
      <n-descriptions-item label="作出结构机关">北京市朝阳区监督管理局</n-descriptions-item>
      <n-descriptions-item label="列入日期">2023/2/28</n-descriptions-item>
      <n-descriptions-item label="列入经营异常名录原因" :labelStyle="labelStyle"
        >通过等级住所或者经营场所获得</n-descriptions-item
      >
      <n-descriptions-item label="Remark">empty</n-descriptions-item>
      <n-descriptions-item label="Address">
        No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China
      </n-descriptions-item>
    </n-descriptions>
  </div>
</template>

<script lang="ts" setup>
const labelStyle = {
  'white-space': 'normal',
};
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
