import { test, expect } from '@jest/globals';

import Enum from '../src/index.js';
import { BUILT_IN_FIELDS } from '../src/utils.js';


test('test init Enum with illegal data', () => {
  // test create enum instance
  [0, false, 'key', ['key']].forEach(value => {
    expect(() => {
      new Enum([value]);
    }).toThrow(/member must be a object instance/);
  });
  expect(() => {
    new Enum('test');
  }).toThrow(/Failed to initialize enum/);
  expect(() => {
    new Enum([{ key: 'test', value: 'test', label: 'test' }, { key: 'test', value: 'test', label: 'test' }]);
  }).toThrow(/does not allow duplicate keys/);
  expect(() => {
    new Enum([]);
  }).toThrow(/The Enum has at least one member/);

  // test member.key
  expect(() => {
    new Enum([{ value: 'test', label: 'test' }]);
  }).toThrow(/member must have a "key" property/);
  expect(() => {
    new Enum([{ key: '', value: 'test', label: 'test' }]);
  }).toThrow(/empty string is not allowed/);
  [0, true, {}, []].forEach(key => {
    expect(() => {
      new Enum([{ key, value: 'test', label: 'test' }]);
    }).toThrow(/member.key can only be a string/);
  });
  BUILT_IN_FIELDS.forEach(key => {
    expect(() => {
      new Enum([{ key, value: 'test', label: 'test' }]);
    }).toThrow(/member.key do not allow the use of built-in fields/);
  });
  ['中文', 'ab/', 'd,', 'd.', 'a b'].forEach(key => {
    expect(() => {
      new Enum([{ key, value: 'test', label: 'test' }]);
    }).toThrow(/member.key can only consist of letters, numbers, underscores and dashes/);
  });
  expect(() => {
    new Enum([{ key: '__test', value: 'test', label: 'test' }]);
  }).toThrow(/cannot start with/);

  // test member.value
  [null, undefined].forEach(value => {
    expect(() => {
      new Enum([{ key: 'test', value, label: 'test' }]);
    }).toThrow(/member must have a "value" property/);
  });

  // test member.label
  [null, ''].forEach(label => {
    expect(() => {
      new Enum([{ key: 'test', value: 'test', label }]);
    }).toThrow(/member.label best type is string/);
  });
});
