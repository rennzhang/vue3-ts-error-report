import { fileURLToPath, URL } from 'node:url';
import { resolve, dirname } from 'node:path';
import { defineConfig, loadEnv } from 'vite';
import pkg from './package.json';
import type { Plugin } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import AutoImport from 'unplugin-auto-import/vite';
import { visualizer } from 'rollup-plugin-visualizer';
import compressPlugin from 'vite-plugin-compression';
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';
import Components from '@nancal/nancal-unplugin-vue-components/vite';
import { NDesignResolver } from '@nancal/nancal-unplugin-vue-components/resolvers';
import UnoCSS from 'unocss/vite';
import Pages from 'vite-plugin-pages';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const { VITE_APP_NGINX_VPATH_NAME, VITE_BASE_API, VITE_COMPRESSION } = loadEnv(mode, process.cwd());
  const lifecycle = process.env.npm_lifecycle_event;
  return {
    base: `/${VITE_APP_NGINX_VPATH_NAME}/`,
    plugins: [
      vue(),
      vueJsx(),
      Pages({
        dirs: ['src/apps'],
        exclude: ['**/Components/*.{vue,tsx}', '**/hooks/*.{vue,tsx,ts}'],
      }),
      UnoCSS(),
      VueI18nPlugin({
        include: resolve(dirname(fileURLToPath(import.meta.url)), './path/to/src/locales/**'),
      }),
      AutoImport({
        dts: 'types/auto-import.d.ts',
        include: [/\.[tj]sx?$/, /\.vue$/],
        imports: [
          'vue',
          'vue-router',
          'vue-i18n',
          'pinia',
          {
            '@/utils/storage': ['storage'],
          },
        ], // 自动导入vue和vue-router相关函数
        eslintrc: {
          enabled: true,
        },
      }),
      Components({
        dts: 'types/components.d.ts',
        dirs: ['src/components/common'],
        include: [/\.[tj]sx?$/, /\.vue$/],
        extensions: ['vue', 'tsx'],
        resolvers: [NDesignResolver({ importStyle: false, resolveIcons: true })],
      }),
      // 代码压缩
      codeCompressPlugin(VITE_COMPRESSION),
      // 打包分析
      lifecycle === 'report' ? visualizer({ open: true, brotliSize: true, filename: 'report.html' }) : null,
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '~': fileURLToPath(new URL('./public', import.meta.url)),
      },
    },
    server: {
      port: 4212,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      proxy: {
        '/front-svr/api/': {
          // target: 'http://192.168.5.60:13738/',
          target: 'http://192.168.50.178/',
          changeOrigin: true,
          rewrite: (url) => url.replace('/front-svr/api', ''),
          // bypass: () => {}
        },
        '/front-svr/levault/': {
          target: `${VITE_BASE_API}/`,
          changeOrigin: true,
          rewrite: (url) => url.replace('/front-svr', ''),
          // bypass: () => {}
        },
        '/levault': `${VITE_BASE_API}/`,
      },
    },
    optimizeDeps: {
      // 指定需要预构建的依赖
      include: Object.keys(pkg.dependencies),
    },
    build: {
      sourcemap: false,
      // 消除打包大小超过500kb警告
      chunkSizeWarningLimit: 4000,
      rollupOptions: {
        input: {
          index: fileURLToPath(new URL('./index.html', import.meta.url)),
        },
        // 静态资源分类打包
        output: {
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
        },
      },
    },
  };
});

// 代码压缩
function codeCompressPlugin(compress): Plugin | Plugin[] | null {
  if (compress === 'none') return null;
  const gz = {
    // 生成的压缩包后缀
    ext: '.gz',
    // 体积大于threshold才会被压缩
    threshold: 0,
    // 默认压缩.js|mjs|json|css|html后缀文件，设置成true，压缩全部文件
    filter: () => true,
    // 压缩后是否删除原始文件
    deleteOriginFile: false,
  };
  const br = {
    ext: '.br',
    algorithm: 'brotliCompress',
    threshold: 0,
    filter: () => true,
    deleteOriginFile: false,
  };
  const codeList = [
    { k: 'gzip', v: gz },
    { k: 'brotli', v: br },
    { k: 'both', v: [gz, br] },
  ];
  const plugins: Plugin[] = [];
  codeList.forEach((item) => {
    if (compress.includes(item.k)) {
      if (compress.includes('clear')) {
        if (Array.isArray(item.v)) {
          item.v.forEach((vItem) => {
            plugins.push(compressPlugin(Object.assign(vItem, { deleteOriginFile: true })));
          });
        } else {
          plugins.push(compressPlugin(Object.assign(item.v, { deleteOriginFile: true })));
        }
      } else {
        if (Array.isArray(item.v)) {
          item.v.forEach((vItem) => {
            plugins.push(compressPlugin(vItem));
          });
        } else {
          plugins.push(compressPlugin(item.v));
        }
      }
    }
  });

  return plugins;
}
