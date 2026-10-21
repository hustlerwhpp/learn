"use client";

import { useEffect, useMemo, useState } from "react";
import type { CourseModule, Lesson } from "@/lib/course/types";
import { MODULE_HTML } from "@/lib/course/html";
import { MODULE_CSS } from "@/lib/course/css";
import { MODULE_JS } from "@/lib/course/js";
import { MODULE_FINAL } from "@/lib/course/final";
import { LessonView } from "@/lib/engine";

const MODULES: CourseModule[] = [MODULE_HTML, MODULE_CSS, MODULE_JS, MODULE_FINAL];
const ALL: { module: CourseModule; lesson: Lesson }[] = MODULES.flatMap((m) => m.lessons.map((l) => ({ module: m, lesson: l })));
const PROGRESS_KEY = "whpp-learn-progress-v1";

export default function HomePage() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
    try {
      const raw = localStorage.getItem(PROGRESS_KEY);
      if (raw) setDone(JSON.parse(raw) as Record<string, boolean>);
    } catch {
      /* noop */
    }
    const fromHash = window.location.hash.replace("#", "");
    if (fromHash && ALL.some((x) => x.lesson.id === fromHash)) setActiveId(fromHash);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("whpp-learn-theme", next ? "dark" : "light");
    } catch {
      /* noop */
    }
  };

  const openLesson = (id: string | null) => {
    setActiveId(id);
    if (id) history.replaceState(null, "", `#${id}`);
    else history.replaceState(null, "", window.location.pathname);
    window.scrollTo({ top: 0 });
  };

  const complete = (id: string) => {
    setDone((prev) => {
      const next = { ...prev, [id]: true };
      try {
        localStorage.setItem(PROGRESS_KEY, JSON.stringify(next));
      } catch {
        /* noop */
      }
      return next;
    });
  };

  const doneCount = ALL.filter((x) => done[x.lesson.id]).length;
  const totalMinutes = ALL.reduce((s, x) => s + x.lesson.minutes, 0);
  const nextLesson = ALL.find((x) => !done[x.lesson.id]);

  const activeEntry = useMemo(() => ALL.find((x) => x.lesson.id === activeId) ?? null, [activeId]);
  const activeIdx = activeEntry ? ALL.indexOf(activeEntry) : -1;
  const prev = activeIdx > 0 ? ALL[activeIdx - 1] : null;
  const next = activeIdx >= 0 && activeIdx < ALL.length - 1 ? ALL[activeIdx + 1] : null;

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 sm:px-6">
      <header className="flex items-center gap-3 py-4">
        <button type="button" onClick={() => openLesson(null)} className="flex items-center gap-2.5 text-left">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-600 text-xl shadow-sm">🎓</span>
          <span>
            <span className="block text-base font-bold leading-tight text-zinc-900 dark:text-zinc-50">WHPP Learn</span>
            <span className="block text-xs leading-tight text-zinc-500 dark:text-zinc-400">HTML · CSS · JavaScript с нуля</span>
          </span>
        </button>
        <div className="ml-auto flex items-center gap-2">
          {doneCount > 0 && (
            <span className="hidden rounded-full bg-violet-100 px-3 py-1.5 text-xs font-semibold text-violet-800 sm:block dark:bg-violet-950/60 dark:text-violet-200">
              Пройдено: {doneCount} из {ALL.length}
            </span>
          )}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Переключить тему"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-300 bg-white text-lg transition hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800"
          >
            {dark ? "☀️" : "🌙"}
          </button>
        </div>
      </header>

      <main className="flex-1 pb-12">
        {activeEntry ? (
          <div>
            <button
              type="button"
              onClick={() => openLesson(null)}
              className="mb-3 text-sm font-medium text-violet-600 hover:underline dark:text-violet-400"
            >
              ← Программа курса
            </button>
            <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
              <span>
                {activeEntry.module.icon} {activeEntry.module.title}
              </span>
              <span>·</span>
              <span>⏱ {activeEntry.lesson.minutes} мин</span>
              {done[activeEntry.lesson.id] && <span className="text-emerald-500">· ✓ пройдено</span>}
            </div>
            <h1 className="mb-4 text-2xl font-bold text-zinc-900 sm:text-3xl dark:text-zinc-50">{activeEntry.lesson.title}</h1>
            <LessonView lesson={activeEntry.lesson} onComplete={complete} />
            <div className="mt-10 flex items-center justify-between gap-3 border-t border-zinc-200 pt-5 dark:border-zinc-800">
              {prev ? (
                <button
                  type="button"
                  onClick={() => openLesson(prev.lesson.id)}
                  className="rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
                >
                  ← {prev.lesson.title}
                </button>
              ) : (
                <span />
              )}
              {next ? (
                <button
                  type="button"
                  onClick={() => openLesson(next.lesson.id)}
                  className="rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500"
                >
                  {next.lesson.title} →
                </button>
              ) : (
                <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">🏁 Это последний урок курса</span>
              )}
            </div>
          </div>
        ) : (
          <div>
            <div className="rounded-3xl border border-zinc-200 bg-gradient-to-br from-violet-600 to-indigo-600 p-6 text-white shadow-sm sm:p-8 dark:border-zinc-800">
              <h1 className="text-2xl font-bold sm:text-3xl">Научитесь делать сайты. Прямо здесь, в браузере.</h1>
              <p className="mt-2 max-w-2xl text-sm text-violet-100 sm:text-base">
                Полноценный курс для начинающих: короткая теория простыми словами с объяснением «почему так», живые примеры и задания,
                которые вы выполняете прямо в уроке — с автоматической проверкой. Без установки программ и регистрации.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-2 text-xs font-semibold">
                <span className="rounded-full bg-white/15 px-3 py-1.5">📚 {ALL.length} уроков</span>
                <span className="rounded-full bg-white/15 px-3 py-1.5">⏱ ≈ {Math.round(totalMinutes / 60)} часа практики</span>
                <span className="rounded-full bg-white/15 px-3 py-1.5">🎯 4 модуля: HTML → CSS → JS → проект</span>
                <span className="rounded-full bg-white/15 px-3 py-1.5">💸 Бесплатно</span>
              </div>
              {doneCount > 0 && (
                <div className="mt-5">
                  <div className="h-2.5 overflow-hidden rounded-full bg-white/20">
                    <div
                      className="h-full rounded-full bg-white transition-all"
                      style={{ width: `${Math.round((doneCount / ALL.length) * 100)}%` }}
                    />
                  </div>
                  <div className="mt-1.5 text-xs text-violet-100">
                    Ваш прогресс: {doneCount} из {ALL.length} уроков ({Math.round((doneCount / ALL.length) * 100)}%)
                  </div>
                </div>
              )}
              <button
                type="button"
                onClick={() => nextLesson && openLesson(nextLesson.lesson.id)}
                className="mt-6 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-violet-700 shadow transition hover:bg-violet-50"
              >
                {doneCount === 0 ? "Начать первый урок →" : doneCount === ALL.length ? "🏆 Курс пройден! Смотреть программу" : "Продолжить обучение →"}
              </button>
            </div>

            {MODULES.map((m, mi) => {
              const mDone = m.lessons.filter((l) => done[l.id]).length;
              return (
                <section key={m.id} className="mt-8">
                  <div className="mb-3 flex items-baseline gap-3">
                    <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                      <span className="mr-1">{m.icon}</span> Модуль {mi + 1}. {m.title}
                    </h2>
                    <span className="text-xs font-medium text-zinc-400">
                      {mDone}/{m.lessons.length} пройдено
                    </span>
                  </div>
                  <p className="mb-3 text-sm text-zinc-500 dark:text-zinc-400">{m.desc}</p>
                  <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
                    {m.lessons.map((l, li) => {
                      const isDone = !!done[l.id];
                      const globalIdx = ALL.findIndex((x) => x.lesson.id === l.id);
                      return (
                        <button
                          key={l.id}
                          type="button"
                          onClick={() => openLesson(l.id)}
                          className={`flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-violet-50 sm:px-5 dark:hover:bg-violet-950/30 ${
                            li > 0 ? "border-t border-zinc-100 dark:border-zinc-800" : ""
                          }`}
                        >
                          <span
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                              isDone
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                                : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                            }`}
                          >
                            {isDone ? "✓" : globalIdx + 1}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate font-medium text-zinc-900 dark:text-zinc-50">{l.title}</span>
                            <span className="block truncate text-sm text-zinc-500 dark:text-zinc-400">{l.intro}</span>
                          </span>
                          <span className="shrink-0 text-xs text-zinc-400">⏱ {l.minutes} мин</span>
                        </button>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </main>

      <footer className="border-t border-zinc-200 py-5 text-center text-xs text-zinc-400 dark:border-zinc-800 dark:text-zinc-500">
        © {new Date().getFullYear()} WHPP Learn · Бесплатный курс для всех · Прогресс хранится только в вашем браузере
      </footer>
    </div>
  );
}
