import path from 'path';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';

import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));


const PATHS = {
  src: path.join(__dirname, 'src'),
  build: path.join(__dirname, 'dist'),
};

const config = {
  mode: 'production',
  // devtool: 'source-map',
  entry: path.join(PATHS.src, 'index.js'),
  output: {
    path: PATHS.build,
    clean: true,
    filename: 'index.js',
    library: {
      name: 'Enum',
      type: 'umd', // 采用通用模块定义
      export: 'default', // 兼容 ES6 的模块系统、CommonJS 和 AMD 模块规范
    },
    globalObject: 'this',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/, //排除node_modules文件夹
        enforce: 'pre', //提前加载使用
        use: { //使用eslint-loader解析
          loader: 'eslint-loader'
        }
      },
      {
        // 使用 babel-loader 来编译处理 js 和 jsx 文件
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
  ],
  optimization: {
    minimize: true,
  },
};

export default config;
