import Vue from 'vue';
import store from './store';
import App from './App.vue';
import router from '@/permission';

import gvUtil from '@/utils/gvUtil';
import Antd from 'ant-vue-nancal';
import 'ant-vue-nancal/dist/antd.css';

import '@/assets/styles/reset.less'; // 统一样式
import i18n from '@/lang'; // 国际化

Vue.config.productionTip = false;
Vue.use(Antd);
Vue.use(gvUtil);

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
  created() {
    this.$store.watch(
      state => state.setting.lang,
      () => {
        this.$i18n.locale = this.$store.state.setting.lang;
      }
    );
  },
}).$mount('#app');
