import path from 'path';
import { merge } from 'webpack-merge';

import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));


const PATHS = {
  src: path.join(__dirname, 'src'),
  build: path.join(__dirname, 'dist'),
};

const baseConfig = {
  mode: 'production',
  entry: path.join(PATHS.src, 'index.js'),
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
  optimization: {
    minimize: true,
  },
};

const config = [
  merge(baseConfig, {
    output: {
      path: PATHS.build,
      clean: {
        dry: false, // 是否模拟删除（不实际删除文件）
        keep: /\.c?js$/ // 正则表达式，匹配保留的文件
      },
      filename: 'index.mjs',
      library: {
        type: 'module',
      },
    },
    experiments: {
      outputModule: true // 启用实验性的 ES Module 输出支持
    },
  }),
  merge(baseConfig, {
    output: {
      path: PATHS.build,
      clean: {
        dry: false,
        keep: /\.m?js$/
      },
      filename: 'index.cjs',
      library: {
        type: 'commonjs2',
      },
    },
  }),
  merge(baseConfig, {
    output: {
      path: PATHS.build,
      clean: {
        dry: false,
        keep: /\.(cjs|mjs)$/
      },
      filename: 'index.js',
      library: {
        name: 'Enum',
        type: 'umd', // 采用通用模块定义
        export: 'default', // 兼容 ES6 的模块系统、CommonJS 和 AMD 模块规范
      },
      globalObject: 'this',
    },
  }),
];

export default config;
