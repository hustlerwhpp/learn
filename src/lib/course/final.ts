import type { CourseModule } from "./types";

/* ---------- helpers для проверок ---------- */

// Разбирает "rgb(r, g, b)" / "rgba(r, g, b, a)" в каналы. null — если не цвет.
function parseRgb(color: string): { r: number; g: number; b: number; a: number } | null {
  const m = color.match(/rgba?\(([^)]+)\)/);
  if (!m) return null;
  const parts = m[1].split(",").map((s) => parseFloat(s.trim()));
  if (parts.length < 3 || parts.some((n) => Number.isNaN(n))) return null;
  return { r: parts[0], g: parts[1], b: parts[2], a: parts.length > 3 ? parts[3] : 1 };
}

function textOf(el: Element | null): string {
  return (el?.textContent ?? "").trim();
}

/* ================= УРОК 1: САЙТ-ВИЗИТКА ================= */

const CARD_EXAMPLE = `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<title>Мария Волкова — визитка</title>
<style>
  body { margin: 0; font-family: Arial, sans-serif; background: #eef0f4; color: #222; }
  header { background: #232733; color: #fff; padding: 28px 20px; text-align: center; }
  main { max-width: 640px; margin: 20px auto; padding: 0 16px; }
  .card { background: #fff; border-radius: 14px; padding: 18px; margin-bottom: 16px; }
  .card img { max-width: 100%; border-radius: 10px; }
  .btn { display: inline-block; background: #4a6cf7; color: #fff; padding: 10px 18px; border-radius: 999px; text-decoration: none; }
  .btn:hover { background: #3553c9; }
  footer { text-align: center; color: #888; padding: 16px; }
  body.light { background: #fdfdf8; }
</style>
</head>
<body>
  <header>
    <h1>Мария Волкова</h1>
    <p>Дизайнер интерфейсов</p>
  </header>
  <main>
    <section class="card">
      <img src="https://picsum.photos/seed/maria/600/320" alt="Рабочее место Марии">
      <p>Привет! Я проектирую удобные интерфейсы для сайтов и приложений.
         Люблю порядок, типографику и аккуратные детали.</p>
    </section>
    <section class="card">
      <h2>Навыки</h2>
      <ul>
        <li>Figma и прототипирование</li>
        <li>HTML и CSS</li>
        <li>Типографика</li>
      </ul>
    </section>
    <section class="card">
      <h2>Контакты</h2>
      <a class="btn" href="mailto:maria@example.com">Написать письмо</a>
      <button id="themeBtn" type="button">Сменить тему</button>
    </section>
  </main>
  <footer>© 2026 Мария Волкова</footer>
  <script>
    var btn = document.getElementById('themeBtn');
    btn.addEventListener('click', function () {
      document.body.classList.toggle('light');
    });
  </script>
</body>
</html>`;

const CARD_STARTER = `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<title>Моя визитка</title>
<style>
  /* Базовые стили уже готовы: */
  body { margin: 0; font-family: Arial, sans-serif; background: #f2f3f7; color: #222; }
  header { padding: 24px 20px; }
  main { max-width: 640px; margin: 0 auto; padding: 0 16px; }

  /* TODO: тёмный фон для header */
  /* TODO: класс .card — белый фон и border-radius не меньше 8px */
  /* TODO: класс .btn — padding и border-radius, чтобы ссылка выглядела кнопкой */
  /* TODO: стили для body.light (светлая тема) */
</style>
</head>
<body>

  <header>
    <!-- TODO: h1 с вашим именем -->
  </header>

  <main>
    <section>
      <!-- TODO: фото (img, src — picsum.photos, не забудьте alt) -->
      <!-- TODO: абзац о себе -->
    </section>

    <section>
      <!-- TODO: список навыков ul, минимум 3 пункта -->
    </section>

    <section>
      <!-- TODO: ссылка mailto с классом btn -->
      <!-- TODO: кнопка «Сменить тему» -->
    </section>
  </main>

  <footer>
    <!-- TODO: подпись, например © и ваше имя -->
  </footer>

  <!-- TODO: скрипт, который по клику переключает класс light у body -->

</body>
</html>`;

