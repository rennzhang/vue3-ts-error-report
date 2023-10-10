# lz-temp3

支持乐造子应用开发的 vue3 框架

## IDE设置

1. [VSCode](https://code.visualstudio.com/)
2. [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (必选)(`禁用掉Vetur`)
3. [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) (必选)
4. [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) (必选)
5. [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) (必选)
6. [vsc-nvm](https://marketplace.visualstudio.com/items?itemName=henrynguyen5-vsc.vsc-nvm)(可选)(如果你使用nvm管理node版本，并同时使用多个node版本开发项目时，可以安装这个插件进行终端node版本快速切换)


## 启动项目

本项目使用了pnpm包管理工具，如果没有安装，请先安装[pnpm](https://pnpm.io/zh/)。
```sh
npm install -g pnpm
```

```sh
pnpm install
```

### 用于开发的编译和热重新加载

```sh
pnpm run dev
```

### 用于生产的类型检查、编译和代码压缩

```sh
npm run build
```




1. 路由必须是 `懒加载` 因为子应用都是作为一个单独页面嵌入到主应用的
2. `gvUtil` 已经挂载到window对象上了，`不需要单独引入`
3. 全局公共性的 `业务组件` 在 `@/components` 下注册, 如 'BnButton.vue'，文件名使用大驼峰的形式，如该业务组件还需要拆分子组件，则新建文件夹，如 'BnButton/index.vue'，则拆分的子组件放到当前组件文件夹内的components下，如 'BnButton/components/BnButtonIcon.vue'
4. 全局公共性的 `非业务组件` 在 `@/components/common` 下注册, 组件名称必须是 `Gv` 开头的大驼峰形式，如GvButton，GvInput，使用时是小驼峰，另外common文件夹下的组件，已自动注册为全局组件，不需要单独引入，直接使用即可。
    ```html
    <template>
      <gv-button></gv-button>
    </template>
    ```
5. 组件库：[n-designv3](http://192.168.5.221:829/ndesignv3/components/overview-cn/)
6. js工具库：[ramda](https://ramda.cn/)、 [lodash.debounce](https://www.lodashjs.com/docs/lodash.debounce)、 [lodash.throttle](https://www.lodashjs.com/docs/lodash.throttle)、 [lodash.kebabcase](https://www.lodashjs.com/docs/lodash.kebabCase#_kebabcasestring)、 [rxjs](https://cn.rx.js.org/)
7. css工具类：[tailwindcss](https://www.tailwindcss.cn/docs/installation)
8. 一个业务模块对应一个store、一个api文件、一个views文件夹, 一个ts类型文件，例如：`@/store/modules/user.ts`、`@/api/user.ts`、`@/views/user/index.vue`、`@/types/user.ts`
9. pinia使用文档：[pinia](https://pinia.vuejs.org/zh/), pinia可以按模块配置持久化缓存，使用方法如下：
    ```ts
    export const useUserStore = defineStore({
      ...
      persist: {
        storage: localStorage,  // localStorage/seeionStorage 注意区分数据存储的位置，没必要的数据不要存储到localStorage
      },
    });
    ```
10. 挂载到 window 对象上的属性(无需引入直接使用)：
  - `gvUtil`：工具库
  - `ofRx`：将 api 转化为 rxjs 的 observer 以便使用rxjs的操作符
11. 与主应用通信
  - wujie
    - 子应用 -> 子应用
      ```ts
      interface Params {
        type: string;
        data?: any
      }
      // 子应用一
      window?.postTileMsg(params: Params);

      // 子应用二
      const isWujie = window?.__POWERED_BY_WUJIE__;
      if (isWujie) {
        const { level } = window?.$wujie?.props || {};
        window?.onTileMsg((data, eventlevel) => {
          console.log(data, eventlevel, level);
        });
      }
      ```
    - 子应用 -> 瓦片
      ```ts
      interface Params {
        type: string;
        data?: any
      }
      // 子应用
      window?.postTileMsg(params: Params);

      // 瓦片
      function onAction(data, level) {
        // 判断层级。level: 事件触发所在层级 this.level: 当前瓦片所在层级
        if (this.level == level - 1) { 
          // data?.type 触发的事件类型
          if (['CreateItem'].includes(data?.type)) {
            this.reset();
          }
        }
      },
      ```
    - 瓦片 -> 子应用
      ```ts
      interface Params {
        type: string;
        data?: any
      }

      // 瓦片
      this.postTileMsg(params: Params);

      interface WujieParams {
        record: any | null; // 表单对象
        selectedRows: any[] | null; // 上级选中行
        relation: any | null; // 关系
        rootBasicClass: string | null; // 根基础类
        parentSelectedRows: any[] | null; // 祖先级选中行
        authBtns: any[] | null; // 权限按钮
      }

      // 子应用
      const isWujie = window?.__POWERED_BY_WUJIE__;
      if (isWujie) {
        // 从属性获取(parentVue 为瓦片实例, 可以直接调用实例方法)
        const { level, params: WujieParams, parentVue } = window?.$wujie?.props || {};

        // 监听事件获取
        window?.onTileMsg((data, eventlevel) => {
          console.log(data, eventlevel, level);
        });
      }
      ```
    - 瓦片 -> 瓦片
      ```ts
      interface Params {
        type: string;
        data?: any
      }
      // 瓦片
      this.postTileMsg(params: Params);

      // 瓦片
      function onAction(data, level) {
        // 判断层级。level: 事件处罚所在层级 this.level: 当前瓦片所在层级
        if (this.level == level - 1) { 
          // data?.type 触发的事件类型
          if (['CreateItem'].includes(data?.type)) {
            this.reset();
          }
        }
      },
      ```

  - iframe

    - 瓦片 -> 子应用
      ```ts
      interface WujieParams {
        record: any | null; // 表单对象
        selectedRows: any[] | null; // 上级选中行
        relation: any | null; // 关系
        rootBasicClass: string | null; // 根基础类
        parentSelectedRows: any[] | null; // 祖先级选中行
        authBtns: any[] | null; // 权限按钮
      }
      // iframe 通信参数
      gvUtil.appParams as WujieParams
      ```
    - 子应用 -> 瓦片
      ```ts
      interface Params {
        type: string;
        data?: any
      }

      gvUtil.postMsg(data: Params)
      // 例子：
      // 子应用： 
      gvUtil.postMsg({
        type: 'gvUtil.succss', 
        data: '操作成功',
        call: false
      })
      // 瓦片执行为： this.gvUtil.succss('操作成功')
      // 理论上按照上面的方式，可以调用this实例对象上的所有方法
      // 如果需要获取父应用 执行之后的返回值，需要将call设置为true
      // 设置为true之后 父应用方法执行成功后 会讲返回值 通过postMessage的方式返回给子应用, 子应用之需要判断类型 
      // 例子：
      // iframe 通信(src/utils/gvUtil.ts)
      window.addEventListener('message', function (event) {
        if (event.data.type == 'init' && event.data.from === 'lzos') {
          util.appParams = event.data.data;
          util.appOrigin = event.origin;
          return;
        }
        if (event.data.type == 'gvUtil.getLanguage' && event.data.from === 'lzos') {
          // iframe 通信获取语言包
          i18n.global.setLocaleMessage('en_us', event.data.data.en_us);
          i18n.global.setLocaleMessage('zh_cn', event.data.data.zh_cn);
          return;
        }
      });
      ```
  