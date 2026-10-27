import { NextResponse } from "next/server";
import { generateCertNumber } from "@/lib/cert-number";
import { getServiceClient } from "@/lib/supabase-server";

/* Выдача номера сертификата. Генерирует и записывает ТОЛЬКО номер —
   никаких имён, курсов, дат и других данных в реестре нет.
   Номер генерирует сервер, а не браузер, чтобы номер нельзя было
   подделать простым вызовом из консоли: в реестр попадает лишь то,
   что сгенерировал этот маршрут. */
export async function POST() {
  const supabase = getServiceClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Сервер номеров пока не настроен" },
      { status: 503 }
    );
  }

  for (let attempt = 0; attempt < 5; attempt++) {
    const number = generateCertNumber();
    const { error } = await supabase
      .from("certificate_numbers")
      .insert({ number });
    if (!error) {
      return NextResponse.json({ number });
    }
    // 23505 — нарушение уникальности: номер уже есть, пробуем другой.
    if (error.code !== "23505") {
      return NextResponse.json(
        { error: "Не удалось записать номер" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json(
    { error: "Не удалось сгенерировать уникальный номер, попробуйте ещё раз" },
    { status: 500 }
  );
}
