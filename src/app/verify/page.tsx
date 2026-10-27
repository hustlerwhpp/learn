import type { Metadata } from "next";
import { Suspense } from "react";
import VerifyForm from "./VerifyForm";

export const metadata: Metadata = {
  title: "Проверка сертификата — WHPP Learn",
  description:
    "Проверьте подлинность номера сертификата WHPP Learn: введите номер с сертификата, и сайт скажет, выдавался ли он.",
  alternates: { canonical: "/verify" },
};

export default function VerifyPage() {
  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
      <a
        href="/"
        className="text-sm font-medium text-violet-600 hover:text-violet-500 dark:text-violet-300"
      >
        ← На главную
      </a>
      <div className="mt-6">
        <div className="text-xs font-semibold uppercase tracking-[0.25em] text-violet-600 dark:text-violet-300">
          WHPP Learn
        </div>
        <h1 className="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          Проверка сертификата
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
          Введите номер с сертификата — тот, что напечатан внизу картинки.
          Сайт проверит, есть ли такой номер в реестре выданных. В реестре
          хранятся только номера, без имён и других данных.
        </p>
      </div>
      <Suspense>
        <VerifyForm />
      </Suspense>
    </main>
  );
}
