import { createApp } from 'vue';

import '@/assets/styles/index.less'; // 引入样式
import '@/assets/iconfont/iconfont.css'; // 引入字体图标
import '@/assets/iconfont/iconfont';

import App from './App.vue';
import { setupUtil } from '@/utils/gvUtil';
import { setupStore } from '@/store';
import { setupRouter } from '@/router';
import { setupI18n } from '@/lang';
import 'n-designv3/dist/nancal.css';

const app = createApp(App);
setupUtil(app);
setupStore(app);
setupRouter(app);
setupI18n(app);
app.mount('#app');
