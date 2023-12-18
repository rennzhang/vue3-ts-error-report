import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import pkg from './package.json';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import AutoImport from 'unplugin-auto-import/vite';
import UnoCSS from 'unocss/vite';
import Pages from 'vite-plugin-pages';

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    base: `/`,
    plugins: [
      vue(),
      vueJsx(),
      Pages({
        dirs: ['src/apps'],
        exclude: ['**/Components/*.{vue,tsx}', '**/hooks/*.{vue,tsx,ts}'],
      }),
      UnoCSS(),
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
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
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
