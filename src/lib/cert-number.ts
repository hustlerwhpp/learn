/* ---------- Номера сертификатов ----------
   Формат: WHPP-XXXX-XXXX-XXXX, где X — символ из алфавита без похожих
   друг на друга знаков (без 0/O и 1/I), чтобы номер было удобно
   переписывать с картинки. 12 случайных символов — коллизии практически
   исключены, а база дополнительно страхует уникальным ключом. */

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const GROUPS = 3;
const GROUP_LEN = 4;

export function generateCertNumber(): string {
  const bytes = new Uint8Array(GROUPS * GROUP_LEN);
  globalThis.crypto.getRandomValues(bytes);
  const chars = Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]);
  const groups: string[] = [];
  for (let i = 0; i < GROUPS; i++) {
    groups.push(chars.slice(i * GROUP_LEN, (i + 1) * GROUP_LEN).join(""));
  }
  return `WHPP-${groups.join("-")}`;
}

/** Приводит ввод к каноническому виду: верхниий регистр, дефисы по группам. */
export function normalizeCertNumber(raw: string): string {
  const cleaned = raw.toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (!cleaned.startsWith("WHPP")) return cleaned;
  const body = cleaned.slice(4);
  const groups: string[] = [];
  for (let i = 0; i < body.length; i += GROUP_LEN) {
    groups.push(body.slice(i, i + GROUP_LEN));
  }
  return `WHPP-${groups.join("-")}`;
}

const NUMBER_RE = /^WHPP-[A-HJ-NP-Z2-9]{4}-[A-HJ-NP-Z2-9]{4}-[A-HJ-NP-Z2-9]{4}$/;

export function isValidCertNumber(value: string): boolean {
  return NUMBER_RE.test(value);
}
