import { test, expect, describe } from '@jest/globals';

import Enum from '../src/index.js';


describe('test Enum use Color', () => {
  const members = [
    { key: 'RED', value: 'red', label: '红色' },
    { key: 'GREEN', value: 'green', label: '绿色' },
  ];
  const Color = new Enum(members);

  test('initialize an enum object using an array', () => {
    expect(Color instanceof Enum).toBeTruthy();

    expect(Color.length).toBe(members.length);
    // 测试属性
    expect(Color.RED).toBe('red');
    expect(Color.GREEN).toBe('green');
    expect(Color.red).toBeUndefined();
    // 判断枚举值，在定义的value中是否存在
    expect(Color.has('red')).toBeTruthy();
    expect(Color.has('Red')).toBeFalsy();
    expect(Color.has('GREEN')).toBeFalsy();

    // 测试其他方法
    const member = Color.getMember(Color.RED);
    expect(member).toBeDefined();
    expect(member.value).toBe(Color.RED);
    expect(member.key).toBe('RED');
    expect(member.label).toBe('红色');
    expect(member.label).toBe(Color.getLabel(member.value));

    // 根据value获取label展示
    expect(Color.getLabel(Color.RED)).toBe('红色');
    // 若是value不存在，则直接返回原值
    expect(Color.getMember('yellow')).toBeUndefined();
    expect(Color.getLabel('yellow')).toBe('yellow');
  });

  test('test enum object iterator function', () => {
    // 遍历属性
    expect(Object.keys(Color)).toStrictEqual(['RED', 'GREEN']);
    const tmpKeys = [];
    for (const key in Color) {
      tmpKeys.push(key);
    }
    expect(tmpKeys).toStrictEqual(['RED', 'GREEN']);

    // 迭代对象
    const tmpMembers = [];
    for (const member of Color) {
      tmpMembers.push(member);
    }
    expect(tmpMembers).toStrictEqual(members);
    expect([...Color]).toStrictEqual(members);

    expect(Color.map(member => member.value)).toStrictEqual(['red', 'green']);
    expect(Color.map(member => member.value)).toStrictEqual(['red', 'green']);
    expect(Color.map(member => member.key)).toStrictEqual(['RED', 'GREEN']);
    expect(Color.filter(member => member.value === 'red')).toStrictEqual([Color.getMember('red')]);
    Color.forEach((member, idx) => {
      if (idx === 0) {
        expect(member).toStrictEqual(Color.getMember('red'));
      } else {
        expect(member).toStrictEqual(Color.getMember('green'));
      }
    });
  });

  test('test the application of Enum on components, such as options and filters', () => {
    expect(Color.toJSON()).toStrictEqual(members);
    expect(JSON.stringify(Color)).toStrictEqual(JSON.stringify(members));
    // 必须有字段存在
    expect(Color.options.filter(item => 'key' in item && 'value' in item && 'label' in item).length).toBe(members.length);
    expect(Color.filters.filter(item => 'key' in item && 'value' in item && 'label' in item).length).toBe(members.length + 1);
    expect(Color.to_filters().filter(item => 'key' in item && 'value' in item && 'text' in item).length).toBe(members.length);
  });

  test('test Enum object is read-only', () => {
    const member = Color.getMember(Color.RED);

    // cat not set property
    expect(() => {
      Color.RED = {};
    }).toThrow(/Cannot assign to read only property/);
    expect(() => {
      member.key += 'v2';
    }).toThrow(/Cannot assign to read only property/);
    expect(() => {
      member.value += 'v2';
    }).toThrow(/Cannot assign to read only property/);
    expect(() => {
      member.label += 'v2';
    }).toThrow(/Cannot assign to read only property/);

    // cat not delete property
    expect(() => {
      delete Color.RED;
    }).toThrow(/Cannot delete property/);
    expect(() => {
      delete member.key;
    }).toThrow(/Cannot delete property/);

    // cat not add property
    expect(Color.YELLOW).toBeUndefined();
    expect(() => {
      Color.YELLOW = 'yellow';
    }).toThrow(/Cannot add property/);

  });
});

test('init an Enum object with options', () => {
  // set freez = false
  const Color = new Enum([{ key: 'RED', value: 'red', label: '红色' }], { freez: false });
  const member = Color.getMember(Color.RED);
  expect(member.value).toBe('red');
  member.value += 'v2';
  expect(member.value).not.toBe('red');
  expect(member.value).toBe('redv2');
});

test('init an enum object using an object', () => {
  const data = { 'red': 'red', 'Green': 'green', 'yellow-0_1': 'yellow' };
  const keys = Object.keys(data);
  const Color = new Enum(data);
  // key字母都会转成大写
  expect(Color.map(member => member.key)).toStrictEqual(keys);
  expect(Color.RED).toBeUndefined();
  expect(Color.Green).toBe('green');
  // 字段形式初始化无label
  expect(Color.toJSON().filter(item => 'key' in item && 'value' in item && !('label' in item)).length).toBe(keys.length);
  // 但是options和filter中label存在
  expect(Color.options.filter(item => 'key' in item && 'value' in item && 'label' in item).length).toBe(keys.length);
  expect(Color.filters.filter(item => 'key' in item && 'value' in item && 'label' in item).length).toBe(keys.length + 1);

});

test('test other uses of Enum', () => {
  const Color = new Enum([
    { key: 'RED', value: 'red', label: '红色', disabled: true, color: '#f00' },
    { key: 'GREEN', value: 'green', label: '绿色', extra: { msg: '其他信息' }, color: '#0f0' },
  ]);
  const red = Color.getMember(Color.RED);
  expect(red.color).toBe('#f00');
  expect(red.extra).toBeUndefined();
  const green = Color.getMember(Color.GREEN);
  expect(green.extra).toBeDefined();
});
