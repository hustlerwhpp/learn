/* Проверка страницы курса в jsdom: рендер главного компонента React с засеянным
   localStorage. Сценарии: node scripts/verify-page.mjs empty | full
   empty — нет прогресса: витрина и углублённый блок видны, сертификатов нет.
   full  — прогресс 100% по обоим курсам: два блока «Ваш сертификат». */
import { execFileSync } from "node:child_process";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import Module from "node:module";
import { createRequire } from "node:module";
import { JSDOM } from "jsdom";

const scenario = process.argv[2] || "empty";
const root = process.cwd();
const out = mkdtempSync(path.join(tmpdir(), "learn-page-"));
const tsc = path.join(root, "node_modules", "typescript", "bin", "tsc");

execFileSync(
  process.execPath,
  [tsc, "-p", "scripts/tsconfig.verify.json", "--outDir", out],
  { stdio: "inherit" }
);

// Резолв алиаса @/ в скомпилированное дерево
const origResolve = Module._resolveFilename;
Module._resolveFilename = function (request, ...args) {
  if (request.startsWith("@/")) {
    const rel = request.slice(2);
    for (const cand of [rel + ".js", rel + "/index.js", rel]) {
      try {
        return origResolve.call(this, path.join(out, cand), ...args);
      } catch {
        /* следующий кандидат */
      }
    }
  }
  return origResolve.call(this, request, ...args);
};

const require = createRequire(import.meta.url);

// Собираем id всех уроков из скомпилированных модулей
const courseDir = path.join(out, "lib", "course");
const allIds = [];
for (const f of ["html.js", "css.js", "js.js", "final.js", "advanced.js"]) {
  const mod = require(path.join(courseDir, f));
  const m = Object.values(mod)[0];
  for (const l of m.lessons) allIds.push(l.id);
}

// jsdom-окружение до загрузки React
const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>", {
  url: "https://learn.local/",
  pretendToBeVisual: true,
});
const w = dom.window;
for (const key of [
  "window", "document", "navigator", "localStorage", "HTMLElement", "HTMLInputElement",
  "HTMLTextAreaElement", "Element", "Node", "Event", "CustomEvent", "MutationObserver",
  "getComputedStyle", "requestAnimationFrame", "cancelAnimationFrame", "history", "location",
]) {
  if (w[key] !== undefined) {
    try {
      Object.defineProperty(globalThis, key, { value: w[key], configurable: true, writable: true });
    } catch {
      /* глобал уже есть и достаточен */
    }
  }
}
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

if (scenario === "full") {
  const progress = {};
  for (const id of allIds) progress[id] = true;
  w.localStorage.setItem("whpp-learn-progress-v1", JSON.stringify(progress));
}

const React = require("react");
const { createRoot } = require("react-dom/client");
const Page = require(path.join(out, "app", "page.js")).default;

const container = w.document.createElement("div");
w.document.body.appendChild(container);
const reactRoot = createRoot(container);
await React.act(async () => {
  reactRoot.render(React.createElement(Page));
});
await React.act(async () => {
  await new Promise((r) => setTimeout(r, 120));
});

const text = container.textContent ?? "";
const html = container.innerHTML;
const checks = [];
const has = (label, needle, expect) => checks.push({ label, pass: text.includes(needle) === expect });

has("Витрина: заголовок «Чему вы научитесь»", "Чему вы научитесь", true);
has("Витрина: навык HTML", "Собирать страницы на HTML", true);
has("Витрина: навык CSS", "Оформлять на CSS", true);
has("Витрина: навык JavaScript", "Оживлять на JavaScript", true);
has("Витрина: финал — свой сайт", "Свой сайт в финале", true);
has("Витрина: карточка сертификатов", "Два сертификата — за каждый курс", true);
has("Углублённый блок: заголовок секции", "Второй уровень · по желанию", true);
has("Углублённый блок: темы (localStorage)", "localStorage", true);
has("Углублённый блок: урок про canvas", "Canvas: рисуем через JavaScript", true);
has("Углублённый блок: мини-проект", "Мини-проект: список дел", true);

const certCount = (html.match(/Ваш сертификат/g) || []).length;
if (scenario === "full") {
  checks.push({ label: "Сертификаты: ровно 2 блока при 100% обоих курсов", pass: certCount === 2 });
  has("Сертификаты: кнопка «Скачать PNG»", "Скачать PNG", true);
  has("Сертификаты: честная пометка про силу", "официальной силы у него нет", true);
  has("Прогресс углублённого: 10 из 10", "10 из 10 уроков", true);
} else {
  checks.push({ label: "Сертификатов нет без 100% прогресса", pass: certCount === 0 });
}

console.log(`=== СТРАНИЦА КУРСА, сценарий: ${scenario} ===`);
let failed = 0;
for (const c of checks) {
  console.log(`${c.pass ? "✓" : "✗"} ${c.label}`);
  if (!c.pass) failed++;
}
console.log(failed === 0 ? "Все проверки страницы зелёные." : `Провалов: ${failed}`);
if (failed) process.exitCode = 1;
