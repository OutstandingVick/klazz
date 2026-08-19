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

test("landing sections collapse safely across tablet and phone widths", () => {
  assert.match(css, /@media \(max-width: 900px\)[\s\S]*?\.landing-problem-lead\s*\{[\s\S]*?grid-template-columns:\s*minmax\(0, 1fr\)/);
  assert.match(css, /@media \(max-width: 760px\)[\s\S]*?\.landing-nav-links a:not\(\.landing-nav-cta\)\s*\{\s*display:\s*none/);
  assert.match(css, /@media \(max-width: 680px\)[\s\S]*?\.pd-trace-row\s*\{[\s\S]*?grid-template-columns:\s*max-content minmax\(0, 1fr\)/);
  assert.match(css, /@media \(max-width: 480px\)[\s\S]*?\.landing-hydra-flow\s*\{\s*grid-template-columns:\s*minmax\(0, 1fr\)/);
  assert.match(css, /@media \(max-width: 480px\)[\s\S]*?\.landing-close-btn\s*\{\s*width:\s*100%/);
});

test("long product and landing content can wrap on narrow screens", () => {
  assert.match(css, /\.pd-input,[\s\S]*?\.pd-trace-row\s*\{[\s\S]*?overflow-wrap:\s*anywhere/);
  assert.match(css, /\.landing-close-title\s*\{[\s\S]*?overflow-wrap:\s*anywhere/);
  assert.match(css, /\.landing-close-cue\s*\{[\s\S]*?flex-wrap:\s*wrap/);
});
