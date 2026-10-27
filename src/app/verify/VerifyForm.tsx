"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { isValidCertNumber, normalizeCertNumber } from "@/lib/cert-number";

type Status = "idle" | "checking" | "valid" | "invalid" | "bad-format" | "error";

/* Форма проверки подлинности номера сертификата.
   Номер из ссылки (?number=...) подставляется и проверяется сразу. */
export default function VerifyForm() {
  const searchParams = useSearchParams();
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const autoCheckedRef = useRef(false);

  const check = useCallback(async (raw: string) => {
    const number = normalizeCertNumber(raw);
    setInput(number);
    if (!isValidCertNumber(number)) {
      setStatus("bad-format");
      return;
    }
    setStatus("checking");
    try {
      const res = await fetch(
        `/api/certificates/verify?number=${encodeURIComponent(number)}`
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        return;
      }
      setStatus(data.valid ? "valid" : "invalid");
    } catch {
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    const fromLink = searchParams.get("number");
    if (fromLink && !autoCheckedRef.current) {
      autoCheckedRef.current = true;
      check(fromLink);
    }
  }, [searchParams, check]);

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          check(input);
        }}
        className="mt-6 flex flex-col gap-3 sm:flex-row"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value.toUpperCase())}
          placeholder="WHPP-XXXX-XXXX-XXXX"
          spellCheck={false}
          autoComplete="off"
          className="min-w-0 flex-1 rounded-xl border border-zinc-300 bg-white px-4 py-3 font-mono text-sm tracking-wider text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-violet-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
        />
        <button
          type="submit"
          disabled={status === "checking"}
          className="cursor-pointer rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:opacity-50"
        >
          {status === "checking" ? "Проверяем…" : "Проверить"}
        </button>
      </form>

      {status === "valid" && (
        <div className="mt-5 rounded-2xl border border-emerald-300 bg-emerald-50 p-5 dark:border-emerald-900/70 dark:bg-emerald-950/40">
          <p className="text-base font-semibold text-emerald-800 dark:text-emerald-200">
            Номер подлинный — он выдан сайтом WHPP Learn.
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-emerald-700 dark:text-emerald-300">
            Проверка подтверждает только номер: имя и курс, указанные на
            сертификате, нигде не хранятся, поэтому их подлинность по номеру
            установить нельзя.
          </p>
        </div>
      )}

      {status === "invalid" && (
        <div className="mt-5 rounded-2xl border border-red-300 bg-red-50 p-5 dark:border-red-900/70 dark:bg-red-950/40">
          <p className="text-base font-semibold text-red-800 dark:text-red-200">
            Номер не найден в реестре.
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-red-700 dark:text-red-300">
            Проверьте, правильно ли переписан номер с сертификата. Если номер
            верный, а сайт его не находит — сертификат сайтом не выдавался.
          </p>
        </div>
      )}

      {status === "bad-format" && (
        <div className="mt-5 rounded-2xl border border-amber-300 bg-amber-50 p-5 dark:border-amber-900/70 dark:bg-amber-950/40">
          <p className="text-sm leading-relaxed text-amber-800 dark:text-amber-200">
            Похоже, номер введён с ошибкой. Формат номера:{" "}
            <span className="font-mono font-semibold">WHPP-XXXX-XXXX-XXXX</span>{" "}
            — буквы и цифры, без похожих друг на друга знаков 0/O и 1/I.
          </p>
        </div>
      )}

      {status === "error" && (
        <div className="mt-5 rounded-2xl border border-zinc-300 bg-zinc-50 p-5 dark:border-zinc-700 dark:bg-zinc-900">
          <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
            Проверка временно недоступна — сервер номеров не отвечает.
            Попробуйте чуть позже.
          </p>
        </div>
      )}
    </div>
  );
}
