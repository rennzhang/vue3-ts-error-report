import type { App } from 'vue';
import { createI18n } from 'vue-i18n';
import { useAppStore } from '@/store/modules/app';

const isWujie = window?.__POWERED_BY_WUJIE__;
const { lang } = window?.$wujie?.props?.setting || {};
const appStore = useAppStore();
export const i18n = createI18n({
  locale: isWujie ? lang : appStore.lang || 'en_us', // 设置当前语言类型
  legacy: false, // 如果要支持compositionAPI，此项必须设置为false;
  globalInjection: true, // 全局注册$t方法
  messages: {}, // 设置资源文件对象
});

export async function setupI18n(app: App) {
  app.use(i18n);
}
