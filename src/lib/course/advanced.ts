import type { CourseModule } from "./types";

/* ---------- helpers для проверок ---------- */

// Весь CSS страницы одним текстом — так проверки могут смотреть правила,
// которые нельзя надёжно прочитать через getComputedStyle (переменные, hover, keyframes).
function cssText(doc: Document): string {
  return Array.from(doc.querySelectorAll("style"))
    .map((s) => s.textContent ?? "")
    .join("\n");
}

export const MODULE_ADVANCED: CourseModule = {
  id: "advanced",
  title: "Углублённый курс",
  icon: "🚀",
  desc: "Второй уровень — по желанию, после основного курса. Мультимедиа, SVG и canvas, доступность, мета-теги для поиска и репостов, CSS-переменные и анимации, валидация форм, localStorage и финальный мини-проект. На завершение основного курса этот модуль не влияет.",
  lessons: [
    /* ================= УРОК 1: АУДИО И ВИДЕО ================= */
    {
      id: "adv-media",
      title: "Аудио и видео на странице",
      minutes: 9,
      intro:
        "До сих пор страницы были тихими и неподвижными. HTML умеет встраивать звук и видео без всяких плагинов — тегами <audio> и <video>. Разберём, как они устроены и почему файл почти всегда подключают вложенным тегом <source>.",
      theory: [
        {
          t: "h",
          text: "Два тега — одна идея",
        },
        {
          t: "p",
          text: "Тег `<audio>` встраивает звуковой плеер, тег `<video>` — видеоплеер. У обоих есть атрибут `controls`: без него плеер не покажет ни кнопки «пуск», ни ползунок громкости — элемент будет, а управлять им нечем. Поэтому `controls` — первое, что ставят.",
        },
        {
          t: "code",
          code: '<audio controls src="song.mp3"></audio>\n\n<video controls width="480" poster="preview.jpg">\n  <source src="clip.mp4" type="video/mp4">\n</video>',
          caption: "Минимальные рабочие варианты обоих плееров",
        },
        {
          t: "h",
          text: "Зачем отдельный тег source",
        },
        {
          t: "p",
          text: "Файл можно указать атрибутом `src` у самого плеера, но чаще его кладут внутрь отдельным тегом `<source>` с атрибутом `type` — форматом файла. Так браузер сразу видит формат и, если вы дадите несколько вариантов (например, mp4 и webm), выберет первый, который умеет играть. Атрибут `type` — подсказка, чтобы браузер не скачивал файл впустую.",
        },
        {
          t: "list",
          items: [
            "`controls` — видимые элементы управления плеером",
            "`poster` — картинка-заставка у видео, пока оно не запущено",
            "`preload=\"metadata\"` — подгрузить только служебные данные (длительность, размер), а не весь файл",
            "`loop` — играть по кругу",
            "`muted` — начать без звука; автозапуск видео браузеры разрешают только в паре с muted",
          ],
        },
        {
          t: "note",
          text: "Почему не стоит включать автозапуск со звуком: браузеры его блокируют — пользователь не просил шума, и страница, внезапно заголосившая из вкладки, это плохой тон. Видео-фон делают через autoplay + muted + loop, а обычный плеер всегда запускает человек.",
        },
      ],
      example: {
        caption: "Оба плеера на одной странице: у видео есть постер, у аудио — только controls",
        code: `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<title>Медиа</title>
</head>
<body>
<h1>Выпуск подкаста</h1>
<audio controls preload="metadata">
  <source src="episode.mp3" type="audio/mpeg">
  Ваш браузер не умеет играть аудио.
</audio>

<h2>Трейлер</h2>
<video controls width="480" poster="poster.jpg" preload="metadata">
  <source src="trailer.mp4" type="video/mp4">
  Ваш браузер не умеет играть видео.
</video>
</body>
</html>`,
      },
      task: {
        brief:
          "Соберите медиаблок в заготовке. Аудиоплееру с `id=\"player\"` добавьте атрибут `controls` и вложенный `<source src=\"song.mp3\" type=\"audio/mpeg\">`. Видеоплееру с `id=\"clip\"` добавьте `controls`, постер `poster=\"poster.jpg\"` и вложенный `<source src=\"clip.mp4\" type=\"video/mp4\">`.",
        starter: `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<title>Медиаблок</title>
</head>
<body>
<h1>Слушать и смотреть</h1>

<!-- TODO: плеер #player — добавьте controls и source (audio/mpeg) -->
<audio id="player"></audio>

<!-- TODO: плеер #clip — добавьте controls, poster и source (video/mp4) -->
<video id="clip" width="480"></video>

</body>
</html>`,
        checks: [
          {
            label: "У аудиоплеера есть controls",
            run: (doc) => {
              const a = doc.querySelector("#player");
              return !!a && a.tagName === "AUDIO" && a.hasAttribute("controls");
            },
          },
          {
            label: "В аудио вложен source с типом audio/mpeg",
            run: (doc) => {
              const s = doc.querySelector("#player source");
              return !!s && s.getAttribute("type") === "audio/mpeg" && (s.getAttribute("src") ?? "").length > 0;
            },
          },
          {
            label: "У видео есть controls и постер",
            run: (doc) => {
              const v = doc.querySelector("#clip");
              return !!v && v.tagName === "VIDEO" && v.hasAttribute("controls") && (v.getAttribute("poster") ?? "").length > 0;
            },
          },
          {
            label: "В видео вложен source с типом video/mp4",
            run: (doc) => {
              const s = doc.querySelector("#clip source");
              return !!s && s.getAttribute("type") === "video/mp4" && (s.getAttribute("src") ?? "").length > 0;
            },
          },
        ],
        hint: "Атрибуты пишутся прямо в открывающий тег: <audio id=\"player\" controls>. Source — отдельный вложенный тег: <source src=\"song.mp3\" type=\"audio/mpeg\">. Постер — обычный атрибут poster у video.",
        solution: `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<title>Медиаблок</title>
</head>
<body>
<h1>Слушать и смотреть</h1>

<audio id="player" controls>
  <source src="song.mp3" type="audio/mpeg">
</audio>

<video id="clip" width="480" controls poster="poster.jpg">
  <source src="clip.mp4" type="video/mp4">
</video>

</body>
</html>`,
      },
    },

    /* ================= УРОК 2: SVG ================= */
    {
      id: "adv-svg",
      title: "SVG: векторные картинки кодом",
      minutes: 10,
      intro:
        "Иконки, логотипы и простые иллюстрации можно не рисовать в редакторе и не таскать файлами, а писать кодом прямо в HTML. Это SVG — векторная графика, которая не теряет резкости на любом экране. Сегодня нарисуем картинку из трёх фигур.",
      theory: [
        {
          t: "h",
          text: "Картинка как разметка",
        },
        {
          t: "p",
          text: "SVG живёт в теге `<svg>` и состоит из обычных тегов-фигур: `<circle>` — круг, `<rect>` — прямоугольник, `<line>` — линия, `<polygon>` — многоугольник по точкам, `<path>` — произвольная линия. Каждая фигура описывается атрибутами: положение, размер и цвет заливки `fill`. Браузер не хранит картинку попиксельно — он каждый раз перерисовывает её по этим инструкциям, поэтому SVG одинаково чёткий и на телефоне, и на огромном мониторе.",
        },
        {
          t: "code",
          code: '<svg width="200" height="120" viewBox="0 0 200 120">\n  <circle cx="160" cy="28" r="16" fill="#fbbf24" />\n  <rect x="0" y="100" width="200" height="20" fill="#4ade80" />\n</svg>',
          caption: "Солнце и полоса травы — две фигуры",
        },
        {
          t: "h",
          text: "Координаты и viewBox",
        },
        {
          t: "p",
          text: "Внутри SVG своя система координат: начало — левый верхний угол, `x` растёт вправо, `y` — вниз. Атрибут `viewBox=\"0 0 200 120\"` задаёт «холст» 200×120 условных единиц; атрибуты `width` и `height` у `<svg>` говорят, какого размера показать этот холст на странице. Фигуры рисуются по порядку: что позже в коде, то лежит поверх.",
        },
        {
          t: "note",
          text: "Почему иконки почти всегда SVG, а фотографии — нет: иконка — это несколько фигур с ровными краями, её описание весит меньше килобайта и масштабируется бесконечно. Фотографию фигурами не опишешь — для неё остаются обычные растровые форматы.",
        },
      ],
      example: {
        caption: "Пейзаж из пяти фигур: солнце, трава, дом, крыша и дверь",
        code: `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<title>SVG-пейзаж</title>
</head>
<body>
<h1>Домик в поле</h1>
<svg width="300" height="180" viewBox="0 0 200 120">
  <circle cx="168" cy="26" r="15" fill="#fbbf24" />
  <rect x="0" y="98" width="200" height="22" fill="#4ade80" />
  <rect x="28" y="58" width="58" height="40" fill="#fca5a5" />
  <polygon points="20,58 57,34 94,58" fill="#92400e" />
  <rect x="50" y="76" width="14" height="22" fill="#78350f" />
</svg>
<p>Вся картинка выше — пять тегов, ни одного файла.</p>
</body>
</html>`,
      },
      task: {
        brief:
          "В заготовке есть пустой `<svg id=\"pic\" viewBox=\"0 0 200 120\">`. Нарисуйте в нём пейзаж из трёх фигур: круг-солнце с любой заливкой (атрибут `fill`), прямоугольник (дом или трава) и крышу — `polygon` по трём точкам или `path`. Порядок фигур в коде — это порядок слоёв: солнце и траву логично положить раньше дома.",
        starter: `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<title>Мой SVG</title>
</head>
<body>
<h1>Картинка кодом</h1>

<svg id="pic" width="300" height="180" viewBox="0 0 200 120">
  <!-- TODO: круг-солнце с атрибутом fill -->
  <!-- TODO: прямоугольник -->
  <!-- TODO: крыша — polygon или path -->
</svg>

</body>
</html>`,
        checks: [
          {
            label: "В SVG есть круг с заливкой fill",
            run: (doc) => {
              const c = doc.querySelector("#pic circle");
              return !!c && (c.getAttribute("fill") ?? "").trim().length > 0;
            },
          },
          {
            label: "В SVG есть прямоугольник",
            run: (doc) => !!doc.querySelector("#pic rect"),
          },
          {
            label: "Крыша нарисована через polygon или path",
            run: (doc) => !!doc.querySelector("#pic polygon, #pic path"),
          },
        ],
        hint: "Круг: <circle cx=\"160\" cy=\"28\" r=\"16\" fill=\"#fbbf24\" />. Прямоугольник: <rect x=\"30\" y=\"60\" width=\"60\" height=\"40\" fill=\"#fca5a5\" />. Крыша: <polygon points=\"25,60 60,35 95,60\" fill=\"#92400e\" /> — точки идут парами x,y через пробел.",
        solution: `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<title>Мой SVG</title>
</head>
<body>
<h1>Картинка кодом</h1>

<svg id="pic" width="300" height="180" viewBox="0 0 200 120">
  <circle cx="160" cy="28" r="16" fill="#fbbf24" />
  <rect x="0" y="100" width="200" height="20" fill="#4ade80" />
  <rect x="30" y="60" width="60" height="40" fill="#fca5a5" />
  <polygon points="25,60 60,35 95,60" fill="#92400e" />
</svg>

</body>
</html>`,
      },
    },

    /* ================= УРОК 3: CANVAS ================= */
    {
      id: "adv-canvas",
      title: "Canvas: рисуем через JavaScript",
      minutes: 11,
      intro:
        "SVG описывает картинку тегами, а canvas — наоборот: пустой холст, на котором JavaScript рисует командами, как художник кистью. Так делают игры, графики и редакторы. Освоим базу: холст, контекст и две главные команды — прямоугольник и круг.",
      theory: [
        {
          t: "h",
          text: "Холст и контекст",
        },
        {
          t: "p",
          text: "Тег `<canvas>` — просто прямоугольная область с шириной и высотой в пикселях. Само рисование делает объект-контекст: его получают командой `canvas.getContext(\"2d\")`. Дальше все команды адресуют контексту: выбрать цвет (`fillStyle`), нарисовать залитый прямоугольник (`fillRect`), начать фигуру (`beginPath`), дугу (`arc`), залить фигуру (`fill`).",
        },
        {
          t: "code",
          code: 'const canvas = document.querySelector("#scene");\nconst ctx = canvas.getContext("2d");\n\nctx.fillStyle = "#87ceeb";\nctx.fillRect(0, 0, 300, 200); // x, y, ширина, высота',
          caption: "Заливка всего холста одним прямоугольником",
        },
        {
          t: "h",
          text: "Круг — это дуга на 360 градусов",
        },
        {
          t: "p",
          text: "Отдельной команды «круг» нет: круг — полная дуга. `arc(x, y, радиус, 0, Math.PI * 2)` описывает окружность, а `fill()` заливает её текущим `fillStyle`. Перед новой фигурой вызывают `beginPath()`, иначе браузер продолжит предыдущий контур и зальёт лишнего.",
        },
        {
          t: "note",
          text: "Canvas или SVG — что выбрать: SVG хранит фигуры как элементы страницы (их можно красить CSS и нажимать), а canvas — просто пиксели: нарисовал и забыл, что это было. Для иконок и схем — SVG, для игр, графиков с тысячами точек и обработки фото — canvas.",
        },
      ],
      example: {
        caption: "Тот же пейзаж, но нарисованный скриптом: небо, солнце и полоса травы",
        code: `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<title>Canvas</title>
</head>
<body>
<h1>Холст</h1>
<canvas id="view" width="300" height="200"></canvas>

<script>
const view = document.querySelector("#view");
const ctx = view.getContext("2d");

ctx.fillStyle = "#87ceeb";
ctx.fillRect(0, 0, 300, 200);

ctx.fillStyle = "#ffd93b";
ctx.beginPath();
ctx.arc(250, 45, 24, 0, Math.PI * 2);
ctx.fill();

ctx.fillStyle = "#4ade80";
ctx.fillRect(0, 160, 300, 40);
</script>
</body>
</html>`,
      },
      task: {
        brief:
          "В заготовке есть холст `<canvas id=\"scene\" width=\"300\" height=\"200\">` и пустой скрипт. Нарисуйте небо и солнце строго так: сначала `fillStyle` — `#87ceeb` и `fillRect(0, 0, 300, 200)` на весь холст; затем `fillStyle` — `#ffd93b`, `beginPath()`, дуга `arc(250, 45, 24, 0, Math.PI * 2)` и `fill()`. Проверка смотрит прямо на пиксели холста.",
        starter: `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<title>Небо и солнце</title>
</head>
<body>
<h1>Рисуем кодом</h1>
<canvas id="scene" width="300" height="200"></canvas>

<script>
// TODO: найдите холст #scene и получите контекст "2d"
// TODO: fillStyle = "#87ceeb", залейте весь холст через fillRect
// TODO: fillStyle = "#ffd93b", beginPath, arc(250, 45, 24, 0, Math.PI * 2), fill
</script>
</body>
</html>`,
        checks: [
          {
            label: "Холст на месте и имеет размер 300×200",
            run: (doc) => {
              const c = doc.querySelector("#scene") as HTMLCanvasElement | null;
              return !!c && c.width === 300 && c.height === 200;
            },
          },
          {
            label: "Прямоугольник и круг действительно нарисованы",
            run: (doc) => {
              const c = doc.querySelector("#scene") as HTMLCanvasElement | null;
              if (!c) return false;
              const calls = (c as unknown as { __drawCalls?: string[] }).__drawCalls;
              if (Array.isArray(calls)) {
                return calls.some((x) => x.startsWith("fillRect")) && calls.some((x) => x === "arc") && calls.some((x) => x === "fill");
              }
              try {
                const ctx = c.getContext("2d");
                if (!ctx) return false;
                const corner = ctx.getImageData(10, 190, 1, 1).data;
                const sun = ctx.getImageData(250, 45, 1, 1).data;
                const near = (px: Uint8ClampedArray, r: number, g: number, b: number, tol: number) =>
                  Math.abs(px[0] - r) <= tol && Math.abs(px[1] - g) <= tol && Math.abs(px[2] - b) <= tol && px[3] > 200;
                return near(corner, 135, 206, 235, 12) && near(sun, 255, 217, 59, 18);
              } catch {
                return false;
              }
            },
          },
        ],
        hint: "const scene = document.querySelector(\"#scene\"); const ctx = scene.getContext(\"2d\"); Дальше по шагам из задания: цвет — fillRect — новый цвет — beginPath — arc — fill. Не забудьте beginPath перед дугой.",
        solution: `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<title>Небо и солнце</title>
</head>
<body>
<h1>Рисуем кодом</h1>
<canvas id="scene" width="300" height="200"></canvas>

<script>
const scene = document.querySelector("#scene");
const ctx = scene.getContext("2d");

ctx.fillStyle = "#87ceeb";
ctx.fillRect(0, 0, 300, 200);

ctx.fillStyle = "#ffd93b";
ctx.beginPath();
ctx.arc(250, 45, 24, 0, Math.PI * 2);
ctx.fill();
</script>
</body>
</html>`,
      },
    },

    /* ================= УРОК 4: ДОСТУПНОСТЬ ================= */
    {
      id: "adv-a11y",
      title: "Доступность: ARIA, клавиатура, фокус",
      minutes: 10,
      intro:
        "Часть ваших посетителей пользуется сайтом не глазами и мышью, а скринридером и клавиатурой: незрячие люди, люди с нарушениями моторики, да и просто человек со сломанной мышью. Доступность — это когда страница честно рассказывает о себе кодом: что за картинка, где поле ввода, что делает кнопка.",
      theory: [
        {
          t: "h",
          text: "Три кита доступности",
        },
        {
          t: "list",
          items: [
            "**Текст для картинок.** Атрибут `alt` у `<img>`: скринридер читает его вслух. Хороший alt описывает смысл картинки, а не слово «картинка».",
            "**Подписи к полям.** Тег `<label for=\"email\">`, связанный с полем по его `id`: скринридер называет поле, а клик по подписи ставит курсор в поле.",
            "**Настоящие кнопки.** `<button>` нажимается с клавиатуры (Tab + Enter или пробел) бесплатно. Кликабельный `<div>` клавиатурой не управляется вообще.",
          ],
        },
        {
          t: "h",
          text: "ARIA — подсказки для скринридеров",
        },
        {
          t: "p",
          text: "ARIA — набор атрибутов, которые дополняют то, что скринридер и так знает из тегов. Самый частый — `aria-label`: подпись элемента, которая не видна на экране, но читается вслух. Нужна там, где у элемента нет видимого текста: кнопка-крестик, кнопка с одной иконкой. Писать aria-label на каждый элемент не надо: если у кнопки есть нормальный текст, скринридер прочитает его и без ARIA.",
        },
        {
          t: "note",
          text: "Главное правило ARIA: никакая ARIA лучше, чем плохая ARIA. Сначала используйте правильный тег (button, label, заголовки по порядку) — в 90% случаев этого достаточно. Атрибуты добавляйте там, где тега не хватает, как у кнопки-иконки.",
        },
        {
          t: "p",
          text: "И ещё про фокус: элемент в фокусе браузер обводит рамкой. Стиль `outline: none` без замены эту рамку убивает — и клавиатурный пользователь перестаёт понимать, где он находится. Убираете стандартную рамку — рисуйте свою через `:focus-visible`.",
        },
      ],
      example: {
        caption: "Та же форма, но доступная: подпись связана с полем, у картинки есть alt, крестик — настоящая кнопка с aria-label",
        code: `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<title>Подписка</title>
<style>
  button:focus-visible, input:focus-visible { outline: 3px solid #7c3aed; outline-offset: 2px; }
</style>
</head>
<body>
<h1>Подписка на новости</h1>
<img src="cat.jpg" alt="Рыжий кот спит на подоконнике" width="200">
<form>
  <label for="mail">Электронная почта</label>
  <input id="mail" type="email" placeholder="you@example.com">
  <button type="submit">Подписаться</button>
  <button type="button" aria-label="Закрыть окно">×</button>
</form>
</body>
</html>`,
      },
      task: {
        brief:
          "В заготовке — недоступная карточка: картинка без `alt`, поле почты без подписи и кликабельный `<div id=\"closeBtn\">×</div>` вместо кнопки. Исправьте всё три: 1) дайте картинке осмысленный `alt` (минимум 3 символа, по смыслу картинки — кот на подоконнике); 2) добавьте `<label for=\"email\">` с текстом подписи, связанную с полем `id=\"email\"`; 3) замените div-крестик на настоящий `<button>` с `aria-label=\"Закрыть\"`.",
        starter: `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<title>Карточка</title>
</head>
<body>
<h1>Наш талисман</h1>

<!-- TODO 1: добавьте alt картинке -->
<img src="cat.jpg" width="200">

<form>
  <!-- TODO 2: добавьте label, связанную с полем ниже по for="email" -->
  <input id="email" type="email" placeholder="Почта для новостей">
  <button type="submit">Подписаться</button>
</form>

<!-- TODO 3: замените этот div на <button aria-label="Закрыть">×</button> -->
<div id="closeBtn">×</div>

</body>
</html>`,
        checks: [
          {
            label: "У картинки есть осмысленный alt",
            run: (doc) => {
              const img = doc.querySelector("img");
              const alt = (img?.getAttribute("alt") ?? "").trim();
              return alt.length >= 3 && alt.toLowerCase() !== "image";
            },
          },
          {
            label: "Поле почты связано с подписью label for=\"email\"",
            run: (doc) => {
              const label = doc.querySelector('label[for="email"]');
              const input = doc.querySelector("#email");
              return !!label && (label.textContent ?? "").trim().length > 0 && !!input;
            },
          },
          {
            label: "Крестик — настоящая кнопка с aria-label «Закрыть»",
            run: (doc) => !!doc.querySelector('button[aria-label="Закрыть"]'),
          },
        ],
        hint: "Alt пишется прямо в тег img: alt=\"Кот на подоконнике\". Подпись: <label for=\"email\">Электронная почта</label> — for должен совпадать с id поля. Div замените целиком на <button type=\"button\" aria-label=\"Закрыть\">×</button>.",
        solution: `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<title>Карточка</title>
</head>
<body>
<h1>Наш талисман</h1>

<img src="cat.jpg" width="200" alt="Кот на подоконнике">

<form>
  <label for="email">Электронная почта</label>
  <input id="email" type="email" placeholder="Почта для новостей">
  <button type="submit">Подписаться</button>
</form>

<button type="button" aria-label="Закрыть">×</button>

</body>
</html>`,
      },
    },

    /* ================= УРОК 5: МЕТА-ТЕГИ И OPEN GRAPH ================= */
    {
      id: "adv-meta",
      title: "Мета-теги, Open Graph и микроразметка",
      minutes: 10,
      intro:
        "Страница живёт не только в браузере: её показывают поиском в выдаче и мессенджеры — когда кто-то делится ссылкой. Что именно они покажут, решаете вы — мета-тегами в <head>. Разберём описание для поиска, Open Graph для репостов и микроразметку, которая помогает поиску понять тип страницы.",
      theory: [
        {
          t: "h",
          text: "Описание для поиска",
        },
        {
          t: "p",
          text: "Тег `<meta name=\"description\" content=\"...\">` — короткое описание страницы на 150–160 символов. Поиск показывает его под заголовком в выдаче. Это не «волшебный тег для первого места», а ваша возможность сказать человеку до клика, что он найдёт внутри, своими словами, а не случайной цитатой со страницы.",
        },
        {
          t: "h",
          text: "Open Graph: карточка при репосте",
        },
        {
          t: "p",
          text: "Протокол Open Graph — мета-теги с `property=\"og:...\"`. Мессенджер или соцсеть, получив ссылку, собирает из них карточку: заголовок (`og:title`), описание (`og:description`), картинку (`og:image`) и тип страницы (`og:type`: website, article и другие). Без этих тегов карточка соберётся как попало — из первого заголовка и случайной картинки.",
        },
        {
          t: "code",
          code: '<meta name="description" content="Рецепт домашнего хлеба: мука, вода, дрожжи и три часа терпения.">\n<meta property="og:title" content="Домашний хлеб за три часа">\n<meta property="og:description" content="Простой рецепт с пошаговыми фото.">\n<meta property="og:type" content="article">',
          caption: "Минимум, который стоит иметь каждой странице",
        },
        {
          t: "h",
          text: "Микроразметка: объяснить поиску, что это",
        },
        {
          t: "p",
          text: "Микроразметка schema.org в формате JSON-LD — блок `<script type=\"application/ld+json\">` с JSON, где страница прямо называет себя: это статья (`Article`), рецепт (`Recipe`), товар (`Product`) — и перечисляет свойства: автор, дата, время готовки. Поиск использует это для расширенных сниппетов — со звёздочками, временем и картинками прямо в выдаче.",
        },
        {
          t: "note",
          text: "Почему всё это пишется один раз и в <head>: мета-теги не видны посетителю, но их читают роботы и мессенджеры до загрузки страницы. Сделали шаблон <head> один раз для проекта — и каждая новая страница выходит в мир с нормальным лицом.",
        },
      ],
      example: {
        caption: "Полный набор головы страницы рецепта: описание, Open Graph и JSON-LD",
        code: `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<title>Домашний хлеб — рецепт</title>
<meta name="description" content="Простой рецепт домашнего хлеба: хрустящая корочка, мягкий мякиш и всего четыре ингредиента.">
<meta property="og:title" content="Домашний хлеб за три часа">
<meta property="og:description" content="Пошаговый рецепт хлеба без хлебопечки: замес, расстойка, выпечка.">
<meta property="og:type" content="article">
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Домашний хлеб за три часа"
}
<\/script>
</head>
<body>
<h1>Домашний хлеб за три часа</h1>
<p>Мука, вода, дрожжи, соль — и терпение.</p>
</body>
</html>`,
      },
      task: {
        brief:
          "Страница рецепта в заготовке выходит в мир «без лица»: в `<head>` только заголовок. Добавьте: 1) `meta description` — описание страницы про хлеб длиной не меньше 30 символов; 2) `og:title` с заголовком статьи; 3) `og:description` длиной не меньше 20 символов; 4) `og:type` со значением `website`; 5) JSON-LD блок (`script type=\"application/ld+json\"`) с `@context` на schema.org и `@type` равным `Article`. JSON должен быть валидным — проверка его распарсит.",
        starter: `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<title>Домашний хлеб — рецепт</title>
<!-- TODO: meta description (не короче 30 символов, про хлеб) -->
<!-- TODO: og:title, og:description (не короче 20 символов), og:type = website -->
<!-- TODO: JSON-LD: @context — schema.org, @type — Article -->
</head>
<body>
<h1>Домашний хлеб за три часа</h1>
<p>Мука, вода, дрожжи, соль — и терпение.</p>
</body>
</html>`,
        checks: [
          {
            label: "Есть meta description длиной от 30 символов",
            run: (doc) => {
              const m = doc.querySelector('meta[name="description"]');
              return !!m && (m.getAttribute("content") ?? "").trim().length >= 30;
            },
          },
          {
            label: "Есть og:title и og:type равен website",
            run: (doc) => {
              const t = doc.querySelector('meta[property="og:title"]');
              const ty = doc.querySelector('meta[property="og:type"]');
              return !!t && (t.getAttribute("content") ?? "").trim().length > 0 && (ty?.getAttribute("content") ?? "") === "website";
            },
          },
          {
            label: "Есть og:description длиной от 20 символов",
            run: (doc) => {
              const d = doc.querySelector('meta[property="og:description"]');
              return !!d && (d.getAttribute("content") ?? "").trim().length >= 20;
            },
          },
          {
            label: "JSON-LD валиден: schema.org и @type Article",
            run: (doc) => {
              const s = doc.querySelector('script[type="application/ld+json"]');
              if (!s) return false;
              try {
                const data = JSON.parse(s.textContent ?? "") as { "@context"?: string; "@type"?: string };
                return String(data["@context"] ?? "").includes("schema.org") && data["@type"] === "Article";
              } catch {
                return false;
              }
            },
          },
        ],
        hint: "Все мета-теги идут в <head>. JSON-LD — обычный JSON в кавычках, без запятой после последнего поля: {\"@context\": \"https://schema.org\", \"@type\": \"Article\", \"headline\": \"Домашний хлеб за три часа\"}.",
        solution: `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<title>Домашний хлеб — рецепт</title>
<meta name="description" content="Простой рецепт домашнего хлеба: хрустящая корочка, мягкий мякиш и всего четыре ингредиента.">
<meta property="og:title" content="Домашний хлеб за три часа">
<meta property="og:description" content="Пошаговый рецепт хлеба без хлебопечки: замес, расстойка, выпечка.">
<meta property="og:type" content="website">
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Домашний хлеб за три часа"
}
<\/script>
</head>
<body>
<h1>Домашний хлеб за три часа</h1>
<p>Мука, вода, дрожжи, соль — и терпение.</p>
</body>
</html>`,
      },
    },

    /* ================= УРОК 6: CSS-ПЕРЕМЕННЫЕ И ТЁМНАЯ ТЕМА ================= */
    {
      id: "adv-cssvars",
      title: "CSS-переменные и тёмная тема",
      minutes: 10,
      intro:
        "В основном курсе тёмная тема делалась отдельным классом с переписанными цветами. Есть способ чище: вынести цвета в переменные и для тёмной темы менять только значения переменных, а не каждое правило. Заодно это стандартный приём для любых «настроек оформления» сайта.",
      theory: [
        {
          t: "h",
          text: "Переменная — имя вместо значения",
        },
        {
          t: "p",
          text: "CSS-переменная объявляется в правиле `:root` (это псевдокласс самого корневого элемента страницы): `--bg: #ffffff;`. Дальше по всему CSS вместо значения пишут `var(--bg)`. Смысл тот же, что у переменных в JavaScript: цвет задан в одном месте — поменяли его там, обновилась вся страница.",
        },
        {
          t: "code",
          code: ":root {\n  --bg: #ffffff;\n  --text: #222222;\n}\n\n.card {\n  background: var(--bg);\n  color: var(--text);\n}",
          caption: "Цвета живут отдельно от правил, которые их используют",
        },
        {
          t: "h",
          text: "Тёмная тема — переопределить переменные",
        },
        {
          t: "p",
          text: "Для тёмной темы не нужно второе оформление каждого блока. Достаточно правила `body.dark`, которое задаёт те же переменные с другими значениями: все блоки, использующие `var(--bg)`, перекрасятся сами. JavaScript при этом только переключает класс `dark` у `<body>` одной строкой — как вы уже делали в основном курсе.",
        },
        {
          t: "note",
          text: "Почему это лучше переписывания цветов: тема — это данные (набор значений), а не копия всей таблицы стилей. Добавить третью тему — значит добавить ещё один блок переменных, а не ещё один полный комплект правил.",
        },
      ],
      example: {
        caption: "Живой пример из основного приёма: карточка на переменных, кнопка переключает класс dark у body",
        code: `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<title>Переменные</title>
<style>
  :root { --bg: #ffffff; --text: #1c1c22; --accent: #7c3aed; }
  body.dark { --bg: #17171f; --text: #f5f5f5; --accent: #a78bfa; }
  body { background: var(--bg); }
  .card { background: var(--bg); color: var(--text); border: 2px solid var(--accent); border-radius: 14px; padding: 20px; }
  .card h2 { color: var(--accent); margin-top: 0; }
</style>
</head>
<body>
<div class="card">
  <h2>Карточка на переменных</h2>
  <p>Нажмите кнопку — поменяются только значения переменных.</p>
  <button id="sw">Переключить тему</button>
</div>

<script>
const sw = document.querySelector("#sw");
sw.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});
<\/script>
</body>
</html>`,
      },
      task: {
        brief:
          "В заготовке карточка `.card` покрашена жёстко прописанными цветами, а кнопки пока нет. Переведите её на переменные: 1) в `:root` объявите `--bg: #ffffff` и `--text: #222222`; 2) `.card` должна использовать `var(--bg)` для фона и `var(--text)` для текста; 3) добавьте правило `body.dark`, переопределяющее `--bg` на `#17171f` и `--text` на `#f5f5f5`; 4) в скрипте подпишите кнопку `#themeBtn` на клик, переключающий класс `dark` у `document.body`.",
        starter: `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<title>Тема на переменных</title>
<style>
/* TODO 1: :root с переменными --bg и --text */
/* TODO 3: правило body.dark с тёмными значениями переменных */
.card {
  /* TODO 2: фон — var(--bg), текст — var(--text) */
  background: #ffffff;
  color: #222222;
  border-radius: 14px;
  padding: 20px;
  border: 1px solid #dddddd;
}
</style>
</head>
<body>
<div class="card">
  <h2>Карточка</h2>
  <p>Эта карточка должна менять тему через переменные.</p>
  <button id="themeBtn">Переключить тему</button>
</div>

<script>
// TODO 4: по клику на #themeBtn переключать класс dark у document.body
</script>
</body>
</html>`,
        checks: [
          {
            label: "В :root объявлены переменные --bg и --text",
            run: (doc) => {
              const css = cssText(doc);
              const root = css.match(/:root\s*{([^}]*)}/);
              return !!root && /--bg\s*:/.test(root[1]) && /--text\s*:/.test(root[1]);
            },
          },
          {
            label: "Карточка использует var(--bg) и var(--text)",
            run: (doc) => {
              const css = cssText(doc);
              const card = css.match(/\.card\s*{([^}]*)}/);
              return !!card && /var\(--bg\)/.test(card[1]) && /var\(--text\)/.test(card[1]);
            },
          },
          {
            label: "Правило body.dark переопределяет --bg",
            run: (doc) => {
              const css = cssText(doc);
              const dark = css.match(/body\.dark\s*{([^}]*)}/);
              return !!dark && /--bg\s*:/.test(dark[1]);
            },
          },
          {
            label: "Кнопка переключает класс dark у body — туда и обратно",
            run: (doc) => {
              const btn = doc.querySelector("#themeBtn") as HTMLButtonElement | null;
              if (!btn) return false;
              btn.click();
              const on = doc.body.classList.contains("dark");
              btn.click();
              const off = doc.body.classList.contains("dark");
              return on && !off;
            },
          },
        ],
        hint: "CSS: :root { --bg: #ffffff; --text: #222222; } и body.dark { --bg: #17171f; --text: #f5f5f5; }. В .card замените значения на var(--bg) и var(--text). Скрипт: document.querySelector(\"#themeBtn\").addEventListener(\"click\", () => document.body.classList.toggle(\"dark\"));",
        solution: `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<title>Тема на переменных</title>
<style>
:root {
  --bg: #ffffff;
  --text: #222222;
}
body.dark {
  --bg: #17171f;
  --text: #f5f5f5;
}
.card {
  background: var(--bg);
  color: var(--text);
  border-radius: 14px;
  padding: 20px;
  border: 1px solid #dddddd;
}
</style>
</head>
<body>
<div class="card">
  <h2>Карточка</h2>
  <p>Эта карточка должна менять тему через переменные.</p>
  <button id="themeBtn">Переключить тему</button>
</div>

<script>
document.querySelector("#themeBtn").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});
</script>
</body>
</html>`,
      },
    },

    /* ================= УРОК 7: ПЕРЕХОДЫ И АНИМАЦИИ ================= */
    {
      id: "adv-anim",
      title: "Переходы и анимации",
      minutes: 10,
      intro:
        "Резкие изменения пугают: кнопка мгновенно сменила цвет — было ли это ответом на наведение? Движение делает интерфейс понятным: видно, что изменилось и почему. В CSS за это отвечают переходы (от состояния к состоянию) и анимации (свой собственный сценарий движения).",
      theory: [
        {
          t: "h",
          text: "Transition: плавный путь между состояниями",
        },
        {
          t: "p",
          text: "Свойство `transition` говорит браузеру: «когда это свойство изменится — не переключай резко, а плавно перейди за указанное время». Классика — кнопка: в обычном состоянии один фон, в `:hover` другой, а `transition: background 0.3s` делает смену цвета мягкой. Перечислять можно несколько свойств через запятую или написать `all`.",
        },
        {
          t: "code",
          code: ".btn {\n  background: #7c3aed;\n  transition: background 0.3s, transform 0.3s;\n}\n.btn:hover {\n  background: #5b21b6;\n  transform: translateY(-2px);\n}",
          caption: "Состояния задаёте вы, плавность — браузер",
        },
        {
          t: "h",
          text: "Keyframes: анимация со своим сценарием",
        },
        {
          t: "p",
          text: "Если движение не привязано к состоянию, а живёт само — пульсирующий индикатор, бегущая строка, подъезжающий блок, — используют `@keyframes`: вы описываете кадры (`from`/`to` или проценты), а элемент подключает сценарий свойством `animation`: имя, длительность, число повторов (`infinite` — бесконечно) и направление (`alternate` — туда-обратно).",
        },
        {
          t: "code",
          code: "@keyframes move {\n  from { transform: translateX(0); }\n  to { transform: translateX(60px); }\n}\n\n.box { animation: move 2s infinite alternate; }",
          caption: "Сценарий описан один раз — играет сам",
        },
        {
          t: "note",
          text: "Уважайте вестибулярный аппарат: у части людей анимации вызывают головокружение. Для них существует медиа-запрос prefers-reduced-motion — в нём бесконечные анимации отключают или делают статичными. Одна строчка в CSS, а кому-то она экономит самочувствие.",
        },
      ],
      example: {
        caption: "Кнопка с плавным hover и блок, который сам ездит по keyframes",
        code: `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<title>Анимации</title>
<style>
  .btn { background: #7c3aed; color: #fff; border: none; padding: 12px 22px; border-radius: 10px; font-size: 16px; cursor: pointer; transition: background 0.3s, transform 0.3s; }
  .btn:hover { background: #5b21b6; transform: translateY(-2px); }
  .box { width: 60px; height: 60px; border-radius: 14px; background: #f59e0b; margin-top: 24px; animation: move 2s infinite alternate; }
  @keyframes move { from { transform: translateX(0); } to { transform: translateX(60px); } }
</style>
</head>
<body>
<button class="btn">Наведи на меня</button>
<div class="box"></div>
</body>
</html>`,
      },
      task: {
        brief:
          "В заготовке кнопка `.btn` меняет цвет резко, а блок `.box` стоит мёртво. Оживите оба: 1) в правило `.btn` добавьте `transition` (например, `background 0.3s` или `all 0.3s`); 2) добавьте правило `.btn:hover` с другим цветом фона; 3) опишите `@keyframes move`: `from` — `transform: translateX(0)`, `to` — `transform: translateX(60px)`; 4) подключите анимацию к `.box`: `animation: move 2s infinite alternate;`.",
        starter: `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<title>Оживляем</title>
<style>
.btn {
  background: #7c3aed;
  color: #fff;
  border: none;
  padding: 12px 22px;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
  /* TODO 1: transition */
}
/* TODO 2: .btn:hover с другим фоном */
.box {
  width: 60px;
  height: 60px;
  border-radius: 14px;
  background: #f59e0b;
  margin-top: 24px;
  /* TODO 4: animation: move 2s infinite alternate */
}
/* TODO 3: @keyframes move — from translateX(0) to translateX(60px) */
</style>
</head>
<body>
<button class="btn">Кнопка</button>
<div class="box"></div>
</body>
</html>`,
        checks: [
          {
            label: "У кнопки есть transition",
            run: (doc) => /\.btn\s*{[^}]*transition\s*:/.test(cssText(doc)),
          },
          {
            label: "Есть правило .btn:hover с фоном",
            run: (doc) => /\.btn:hover\s*{[^}]*background/.test(cssText(doc)),
          },
          {
            label: "Описаны @keyframes move с translateX",
            run: (doc) => {
              const css = cssText(doc);
              return /@keyframes\s+move/.test(css) && css.includes("translateX(60px)");
            },
          },
          {
            label: "Блок .box подключён к анимации move",
            run: (doc) => /\.box\s*{[^}]*animation\s*:[^;}]*move/.test(cssText(doc)),
          },
        ],
        hint: "Всё делается в CSS, скрипт не нужен. .btn { transition: background 0.3s; } .btn:hover { background: #5b21b6; } @keyframes move { from { transform: translateX(0); } to { transform: translateX(60px); } } .box { animation: move 2s infinite alternate; }",
        solution: `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<title>Оживляем</title>
<style>
.btn {
  background: #7c3aed;
  color: #fff;
  border: none;
  padding: 12px 22px;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s;
}
.btn:hover {
  background: #5b21b6;
}
.box {
  width: 60px;
  height: 60px;
  border-radius: 14px;
  background: #f59e0b;
  margin-top: 24px;
  animation: move 2s infinite alternate;
}
@keyframes move {
  from { transform: translateX(0); }
  to { transform: translateX(60px); }
}
</style>
</head>
<body>
<button class="btn">Кнопка</button>
<div class="box"></div>
</body>
</html>`,
      },
    },

    /* ================= УРОК 8: ВАЛИДАЦИЯ ФОРМ ================= */
    {
      id: "adv-forms",
      title: "Формы: валидация и состояния",
      minutes: 11,
      intro:
        "Форма, которая принимает что угодно, — дыра в данных: «почта» без собаки, пустое имя, заказ без телефона. Браузер умеет проверять поля сам, без сервера и библиотек: атрибутами разметки, псевдоклассами состояний и парой методов в JavaScript. Разберём весь набор.",
      theory: [
        {
          t: "h",
          text: "Проверка атрибутами",
        },
        {
          t: "list",
          items: [
            "`required` — поле нельзя оставить пустым",
            "`type=\"email\"` — браузер сам проверяет формат почты, а телефон покажет клавиатуру с собакой",
            "`minlength` / `maxlength` — границы длины текста",
            "`pattern` — своё регулярное выражение, например для кода из цифр",
          ],
        },
        {
          t: "p",
          text: "Пока поле не проходит проверку, оно находится в состоянии `:invalid`, когда проходит — `:valid`. На эти псевдоклассы вешают оформление: красную рамку у невалидного поля. Тонкость: при загрузке страницы пустое required-поле уже `:invalid` — красить его красным сразу, до касания, грубо. В боевых проектах класс «поле трогали» добавляют скриптом; для нашего урока достаточно простой версии.",
        },
        {
          t: "h",
          text: "Отправка без сервера",
        },
        {
          t: "p",
          text: "По умолчанию отправка формы перезагружает страницу и уводит данные на сервер. Если обработчик на событие `submit` вызывает `event.preventDefault()`, перезагрузки не будет: скрипт сам решает, что дальше. Метод формы `checkValidity()` возвращает, проходят ли все её поля проверку, а `reportValidity()` ещё и показывает пользователю встроенные подсказки браузера у проблемных полей.",
        },
        {
          t: "code",
          code: 'form.addEventListener("submit", (e) => {\n  e.preventDefault();\n  if (form.checkValidity()) {\n    // всё в порядке — показываем успех\n  } else {\n    form.reportValidity(); // браузер сам укажет на ошибки\n  }\n});',
          caption: "Шаблон обработки формы без сервера",
        },
      ],
      example: {
        caption: "Форма с атрибутами, красной рамкой у :invalid и сообщением об успехе без перезагрузки",
        code: `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<title>Регистрация</title>
<style>
  input { padding: 10px; border: 2px solid #cccccc; border-radius: 8px; display: block; margin: 8px 0 14px; }
  input:invalid { border-color: #dc2626; }
  input:valid { border-color: #16a34a; }
</style>
</head>
<body>
<h1>Регистрация</h1>
<form id="reg">
  <label>Имя <input id="nm" required minlength="2" placeholder="Минимум 2 символа"></label>
  <label>Почта <input id="em" type="email" required placeholder="you@example.com"></label>
  <button type="submit">Отправить</button>
</form>
<p id="ok"></p>

<script>
const form = document.querySelector("#reg");
const ok = document.querySelector("#ok");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (form.checkValidity()) {
    ok.textContent = "Готово, " + document.querySelector("#nm").value + "!";
  } else {
    form.reportValidity();
  }
});
<\/script>
</body>
</html>`,
      },
      task: {
        brief:
          "Доведите форму регистрации в заготовке до рабочего состояния. Разметка: полю `#name` — `required` и `minlength=\"2\"`, полю `#email` — `type=\"email\"` и `required`. Стили: правило `input:invalid` с красной рамкой (`border-color`). Скрипт: обработчик `submit` у формы `#reg` — отменяет перезагрузку; если `checkValidity()` проходит, пишет в `#done` ровно «Готово, {имя}!», иначе вызывает `reportValidity()`.",
        starter: `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<title>Регистрация</title>
<style>
input { padding: 10px; border: 2px solid #cccccc; border-radius: 8px; display: block; margin: 8px 0 14px; }
/* TODO: правило input:invalid с красной рамкой border-color */
</style>
</head>
<body>
<h1>Регистрация</h1>
<form id="reg">
  <label>Имя <input id="name" placeholder="Ваше имя"></label>
  <label>Почта <input id="email" placeholder="you@example.com"></label>
  <button type="submit">Отправить</button>
</form>
<p id="done"></p>

<script>
// TODO: обработчик submit у #reg:
//   e.preventDefault();
//   если form.checkValidity() — в #done текст «Готово, {имя}!»
//   иначе form.reportValidity()
</script>
</body>
</html>`,
        checks: [
          {
            label: "Имя: required и minlength=2; почта: type=email и required",
            run: (doc) => {
              const name = doc.querySelector("#name") as HTMLInputElement | null;
              const email = doc.querySelector("#email") as HTMLInputElement | null;
              if (!name || !email) return false;
              return (
                name.hasAttribute("required") &&
                name.getAttribute("minlength") === "2" &&
                email.getAttribute("type") === "email" &&
                email.hasAttribute("required")
              );
            },
          },
          {
            label: "Есть стиль input:invalid",
            run: (doc) => /input\s*:invalid/.test(cssText(doc)),
          },
          {
            label: "checkValidity честно отличает плохую почту от хорошей",
            run: (doc) => {
              const form = doc.querySelector("#reg") as HTMLFormElement | null;
              const name = doc.querySelector("#name") as HTMLInputElement | null;
              const email = doc.querySelector("#email") as HTMLInputElement | null;
              if (!form || !name || !email) return false;
              name.value = "Аня";
              email.value = "не-почта";
              const bad = form.checkValidity();
              email.value = "anya@example.com";
              const good = form.checkValidity();
              return bad === false && good === true;
            },
          },
          {
            label: "При валидной отправке появляется «Готово, Аня!»",
            run: (doc, win) => {
              const form = doc.querySelector("#reg") as HTMLFormElement | null;
              const name = doc.querySelector("#name") as HTMLInputElement | null;
              const email = doc.querySelector("#email") as HTMLInputElement | null;
              const done = doc.querySelector("#done");
              const btn = doc.querySelector('#reg button[type="submit"]') as HTMLButtonElement | null;
              if (!form || !name || !email || !done || !btn) return false;
              name.value = "Аня";
              email.value = "anya@example.com";
              btn.click();
              if ((done.textContent ?? "").trim() !== "Готово, Аня!") {
                form.dispatchEvent(new (win as unknown as { Event: typeof Event }).Event("submit", { bubbles: true, cancelable: true }));
              }
              return (done.textContent ?? "").trim() === "Готово, Аня!";
            },
          },
        ],
        hint: "Атрибуты — прямо в теги input. Стиль: input:invalid { border-color: #dc2626; }. Скрипт — по шаблону из теории; имя для сообщения берите из document.querySelector(\"#name\").value.",
        solution: `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<title>Регистрация</title>
<style>
input { padding: 10px; border: 2px solid #cccccc; border-radius: 8px; display: block; margin: 8px 0 14px; }
input:invalid { border-color: #dc2626; }
</style>
</head>
<body>
<h1>Регистрация</h1>
<form id="reg">
  <label>Имя <input id="name" required minlength="2" placeholder="Ваше имя"></label>
  <label>Почта <input id="email" type="email" required placeholder="you@example.com"></label>
  <button type="submit">Отправить</button>
</form>
<p id="done"></p>

<script>
const form = document.querySelector("#reg");
const done = document.querySelector("#done");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (form.checkValidity()) {
    done.textContent = "Готово, " + document.querySelector("#name").value + "!";
  } else {
    form.reportValidity();
  }
});
</script>
</body>
</html>`,
      },
    },

    /* ================= УРОК 9: LOCALSTORAGE ================= */
    {
      id: "adv-storage",
      title: "localStorage: сохраняем данные между заходами",
      minutes: 10,
      intro:
        "До сих пор страница забывала всё при перезагрузке. У браузера есть встроенное хранилище — localStorage: пары «ключ — значение», которые живут в браузере пользователя днями и неделями, без сервера и регистрации. Тёмная тема, имя в приветствии, черновик письма — всё это оно.",
      theory: [
        {
          t: "h",
          text: "Три команды и одна особенность",
        },
        {
          t: "code",
          code: 'localStorage.setItem("name", "Аня");   // сохранить\nconst name = localStorage.getItem("name"); // прочитать: "Аня"\nlocalStorage.removeItem("name");       // удалить ключ\n// localStorage.clear();             // удалить всё',
          caption: "Весь интерфейс хранилища для старта",
        },
        {
          t: "p",
          text: "Особенность: localStorage хранит только строки. Число превратится в строку само, а вот массив или объект превратятся в бессмысленное «[object Object]». Поэтому сложные данные сначала упаковывают в строку командой `JSON.stringify`, а при чтении распаковывают обратно через `JSON.parse`. В следующем уроке именно так сохраним список дел.",
        },
        {
          t: "list",
          items: [
            "Данные привязаны к сайту: чужой сайт ваши ключи не прочитает",
            "Хранилище не отправляется на сервер — это память только этого браузера",
            "Объём — около 5 МБ: для настроек и черновиков хватает с запасом",
            "Пароли и секреты сюда класть нельзя: любой скрипт страницы имеет доступ",
          ],
        },
        {
          t: "note",
          text: "Почему в примере и задании чтение и запись завёрнуты в try/catch и маленькую обёртку: в приватном режиме и в некоторых песочницах (включая превью этого урока) браузер может запретить доступ к localStorage и бросить исключение. Боевой код так и пишут: попробовали хранилище — не вышло, работаем с обычной переменной в памяти.",
        },
      ],
      example: {
        caption: "Введите имя и нажмите «Сохранить», затем перезапустите пример — имя подхватится из хранилища",
        code: `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<title>Запоминалка</title>
</head>
<body>
<h1>Запоминалка имени</h1>
<label>Имя: <input id="name" type="text" placeholder="Как вас зовут?"></label>
<button id="save">Сохранить</button>
<p id="hi">Я пока никого не знаю.</p>

<script>
const mem = {};
function saveData(key, value) {
  mem[key] = value;
  try { localStorage.setItem(key, value); } catch (e) {}
}
function loadData(key) {
  try {
    const v = localStorage.getItem(key);
    if (v !== null) return v;
  } catch (e) {}
  return key in mem ? mem[key] : null;
}

const KEY = "demo-name";
const hi = document.querySelector("#hi");

function show() {
  const name = loadData(KEY);
  hi.textContent = name ? "С возвращением, " + name + "!" : "Я пока никого не знаю.";
}

document.querySelector("#save").addEventListener("click", () => {
  saveData(KEY, document.querySelector("#name").value);
  show();
});

show();
<\/script>
</body>
</html>`,
      },
      task: {
        brief:
          "Соберите заметку, которая переживает перезагрузку. В заготовке есть поле `#note`, кнопки `#save`, `#load`, `#clear` и абзац `#saved`. Логика: «Сохранить» — записывает текст поля в хранилище по ключу `adv-note` и сразу показывает его в `#saved`; «Загрузить» — читает из хранилища и показывает в `#saved` (то, что сейчас в поле, игнорируется); «Очистить» — удаляет ключ, и `#saved` показывает «Пока пусто». При открытии страницы `#saved` сразу показывает сохранённое, а если пусто — «Пока пусто». Доступ к localStorage оберните в try/catch с запасным хранением в объекте памяти — как в примере урока.",
        starter: `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<title>Заметка</title>
</head>
<body>
<h1>Заметка</h1>
<label>Текст: <input id="note" type="text" placeholder="Что сохранить?"></label>
<button id="save">Сохранить</button>
<button id="load">Загрузить</button>
<button id="clear">Очистить</button>
<p>Сохранено: <span id="saved">Пока пусто</span></p>

<script>
// Подсказка по структуре:
//   const KEY = "adv-note";
//   объект mem = {} и функции saveData/loadData/removeData с try/catch —
//   как в примере урока.
// TODO: функция show() — читает loadData(KEY) и пишет в #saved
//       (если null — текст «Пока пусто»)
// TODO: обработчики трёх кнопок
// TODO: вызов show() при старте
</script>
</body>
</html>`,
        checks: [
          {
            label: "«Сохранить» показывает текст заметки",
            run: (doc) => {
              const input = doc.querySelector("#note") as HTMLInputElement | null;
              const save = doc.querySelector("#save") as HTMLButtonElement | null;
              const saved = doc.querySelector("#saved");
              if (!input || !save || !saved) return false;
              input.value = "Купить молоко";
              save.click();
              return (saved.textContent ?? "").trim() === "Купить молоко";
            },
          },
          {
            label: "«Загрузить» возвращает сохранённое, а не текущий текст поля",
            run: (doc) => {
              const input = doc.querySelector("#note") as HTMLInputElement | null;
              const save = doc.querySelector("#save") as HTMLButtonElement | null;
              const load = doc.querySelector("#load") as HTMLButtonElement | null;
              const saved = doc.querySelector("#saved");
              if (!input || !save || !load || !saved) return false;
              input.value = "Купить молоко";
              save.click();
              input.value = "Черновик";
              load.click();
              return (saved.textContent ?? "").trim() === "Купить молоко";
            },
          },
          {
            label: "«Очистить» удаляет заметку — снова «Пока пусто»",
            run: (doc) => {
              const input = doc.querySelector("#note") as HTMLInputElement | null;
              const save = doc.querySelector("#save") as HTMLButtonElement | null;
              const clear = doc.querySelector("#clear") as HTMLButtonElement | null;
              const saved = doc.querySelector("#saved");
              if (!input || !save || !clear || !saved) return false;
              input.value = "Купить молоко";
              save.click();
              clear.click();
              return (saved.textContent ?? "").trim() === "Пока пусто";
            },
          },
        ],
        hint: "Возьмите обёртку из примера урока (mem + saveData/loadData/removeData) — она один в один подходит. Дальше: show() пишет в #saved результат loadData(\"adv-note\") или «Пока пусто», кнопки вызывают saveData/removeData и show().",
        solution: `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<title>Заметка</title>
</head>
<body>
<h1>Заметка</h1>
<label>Текст: <input id="note" type="text" placeholder="Что сохранить?"></label>
<button id="save">Сохранить</button>
<button id="load">Загрузить</button>
<button id="clear">Очистить</button>
<p>Сохранено: <span id="saved">Пока пусто</span></p>

<script>
const mem = {};
function saveData(key, value) {
  mem[key] = value;
  try { localStorage.setItem(key, value); } catch (e) {}
}
function loadData(key) {
  try {
    const v = localStorage.getItem(key);
    if (v !== null) return v;
  } catch (e) {}
  return key in mem ? mem[key] : null;
}
function removeData(key) {
  delete mem[key];
  try { localStorage.removeItem(key); } catch (e) {}
}

const KEY = "adv-note";
const input = document.querySelector("#note");
const saved = document.querySelector("#saved");

function show() {
  const v = loadData(KEY);
  saved.textContent = v === null ? "Пока пусто" : v;
}

document.querySelector("#save").addEventListener("click", () => {
  saveData(KEY, input.value);
  show();
});
document.querySelector("#load").addEventListener("click", show);
document.querySelector("#clear").addEventListener("click", () => {
  removeData(KEY);
  show();
});

show();
</script>
</body>
</html>`,
      },
    },

    /* ================= УРОК 10: МИНИ-ПРОЕКТ «СПИСОК ДЕЛ» ================= */
    {
      id: "adv-todo",
      title: "Мини-проект: список дел",
      minutes: 12,
      intro:
        "Финальный проект углублённого курса собирает всё вместе: элементы создаются кодом, а не разметкой; список живёт в массиве-состоянии; каждое изменение перерисовывает экран и сохраняется в localStorage одной строкой JSON. Это ровно та архитектура, что и у настоящих приложений, только в миниатюре.",
      theory: [
        {
          t: "h",
          text: "Элементы, которых не было в разметке",
        },
        {
          t: "p",
          text: "До сих пор все элементы существовали в HTML, а скрипт их только находил. Но список дел нельзя написать заранее — пользователь придумывает пункты на ходу. Новые элементы создаёт `document.createElement(\"li\")`, наполняют через `textContent`, а вставляют в страницу методом `append` у родителя. Удаление — `remove()` у самого элемента или перестройка списка.",
        },
        {
          t: "note",
          text: "Почему текст пункта ставят через textContent, а не innerHTML: textContent показывает текст как текст — даже если пользователь ввёл «<b>важно</b>», страница покажет эти символы, а не жирный шрифт. Через innerHTML такой ввод вставил бы настоящую разметку — так начинаются XSS-атаки.",
        },
        {
          t: "h",
          text: "Один массив — один render",
        },
        {
          t: "p",
          text: "Как в счётчике из основного курса, состояние — одно: массив строк `todos`. Функция `render()` очищает список и строит его заново из массива, заодно обновляя счётчик. Добавление и удаление только меняют массив, вызывают сохранение и `render()` — экран никогда не расходится с данными, потому что рисуется из них каждый раз целиком.",
        },
        {
          t: "code",
          code: 'localStorage.setItem("todos", JSON.stringify(todos));\nconst saved = JSON.parse(localStorage.getItem("todos") || "[]");',
          caption: "Массив туда — строкой, обратно — JSON.parse",
        },
      ],
      example: {
        caption: "Та же архитектура в маленькой версии: список покупок без сохранения — состояние, render, добавление",
        code: `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<title>Покупки</title>
</head>
<body>
<h1>Покупки</h1>
<input id="item" type="text" placeholder="Что купить?">
<button id="add">Добавить</button>
<ul id="list"></ul>

<script>
const items = [];
const list = document.querySelector("#list");
const input = document.querySelector("#item");

function render() {
  list.innerHTML = "";
  items.forEach((text) => {
    const li = document.createElement("li");
    li.textContent = text;
    list.append(li);
  });
}

document.querySelector("#add").addEventListener("click", () => {
  const text = input.value.trim();
  if (!text) return;
  items.push(text);
  input.value = "";
  render();
});

render();
<\/script>
</body>
</html>`,
      },
      task: {
        brief:
          "Соберите список дел целиком. Интерфейс в заготовке: поле `#task`, кнопка `#add`, список `#list` и счётчик `#count` в формате «Дел: N». Требования: 1) по клику «Добавить» непустой текст (после trim) становится пунктом списка: текст в отдельном элементе внутри `li` плюс кнопка удаления внутри того же `li`; пустой ввод игнорируется; 2) кнопка удаления убирает именно свой пункт; 3) счётчик всегда показывает актуальное число дел; 4) после каждого изменения список сохраняется в хранилище по ключу `adv-todos` строкой JSON, а при открытии страницы — восстанавливается из него. Для хранилища используйте обёртку с try/catch из прошлого урока.",
        starter: `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<title>Список дел</title>
</head>
<body>
<h1>Мои дела</h1>
<input id="task" type="text" placeholder="Новое дело">
<button id="add">Добавить</button>
<ul id="list"></ul>
<p id="count">Дел: 0</p>

<script>
// План:
//   1. Обёртка хранилища (mem + saveData/loadData) из прошлого урока,
//      ключ — "adv-todos".
//   2. let todos — массив строк; при старте прочитать JSON из хранилища
//      (JSON.parse, при ошибке или пустоте — пустой массив).
//   3. render(): очистить #list, для каждого дела создать li:
//      span с текстом (textContent!) и button «Удалить»,
//      которая удаляет дело из массива по его индексу.
//      В конце — обновить #count: «Дел: » + todos.length.
//   4. Кнопка #add: trim ввода; пустой — игнор; иначе push,
//      очистить поле. После любого изменения: сохранить JSON и render().
</script>
</body>
</html>`,
        checks: [
          {
            label: "Добавление создаёт пункты, счётчик показывает 2",
            run: (doc) => {
              const input = doc.querySelector("#task") as HTMLInputElement | null;
              const add = doc.querySelector("#add") as HTMLButtonElement | null;
              const count = doc.querySelector("#count");
              if (!input || !add || !count) return false;
              input.value = "Первое дело";
              add.click();
              input.value = "Второе дело";
              add.click();
              const items = Array.from(doc.querySelectorAll("#list li"));
              const texts = items.map((li) => (li.querySelector("span")?.textContent ?? li.textContent ?? "").trim());
              return items.length === 2 && texts[0].includes("Первое дело") && texts[1].includes("Второе дело") && (count.textContent ?? "").includes("2");
            },
          },
          {
            label: "Кнопка удаления убирает свой пункт, счётчик обновляется",
            run: (doc) => {
              const input = doc.querySelector("#task") as HTMLInputElement | null;
              const add = doc.querySelector("#add") as HTMLButtonElement | null;
              const count = doc.querySelector("#count");
              if (!input || !add || !count) return false;
              if (doc.querySelectorAll("#list li").length === 0) {
                input.value = "Первое дело";
                add.click();
                input.value = "Второе дело";
                add.click();
              }
              const first = doc.querySelector("#list li");
              const del = first?.querySelector("button") as HTMLButtonElement | null;
              if (!first || !del) return false;
              del.click();
              const items = Array.from(doc.querySelectorAll("#list li"));
              return items.length === 1 && (items[0].textContent ?? "").includes("Второе дело") && (count.textContent ?? "").includes("1");
            },
          },
          {
            label: "Пустой ввод не добавляет пункт",
            run: (doc) => {
              const input = doc.querySelector("#task") as HTMLInputElement | null;
              const add = doc.querySelector("#add") as HTMLButtonElement | null;
              if (!input || !add) return false;
              const before = doc.querySelectorAll("#list li").length;
              input.value = "   ";
              add.click();
              return doc.querySelectorAll("#list li").length === before;
            },
          },
        ],
        hint: "Скелет — в комментарии заготовки и в примере урока. Не забудьте: внутри render кнопка удаления замыкается на индекс своего дела (todos.splice(i, 1)), а сохранение — saveData(\"adv-todos\", JSON.stringify(todos)) после каждого изменения.",
        solution: `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<title>Список дел</title>
</head>
<body>
<h1>Мои дела</h1>
<input id="task" type="text" placeholder="Новое дело">
<button id="add">Добавить</button>
<ul id="list"></ul>
<p id="count">Дел: 0</p>

<script>
const mem = {};
function saveData(key, value) {
  mem[key] = value;
  try { localStorage.setItem(key, value); } catch (e) {}
}
function loadData(key) {
  try {
    const v = localStorage.getItem(key);
    if (v !== null) return v;
  } catch (e) {}
  return key in mem ? mem[key] : null;
}

const KEY = "adv-todos";
let todos = [];
try {
  const raw = loadData(KEY);
  if (raw) todos = JSON.parse(raw);
  if (!Array.isArray(todos)) todos = [];
} catch (e) {
  todos = [];
}

const input = document.querySelector("#task");
const list = document.querySelector("#list");
const count = document.querySelector("#count");

function saveTodos() {
  saveData(KEY, JSON.stringify(todos));
}

function render() {
  list.innerHTML = "";
  todos.forEach((text, i) => {
    const li = document.createElement("li");
    const span = document.createElement("span");
    span.textContent = text;
    const del = document.createElement("button");
    del.textContent = "Удалить";
    del.addEventListener("click", () => {
      todos.splice(i, 1);
      saveTodos();
      render();
    });
    li.append(span, " ", del);
    list.append(li);
  });
  count.textContent = "Дел: " + todos.length;
}

document.querySelector("#add").addEventListener("click", () => {
  const text = input.value.trim();
  if (!text) return;
  todos.push(text);
  input.value = "";
  saveTodos();
  render();
});

render();
</script>
</body>
</html>`,
      },
    },
  ],
};
