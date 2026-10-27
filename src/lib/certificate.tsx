"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/* ---------- Сертификат о прохождении курса ----------
   Появляется при 100% прогресса курса. Полностью клиентский:
   имя вводит ученик, картинка рисуется на canvas и скачивается PNG. */

export interface CertificateData {
  name: string;
  courseTitle: string;
  date: string;
  /** Уникальный номер из реестра; без него строка с номером не рисуется. */
  number?: string;
}

const NAME_KEY = "whpp-learn-cert-name";
const numberKey = (courseId: string) => `whpp-learn-cert-number:${courseId}`;
const W = 1680;
const H = 1188;

function formatToday(): string {
  try {
    return new Date().toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}

/** Рисует сертификат на переданном 2d-контексте. Вынесено отдельно — так логику
    можно проверить без браузера (подставив тестовый контекст). */
export function drawCertificate(ctx: CanvasRenderingContext2D, data: CertificateData): void {
  const violet = "#5b21b6";
  const violetLight = "#c4b5fd";
  const ink = "#18181b";
  const grey = "#52525b";

  // фон
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, W, H);

  // двойная рамка
  ctx.strokeStyle = violet;
  ctx.lineWidth = 6;
  ctx.strokeRect(28, 28, W - 56, H - 56);
  ctx.strokeStyle = violetLight;
  ctx.lineWidth = 2;
  ctx.strokeRect(48, 48, W - 96, H - 96);

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // шапка
  ctx.fillStyle = violet;
  ctx.font = "600 34px Arial, sans-serif";
  ctx.fillText("W H P P   L E A R N", W / 2, 138);

  ctx.fillStyle = ink;
  ctx.font = "bold 104px Georgia, 'Times New Roman', serif";
  ctx.fillText("СЕРТИФИКАТ", W / 2, 268);

  ctx.fillStyle = grey;
  ctx.font = "34px Arial, sans-serif";
  ctx.fillText("о прохождении курса", W / 2, 348);

  ctx.fillStyle = ink;
  ctx.font = "bold 50px Georgia, 'Times New Roman', serif";
  ctx.fillText(data.courseTitle, W / 2, 428);

  // разделитель
  ctx.strokeStyle = violetLight;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(W / 2 - 210, 492);
  ctx.lineTo(W / 2 + 210, 492);
  ctx.stroke();

  ctx.fillStyle = grey;
  ctx.font = "32px Arial, sans-serif";
  ctx.fillText("Настоящий сертификат выдан ученику", W / 2, 572);

  ctx.fillStyle = ink;
  ctx.font = "bold 72px Georgia, 'Times New Roman', serif";
  ctx.fillText(data.name || "Ученик", W / 2, 668);

  ctx.fillStyle = grey;
  ctx.font = "30px Arial, sans-serif";
  ctx.fillText("Курс пройден полностью: все уроки и задания выполнены", W / 2, 756);

  // дата — слева внизу
  ctx.textAlign = "left";
  ctx.fillStyle = grey;
  ctx.font = "28px Arial, sans-serif";
  ctx.fillText("Дата выдачи", 130, H - 240);
  ctx.fillStyle = ink;
  ctx.font = "bold 34px Arial, sans-serif";
  ctx.fillText(data.date, 130, H - 192);

  // подпись — по центру внизу
  ctx.textAlign = "center";
  ctx.strokeStyle = ink;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(W / 2 - 150, H - 196);
  ctx.bezierCurveTo(W / 2 - 90, H - 236, W / 2 - 30, H - 156, W / 2 + 40, H - 200);
  ctx.bezierCurveTo(W / 2 + 80, H - 226, W / 2 + 110, H - 176, W / 2 + 150, H - 196);
  ctx.stroke();
  ctx.fillStyle = grey;
  ctx.font = "26px Arial, sans-serif";
  ctx.fillText("Команда WHPP Learn", W / 2, H - 148);

  // печать — справа внизу: два круга и надпись
  const px = W - 250;
  const py = H - 205;
  ctx.strokeStyle = violet;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(px, py, 92, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(px, py, 74, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = violet;
  ctx.font = "bold 30px Arial, sans-serif";
  ctx.fillText("WHPP", px, py - 16);
  ctx.font = "20px Arial, sans-serif";
  ctx.fillText("LEARN", px, py + 18);

  // номер сертификата — строкой внизу по центру (если присвоен)
  if (data.number) {
    ctx.textAlign = "center";
    ctx.fillStyle = grey;
    ctx.font = "24px Arial, sans-serif";
    ctx.fillText(
      `Номер сертификата: ${data.number} · проверка: learn.whpp.site/verify`,
      W / 2,
      H - 84
    );
  }
}

function renderPng(data: CertificateData): HTMLCanvasElement | null {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  drawCertificate(ctx, data);
  return canvas;
}

export function CertificateBlock({
  courseTitle,
  accent,
  courseId,
}: {
  courseTitle: string;
  accent?: string;
  /** Устойчивый ключ курса: номер запоминается отдельно для каждого. */
  courseId: string;
}) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [number, setNumber] = useState<string | null>(null);
  const [numberState, setNumberState] = useState<
    "loading" | "ready" | "unavailable"
  >("loading");
  const mintingRef = useRef(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(NAME_KEY);
      if (saved) setName(saved);
    } catch {
      /* noop */
    }
  }, []);

  // Номер: берём сохранённый для этого курса, иначе один раз просим
  // сервер выдать новый. Номер — единственное, что уходит на сервер.
  const mintNumber = useCallback(async () => {
    if (mintingRef.current) return;
    mintingRef.current = true;
    setNumberState("loading");
    try {
      const saved = localStorage.getItem(numberKey(courseId));
      if (saved) {
        setNumber(saved);
        setNumberState("ready");
        return;
      }
      const res = await fetch("/api/certificates/issue", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.number) throw new Error(data.error || "Ошибка выдачи номера");
      localStorage.setItem(numberKey(courseId), data.number);
      setNumber(data.number);
      setNumberState("ready");
    } catch {
      setNumberState("unavailable");
    } finally {
      mintingRef.current = false;
    }
  }, [courseId]);

  useEffect(() => {
    mintNumber();
  }, [mintNumber]);

  const data = (): CertificateData => ({
    name: name.trim(),
    courseTitle,
    date: formatToday(),
    number: number ?? undefined,
  });

  const saveName = (v: string) => {
    setName(v);
    try {
      localStorage.setItem(NAME_KEY, v);
    } catch {
      /* noop */
    }
  };

  const download = () => {
    if (!name.trim()) {
      setError("Сначала введите имя — оно будет на сертификате.");
      return;
    }
    setError("");
    const canvas = renderPng(data());
    if (!canvas) {
      setError("Не получилось сгенерировать картинку в этом браузере.");
      return;
    }
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "whpp-learn-certificate.png";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
    }, "image/png");
  };

  const print = () => {
    if (!name.trim()) {
      setError("Сначала введите имя — оно будет на сертификате.");
      return;
    }
    setError("");
    const canvas = renderPng(data());
    if (!canvas) {
      setError("Не получилось сгенерировать картинку в этом браузере.");
      return;
    }
    const w = window.open("", "_blank");
    if (!w) {
      setError("Браузер заблокировал окно печати — скачайте PNG, её тоже можно распечатать.");
      return;
    }
    const url = canvas.toDataURL("image/png");
    w.document.write(
      '<!DOCTYPE html><html lang="ru"><head><meta charset="UTF-8"><title>Сертификат WHPP Learn</title>' +
        '<style>@page { size: A4 landscape; margin: 8mm; } body { margin: 0; } img { width: 100%; display: block; }</style></head>' +
        '<body><img src="' + url + '" alt="Сертификат" onload="setTimeout(function(){window.print()},150)"></body></html>'
    );
    w.document.close();
  };

  return (
    <section className="mt-10 overflow-hidden rounded-3xl border border-violet-300 bg-white shadow-sm dark:border-violet-900/70 dark:bg-zinc-900">
      <div className="border-b-4 border-double border-violet-300 px-6 py-6 sm:px-8 dark:border-violet-900/70">
        <div className="text-xs font-semibold uppercase tracking-[0.25em] text-violet-600 dark:text-violet-300">WHPP Learn</div>
        <h2 className="mt-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">Ваш сертификат</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
          Курс «{accent ?? courseTitle}» пройден полностью — все уроки выполнены. Введите имя, и мы сгенерируем именной
          сертификат-картинку: её можно скачать, распечатать или сохранить в PDF через печать.
        </p>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
          Честно: официальной силы у него нет и работодателей он не впечатлит. Это памятный знак для вас самих — точка в конце
          пройденного пути.
        </p>
        <div className="mt-5 flex flex-wrap items-end gap-3">
          <label className="min-w-56 flex-1 sm:max-w-xs">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-400">Имя на сертификате</span>
            <input
              type="text"
              value={name}
              onChange={(e) => saveName(e.target.value)}
              placeholder="Например, Анна Соколова"
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-violet-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
            />
          </label>
          <button
            type="button"
            onClick={download}
            className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500"
          >
            Скачать PNG
          </button>
          <button
            type="button"
            onClick={print}
            className="rounded-xl border border-zinc-300 bg-white px-5 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            Печать / PDF
          </button>
        </div>
        {error && <p className="mt-3 text-sm font-medium text-red-600 dark:text-red-400">{error}</p>}
        {numberState === "ready" && number && (
          <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-300">
            Номер сертификата:{" "}
            <span className="font-mono font-semibold text-zinc-900 dark:text-zinc-50">{number}</span>{" "}
            ·{" "}
            <a
              href={`/verify?number=${encodeURIComponent(number)}`}
              className="font-medium text-violet-600 underline underline-offset-2 hover:text-violet-500 dark:text-violet-300"
            >
              Проверить подлинность
            </a>
          </p>
        )}
        {numberState === "unavailable" && (
          <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
            Номер пока не присвоен — сервер номеров недоступен. Картинку всё равно можно скачать, а номер появится позже.{" "}
            <button
              type="button"
              onClick={mintNumber}
              className="cursor-pointer font-medium text-violet-600 underline underline-offset-2 hover:text-violet-500 dark:text-violet-300"
            >
              Попробовать снова
            </button>
          </p>
        )}
        <p className="mt-3 text-xs text-zinc-400 dark:text-zinc-500">
          Имя никуда не отправляется: сертификат рисуется прямо в вашем браузере. Для проверки подлинности на сервер
          записывается только номер сертификата — без имени и других данных.
        </p>
      </div>
    </section>
  );
}
