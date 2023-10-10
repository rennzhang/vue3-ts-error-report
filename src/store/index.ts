import type { App } from 'vue';
import { createPinia } from 'pinia';
import type { PiniaPluginContext } from 'pinia';
import piniaPersist from 'pinia-plugin-persistedstate';
const store = createPinia();
store.use((context: PiniaPluginContext) => {
  if (!context.options.persist) return;
  context.options.persist.key = `${import.meta.env.VITE_APP_NGINX_VPATH_NAME}:${context.store.$id}`;
});
export function setupStore(app: App<Element>) {
  store.use(piniaPersist);
  app.use(store);
}

export { store };
