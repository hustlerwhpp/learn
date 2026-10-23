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
      return <p className="mt-3 max-w-3xl leading-relaxed text-zinc-600 dark:text-zinc-300">{rich(block.text)}</p>;
    case "list":
      return (
        <ul className="mt-3 max-w-3xl list-disc space-y-1.5 pl-5 leading-relaxed text-zinc-600 marker:text-violet-500 dark:text-zinc-300">
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
        <div className="mt-4 max-w-3xl rounded-2xl border border-amber-200 border-l-4 border-l-amber-400 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900 dark:border-amber-900/50 dark:border-l-amber-500 dark:bg-amber-950/30 dark:text-amber-100">
          {rich(block.text)}
        </div>
      );
  }
}

/* ---------- живой пример ---------- */

export function ExampleBlock({ code, caption }: { code: string; caption?: string }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-zinc-200 dark:border-zinc-800">
      <div className="grid md:grid-cols-2">
        <div className="flex flex-col bg-zinc-950">
          <div className="border-b border-zinc-800 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
            Код примера
          </div>
          <pre className="max-h-80 flex-1 overflow-auto p-4 font-mono text-[12.5px] leading-relaxed text-zinc-100">
            {code}
          </pre>
        </div>
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
  // Метка времени последнего нажатия «Проверить задание»: по ней handleLoad
  // понимает, что свежезагрузившийся документ превью надо сразу проверить.
  const checkRequestedAt = useRef(0);
  // Документ превью, по которому проверки уже запускались в рамках текущего
  // запроса. Проверки бывают с состоянием (клики переключают классы, счётчики
  // растут), поэтому один и тот же документ нельзя проверять дважды подряд.
  const lastCheckedDoc = useRef<Document | null>(null);

  useEffect(() => {
    setCode(lesson.task.starter);
    setPreview(lesson.task.starter);
    setResults(null);
    setShowHint(false);
    setShowSolution(false);
    setPassed(false);
    lastCheckedDoc.current = null;
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
    // Один документ — одна проверка: повторный запуск по тому же документу
    // ломает проверки с состоянием (вторая проверка «кликает» ещё раз).
    if (doc === lastCheckedDoc.current) return;
    lastCheckedDoc.current = doc;
    try {
      const res = lesson.task.checks.map((c) => {
        try {
          return !!c.run(doc, win as unknown as Window);
        } catch {
          return false;
        }
      });
      setResults(res);
      // Вердикт обязан следовать за пунктами в обе стороны: раньше passed
      // только выставлялся в true и не сбрасывался, из-за чего шапка
      // результата продолжала показывать «выполнено» при проваленных пунктах.
      const ok = res.every(Boolean);
      setPassed(ok);
      if (ok) {
        onComplete(lesson.id);
      }
    } catch {
      /* iframe ещё не готов */
    }
  }, [lesson, onComplete]);

  const handleLoad = () => {
    // Превью перезагружается и от дебаунса при вводе — проверяем по load
    // только если недавно нажимали «Проверить задание».
    if (Date.now() - checkRequestedAt.current < 3000) {
      setTimeout(runChecks, 60);
    }
  };

  const check = () => {
    // Мгновенно применяем текущий код (не ждём дебаунс) и проверяем
    // несколько раз с интервалами. Раньше стоял флаг pendingCheck, который
    // «съедался» первым сработавшим путём (load или таймер): при неудачной
    // гонке проверка запускалась по ещё не применившемуся документу, а
    // повторное нажатие могло вообще ничего не делать. Теперь попытки
    // идут по таймерам и по load, а runChecks сам следит, чтобы каждый
    // документ превью проверялся ровно один раз (см. lastCheckedDoc).
    checkRequestedAt.current = Date.now();
    // Свежий запрос пользователя: разрешаем проверку текущего документа,
    // даже если он уже проверялся по прошлому нажатию.
    lastCheckedDoc.current = null;
    setPreview(code);
    setTimeout(runChecks, 250);
    setTimeout(runChecks, 800);
    setTimeout(runChecks, 1600);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-violet-200 bg-violet-50 p-4 dark:border-violet-900/60 dark:bg-violet-950/30">
        <div className="text-sm font-bold uppercase tracking-wide text-violet-700 dark:text-violet-300">Задание</div>
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
          Проверить задание
        </button>
        <button
          type="button"
          onClick={() => setShowHint((v) => !v)}
          className="rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          Подсказка
        </button>
        <button
          type="button"
          onClick={() => setShowSolution((v) => !v)}
          className="rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          Решение
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
          data-check-results={passed ? "passed" : "failed"}
          className={`rounded-3xl border p-4 ${
            passed
              ? "border-emerald-200 bg-emerald-50 dark:border-emerald-900/60 dark:bg-emerald-950/30"
              : "border-rose-200 bg-rose-50/60 dark:border-rose-900/50 dark:bg-rose-950/20"
          }`}
        >
          <div className={`font-bold ${passed ? "text-emerald-800 dark:text-emerald-200" : "text-rose-800 dark:text-rose-200"}`}>
            {passed ? "Задание выполнено! Урок засчитан." : "Проверка: пока есть ошибки"}
          </div>
          <ul className="mt-2 space-y-1.5">
            {lesson.task.checks.map((c, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                {results[i] ? (
                  <span
                    data-check-status="pass"
                    aria-hidden="true"
                    className="mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                      <path d="M4.5 12.5 10 18 19.5 6.5" />
                    </svg>
                  </span>
                ) : (
                  <span
                    data-check-status="fail"
                    aria-hidden="true"
                    className="mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-rose-500 text-white"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" className="h-3 w-3">
                      <path d="M6 6l12 12M18 6L6 18" />
                    </svg>
                  </span>
                )}
                <span
                  className={
                    results[i] ? "text-zinc-500 dark:text-zinc-400" : "font-medium text-zinc-900 dark:text-zinc-50"
                  }
                >
                  {c.label}
                </span>
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
      <p className="max-w-3xl leading-relaxed text-zinc-600 dark:text-zinc-300">{rich(lesson.intro)}</p>
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
