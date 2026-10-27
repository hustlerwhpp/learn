import { NextResponse } from "next/server";
import { isValidCertNumber, normalizeCertNumber } from "@/lib/cert-number";
import { getServiceClient } from "@/lib/supabase-server";

/* Проверка подлинности номера: есть ли он в реестре выданных номеров.
   В реестре хранятся только номера, поэтому ответ — лишь «да/нет»:
   кому и за какой курс выдан номер, из проверки узнать нельзя. */
export async function GET(req: Request) {
  const raw = new URL(req.url).searchParams.get("number") ?? "";
  const number = normalizeCertNumber(raw);

  if (!isValidCertNumber(number)) {
    return NextResponse.json(
      { valid: false, error: "Неверный формат номера" },
      { status: 400 }
    );
  }

  const supabase = getServiceClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Сервер номеров пока не настроен" },
      { status: 503 }
    );
  }

  const { data, error } = await supabase
    .from("certificate_numbers")
    .select("number")
    .eq("number", number)
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { error: "Не удалось проверить номер" },
      { status: 500 }
    );
  }

  return NextResponse.json({ valid: !!data });
}
