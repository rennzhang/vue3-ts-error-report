<template>
  <div id="app">
    <a-config-provider :locale="locale">
      <router-view class="routerWrap"></router-view>
    </a-config-provider>
  </div>
</template>
<script>
import { mapState } from 'vuex';
export default {
  data() {
    return {};
  },
  computed: {
    ...mapState('setting', ['lang']),
    locale() {
      const fileName = this.lang.replace(/(_[a-z]{1,})/, function (s, s1) {
        return s1.toUpperCase();
      });
      return require(`ant-vue-nancal/es/locale/${fileName || 'zh_CN'}`).default;
    },
  },
  created() {},
  methods: {},
};
</script>

<style lang="less" scoped>
// wujie 去除统一遮罩和设置高度为100%
#app {
  width: 100%;
  height: 100%;
  background-color: #fff;
  display: flex;
  flex-direction: column;
}
.routerWrap {
  flex: 1;
  overflow: auto;
}
</style>
