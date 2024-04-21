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
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          }
        },
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.css', '.scss', '.less'],
    alias: {
      '@': path.join(__dirname, 'src'),
    }
  },
  mode: 'production',
  entry: path.join(PATHS.src, 'index.js'),
  output: {
    path: PATHS.build,
    filename: 'index.js',
    library: {
      name: 'Enum',
      type: 'umd', // 采用通用模块定义
      export: 'default', // 兼容 ES6 的模块系统、CommonJS 和 AMD 模块规范
    },
  },
  plugins: [
    new CleanWebpackPlugin(),
  ],
  optimization: {
    minimize: true,
  },
  externals: {},
};

export default config;
