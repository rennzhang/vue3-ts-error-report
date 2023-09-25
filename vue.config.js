const path = require('path');
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const productionGzipExtensions = ['js', 'css'];

const isProd = process.env.NODE_ENV === 'production';

const getNginxPath = function () {
  let name = process.env.VUE_APP_NGINX_VPATH_NAME || '';
  if (!name.startsWith('/')) {
    name = `/${name}`;
  }
  if (!name.endsWith('/')) {
    name += '/';
  }
  return name;
};

let pluginsOptions = [
  new AntdDayjsWebpackPlugin({
    preset: 'antdv3',
  }),
];
if (isProd) {
  pluginsOptions.push(
    new CompressionWebpackPlugin({
      algorithm: 'gzip',
      test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
      threshold: 10240,
      minRatio: 0.8,
    })
  );
}
module.exports = {
  runtimeCompiler: true,
  publicPath: getNginxPath(),
  lintOnSave: false,
  devServer: {
    // wujie 配置端口和跨域
    port: 4211,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    proxy: {
      '/levault': {
        target: `${process.env.VUE_APP_BASE_API}/`,
        changeOrigin: true,
      },
    },
  },
  configureWebpack: {
    devtool: process.env.NODE_ENV == 'production' ? false : 'source-map',
    plugins: pluginsOptions,
    resolve: {
      alias: {
        '@': path.resolve('src'),
        '~': path.resolve('public'),
      },
    },
    performance: {
      hints: 'warning',
      // 入口起点的最大体积 整数类型（以字节为单位）
      maxEntrypointSize: 50000000,
      // 生成文件的最大体积 整数类型（以字节为单位 300k）
      maxAssetSize: 30000000,
      // 只给出 js 文件的性能提示
      assetFilter(assetFilename) {
        return assetFilename.endsWith('.js');
      },
    },
  },
};
