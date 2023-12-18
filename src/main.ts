import { createApp } from 'vue';

import 'virtual:uno.css';

import App from './App.vue';
import { setupRouter } from '@/router';

const app = createApp(App);
setupRouter(app);
app.mount('#app');
