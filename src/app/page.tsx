"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CourseModule, Lesson } from "@/lib/course/types";
import { MODULE_HTML } from "@/lib/course/html";
import { MODULE_CSS } from "@/lib/course/css";
import { MODULE_JS } from "@/lib/course/js";
import { MODULE_FINAL } from "@/lib/course/final";
import { MODULE_ADVANCED } from "@/lib/course/advanced";
import { LessonView } from "@/lib/engine";
import { CertificateBlock } from "@/lib/certificate";

/* Основной курс: 4 модуля, 28 уроков. Его состав и логика завершения не меняются. */
const MODULES: CourseModule[] = [MODULE_HTML, MODULE_CSS, MODULE_JS, MODULE_FINAL];
const ALL: { module: CourseModule; lesson: Lesson }[] = MODULES.flatMap((m) => m.lessons.map((l) => ({ module: m, lesson: l })));

/* Углублённый курс: отдельный необязательный модуль со своим прогрессом.
   Прогресс хранится в том же объекте localStorage (ключи уроков с префиксом adv-
   не пересекаются с основным курсом), поэтому старые сохранения подхватываются. */
const ADV_MODULES: CourseModule[] = [MODULE_ADVANCED];
const ADV_ALL: { module: CourseModule; lesson: Lesson }[] = ADV_MODULES.flatMap((m) =>
  m.lessons.map((l) => ({ module: m, lesson: l }))
);
const EVERYTHING: { module: CourseModule; lesson: Lesson }[] = [...ALL, ...ADV_ALL];
const PROGRESS_KEY = "whpp-learn-progress-v1";

/* ---------- Навигация: урок — отдельная запись в истории браузера ----------
   Список уроков — запись без хэша, открытый урок — запись с хэшем #lesson-<id>.
   Поэтому кнопка «назад» мыши/браузера из урока возвращает в список, а не
   уводит с сайта, «вперёд» снова открывает урок, а прямая ссылка с хэшем
   сразу ведёт в урок. Переход между уроками (кнопки «предыдущий/следующий»)
   идёт через replaceState — лишних записей в истории не плодим. */
const HASH_PREFIX = "lesson-";

function idFromHash(): string | null {
  if (typeof window === "undefined") return null;
  const raw = window.location.hash.replace(/^#/, "");
  const id = raw.startsWith(HASH_PREFIX) ? raw.slice(HASH_PREFIX.length) : raw;
  return id && EVERYTHING.some((x) => x.lesson.id === id) ? id : null;
}

/* Галочка пройденного урока: рисованная SVG в зелёном кружке (не эмодзи). */
function DoneCheck() {
  return (
    <span
      data-done-check=""
      aria-hidden="true"
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]">
        <path d="M4.5 12.5 10 18 19.5 6.5" />
      </svg>
    </span>
  );
}

