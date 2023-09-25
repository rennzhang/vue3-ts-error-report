<template>
  <gv-page-body class="h-full mlr-16 mt-16">
    <a-result status="404" title="404" :sub-title="$t('aiwork_404')">
      <template #extra>
        <a-button type="primary" @click="backHome"> {{ $t('aiwork_back_homepage') }} </a-button>
      </template>
    </a-result>
  </gv-page-body>
</template>
<script>
export default {
  name: 'NotFound',
  props: {},
  data() {
    return {};
  },
  computed: {},
  mounted() {},
  methods: {
    backHome() {
      this.$router.replace('/');
    },
  },
};
</script>
<style lang="less" scoped></style>