const CARD_SOLUTION = `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<title>Анна Соколова — визитка</title>
<style>
  body { margin: 0; font-family: Arial, sans-serif; background: #eceef3; color: #22242a; }
  body.light { background: #fffdf5; color: #2a2a22; }
  header { background: #20242e; color: #ffffff; padding: 30px 20px; text-align: center; }
  header h1 { margin: 0 0 6px; }
  header p { margin: 0; color: #b9c0cf; }
  main { max-width: 640px; margin: 22px auto; padding: 0 16px; }
  .card { background: #ffffff; border-radius: 16px; padding: 20px; margin-bottom: 16px; }
  .card img { max-width: 100%; border-radius: 10px; display: block; }
  .btn { display: inline-block; background: #4a6cf7; color: #ffffff; padding: 10px 18px; border-radius: 999px; text-decoration: none; }
  .btn:hover { background: #3553c9; }
  button { padding: 10px 16px; border-radius: 999px; border: 1px solid #c6cbda; background: transparent; cursor: pointer; margin-left: 8px; }
  footer { text-align: center; color: #8a8f9c; padding: 18px; }
</style>
</head>
<body>
  <header>
    <h1>Анна Соколова</h1>
    <p>Начинающий веб-разработчик</p>
  </header>
  <main>
    <section class="card">
      <img src="https://picsum.photos/seed/anna/640/340" alt="Фотография рабочего стола Анны">
      <p>Привет! Я Анна, делаю первые шаги в веб-разработке. Уже умею собирать
         аккуратные страницы на HTML и CSS и постепенно осваиваю JavaScript.</p>
    </section>
    <section class="card">
      <h2>Навыки</h2>
      <ul>
        <li>Семантическая вёрстка HTML</li>
        <li>Стили и адаптив на CSS</li>
        <li>Основы JavaScript</li>
        <li>Работа с Git</li>
      </ul>
    </section>
    <section class="card">
      <h2>Контакты</h2>
      <a class="btn" href="mailto:anna@example.com">Написать письмо</a>
      <button id="themeBtn" type="button">Сменить тему</button>
    </section>
  </main>
  <footer>© 2026 Анна Соколова. Сделано вручную на HTML и CSS.</footer>
  <script>
    var btn = document.getElementById('themeBtn');
    btn.addEventListener('click', function () {
      document.body.classList.toggle('light');
    });
  </script>
</body>
</html>`;

/* ================= УРОК 2: ПОЛИРОВКА И ПУБЛИКАЦИЯ ================= */

const PUBLISH_EXAMPLE = `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="Визитка Марии Волковой: дизайн интерфейсов, навыки и контакты.">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>💜</text></svg>">
<title>Мария Волкова — дизайнер интерфейсов</title>
<style>
  body { margin: 0; font-family: Arial, sans-serif; background: #eef0f4; }
  .wrap { max-width: 720px; margin: 0 auto; padding: 24px 20px; background: #ffffff; }
  img { max-width: 100%; border-radius: 12px; }
  @media (max-width: 480px) {
    .wrap { padding: 16px 14px; }
    h1 { font-size: 24px; }
  }
</style>
</head>
<body>
  <div class="wrap">
    <h1>Мария Волкова</h1>
    <img src="https://picsum.photos/seed/maria/720/360" alt="Рабочее место Марии">
    <p>Проектирую интерфейсы и верстаю страницы. Эта визитка — пример аккуратной
       одностраничной визитки с мета-тегами, favicon и адаптивной вёрсткой.</p>
  </div>
</body>
</html>`;

