export type Block =
  | { t: "h"; text: string }
  | { t: "p"; text: string }
  | { t: "list"; items: string[] }
  | { t: "code"; code: string; caption?: string }
  | { t: "note"; text: string };

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
