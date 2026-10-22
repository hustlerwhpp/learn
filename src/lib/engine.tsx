"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import type { Block, Lesson } from "./course/types";

/* ---------- rich text: **жирный** и `код` ---------- */

export function rich(text: string): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-zinc-900 dark:text-zinc-50">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={i}
          className="rounded-md bg-violet-100 px-1.5 py-0.5 font-mono text-[0.85em] font-medium text-violet-900 dark:bg-violet-950/70 dark:text-violet-200"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

/* ---------- блоки теории ---------- */

export function TheoryBlock({ block }: { block: Block }) {
  switch (block.t) {
    case "h":
      return <h3 className="mt-7 text-lg font-bold text-zinc-900 first:mt-0 dark:text-zinc-50">{block.text}</h3>;
    case "p":
      return <p className="mt-3 leading-relaxed text-zinc-600 dark:text-zinc-300">{rich(block.text)}</p>;
    case "list":
      return (
        <ul className="mt-3 list-disc space-y-1.5 pl-5 leading-relaxed text-zinc-600 marker:text-violet-500 dark:text-zinc-300">
          {block.items.map((item, i) => (
            <li key={i}>{rich(item)}</li>
          ))}
        </ul>
      );
    case "code":
      return (
        <figure className="mt-3">
          <pre className="overflow-x-auto rounded-2xl bg-zinc-950 p-4 font-mono text-[13px] leading-relaxed text-zinc-100">
            {block.code}
          </pre>
          {block.caption && <figcaption className="mt-1.5 text-xs text-zinc-400">{block.caption}</figcaption>}
        </figure>
      );
    case "note":
      return (
        <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-100">
          💡 {rich(block.text)}
        </div>
      );
  }
}

/* ---------- живой пример ---------- */

export function ExampleBlock({ code, caption }: { code: string; caption?: string }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-zinc-200 dark:border-zinc-800">
      <div className="grid md:grid-cols-2">
        <pre className="max-h-80 overflow-auto bg-zinc-950 p-4 font-mono text-[12.5px] leading-relaxed text-zinc-100">
          {code}
        </pre>
        <div className="flex flex-col bg-white dark:bg-zinc-900">
          <div className="border-b border-zinc-100 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-zinc-400 dark:border-zinc-800">
            Результат
          </div>
          <iframe title="Пример" srcDoc={code} className="min-h-40 w-full flex-1 bg-white" sandbox="allow-scripts" />
        </div>
      </div>
      {caption && <div className="bg-zinc-50 px-4 py-2 text-xs text-zinc-500 dark:bg-zinc-950 dark:text-zinc-400">{caption}</div>}
    </div>
  );
}

/* ---------- задание с редактором и автопроверкой ----------

   Практика устроена в две колонки: слева редактор, справа — предпросмотр.
   Предпросмотр ЖИВОЙ: код ученика попадает в iframe автоматически, с небольшим
   дебаунсом после каждого изменения, отдельной кнопки «Запустить» нет.

   ВАЖНО про sandbox: нужны ОБА флага — allow-scripts и allow-same-origin.
   Без allow-same-origin документ в srcDoc получает непрозрачный origin, и
   родительская страница не может прочитать iframe.contentDocument (он null) —
   из-за этого автопроверка в реальном браузере молча не работала, а скриптам
   ученика был запрещён localStorage. Скрипты при этом выполняются и с одним
   allow-scripts, поэтому поломка выглядела как «превью мёртвое». */

