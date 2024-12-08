export const deepFreeze = (obj, dept = 0) => {
  Object.keys(obj).forEach(prop => {
    if (typeof obj[prop] === "object" && !Object.isFrozen(obj[prop])) {
      deepFreeze(obj[prop], dept + 1);
    }
  });
  Object.freeze(obj);
};

export const isEmpty = value => {
  return value === undefined || value === null || value === "";
};

// Enum的内置字段，不允许用来做key
export const BUILT_IN_FIELDS = ["length", "options", "filters"];

export const isMemberLegal = member => {
  if (typeof member !== "object" || member instanceof Array) {
    throw Error(`member must be a object instance, ${member} is illegal.`);
  }
  const memberStr = JSON.stringify(member);
  if (isEmpty(member.key)) {
    throw Error(`member must have a "key" property, and empty string is not allowed. ${memberStr} is illegal.`);
  }
  if (typeof member.key !== "string") {
    throw Error(`member.key can only be a string, ${memberStr} is illegal.`);
  }
  if (BUILT_IN_FIELDS.indexOf(member.key) > -1) {
    throw Error(`member.key do not allow the use of built-in fields, eg: ${BUILT_IN_FIELDS.join("/")}`);
  }
  if (!member.key.match(/^[A-Za-z0-9_-]+$/)) {
    throw Error(`member.key can only consist of letters, numbers, underscores and dashes, ${memberStr} is illegal.`);
  }
  if (member.key.startsWith("__")) {
    throw Error(`member.key cannot start with '__', which is generally used for built-in attributes, ${memberStr} is illegal.`);
  }
  if (member.value === undefined || member.value === null) {
    throw Error(`member must have a "value" property, undefined/null is not allowed. ${memberStr} is illegal.`);
  }
  if (member.label === null || member.label === "") {
    // label是允许不定义的
    throw Error(`member.label best type is string, and empty string is not allowed. ${memberStr} is illegal.`);
  }
};
