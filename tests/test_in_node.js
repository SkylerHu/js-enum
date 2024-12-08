/**
 * @jest-environment node
 */
import { test, expect } from "@jest/globals";

import Enum from "../src/index.js";

test("test enum register in nodejs", () => {
  expect(global.Enum).toBeUndefined();
  Enum.register();
  expect(global.Enum).toBe(Enum);

  expect(global.JsEnum).toBeUndefined();
  Enum.register("JsEnum");
  expect(global.JsEnum).toBe(Enum);
});