/* Строка урока в списке: у пройденного — галочка и приглушённый текст. */
function LessonRow({
  lesson,
  badge,
  isDone,
  onOpen,
}: {
  lesson: Lesson;
  badge: number;
  isDone: boolean;
  onOpen: (id: string) => void;
}) {
  return (
    <button
      type="button"
      data-lesson-id={lesson.id}
      data-done={isDone ? "true" : undefined}
      onClick={() => onOpen(lesson.id)}
      className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-violet-50 focus-visible:bg-violet-50 focus-visible:outline-none sm:px-5 dark:hover:bg-violet-950/30 dark:focus-visible:bg-violet-950/30"
    >
      {isDone ? (
        <DoneCheck />
      ) : (
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-sm font-bold text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
          {badge}
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className={`block truncate font-medium ${isDone ? "text-zinc-500 dark:text-zinc-400" : "text-zinc-900 dark:text-zinc-50"}`}>
          {lesson.title}
        </span>
        <span className={`block truncate text-sm ${isDone ? "text-zinc-400 dark:text-zinc-500" : "text-zinc-500 dark:text-zinc-400"}`}>
          {lesson.intro}
        </span>
      </span>
      {isDone && <span className="hidden shrink-0 text-xs font-semibold text-emerald-600 sm:block dark:text-emerald-400">Пройдено</span>}
      <span className="shrink-0 text-xs text-zinc-400">{lesson.minutes} мин</span>
    </button>
  );
}

export default function HomePage() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [dark, setDark] = useState(false);

  /* Скроллом управляем вручную: при открытии урока — вверх страницы,
     при возврате в список — на ту же позицию, где список оставили. */
  const listScrollRef = useRef(0);
  const pendingScrollRef = useRef<number | null>(null);
  const normalizedRef = useRef(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
    try {
      const raw = localStorage.getItem(PROGRESS_KEY);
      if (raw) setDone(JSON.parse(raw) as Record<string, boolean>);
    } catch {
      /* noop */
    }
    try {
      history.scrollRestoration = "manual";
    } catch {
      /* noop */
    }

    /* Прямая ссылка #lesson-<id>: под уроком в истории должна лежать запись
       списка — иначе «назад» из такого урока уведёт с сайта. Вставляем её:
       текущую запись заменяем на чистый адрес, урок кладём поверх. */
    if (!normalizedRef.current) {
      normalizedRef.current = true;
      const fromHash = idFromHash();
      if (fromHash) {
        history.replaceState(null, "", window.location.pathname + window.location.search);
        history.pushState(null, "", `#${HASH_PREFIX}${fromHash}`);
        setActiveId(fromHash);
        pendingScrollRef.current = 0;
      }
    }

    const onPopState = () => {
      const id = idFromHash();
      setActiveId(id);
      pendingScrollRef.current = id ? 0 : listScrollRef.current;
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  /* Применяем запланированный скролл после смены экрана. */
  useEffect(() => {
    if (pendingScrollRef.current !== null) {
      const y = pendingScrollRef.current;
      pendingScrollRef.current = null;
      window.scrollTo({ top: y });
    }
  }, [activeId]);

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

  /* Открыть урок. mode "push" — из списка (новая запись в истории),
     "replace" — переход урок→урок (запись та же, история не растёт). */
  const openLesson = (id: string, mode: "push" | "replace" = "push") => {
    if (!activeId) listScrollRef.current = window.scrollY;
    const url = `#${HASH_PREFIX}${id}`;
    if (window.location.hash !== url) {
      if (mode === "push") history.pushState(null, "", url);
      else history.replaceState(null, "", url);
    }
    setActiveId(id);
    pendingScrollRef.current = 0;
  };

  /* Вернуться к списку уроков. Если урок открыт (в адресе его хэш) — идём
     настоящим шагом истории назад: popstate закроет урок и вернёт скролл,
     а история останется согласованной — лишнего нажатия «назад» не появится. */
  const closeLesson = () => {
    if (window.location.hash) {
      history.back();
    } else {
      setActiveId(null);
      pendingScrollRef.current = listScrollRef.current;
    }
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
  const advDoneCount = ADV_ALL.filter((x) => done[x.lesson.id]).length;
  const mainComplete = doneCount === ALL.length;
  const advComplete = advDoneCount === ADV_ALL.length;
  const totalMinutes = ALL.reduce((s, x) => s + x.lesson.minutes, 0);
  const nextLesson = ALL.find((x) => !done[x.lesson.id]);

  const activeEntry = useMemo(() => EVERYTHING.find((x) => x.lesson.id === activeId) ?? null, [activeId]);
  const activeList = activeEntry && ADV_ALL.some((x) => x.lesson.id === activeEntry.lesson.id) ? ADV_ALL : ALL;
  const activeIdx = activeEntry ? activeList.indexOf(activeEntry) : -1;
  const prev = activeIdx > 0 ? activeList[activeIdx - 1] : null;
  const next = activeIdx >= 0 && activeIdx < activeList.length - 1 ? activeList[activeIdx + 1] : null;
  const activeIsAdv = activeList === ADV_ALL;

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 sm:px-6">
      <header className="sticky top-0 z-30 -mx-4 border-b border-zinc-200/70 bg-[#e6e7ea]/90 px-4 backdrop-blur sm:-mx-6 sm:px-6 dark:border-zinc-800/70 dark:bg-[#202329]/90">
        <div className="flex items-center gap-3 py-3">
          <button type="button" onClick={closeLesson} className="flex items-center gap-2.5 text-left" aria-label="WHPP Learn — на главную">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-sm">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden="true">
                <path d="M8.5 6 3 12l5.5 6M15.5 6 21 12l-5.5 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span>
              <span className="block text-base font-bold leading-tight tracking-tight text-zinc-900 dark:text-zinc-50">WHPP Learn</span>
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
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-300 bg-white transition hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              {dark ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5 text-amber-500" aria-hidden="true">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2.5v2.2M12 19.3v2.2M4.9 4.9l1.6 1.6M17.5 17.5l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.9 19.1l1.6-1.6M17.5 6.5l1.6-1.6" strokeLinecap="round" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5 text-zinc-600" aria-hidden="true">
                  <path d="M20.4 14.7A8.6 8.6 0 0 1 9.3 3.6a8.6 8.6 0 1 0 11.1 11.1Z" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 pb-12">
        {activeEntry ? (
          <div key={activeEntry.lesson.id} className="view-enter pt-5">
            <button
              type="button"
              onClick={closeLesson}
              className="mb-3 text-sm font-medium text-violet-600 hover:underline dark:text-violet-400"
            >
              ← Программа курса
            </button>
            <div className="mb-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold uppercase tracking-wide text-zinc-400">
              <span>
                {activeEntry.module.icon} {activeEntry.module.title}
              </span>
              <span aria-hidden="true">·</span>
              <span>{activeEntry.lesson.minutes} мин</span>
              {done[activeEntry.lesson.id] && (
                <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                  <span aria-hidden="true">·</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                    <path d="M4.5 12.5 10 18 19.5 6.5" />
                  </svg>
                  пройдено
                </span>
              )}
            </div>
            <h1 className="mb-4 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">{activeEntry.lesson.title}</h1>
            <LessonView lesson={activeEntry.lesson} onComplete={complete} />
            <div className="mt-10 flex items-center justify-between gap-3 border-t border-zinc-200 pt-5 dark:border-zinc-800">
              {prev ? (
                <button
                  type="button"
                  onClick={() => openLesson(prev.lesson.id, "replace")}
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
                  onClick={() => openLesson(next.lesson.id, "replace")}
                  className="rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500"
                >
                  {next.lesson.title} →
                </button>
              ) : (
                <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  {activeIsAdv ? "Это последний урок углублённого курса" : "Это последний урок курса"}
                </span>
              )}
            </div>
          </div>
        ) : (
          <div key="list" className="view-enter">
            <div className="rounded-3xl border border-zinc-200 bg-gradient-to-br from-violet-600 to-indigo-600 p-6 text-white shadow-sm sm:p-8 dark:border-zinc-800">
              <h1 className="text-2xl font-bold leading-tight tracking-tight sm:text-[32px]">Научитесь делать сайты. Прямо здесь, в браузере.</h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-violet-100 sm:text-base">
                Полноценный курс для начинающих: короткая теория простыми словами с объяснением «почему так», живые примеры и задания,
                которые вы выполняете прямо в уроке — с автоматической проверкой. Без установки программ и регистрации.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-2 text-xs font-semibold">
                <span className="rounded-full bg-white/15 px-3 py-1.5">{ALL.length} уроков</span>
                <span className="rounded-full bg-white/15 px-3 py-1.5">≈ {Math.round(totalMinutes / 60)} часа практики</span>
                <span className="rounded-full bg-white/15 px-3 py-1.5">4 модуля: HTML → CSS → JS → проект</span>
                <span className="rounded-full bg-white/15 px-3 py-1.5">Бесплатно</span>
              </div>
              <div className="mt-5">
                <div className="h-2.5 overflow-hidden rounded-full bg-white/20">
                  <div
                    className="h-full rounded-full bg-white transition-all duration-500"
                    style={{ width: `${Math.round((doneCount / ALL.length) * 100)}%` }}
                  />
                </div>
                <div className="mt-1.5 flex items-baseline justify-between text-xs text-violet-100">
                  <span>
                    Пройдено: {doneCount} из {ALL.length}
                  </span>
                  <span>{Math.round((doneCount / ALL.length) * 100)}%</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => nextLesson && openLesson(nextLesson.lesson.id)}
                className="mt-6 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-violet-700 shadow transition hover:bg-violet-50"
              >
                {doneCount === 0 ? "Начать первый урок →" : doneCount === ALL.length ? "Курс пройден! Смотреть программу" : "Продолжить обучение →"}
              </button>
            </div>

            <section className="mt-10">
              <h2 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Чему вы научитесь</h2>
              <p className="mb-4 mt-1 max-w-3xl text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                Курс построен как цепочка навыков: каждый следующий модуль опирается на предыдущий, а в финале вы собираете всё в
                собственный сайт.
              </p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  {
                    title: "Собирать страницы на HTML",
                    text: "Структура документа, текст, ссылки, картинки, таблицы, формы и семантическая вёрстка.",
                    icon: (
                      <path d="M8.5 6 3 12l5.5 6M15.5 6 21 12l-5.5 6" strokeLinecap="round" strokeLinejoin="round" />
                    ),
                  },
                  {
                    title: "Оформлять на CSS",
                    text: "Цвета и шрифты, блочная модель, flexbox и grid, позиционирование, адаптив под телефон.",
                    icon: <path d="M12 3 21 8l-9 5-9-5 9-5ZM3 13l9 5 9-5" strokeLinecap="round" strokeLinejoin="round" />,
                  },
                  {
                    title: "Оживлять на JavaScript",
                    text: "Переменные, события и клики, ввод пользователя, условия и обновление страницы без перезагрузки.",
                    icon: <path d="M13 2 4.5 13.5H11L9.8 22 19.5 10H13L13 2Z" strokeLinejoin="round" />,
                  },
                  {
                    title: "Свой сайт в финале",
                    text: "Сайт-визитка целиком своими руками: вёрстка, оформление, интерактив и подготовка к публикации.",
                    icon: <path d="M5 21.5v-17M5 4.5h12.5l-2.6 3.8 2.6 3.7H5" strokeLinecap="round" strokeLinejoin="round" />,
                  },
                ].map((c) => (
                  <div key={c.title} className="rounded-3xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-8 w-8 text-violet-600 dark:text-violet-400" aria-hidden="true">
                      {c.icon}
                    </svg>
                    <div className="mt-3 font-semibold leading-snug text-zinc-900 dark:text-zinc-50">{c.title}</div>
                    <p className="mt-1.5 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{c.text}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                {["Бесплатно", "Без регистрации", "Практика прямо в браузере", "Автопроверка каждого задания", "Прогресс сохраняется на устройстве"].map(
                  (f) => (
                    <span key={f} className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 dark:border-zinc-800 dark:bg-zinc-900">
                      {f}
                    </span>
                  )
                )}
              </div>
              <div className="mt-4 flex flex-col gap-5 rounded-3xl border border-zinc-200 bg-white p-5 sm:flex-row sm:items-center dark:border-zinc-800 dark:bg-zinc-900">
                <div className="w-full max-w-60 shrink-0 rounded-md border-4 border-double border-violet-300 bg-violet-50 px-4 py-5 text-center dark:border-violet-900/70 dark:bg-violet-950/20">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-violet-500">WHPP Learn</div>
                  <div className="mt-1.5 font-serif text-xl font-bold tracking-wide text-zinc-800 dark:text-zinc-100">СЕРТИФИКАТ</div>
                  <div className="mx-auto mt-3 h-px w-2/3 bg-violet-300 dark:bg-violet-800" />
                  <div className="mt-3 text-[11px] text-zinc-500 dark:text-zinc-400">о прохождении курса</div>
                </div>
                <div>
                  <div className="font-semibold text-zinc-900 dark:text-zinc-50">Два сертификата — за каждый курс</div>
                  <p className="mt-1.5 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                    Пройдёте все 28 уроков основного курса — получите именной сертификат основного. Захотите большего — ещё один, за
                    углублённый. Сертификаты генерируются прямо в браузере и скачиваются картинкой: честная памятная точка в конце
                    пути, без громких обещаний.
                  </p>
                </div>
              </div>
            </section>

            {MODULES.map((m, mi) => {
              const mDone = m.lessons.filter((l) => done[l.id]).length;
              return (
                <section key={m.id} className="mt-10">
                  <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h2 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                      <span className="mr-1">{m.icon}</span> Модуль {mi + 1}. {m.title}
                    </h2>
                    <span className="text-xs font-medium text-zinc-400">
                      {mDone}/{m.lessons.length} пройдено
                    </span>
                  </div>
                  <p className="mb-3 max-w-3xl text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{m.desc}</p>
                  <div className="divide-y divide-zinc-100 overflow-hidden rounded-3xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900">
                    {m.lessons.map((l) => {
                      const globalIdx = ALL.findIndex((x) => x.lesson.id === l.id);
                      return <LessonRow key={l.id} lesson={l} badge={globalIdx + 1} isDone={!!done[l.id]} onOpen={(id) => openLesson(id)} />;
                    })}
                  </div>
                </section>
              );
            })}

            {mainComplete && <CertificateBlock courseTitle="WHPP Learn — основной курс" accent="Основной курс" courseId="main" />}

            <section className="mt-12">
              <div className="rounded-3xl border border-violet-200 bg-gradient-to-br from-violet-50 to-indigo-50 p-6 sm:p-8 dark:border-violet-900/60 dark:from-violet-950/40 dark:to-indigo-950/30">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-600 dark:text-violet-300">
                  Второй уровень · по желанию
                </div>
                <h2 className="mt-2 text-xl font-bold tracking-tight text-zinc-900 sm:text-2xl dark:text-zinc-50">Углублённый курс</h2>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                  Для тех, кто прошёл основу и хочет глубже. Этот модуль необязателен: он не влияет на завершение основного курса и
                  не блокирует его сертификат. Проходить можно в любом порядке, хоть параллельно с основным.
                </p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-violet-800 dark:text-violet-200">
                  {[
                    "Аудио и видео",
                    "SVG",
                    "Canvas",
                    "Доступность и ARIA",
                    "Open Graph и микроразметка",
                    "CSS-переменные и тёмная тема",
                    "Анимации",
                    "Валидация форм",
                    "localStorage",
                    "Мини-проект: список дел",
                  ].map((t) => (
                    <span key={t} className="rounded-full bg-white/70 px-3 py-1.5 dark:bg-white/10">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="mt-5">
                  <div className="flex items-center gap-3">
                    <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-violet-200/70 dark:bg-white/10">
                      <div
                        className="h-full rounded-full bg-violet-600 transition-all duration-500 dark:bg-violet-400"
                        style={{ width: `${Math.round((advDoneCount / ADV_ALL.length) * 100)}%` }}
                      />
                    </div>
                    <span className="shrink-0 text-xs font-semibold text-violet-800 dark:text-violet-200">
                      Пройдено: {advDoneCount} из {ADV_ALL.length}
                    </span>
                  </div>
                  <div className="mt-2 text-sm font-medium text-zinc-600 dark:text-zinc-300">
                    Прогресс углублённого: {advDoneCount} из {ADV_ALL.length} уроков
                    {advComplete ? " — курс пройден полностью" : ""}
                  </div>
                </div>
              </div>

              {ADV_MODULES.map((m) => {
                const mDone = m.lessons.filter((l) => done[l.id]).length;
                return (
                  <div key={m.id} className="mt-6">
                    <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h3 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                        <span className="mr-1">{m.icon}</span> {m.title}
                      </h3>
                      <span className="text-xs font-medium text-zinc-400">
                        {mDone}/{m.lessons.length} пройдено
                      </span>
                    </div>
                    <div className="divide-y divide-zinc-100 overflow-hidden rounded-3xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900">
                      {m.lessons.map((l, li) => (
                        <LessonRow key={l.id} lesson={l} badge={li + 1} isDone={!!done[l.id]} onOpen={(id) => openLesson(id)} />
                      ))}
                    </div>
                  </div>
                );
              })}

              {advComplete && <CertificateBlock courseTitle="WHPP Learn — углублённый курс" accent="Углублённый курс" courseId="advanced" />}
            </section>
          </div>
        )}
      </main>

      <footer className="border-t border-zinc-200 py-5 text-center text-xs text-zinc-400 dark:border-zinc-800 dark:text-zinc-500">
        © {new Date().getFullYear()} WHPP Learn · Бесплатный курс для всех · Прогресс хранится только в вашем браузере
      </footer>
    </div>
  );
}
