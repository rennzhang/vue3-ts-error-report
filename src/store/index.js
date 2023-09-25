import Vue from 'vue';
import Vuex from 'vuex';
const path = require('path');
import createPersistedstate from 'vuex-persistedstate';

Vue.use(Vuex);

const req = require.context('./modules', false, /.js$/);

const requireAll = file =>
  file.keys().reduce((modules, e) => {
    let name = path.basename(e, '.js');
    modules[name] = file(e).default;
    return modules;
  }, {});

export default new Vuex.Store({
  state: {},
  modules: {
    ...requireAll(req),
  },
  plugins: [
    createPersistedstate({
      key: 'uisvr:vuex',
    }),
  ],
});
