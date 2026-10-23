export type Block =
  | { t: "h"; text: string }
  | { t: "p"; text: string }
  | { t: "list"; items: string[] }
  | { t: "code"; code: string; caption?: string }
  | { t: "note"; text: string };

/**
 * Сравнение CSS-значения в пикселях с допуском. Использованные (used)
 * значения вроде толщины рамки браузер вправе отдавать дробными
 * (например, 2.4px при системном масштабе 125%), поэтому строгое
 * сравнение строкой === "2px" даёт ложные отказы на правильных решениях.
 */
export function pxEq(actual: string, expected: number): boolean {
  const v = parseFloat(actual);
  return Number.isFinite(v) && Math.abs(v - expected) < 0.6;
}

export interface LessonCheck {
  label: string;
  run: (doc: Document, win: Window) => boolean;
}

export interface Lesson {
  id: string;
  title: string;
  minutes: number;
  intro: string;
  theory: Block[];
  example: { caption?: string; code: string };
  task: {
    brief: string;
    starter: string;
    checks: LessonCheck[];
    hint: string;
    solution: string;
  };
}

export interface CourseModule {
  id: string;
  title: string;
  icon: string;
  desc: string;
  lessons: Lesson[];
}
