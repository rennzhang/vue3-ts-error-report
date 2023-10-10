import { type Component } from 'vue';
const modules = import.meta.glob('./*.vue', { eager: true });
export const components: Recordable<Component> = {};

Object.keys(modules).forEach(key => {
  const comp = (modules[key] as any).default;
  const compName = 'schema-form-' + key.replace(/\.\/|\.vue/g, '').toLowerCase();
  comp.name = compName;
  components[compName] = comp;
});

export default components;