export function TaskBlock({ lesson, onComplete }: { lesson: Lesson; onComplete: (id: string) => void }) {
  const [code, setCode] = useState(lesson.task.starter);
  const [preview, setPreview] = useState(lesson.task.starter);
  const [results, setResults] = useState<boolean[] | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [passed, setPassed] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const pendingCheck = useRef(false);

  useEffect(() => {
    setCode(lesson.task.starter);
    setPreview(lesson.task.starter);
    setResults(null);
    setShowHint(false);
    setShowSolution(false);
    setPassed(false);
  }, [lesson.id, lesson.task.starter]);

  // Живое обновление предпросмотра: 300 мс после последнего изменения кода.
  useEffect(() => {
    const t = setTimeout(() => setPreview(code), 300);
    return () => clearTimeout(t);
  }, [code]);

  const runChecks = useCallback(() => {
    const iframe = iframeRef.current;
    const doc = iframe?.contentDocument;
    const win = iframe?.contentWindow;
    if (!doc || !win) return;
    try {
      const res = lesson.task.checks.map((c) => {
        try {
          return !!c.run(doc, win as unknown as Window);
        } catch {
          return false;
        }
      });
      setResults(res);
      if (res.every(Boolean)) {
        setPassed(true);
        onComplete(lesson.id);
      }
    } catch {
      /* iframe ещё не готов */
    }
  }, [lesson, onComplete]);

  const handleLoad = () => {
    if (pendingCheck.current) {
      pendingCheck.current = false;
      setTimeout(runChecks, 60);
    }
  };

  const check = () => {
    // Мгновенно применяем текущий код (не ждём дебаунс) и проверяем после загрузки.
    pendingCheck.current = true;
    setPreview(code);
    // если srcDoc не изменился, onLoad может не сработать — подстраховки
    setTimeout(() => {
      if (pendingCheck.current) {
        pendingCheck.current = false;
        runChecks();
      }
    }, 500);
    setTimeout(() => {
      if (pendingCheck.current) {
        pendingCheck.current = false;
        runChecks();
      }
    }, 1400);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-violet-200 bg-violet-50 p-4 dark:border-violet-900/60 dark:bg-violet-950/30">
        <div className="text-sm font-bold uppercase tracking-wide text-violet-700 dark:text-violet-300">🎯 Задание</div>
        <div className="mt-1 leading-relaxed text-zinc-700 dark:text-zinc-200">{rich(lesson.task.brief)}</div>
      </div>

      <div className="grid items-start gap-4 lg:grid-cols-2">
        <div className="overflow-hidden rounded-3xl border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between bg-zinc-900 px-4 py-2">
            <span className="font-mono text-xs text-zinc-400">index.html — редактируйте код</span>
            <button
              type="button"
              onClick={() => {
                setCode(lesson.task.starter);
                setPreview(lesson.task.starter);
                setResults(null);
                setPassed(false);
              }}
              className="text-xs font-medium text-zinc-400 transition hover:text-white"
            >
              ↺ Сбросить
            </button>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Tab") {
                e.preventDefault();
                const ta = e.currentTarget;
                const start = ta.selectionStart;
                const end = ta.selectionEnd;
                const next = code.slice(0, start) + "  " + code.slice(end);
                setCode(next);
                requestAnimationFrame(() => {
                  ta.selectionStart = ta.selectionEnd = start + 2;
                });
              }
            }}
            spellCheck={false}
            className="block h-[26rem] w-full resize-y bg-zinc-950 p-4 font-mono text-[13px] leading-relaxed text-zinc-100 outline-none lg:h-[30rem]"
          />
        </div>

        <div className="overflow-hidden rounded-3xl border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between border-b border-zinc-100 bg-white px-4 py-2 dark:border-zinc-800 dark:bg-zinc-900">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">Предпросмотр вашей страницы</span>
            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">обновляется при вводе</span>
          </div>
          <iframe
            ref={iframeRef}
            title="Предпросмотр"
            srcDoc={preview}
            onLoad={handleLoad}
            className="h-[26rem] w-full bg-white lg:h-[30rem]"
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={check}
          className="rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500"
        >
          ✓ Проверить задание
        </button>
        <button
          type="button"
          onClick={() => setShowHint((v) => !v)}
          className="rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          💡 Подсказка
        </button>
        <button
          type="button"
          onClick={() => setShowSolution((v) => !v)}
          className="rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          👀 Решение
        </button>
      </div>

      {showHint && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-100">
          {rich(lesson.task.hint)}
        </div>
      )}

      {showSolution && (
        <div className="space-y-2">
          <pre className="max-h-80 overflow-auto rounded-2xl bg-zinc-950 p-4 font-mono text-[12.5px] leading-relaxed text-zinc-100">
            {lesson.task.solution}
          </pre>
          <button
            type="button"
            onClick={() => setCode(lesson.task.solution)}
            className="text-sm font-medium text-violet-600 hover:underline dark:text-violet-400"
          >
            Вставить решение в редактор
          </button>
        </div>
      )}

      {results && (
        <div
          className={`rounded-3xl border p-4 ${
            passed
              ? "border-emerald-200 bg-emerald-50 dark:border-emerald-900/60 dark:bg-emerald-950/30"
              : "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
          }`}
        >
          <div className="font-bold text-zinc-900 dark:text-zinc-50">
            {passed ? "🎉 Задание выполнено! Урок засчитан." : "Проверка:"}
          </div>
          <ul className="mt-2 space-y-1.5">
            {lesson.task.checks.map((c, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span>{results[i] ? "✅" : "⬜"}</span>
                <span className={results[i] ? "text-zinc-700 dark:text-zinc-200" : "text-zinc-500 dark:text-zinc-400"}>{c.label}</span>
              </li>
            ))}
          </ul>
          {!passed && <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Поправьте код — предпросмотр обновится сам — и проверьте ещё раз. Если тупик — загляните в подсказку.</p>}
        </div>
      )}
    </div>
  );
}

/* ---------- полный урок ---------- */

export function LessonView({ lesson, onComplete }: { lesson: Lesson; onComplete: (id: string) => void }) {
  return (
    <div>
      <p className="leading-relaxed text-zinc-600 dark:text-zinc-300">{rich(lesson.intro)}</p>
      <div className="mt-2">
        {lesson.theory.map((b, i) => (
          <TheoryBlock key={i} block={b} />
        ))}
      </div>
      <h3 className="mt-8 text-lg font-bold text-zinc-900 dark:text-zinc-50">Живой пример</h3>
      <p className="mb-3 mt-1 text-sm text-zinc-500 dark:text-zinc-400">Слева — код, справа — то, что он рисует. Так браузер видит вашу страницу.</p>
      <ExampleBlock code={lesson.example.code} caption={lesson.example.caption} />
      <h3 className="mb-3 mt-8 text-lg font-bold text-zinc-900 dark:text-zinc-50">Практика</h3>
      <TaskBlock lesson={lesson} onComplete={onComplete} />
    </div>
  );
}
