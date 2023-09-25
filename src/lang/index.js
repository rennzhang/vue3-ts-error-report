import Vue from 'vue';
import VueI18n from 'vue-i18n';
import langCodes from '@/lang/langCode';
Vue.use(VueI18n);

const isWujie = window?.__POWERED_BY_WUJIE__;
const {
  util,
  setting: { lang },
} = window?.$wujie?.props || {};

const i18n = new VueI18n({
  locale: isWujie ? lang : 'zh_cn',
  fallbackLocale: 'en_us',
  messages: {},
  silentTranslationWarn: true,
});

if (isWujie) {
  util.getLanguage(process.env.VUE_APP_NGINX_VPATH_NAME, langCodes).then(res => {
    i18n.setLocaleMessage('en_us', res.en_us);
    i18n.setLocaleMessage('zh_cn', res.zh_cn);
  });
}

window.i18n = i18n;
export default i18n;
