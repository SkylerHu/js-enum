# 前言
主要是给开发者阅读，描述开发前后需要注意的一些事项。

# 开发环境

    node: ^14.21.3

常用命令：
- 安装依赖`npm install .`
- 代码格式`npm run lint`
- 测试用例`npm run test`
- 构建`npm run build`
- 发版`npm publish`

# 提交Pull Request
提交Pull Request之前需要检查以下事项是否完成：
- 需包含测试用例，并通过`make test`
- 测试覆盖度要求 `100%`
- 本地构建 `make dist`，输出文件`dist/index.js`

makefile中依赖`jq`命令，MacOS系统通过brew安装即可`brew install jq`.

# 打包发版

  make release