const PUBLISH_STARTER = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Document</title>
<style>
  body { margin: 0; font-family: Arial, sans-serif; background: #f4f4f6; }
  .wrap { padding: 20px 16px; background: #ffffff; }
  img { max-width: 100%; }
</style>
</head>
<body>
  <div class="wrap">
    <h1>Иван Петров</h1>
    <img src="https://picsum.photos/seed/ivan/720/360">
    <p>Привет! Я Иван, интересуюсь веб-разработкой и делаю небольшие сайты.
       На этой странице — коротко обо мне и моих увлечениях.</p>
    <p>В свободное время читаю про технологии, катаюсь на велосипеде и учу английский.</p>
  </div>
</body>
</html>`;

const PUBLISH_SOLUTION = `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="Визитка Ивана Петрова: пара слов о себе, интересы и увлечения.">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🚀</text></svg>">
<title>Иван Петров — о себе</title>
<style>
  body { margin: 0; font-family: Arial, sans-serif; background: #f4f4f6; }
  .wrap { max-width: 720px; margin: 0 auto; padding: 24px 20px; background: #ffffff; }
  img { max-width: 100%; border-radius: 12px; }
  @media (max-width: 480px) {
    .wrap { padding: 16px 14px; }
    h1 { font-size: 24px; }
  }
</style>
</head>
<body>
  <div class="wrap">
    <h1>Иван Петров</h1>
    <img src="https://picsum.photos/seed/ivan/720/360" alt="Фотография для визитки Ивана">
    <p>Привет! Я Иван, интересуюсь веб-разработкой и делаю небольшие сайты.
       На этой странице — коротко обо мне и моих увлечениях.</p>
    <p>В свободное время читаю про технологии, катаюсь на велосипеде и учу английский.</p>
  </div>
</body>
</html>`;

/* ================= МОДУЛЬ ================= */

export const MODULE_FINAL: CourseModule = {
  id: "final",
  title: "Финальный проект",
  icon: "🏆",
  desc: "Собираем всё изученное в настоящий сайт-визитку: структура, стили, интерактив и публикация.",
  lessons: [
    {
      id: "final-card",
      title: "Сайт-визитка: собираем всё",
      minutes: 25,
      intro:
        "Финальный проект курса — ваша собственная страница-визитка. Здесь сойдётся всё сразу: семантическая структура, стили, картинки, ссылки и первый интерактив на JavaScript. Не пугайтесь объёма: страница собирается по шагам, и каждый шаг вы уже умеете делать по отдельности.",
      theory: [
        {
          t: "h",
          text: "Как планируют страницу",
        },
        {
          t: "p",
          text: "Любую страницу удобно собирать в одном и том же порядке — от скелета к отделке. Так вы никогда не утонете в деталях и всегда будете знать, что делать дальше.",
        },
        {
          t: "list",
          items: [
            "**Структура.** Сначала чистая разметка: `header`, `main`, секции, `footer`. Смысл важнее вида.",
            "**Содержимое.** Тексты, фото, списки, ссылки — всё по местам, пока без единой строчки CSS.",
            "**Стили.** Цвета, отступы, скругления, карточки. Страница «оживает» и становится аккуратной.",
            "**Интерактив.** В самом конце — JavaScript: кнопки, переключение темы, реакции на действия.",
          ],
        },
        {
          t: "p",
          text: "Почему именно так? Потому что браузеру и читателю сначала нужен смысл документа, а уже потом — его внешний вид. Если начать со стилей, легко построить красивую обёртку вокруг путаницы.",
        },
        {
          t: "h",
          text: "Чек-лист качества страницы",
        },
        {
          t: "list",
          items: [
            "Один `h1` — главный заголовок страницы, дальше заголовки по убыванию уровня.",
            "У каждой картинки есть `alt` — подпись на случай, если фото не загрузится, и для тех, кто не видит изображение.",
            "Ссылки понятны без окружающего текста: «Написать письмо», а не «сюда».",
            "Видно, что кликабельно: кнопки и ссылки оформлены и меняются при наведении (`:hover`).",
            "Страница не разваливается на узком экране: контент в контейнере с `max-width`.",
          ],
        },
        {
          t: "note",
          text: "Визитка — идеальный финальный проект: она маленькая, но настоящая. Её не стыдно показать, легко дорабатывать и просто опубликовать — чем и займёмся в следующем уроке.",
        },
      ],
      example: {
        caption: "Готовая визитка: все блоки на месте, тема переключается кнопкой",
        code: CARD_EXAMPLE,
      },
      task: {
        brief:
          "Соберите одностраничную визитку по каркасу. Нужно всё: header с вашим именем в h1; в main — фото с picsum.photos и непустым alt, абзац о себе, список навыков (ul, минимум 3 пункта) и секция контактов со ссылкой mailto; footer с подписью. По стилям: тёмный header, секции-карточки с border-radius не меньше 8px, ссылка-контакт оформлена классом .btn (padding и скругление, чтобы выглядела кнопкой). И интерактив: кнопка «Сменить тему», которая переключает класс light у body (стили для светлой темы придумайте сами).",
        starter: CARD_STARTER,
        checks: [
          {
            label: "В header есть заголовок h1 с именем",
            run: (doc) => {
              const h1 = doc.querySelector("header h1");
              return !!h1 && textOf(h1).length >= 2;
            },
          },
          {
            label: "В main есть фото (img) с адресом picsum и непустым alt",
            run: (doc) => {
              const img = doc.querySelector("main img");
              if (!img) return false;
              const src = img.getAttribute("src") ?? "";
              const alt = (img.getAttribute("alt") ?? "").trim();
              return src.includes("picsum") && alt.length > 0;
            },
          },
          {
            label: "Есть абзац о себе (текст не короче 40 символов)",
            run: (doc) => {
              const ps = Array.from(doc.querySelectorAll("main p"));
              return ps.some((p) => textOf(p).length >= 40);
            },
          },
          {
            label: "Список навыков: ul минимум из 3 непустых пунктов",
            run: (doc) => {
              const items = Array.from(doc.querySelectorAll("main ul li"));
              return items.filter((li) => textOf(li).length > 0).length >= 3;
            },
          },
          {
            label: "Ссылка mailto оформлена как кнопка (.btn: есть padding и скругление)",
            run: (doc, win) => {
              const link = doc.querySelector('a[href^="mailto:"]');
              if (!link || !link.classList.contains("btn")) return false;
              const cs = win.getComputedStyle(link);
              return parseFloat(cs.paddingTop) >= 6 && parseFloat(cs.borderTopLeftRadius) >= 6;
            },
          },
          {
            label: "Есть footer с текстом внутри",
            run: (doc) => textOf(doc.querySelector("footer")).length > 0,
          },
          {
            label: "Header тёмный (фон не прозрачный и не светлый)",
            run: (doc, win) => {
              const header = doc.querySelector("header");
              if (!header) return false;
              const rgb = parseRgb(win.getComputedStyle(header).backgroundColor);
              if (!rgb || rgb.a === 0) return false;
              return rgb.r + rgb.g + rgb.b < 300;
            },
          },
          {
            label: "Секции-карточки скруглены (border-radius не меньше 8px)",
            run: (doc, win) => {
              const card = doc.querySelector("main section, main .card");
              if (!card) return false;
              return parseFloat(win.getComputedStyle(card).borderTopLeftRadius) >= 8;
            },
          },
          {
            label: "Кнопка «Сменить тему» переключает класс у body",
            run: (doc) => {
              const btn = Array.from(doc.querySelectorAll("button")).find((b) =>
                textOf(b).toLowerCase().includes("тем")
              );
              if (!btn) return false;
              const before = doc.body.className;
              btn.click();
              const after = doc.body.className;
              if (after === before) return false;
              btn.click();
              return doc.body.className === before;
            },
          },
        ],
        hint: "Идите по комментариям TODO сверху вниз. Тёмный header — это просто header { background: #20242e; color: #fff; }. Для кнопки: document.body.classList.toggle('light') внутри обработчика click — и не забудьте описать стили body.light, иначе переключение не будет видно.",
        solution: CARD_SOLUTION,
      },
    },
    {
      id: "final-publish",
      title: "Полировка и публикация",
      minutes: 15,
      intro:
        "Страница готова — теперь сделаем её «взрослой»: добавим служебные мета-теги, иконку вкладки, адаптивность и проверим всё перед публикацией. В конце разберём, где бесплатно разместить сайт и что учить дальше.",
      theory: [
        {
          t: "h",
          text: "Мета-теги: паспорт страницы",
        },
        {
          t: "p",
          text: "Теги `meta` лежат в `head` и не видны на странице, но их читают браузеры, поисковики и мессенджеры. Два главных — `viewport` и `description`.",
        },
        {
          t: "code",
          caption: "Минимальный набор для любой страницы",
          code: `<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="Одно-два предложения о том, что на странице.">`,
        },
        {
          t: "p",
          text: "**Viewport** говорит мобильному браузеру: «ширина страницы равна ширине экрана, масштаб — 100%». Без него телефон покажет страницу как десктопную шириной около 980 пикселей и уменьшит её до нечитаемых крох — даже если у вас есть медиа-запросы, они просто не сработают как задумано.",
        },
        {
          t: "p",
          text: "**Description** — это текст, который поисковик покажет под заголовком в выдаче, а мессенджер — в превью ссылки. Пустой description означает, что этот текст выберут за вас и не факт, что удачно.",
        },
        {
          t: "h",
          text: "Favicon: маленькая, но своя",
        },
        {
          t: "p",
          text: "Favicon — иконка на вкладке браузера. Её подключают тегом `link` с `rel=\"icon\"`. Отдельный файл не обязателен: иконку можно вложить прямо в адрес в формате data: URI — например, эмодзи в SVG. Браузер прочитает её так же, как обычный файл.",
        },
        {
          t: "code",
          caption: "Favicon-эмодзи одной строкой",
          code: `<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🚀</text></svg>">`,
        },
        {
          t: "h",
          text: "Проверка перед публикацией",
        },
        {
          t: "list",
          items: [
            "Открыть страницу и прочитать её целиком: опечатки виднее на «живом» рендере.",
            "Проверить узкую ширину (инструменты разработчика в браузере умеют эмулировать телефон).",
            "Кликнуть каждую ссылку — особенно mailto и внешние.",
            "Посмотреть вкладку: на месте ли заголовок и favicon.",
            "Убедиться, что у картинок есть `alt`, а у `html` — атрибут `lang`.",
          ],
        },
        {
          t: "h",
          text: "Куда опубликовать бесплатно",
        },
        {
          t: "p",
          text: "Статичному сайту (HTML, CSS и JS без сервера) не нужен платный хостинг. Три популярных бесплатных варианта: **GitHub Pages** — публикует прямо из репозитория GitHub; **Vercel** и **Netlify** — подключаются к репозиторию и сами пересобирают сайт при каждом обновлении кода. Во всех случаях вы получаете адрес вида «имя.сервис.com», а позже можно привязать свой домен.",
        },
        {
          t: "h",
          text: "Что учить дальше",
        },
        {
          t: "list",
          items: [
            "**CSS глубже:** flexbox и grid до автоматизма, анимации и переходы, переменные.",
            "**JavaScript глубже:** события, работа с DOM, массивы и объекты, запросы к API через `fetch`.",
            "**Инструменты:** Git и GitHub, редактор и его горячие клавиши, основы командной строки.",
            "**Следующий уровень:** любой популярный фреймворк (React, Vue) — но только после уверенной базы: фреймворк не заменяет понимание HTML и CSS, а строится на нём.",
          ],
        },
        {
          t: "note",
          text: "Главный секрет публикации: не ждать «идеальной» версии. Работающая страница, которую можно показать по ссылке, ценнее безупречной, которая лежит только на вашем компьютере.",
        },
      ],
      example: {
        caption: "Та же визитка после полировки: мета-теги, favicon и адаптив на месте",
        code: PUBLISH_EXAMPLE,
      },
      task: {
        brief:
          "Перед вами готовая визитка, но «сырая»: её собирали в спешке. Отполируйте её до публикуемой версии: укажите lang=\"ru\" у html, добавьте meta viewport и meta description с осмысленным текстом, замените title «Document» на нормальный заголовок, подключите favicon (подойдёт data: URI), дайте картинке непустой alt и отцентруйте страницу: у .wrap задайте max-width: 720px и margin: 0 auto.",
        starter: PUBLISH_STARTER,
        checks: [
          {
            label: "Добавлен meta viewport",
            run: (doc) => !!doc.querySelector('meta[name="viewport"]'),
          },
          {
            label: "Заполнены осмысленный title и meta description",
            run: (doc) => {
              const title = (doc.title ?? "").trim();
              const desc = doc.querySelector('meta[name="description"]');
              const content = (desc?.getAttribute("content") ?? "").trim();
              return title.length >= 3 && title.toLowerCase() !== "document" && content.length > 0;
            },
          },
          {
            label: "У html указан lang=\"ru\"",
            run: (doc) => doc.documentElement.lang === "ru",
          },
          {
            label: "Подключена favicon (link rel=\"icon\")",
            run: (doc) => !!doc.querySelector('link[rel="icon"]'),
          },
          {
            label: "У картинки есть непустой alt",
            run: (doc) => {
              const img = doc.querySelector("img");
              return !!img && (img.getAttribute("alt") ?? "").trim().length > 0;
            },
          },
          {
            label: "Контейнер .wrap ограничен по ширине и стоит по центру (margin: 0 auto)",
            run: (doc, win) => {
              const wrap = doc.querySelector(".wrap");
              if (!wrap) return false;
              if (win.getComputedStyle(wrap).maxWidth === "none") return false;
              for (const sheet of Array.from(doc.styleSheets)) {
                let rules: CSSRuleList | null = null;
                try { rules = sheet.cssRules; } catch { continue; }
                if (!rules) continue;
                for (const rule of Array.from(rules)) {
                  const sr = rule as CSSStyleRule;
                  if (rule.type === 1 && sr.selectorText.split(",").map((s) => s.trim()).includes(".wrap")) {
                    if (sr.style.marginLeft === "auto" && sr.style.marginRight === "auto") return true;
                  }
                }
              }
              return false;
            },
          },
        ],
        hint: "Почти всё делается в head и в одной строке CSS. Порядок такой: lang — в открывающий тег html; viewport и description — meta-тегами рядом с charset; favicon — link с data: URI (можно взять из теории); alt — атрибут у img; а в CSS для .wrap добавьте max-width: 720px; margin: 0 auto; — авто-отступы по бокам сами поставят блок по центру.",
        solution: PUBLISH_SOLUTION,
      },
    },
  ],
};
