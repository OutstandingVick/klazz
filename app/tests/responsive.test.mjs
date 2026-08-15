import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

test("defines tablet, mobile, and narrow-mobile layouts", () => {
  for (const breakpoint of ["max-width:900px", "max-width:720px", "max-width:480px"]) {
    assert.match(css, new RegExp(breakpoint.replace(/[()]/g, "\\$&")));
  }
});

test("protects narrow layouts from horizontal overflow", () => {
  assert.match(css, /min-width:320px/);
  assert.match(css, /overflow-x:hidden/);
  assert.match(css, /grid-template-columns:1fr/);
});
