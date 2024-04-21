import { deepFreeze, isMemberLegal, isEmpty } from './utils.js';

export default class Enum {
  #members = [];
  #allDefaultValue = null;
  /**
   *
   * @param data 通过值初始化枚举，格式json/array
   * @param options 格式json
   */
  constructor(data, {
    freez = true, // 冻结数据
    allDefaultValue = { key: '__ALL', value: '', label: '全部' },
  } = {}) {
    this.#allDefaultValue = allDefaultValue;

    const members = [];
    if (data instanceof Array) {
      data.forEach(member => {
        isMemberLegal(member);
        members.push(member);
      });
    } else if (typeof data === 'object') {
      Object.keys(data).forEach(key => {
        const member = { key, value: data[key] };
        isMemberLegal(member);
        members.push(member);
      });
    } else {
      throw Error(`Failed to initialize enum, ${JSON.stringify(data)} wrong format`);
    }
    // 检查是否有重复的key
    const _keys = [];
    members.forEach(member => {
      if (_keys.indexOf(member.key) > -1) {
        throw Error(`Initialization members does not allow duplicate keys, key=${member.key} is duplicated.`);
      }
      _keys.push(member.key);
      // 赋值
      this[member.key] = member.value;
    });
    if (_keys.length === 0) {
      throw Error('No member of the Enum is defined in the form {key, value, label}, The Enum has at least one member');
    }

    this.#members = members;
    Object.defineProperty(this, 'options', {
      enumerable: false,
      configurable: false,
      writable: false,
      value: this.getOptions({ enableAll: false }),
    });
    Object.defineProperty(this, 'filters', {
      enumerable: false,
      configurable: false,
      writable: false,
      value: this.getOptions(),
    });
    if (freez) {
      deepFreeze(this.#members);
      deepFreeze(this.#allDefaultValue);
      deepFreeze(this);
    }
  }

  get length () { return this.#members.length; }
  map (callback) { return this.#members.map(callback); }
  forEach (callback) { return this.#members.forEach(callback); }
  filter (callback) { return this.#members.filter(callback); }

  getMember (value) {
    const info = this.#members.filter(member => member.value === value);
    if (info.length > 0) {
      return info[0];
    }
    return undefined;
  }

  /**
   *  判断枚举值value 是否 属于定义的实例
   * @param value
   * @returns {boolean}
   */
  has (value) {
    return this.getMember(value) !== undefined;
  }

  getLabel (value) {
    const member = this.getMember(value);
    return this.#getMemberLabel(member, value);
  }

  #getMemberLabel (member, defaultValue = '') {
    if (!member) {
      return defaultValue;
    }
    if (isEmpty(member.label)) {
      return member.value;
    }
    return member.label;
  }

  toJSON () {
    return this.#members;
  }

  /**
   * 转换成ant design/element中表格table组件filters需要的刷选条件
   * @param options
   * @returns {{key: *}[]}
   */
  to_filters (options = {}) {
    return this.getOptions({ enableAll: false, keyLabel: 'text', ...options });
  }


  /**
   * 返回 单选框、多选框、选择器、表格等前端组件 所需要的枚举列表值
   * @returns {{key: *}[]}
   */
  getOptions ({
    enableAll = true, // 主要用于下拉选项组件“全部”的场景
    keyValue = 'value',
    keyLabel = 'label',
    allDefaultValue = null,
  } = {}) {
    const allValue = { ...this.#allDefaultValue, ...allDefaultValue };
    let options = this.#members.map(member => ({
      ...member,
      [keyValue]: member.value,
      [keyLabel]: this.#getMemberLabel(member),
    }));
    if (enableAll) {
      const specialMember = {
        ...allValue,
        [keyValue]: allValue.value,
        [keyLabel]: allValue.label,
      };
      options = [specialMember].concat(options);
    }
    return options;
  }

  [Symbol.iterator] () {
    let index = 0;
    return {
      next: () => index < this.#members.length ? { done: false, value: this.#members[index++] } : { done: true }
    };
  }

  /**
   * 将类注册到全局使用
   * @param key
   */
  static register(key = 'Enum') {
    if (typeof window !== 'undefined' && !window[key]) {
      window[key] = Enum;
    }
    if (typeof global !== 'undefined' && !global[key]) {
      global[key] = Enum;
    }
  }
}
