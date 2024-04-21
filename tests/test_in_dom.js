/**
 * @jest-environment jsdom
 */
import { test, expect, describe, afterEach } from '@jest/globals';
import path from 'path';

import Enum from '../src/index.js';


describe('test register in jsdom', () => {
  afterEach(() => {
    delete window.Enum;
  });
  test('test enum register in jsdom', () => {
    expect(window.Enum).toBeUndefined();
    Enum.register();
    expect(window.Enum).toBe(Enum);

    expect(window.JsEnum).toBeUndefined();
    Enum.register('JsEnum');
    expect(window.JsEnum).toBe(Enum);
  });
});

describe('test load script in html', () => {
  afterEach(() => {
    delete window.Enum;
  });
  test('test using Enum in html script tags', function () {
    expect(window.Enum).toBeUndefined();
    const tag = document.createElement('script');
    tag.type = 'text/javascript';
    tag.src = path.resolve(__dirname, 'test.html');
    tag.onload = () => {
      expect(window.Enum).toBeDefined();
    };
    document.body.appendChild(tag);
  });
});
