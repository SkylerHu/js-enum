# js-enumerate

[![NPM Version](https://img.shields.io/npm/v/js-enumerate)](https://github.com/SkylerHu/js-enum)
[![GitHub Actions Workflow Status](https://github.com/SkylerHu/js-enum/actions/workflows/test.yml/badge.svg?branch=master)](https://github.com/SkylerHu/js-enum)
[![Coveralls](https://img.shields.io/coverallsCoverage/github/SkylerHu/js-enum)](https://github.com/SkylerHu/js-enum)
[![GitHub License](https://img.shields.io/github/license/SkylerHu/js-enum)](https://github.com/SkylerHu/js-enum)


Enum is a javascript enumeration module. It works with Node.js and the browser.

构建Enum对象在JavaScript中使用，可用于枚举定义，前端组件单选、多选等的options选项的定义。

## 1. 安装

可查看版本变更记录[ChangeLog](./docs/CHANGELOG-1.x.md)

### 1.1 NodeJS

	npm install js-enumerate

```javascript
import * as Enum from 'js-enumerate';

new Enum([
  { key: 'RED', value: 'red', label: '红色' },
  { key: 'GREEN', value: 'green', label: '绿色' },
]);
// 也可使用字典构造
new Enum({
  Red: 'red',
  green: 'green',
});
```

### 1.2 Bower

```html
<script src="releases/js-enumerate-latest.min.js"></script>
<script>
    new Enum([{ key: 'RED', value: 'red', label: '红色' }]);
</script>
```

> ps: 可自行将[releases/js-enumerate-latest.min.js](./releases/js-enumerate-latest.min.js)文件上传到CDN、或者拷贝到项目里引用。

## 2. 使用(Usage)

### 2.1 构造函数(constructor)

    new Enum(data, options)

参数说明：

| 参数 | 类型 | 说明 | 默认值 | 版本 |
| - | - | - | - | - |
| data | array/object | 初始化枚举成员 | | |
| options | object | 配置选项 | | |

options参数说明

| 参数 | 类型 | 说明 | 默认值 | 版本 |
| - | - | - | - | - |
| freez | bool | 初始化枚举成员,只读不允许修改 | true |  |
| allDefaultValue | object | 定义刷选默认"全部"的场景 | { key: '__ALL', value: '', label: '全部' } |  |


### 2.2 全局注册register
```javascript
// 在nodejs中定义 global.Enum
// 在浏览器中定义 window.Enum
Enum.register();
// 可以通过key更改对象的名称
Enum.register("JsEnum"); // window.JsEnum
```

### 2.3 基础用法
```javascript
const Color = new Enum([
  { key: 'RED', value: 'red', label: '红色' },
  { key: 'GREEN', value: 'green', label: '绿色' },
]);
// 使用成员值
Color.RED // 'red'
Color.GREEN // 'green'
// 成员个数
Color.length // 2

Color.toJSON(); // 返回数组 [{"key":"RED","value":"red","label":"红色"},{"key":"GREEN","value":"green","label":"绿色"}]
JSON.stringify(Color); // 返回字符串 '[{"key":"RED","value":"red","label":"红色"},{"key":"GREEN","value":"green","label":"绿色"}]'

// 获取成员
const member = Color.getMember('red'); // 返回单个成员对象 {"key":"RED","value":"red","label":"红色"}
member.value === 'red'; // true
member.key; // 'RED'
member.label; // '红色'
Color.getLabel(Color.RED); // '红色'

// 判断枚举值是否合法
Color.has('red'); // true
Color.has('yellow'); // false

// map，forEach和filter函数都可直接使用
Color.map(member => member.label); // ['红色', '绿色']
// 属性成员来自定义枚举的key
Object.keys(Color); // ['RED', 'GREEN']
// 用in是遍历keys
for (const key in Color) {
  console.log(key);
}
// 用of是遍历成员对象
for (const member of Color) {
  console.log(member);
}

// 使用字典构造
const ColorV2 = new Enum({
  Red: 'red',
  green: 'green',
});
ColorV2.toJSON(); // [{"key":"Red","value":"red"},{"key":"blue","value":"blue"}]
// 注意区分大小写，字典属性字段为成员的key
ColorV2.Red // 'red'
ColorV2.green // 'green'
```

### 2.4 前端组件中使用
使用`React + Ant Design`举例：
```jsx
import React from 'react';
import { Select, Radio, Table } from 'antd';
// 可以直接在index.js入口文件中执行Enum.register()，即可全局使用；
import Enum from 'js-enumerate';

const Color = new Enum([
  { key: 'RED', value: 'red', label: '红色' },
  { key: 'GREEN', value: 'green', label: '绿色' },
]);
// 依次应用于 下拉选项、单选框、表格字段的筛选菜单项
const App = () => (
  <>
    {/*使用filters可以选择“全部”*/}
    <Select defaultValue={Color.RED} options={Color.filters} />
    <Radio.Group defaultValue={Color.GREEN} options={Color.options} />
    <Table colums={[{ key: 'color', title: '颜色', filters: Color.to_filters() }]}/>
  </>
);
```

### 2.5 其他扩展用法
```javascript
const Color = new Enum([
  { key: 'RED', value: 'red', label: '红色', disabled: true, color: '#f00' },
  { key: 'GREEN', value: 'green', label: '绿色', extra: { msg: '其他信息' }, color: '#0f0' },
]);
const redMem = Color.getMember(Color.RED);
redMem.disabled // true
redMem.color // '#f00'
const greenMem = Color.getMember(Color.GREEN);
greenMem.extra // { msg: '其他信息' }

// 以下非读操作会报错
Color.RED = 'red-v2'; // Throws Error
delete Color.RED; // Throws Error
redMem.label = '大红色'; // Throws Error

// 可以通过 options.freez 不冻结枚举实例
// 但不建议这么使用，容易出现不可预期的事情
const ColorEdit = new Enum([
  { key: 'RED', value: 'red', label: '红色' },
  { key: 'GREEN', value: 'green', label: '绿色' },
], { freez: false });
const redEdit = ColorEdit.getMember(ColorEdit.RED);
redEdit.label // '红色'
redEdit.label = '大红色' // true
redEdit.label // '大红色'
```

### 2.6 内置属性
- `length` 枚举实例所有成员个数
- `options` 可用于下拉选择的数组数据
- `filters` 可用于刷选的数组数据，比options多一个`value=''`的成员

### 2.7 Enum object API
- `forEach`,`map`,`filter` 这三个方法是对枚举成员迭代器进行遍历操作
- `getMember(value)` 通过value获取成员对象
- `has(value)` 值value是否在枚举定义的成员当中
- `getLabel(value)` 通过value获取成员label用于展示
- `to_filters()` 转换成ant design/element中表格table组件filters需要的刷选条件
- `getOptions(option = {})` 根据所有成员信息返回数组数据
- `Enum.register(key = 'Enum')`类的静态方法，用于全局注册对象

### 2.8 其他注意事项
- 成员key属性只能由数字、大小写字母、中横线、下划线组成的`字符串`，且不能以`__`开头；
- 成员key属性不能使用内置属性字符串，例如`length/options/filters`不能使用；
- 成员`value`不能为`null`和`undefined`；
- 成员`label`不能为`null`和`''`；
- 枚举实例成员默认都被`freez`冻结，不允许修改；


## 3. 推荐
- 若是后端是Python语言，推荐 [py-enum](https://github.com/SkylerHu/py-enum) 配合该lib一起使用
