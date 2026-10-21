import type { CourseModule } from "./types";

export const MODULE_CSS: CourseModule = {
  id: "css",
  title: "CSS: внешний вид",
  icon: "🎨",
  desc: "Как страница становится красивой: селекторы, цвета, блочная модель, flexbox, grid, адаптив и эффекты.",
  lessons: [
    {
      id: "css-connect",
      title: "Как CSS попадает на страницу",
      minutes: 7,
      intro:
        "HTML — это скелет страницы, а CSS — её одежда. В этом уроке разберём три способа подключить стили и научимся обращаться к элементам через селекторы: по тегу, по классу и по id.",
      theory: [
        {
          t: "h",
          text: "Три способа добавить CSS",
        },
        {
          t: "p",
          text: "Первый способ — **inline-стиль**: атрибут `style` прямо у тега, например `<p style=\"color: red\">`. Второй — тег `<style>` внутри `<head>`: в нём пишут правила для всей страницы. Третий — **внешний файл**: стили лежат в отдельном файле `style.css`, а страница подключает его строкой `<link rel=\"stylesheet\" href=\"style.css\">`.",
        },
        {
          t: "code",
          code: "<!-- 1. Inline: стиль прямо в теге -->\n<p style=\"color: red\">Красный абзац</p>\n\n<!-- 2. Тег <style> в <head> -->\n<style>\n  p { color: red; }\n</style>\n\n<!-- 3. Внешний файл: одна строка в <head> -->\n<link rel=\"stylesheet\" href=\"style.css\">",
          caption: "Три способа — один результат",
        },
        {
          t: "note",
          text: "Почему внешний файл и `<style>` лучше inline: один inline-стиль действует только на один элемент, а правило в `<style>` — сразу на все подходящие элементы страницы. Захотели поменять цвет всех абзацев — правите одну строку, а не бегаете по каждому тегу. Поэтому inline-стили почти не используют, кроме редких разовых случаев.",
        },
        {
          t: "h",
          text: "Селекторы: как указать, кого красить",
        },
        {
          t: "p",
          text: "Правило CSS состоит из **селектора** (кого красим) и блока в фигурных скобках (во что красим). Селектор по тегу — просто имя тега: `p` выберет все абзацы. Селектор по классу начинается с точки: `.note` выберет все элементы с `class=\"note\"`. Селектор по id начинается с решётки: `#title` выберет один элемент с `id=\"title\"` — id на странице должен быть уникальным, как номер паспорта.",
        },
        {
          t: "code",
          code: "p {\n  color: tomato;\n}\n\n.note {\n  font-size: 20px;\n}\n\n#title {\n  color: navy;\n}",
          caption: "Селекторы: тег, класс и id",
        },
        {
          t: "note",
          text: "Что будет, если к одному элементу подходит несколько правил? Сработает **каскад**: при прочих равных побеждает правило, которое написано позже, а ещё у селекторов разный «вес» — id сильнее класса, класс сильнее тега. Подробнее разберём в уроке про классы, а пока запомните сам факт: браузер не путается, у него есть чёткий порядок.",
        },
      ],
      example: {
        caption: "Селекторы тега и класса в действии: все абзацы — синие, а особенный — ещё и крупный.",
        code: "<!DOCTYPE html>\n<html lang=\"ru\">\n<head>\n<meta charset=\"UTF-8\">\n<title>Селекторы</title>\n<style>\n  body { font-family: Arial, sans-serif; }\n  p { color: #2563eb; }\n  .note {\n    font-size: 22px;\n    font-weight: bold;\n  }\n</style>\n</head>\n<body>\n  <h1>Заголовок</h1>\n  <p>Обычный абзац — синий, потому что селектор p красит все абзацы.</p>\n  <p class=\"note\">А этот абзац ещё и крупный: у него есть класс note.</p>\n  <p>И этот абзац синий — правило одно на всех.</p>\n</body>\n</html>",
      },
      task: {
        brief:
          "В блоке <style> напишите два правила. Первое: селектор по тегу p — всем абзацам цвет tomato. Второе: селектор по классу .note — размер шрифта 20px. Разметку не трогайте, работайте только внутри <style>.",
        starter:
          "<!DOCTYPE html>\n<html lang=\"ru\">\n<head>\n<meta charset=\"UTF-8\">\n<title>Задание: подключаем CSS</title>\n<style>\n  /* Сюда напишите два правила:\n     1) для всех абзацев p — цвет tomato\n     2) для класса .note — размер шрифта 20px */\n</style>\n</head>\n<body>\n  <h1>Мои заметки</h1>\n  <p>Первый абзац. Он должен стать томатным.</p>\n  <p class=\"note\">Важная заметка: и томатная, и крупная (20px).</p>\n  <p>Ещё один обычный абзац.</p>\n</body>\n</html>",
        checks: [
          {
            label: "У всех абзацев p цвет tomato",
            run: (doc, win) => {
              const p = doc.querySelector("p");
              return !!p && win.getComputedStyle(p).color === "rgb(255, 99, 71)";
            },
          },
          {
            label: "У элемента с классом .note размер шрифта 20px",
            run: (doc, win) => {
              const el = doc.querySelector(".note");
              return !!el && win.getComputedStyle(el).fontSize === "20px";
            },
          },
        ],
        hint: "Правило выглядит так: селектор { свойство: значение; }. Для абзацев селектор — просто p, для класса — точка и имя класса: .note { ... }.",
        solution:
          "<!DOCTYPE html>\n<html lang=\"ru\">\n<head>\n<meta charset=\"UTF-8\">\n<title>Задание: подключаем CSS</title>\n<style>\n  p {\n    color: tomato;\n  }\n  .note {\n    font-size: 20px;\n  }\n</style>\n</head>\n<body>\n  <h1>Мои заметки</h1>\n  <p>Первый абзац. Он должен стать томатным.</p>\n  <p class=\"note\">Важная заметка: и томатная, и крупная (20px).</p>\n  <p>Ещё один обычный абзац.</p>\n</body>\n</html>",
      },
    },
    {
      id: "css-text",
      title: "Цвета и текст",
      minutes: 8,
      intro:
        "Учимся оформлять текст: задавать цвет и фон, размер и семейство шрифта, жирность, выравнивание и межстрочный интервал. Это базовый набор, которым пользуются в каждом проекте.",
      theory: [
        {
          t: "h",
          text: "Цвета: color и background-color",
        },
        {
          t: "p",
          text: "`color` задаёт цвет текста, `background-color` — цвет фона элемента. Цвет можно записать словом (`red`, `tomato`), HEX-кодом (`#2563eb`) или функцией `rgb(37, 99, 235)`. HEX — самый популярный формат: его выдают все графические редакторы и палитры, поэтому именно им мы будем пользоваться чаще всего. Обратите внимание: `#2563eb` и `rgb(37, 99, 235)` — это один и тот же синий цвет, просто записанный по-разному.",
        },
        {
          t: "h",
          text: "Шрифт: размер, семейство, жирность",
        },
        {
          t: "list",
          items: [
            "`font-size` — размер шрифта, например `18px`.",
            "`font-family` — семейство шрифта: `Arial, sans-serif`. Второе имя — запасное: если первого шрифта нет на компьютере, браузер возьмёт следующее.",
            "`font-weight` — жирность: `400` — обычная, `700` — жирная (то же самое, что слово `bold`). Бывают и промежуточные значения: `500`, `600`.",
            "`text-align` — выравнивание: `left`, `center`, `right`.",
            "`line-height` — межстрочный интервал. Задаётся числом без единиц: `1.6` означает «в 1,6 раза больше размера шрифта».",
          ],
        },
        {
          t: "note",
          text: "Почему `line-height` так важен: текст с интервалом по умолчанию (примерно 1.2) читается тяжело — строки «липнут» друг к другу. Для основного текста обычно ставят 1.5–1.7: абзац сразу выглядит легче и профессиональнее, хотя ни одна буква не изменилась. А единица `line-height: 1.6` удобна тем, что подстраивается под размер шрифта сама: увеличили шрифт — интервал вырос пропорционально.",
        },
        {
          t: "h",
          text: "Единицы измерения: px, em, rem",
        },
        {
          t: "p",
          text: "`px` — абсолютные пиксели: `16px` всегда 16px. `em` — относительно размера шрифта родителя: `1.5em` при шрифте 16px даст 24px. `rem` — то же самое, но относительно шрифта всей страницы (обычно 16px). Пиксели проще для старта, а `em` и `rem` пригодятся позже для гибких интерфейсов, где всё масштабируется от одного базового размера.",
        },
        {
          t: "code",
          code: "h1 {\n  color: #2563eb;\n  font-size: 36px;\n  text-align: center;\n}\n\np {\n  font-family: Georgia, serif;\n  line-height: 1.6;\n}",
          caption: "Набор текстовых свойств в одном примере",
        },
      ],
      example: {
        caption: "Оформленный заголовок и абзац с увеличенным межстрочным интервалом.",
        code: "<!DOCTYPE html>\n<html lang=\"ru\">\n<head>\n<meta charset=\"UTF-8\">\n<title>Цвета и текст</title>\n<style>\n  body { font-family: Arial, sans-serif; }\n  h1 {\n    color: #2563eb;\n    font-size: 36px;\n    text-align: center;\n  }\n  .lead {\n    font-size: 18px;\n    line-height: 1.6;\n  }\n</style>\n</head>\n<body>\n  <h1>Привет, CSS!</h1>\n  <p class=\"lead\">Этот абзац крупнее обычного и дышит свободнее: межстрочный интервал 1.6 делает длинные тексты заметно приятнее для чтения.</p>\n</body>\n</html>",
      },
      task: {
        brief:
          "Оформите страницу правилами в <style>. Заголовку h1: цвет #2563eb, размер шрифта 36px, выравнивание по центру. Абзацу с классом .lead: размер шрифта 18px и межстрочный интервал 1.6.",
        starter:
          "<!DOCTYPE html>\n<html lang=\"ru\">\n<head>\n<meta charset=\"UTF-8\">\n<title>Задание: цвета и текст</title>\n<style>\n  /* h1: цвет #2563eb, размер 36px, по центру.\n     .lead: размер 18px, межстрочный интервал 1.6 */\n</style>\n</head>\n<body>\n  <h1>Учимся оформлять текст</h1>\n  <p class=\"lead\">Это главный абзац страницы. Сделайте его крупнее и добавьте воздуха между строками — так текст читается легче.</p>\n  <p>Обычный абзац для сравнения. Его оформлять не нужно.</p>\n</body>\n</html>",
        checks: [
          {
            label: "У h1 цвет #2563eb",
            run: (doc, win) => {
              const el = doc.querySelector("h1");
              return !!el && win.getComputedStyle(el).color === "rgb(37, 99, 235)";
            },
          },
          {
            label: "У h1 размер шрифта 36px",
            run: (doc, win) => {
              const el = doc.querySelector("h1");
              return !!el && win.getComputedStyle(el).fontSize === "36px";
            },
          },
          {
            label: "Заголовок h1 выровнен по центру",
            run: (doc, win) => {
              const el = doc.querySelector("h1");
              return !!el && win.getComputedStyle(el).textAlign === "center";
            },
          },
          {
            label: "У абзаца .lead размер шрифта 18px",
            run: (doc, win) => {
              const el = doc.querySelector(".lead");
              return !!el && win.getComputedStyle(el).fontSize === "18px";
            },
          },
          {
            label: "У абзаца .lead межстрочный интервал около 1.6",
            run: (doc, win) => {
              const el = doc.querySelector(".lead");
              if (!el) return false;
              const lh = parseFloat(win.getComputedStyle(el).lineHeight);
              return !Number.isNaN(lh) && lh > 18 * 1.4;
            },
          },
        ],
        hint: "Для h1 понадобятся color, font-size и text-align: center. Для .lead — font-size: 18px и line-height: 1.6 (число без px!).",
        solution:
          "<!DOCTYPE html>\n<html lang=\"ru\">\n<head>\n<meta charset=\"UTF-8\">\n<title>Задание: цвета и текст</title>\n<style>\n  h1 {\n    color: #2563eb;\n    font-size: 36px;\n    text-align: center;\n  }\n  .lead {\n    font-size: 18px;\n    line-height: 1.6;\n  }\n</style>\n</head>\n<body>\n  <h1>Учимся оформлять текст</h1>\n  <p class=\"lead\">Это главный абзац страницы. Сделайте его крупнее и добавьте воздуха между строками — так текст читается легче.</p>\n  <p>Обычный абзац для сравнения. Его оформлять не нужно.</p>\n</body>\n</html>",
      },
    },
    {
      id: "css-box",
      title: "Блочная модель",
      minutes: 9,
      intro:
        "Каждый элемент на странице — прямоугольник с внутренними отступами, рамкой и внешними отступами. Разберём блочную модель по слоям и узнаем про box-sizing — свойство, без которого вёрстка постоянно «плывёт».",
      theory: [
        {
          t: "h",
          text: "Четыре слоя коробки",
        },
        {
          t: "p",
          text: "Представьте элемент как матрёшку из четырёх слоёв. В центре — **содержимое** (текст или картинка). Вокруг него `padding` — внутренний отступ, «воздух» между содержимым и краем элемента. Дальше `border` — рамка. Снаружи `margin` — внешний отступ, расстояние до соседних элементов. Фон элемента закрашивает содержимое и padding, но не margin — поэтому margin всегда прозрачный.",
        },
        {
          t: "list",
          items: [
            "`padding: 20px` — отступы со всех сторон; можно по отдельности: `padding-top`, `padding-left` и т.д.",
            "`border: 2px solid #333` — короткая запись: толщина, стиль (solid — сплошная, есть ещё dashed и dotted) и цвет.",
            "`margin: 16px` — внешние отступы со всех сторон.",
            "`border-radius: 12px` — скругление углов; работает, даже если рамки нет.",
          ],
        },
        {
          t: "code",
          code: ".card {\n  padding: 20px;        /* воздух внутри */\n  border: 2px solid #333;\n  margin: 16px;         /* воздух снаружи */\n  border-radius: 12px;  /* скруглённые углы */\n}",
          caption: "Карточка со всеми слоями блочной модели",
        },
        {
          t: "note",
          text: "Почему ширина «плывёт»: по умолчанию `width: 200px` означает ширину только содержимого. Добавили padding по 20px и рамку 2px — и элемент стал занимать 244px, хотя вы просили 200. Из-за этого колонки не влезают в ряд и дизайн разваливается. Лекарство — `box-sizing: border-box`: тогда width включает padding и рамку, и элемент занимает ровно столько, сколько вы написали. Поэтому почти в каждом проекте в самом начале пишут правило `* { box-sizing: border-box; }` — оно применяет режим ко всем элементам сразу.",
        },
        {
          t: "p",
          text: "Селектор `*` называется универсальным: он выбирает вообще все элементы страницы. У него самый маленький «вес», поэтому любые другие правила его легко перебивают — это делает его идеальным для глобальных настроек вроде `box-sizing`.",
        },
      ],
      example: {
        caption: "Карточка с отступами, рамкой и скруглением. Сравните: внутри неё текст не прилипает к краям.",
        code: "<!DOCTYPE html>\n<html lang=\"ru\">\n<head>\n<meta charset=\"UTF-8\">\n<title>Блочная модель</title>\n<style>\n  * { box-sizing: border-box; }\n  body { font-family: Arial, sans-serif; background: #f1f5f9; }\n  .card {\n    background: white;\n    padding: 20px;\n    border: 2px solid #2563eb;\n    margin: 16px;\n    border-radius: 12px;\n  }\n</style>\n</head>\n<body>\n  <div class=\"card\">\n    <strong>Я — карточка.</strong> Вокруг текста 20px воздуха (padding), снаружи синяя рамка (border), а до краёв окна — 16px (margin). Углы скруглены.\n  </div>\n</body>\n</html>",
      },
      task: {
        brief:
          "Задайте карточке .card полный набор блочной модели: padding 20px, рамку 2px solid любого цвета, margin 16px и border-radius 12px. Плюс в самом начале блока <style> добавьте правило * { box-sizing: border-box; } — пусть ширина считается честно.",
        starter:
          "<!DOCTYPE html>\n<html lang=\"ru\">\n<head>\n<meta charset=\"UTF-8\">\n<title>Задание: блочная модель</title>\n<style>\n  body { font-family: Arial, sans-serif; background: #f1f5f9; }\n  /* 1) * { box-sizing: border-box; }\n     2) .card: padding 20px, border 2px solid, margin 16px, border-radius 12px,\n        фон белый — для красоты */\n</style>\n</head>\n<body>\n  <div class=\"card\">\n    <strong>Карточка товара</strong><br>\n    Сейчас у меня нет ни отступов, ни рамки — текст прилип к краям. Исправьте это!\n  </div>\n</body>\n</html>",
        checks: [
          {
            label: "У .card внутренний отступ padding 20px",
            run: (doc, win) => {
              const el = doc.querySelector(".card");
              return !!el && win.getComputedStyle(el).paddingTop === "20px";
            },
          },
          {
            label: "У .card рамка толщиной 2px",
            run: (doc, win) => {
              const el = doc.querySelector(".card");
              return !!el && win.getComputedStyle(el).borderTopWidth === "2px";
            },
          },
          {
            label: "Рамка .card сплошная (solid)",
            run: (doc, win) => {
              const el = doc.querySelector(".card");
              return !!el && win.getComputedStyle(el).borderTopStyle === "solid";
            },
          },
          {
            label: "У .card внешний отступ margin 16px",
            run: (doc, win) => {
              const el = doc.querySelector(".card");
              return !!el && win.getComputedStyle(el).marginTop === "16px";
            },
          },
          {
            label: "У .card скругление углов 12px",
            run: (doc, win) => {
              const el = doc.querySelector(".card");
              return !!el && win.getComputedStyle(el).borderTopLeftRadius === "12px";
            },
          },
        ],
        hint: "Всё пишется в одном правиле .card { ... }: padding: 20px; border: 2px solid #2563eb; margin: 16px; border-radius: 12px;",
        solution:
          "<!DOCTYPE html>\n<html lang=\"ru\">\n<head>\n<meta charset=\"UTF-8\">\n<title>Задание: блочная модель</title>\n<style>\n  body { font-family: Arial, sans-serif; background: #f1f5f9; }\n  * { box-sizing: border-box; }\n  .card {\n    background: white;\n    padding: 20px;\n    border: 2px solid #2563eb;\n    margin: 16px;\n    border-radius: 12px;\n  }\n</style>\n</head>\n<body>\n  <div class=\"card\">\n    <strong>Карточка товара</strong><br>\n    Сейчас у меня нет ни отступов, ни рамки — текст прилип к краям. Исправьте это!\n  </div>\n</body>\n</html>",
      },
    },
    {
      id: "css-classes",
      title: "Классы и специфичность",
      minutes: 8,
      intro:
        "Классы — главный инструмент CSS: один набор стилей описывается один раз и применяется к любому числу элементов. Научимся вешать несколько классов на один элемент и разберёмся, чьё правило побеждает, если стили спорят.",
      theory: [
        {
          t: "h",
          text: "Несколько классов на одном элементе",
        },
        {
          t: "p",
          text: "В атрибуте `class` можно перечислить сколько угодно классов через пробел: `<button class=\"btn btn-danger\">`. Элемент получит стили обоих классов сразу. Так вёрстка собирается как конструктор: один класс отвечает за общее (форма, размер), второй — за вариант (цвет, состояние).",
        },
        {
          t: "code",
          code: ".btn {\n  padding: 10px 20px;\n  border-radius: 999px;\n  border: none;\n}\n\n.btn-danger {\n  background: red;\n  color: white;\n}",
          caption: "База + модификатор: классическая пара классов",
        },
        {
          t: "note",
          text: "Почему так делают: представьте интернет-магазин с тысячей кнопок. Общий вид описан один раз в `.btn`, а красной кнопку делает маленький дополнительный класс. Захотели изменить форму всех кнопок — правите одно место. Если бы стиль каждой кнопки был inline, пришлось бы переписывать тысячу тегов.",
        },
        {
          t: "h",
          text: "Специфичность: кто главнее",
        },
        {
          t: "p",
          text: "Когда два правила задают элементу одно и то же свойство, браузер выбирает по **специфичности** селектора. Запомните лестницу: селектор по тегу — самый слабый, по классу — сильнее, по id — самый сильный. Внутри одного уровня побеждает правило, написанное позже. Поэтому `#title { color: navy }` перебьёт `.note { color: red }`, даже если правило класса стоит ниже в файле.",
        },
        {
          t: "list",
          items: [
            "Тег: `p { ... }` — вес 1.",
            "Класс: `.note { ... }` — вес 10.",
            "Id: `#title { ... }` — вес 100.",
            "Inline-стиль в атрибуте `style` — сильнее всех, поэтому им и не злоупотребляют.",
          ],
        },
        {
          t: "note",
          text: "Почему не стоит красить всё через id, если id «сильнее всех»: id на странице один, его нельзя переиспользовать. Стили через классы можно применять где угодно и комбинировать. Профессионалы почти всю вёрстку строят на классах, а id оставляют для якорей и JavaScript.",
        },
      ],
      example: {
        caption: "Две кнопки с общим классом .btn: у второй добавлен .btn-danger — она красная, а форма та же.",
        code: "<!DOCTYPE html>\n<html lang=\"ru\">\n<head>\n<meta charset=\"UTF-8\">\n<title>Классы</title>\n<style>\n  body { font-family: Arial, sans-serif; }\n  .btn {\n    padding: 10px 20px;\n    border-radius: 999px;\n    border: none;\n    font-size: 16px;\n    cursor: pointer;\n    background: #e2e8f0;\n  }\n  .btn-danger {\n    background: red;\n    color: white;\n  }\n</style>\n</head>\n<body>\n  <button class=\"btn\">Обычная кнопка</button>\n  <button class=\"btn btn-danger\">Опасная кнопка</button>\n</body>\n</html>",
      },
      task: {
        brief:
          "Соберите кнопки из двух классов. Класс .btn — общие стили: padding 10px 20px, border-radius 999px, уберите рамку (border: none) и задайте размер шрифта 16px. Класс .btn-danger — фон red и белый цвет текста. Разметку менять не нужно: у второй кнопки уже стоят оба класса.",
        starter:
          "<!DOCTYPE html>\n<html lang=\"ru\">\n<head>\n<meta charset=\"UTF-8\">\n<title>Задание: классы</title>\n<style>\n  body { font-family: Arial, sans-serif; }\n  /* .btn — общие стили кнопок: padding 10px 20px, border-radius 999px,\n     border: none, font-size 16px.\n     .btn-danger — фон red, цвет текста white. */\n</style>\n</head>\n<body>\n  <button class=\"btn\">Сохранить</button>\n  <button class=\"btn btn-danger\">Удалить всё</button>\n</body>\n</html>",
        checks: [
          {
            label: "У кнопок .btn верхний внутренний отступ 10px",
            run: (doc, win) => {
              const el = doc.querySelector(".btn");
              return !!el && win.getComputedStyle(el).paddingTop === "10px";
            },
          },
          {
            label: "У кнопок .btn полностью круглые углы (999px)",
            run: (doc, win) => {
              const el = doc.querySelector(".btn");
              return !!el && win.getComputedStyle(el).borderTopLeftRadius === "999px";
            },
          },
          {
            label: "Кнопка с классами .btn и .btn-danger имеет красный фон",
            run: (doc, win) => {
              const el = doc.querySelector(".btn-danger");
              return !!el && win.getComputedStyle(el).backgroundColor === "rgb(255, 0, 0)";
            },
          },
        ],
        hint: "Два отдельных правила: .btn { padding: 10px 20px; border-radius: 999px; border: none; font-size: 16px; } и .btn-danger { background: red; color: white; }.",
        solution:
          "<!DOCTYPE html>\n<html lang=\"ru\">\n<head>\n<meta charset=\"UTF-8\">\n<title>Задание: классы</title>\n<style>\n  body { font-family: Arial, sans-serif; }\n  .btn {\n    padding: 10px 20px;\n    border-radius: 999px;\n    border: none;\n    font-size: 16px;\n  }\n  .btn-danger {\n    background: red;\n    color: white;\n  }\n</style>\n</head>\n<body>\n  <button class=\"btn\">Сохранить</button>\n  <button class=\"btn btn-danger\">Удалить всё</button>\n</body>\n</html>",
      },
    },
    {
      id: "css-flex",
      title: "Flexbox: элементы в ряд",
      minutes: 10,
      intro:
        "Flexbox — способ выстроить элементы в строку или колонку и красиво распределить между ними место. Это самый используемый инструмент раскладки в современном CSS: меню, карточки, шапки сайтов — всё на нём.",
      theory: [
        {
          t: "h",
          text: "Контейнер и его дети",
        },
        {
          t: "p",
          text: "Flexbox включается на родительском элементе: `display: flex`. После этого все прямые потомки выстраиваются в ряд слева направо. Важно: свойства flexbox пишутся **контейнеру**, а не самим элементам. Контейнер решает, как его дети расположатся: в ряд или в колонку, прижмутся к краям или разлетятся по ширине.",
        },
        {
          t: "list",
          items: [
            "`flex-direction: row` — в ряд (по умолчанию); `column` — в колонку.",
            "`justify-content` — распределение по главной оси: `flex-start`, `center`, `flex-end`, `space-between` (крайние прижаты к краям, остальные равномерно), `space-around`.",
            "`align-items` — выравнивание по поперечной оси: `center` — ровно посередине, удобно для вертикального центрирования.",
            "`gap: 12px` — равные промежутки между элементами. Раньше вместо него извращались с margin у каждого элемента — gap проще и надёжнее.",
          ],
        },
        {
          t: "code",
          code: ".row {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: 12px;\n}",
          caption: "Классическая строка: элементы по краям, по центру по высоте",
        },
        {
          t: "note",
          text: "Почему flexbox так любят: до него выровнять блок по центру по вертикали было отдельной болью с костылями. Во flexbox это одна строка — `align-items: center`. А `justify-content: space-between` сам раскидывает логотип влево, а меню вправо — не нужно считать пиксели и подгонять под ширину экрана: на узком экране элементы просто встанут ближе друг к другу.",
        },
        {
          t: "p",
          text: "Ещё одно полезное свойство — `flex-wrap: wrap`: разрешает элементам переноситься на следующую строку, если не влезают. Так строят галереи и витрины: карточки сами перестраиваются под ширину экрана.",
        },
      ],
      example: {
        caption: "Три блока, разнесённые по краям строки с равными промежутками и выровненные по центру по высоте.",
        code: "<!DOCTYPE html>\n<html lang=\"ru\">\n<head>\n<meta charset=\"UTF-8\">\n<title>Flexbox</title>\n<style>\n  body { font-family: Arial, sans-serif; }\n  .row {\n    display: flex;\n    justify-content: space-between;\n    align-items: center;\n    gap: 12px;\n    background: #eef2ff;\n    padding: 12px;\n    border-radius: 12px;\n  }\n  .box {\n    background: #2563eb;\n    color: white;\n    padding: 16px;\n    border-radius: 8px;\n  }\n  .tall { padding-top: 34px; padding-bottom: 34px; }\n</style>\n</head>\n<body>\n  <div class=\"row\">\n    <div class=\"box\">Первый</div>\n    <div class=\"box tall\">Высокий</div>\n    <div class=\"box\">Третий</div>\n  </div>\n</body>\n</html>",
      },
      task: {
        brief:
          "Превратите .row в flex-контейнер: display: flex, промежутки gap: 12px и распределение justify-content: space-between, чтобы первый блок прижался к левому краю, последний — к правому, а средний встал ровно между ними. Стили блоков .box уже готовы.",
        starter:
          "<!DOCTYPE html>\n<html lang=\"ru\">\n<head>\n<meta charset=\"UTF-8\">\n<title>Задание: flexbox</title>\n<style>\n  body { font-family: Arial, sans-serif; }\n  .box {\n    background: #2563eb;\n    color: white;\n    padding: 16px 22px;\n    border-radius: 8px;\n  }\n  /* Сделайте .row flex-контейнером:\n     display: flex; gap: 12px; justify-content: space-between */\n</style>\n</head>\n<body>\n  <div class=\"row\">\n    <div class=\"box\">Логотип</div>\n    <div class=\"box\">Меню</div>\n    <div class=\"box\">Кнопка</div>\n  </div>\n</body>\n</html>",
        checks: [
          {
            label: "У .row включён display: flex",
            run: (doc, win) => {
              const el = doc.querySelector(".row");
              return !!el && win.getComputedStyle(el).display === "flex";
            },
          },
          {
            label: "Между элементами .row промежуток 12px",
            run: (doc, win) => {
              const el = doc.querySelector(".row");
              return !!el && win.getComputedStyle(el).columnGap === "12px";
            },
          },
          {
            label: "Элементы распределены по краям (space-between)",
            run: (doc, win) => {
              const el = doc.querySelector(".row");
              return !!el && win.getComputedStyle(el).justifyContent === "space-between";
            },
          },
        ],
        hint: "Все три свойства пишутся контейнеру .row, а не блокам внутри: .row { display: flex; gap: 12px; justify-content: space-between; }",
        solution:
          "<!DOCTYPE html>\n<html lang=\"ru\">\n<head>\n<meta charset=\"UTF-8\">\n<title>Задание: flexbox</title>\n<style>\n  body { font-family: Arial, sans-serif; }\n  .box {\n    background: #2563eb;\n    color: white;\n    padding: 16px 22px;\n    border-radius: 8px;\n  }\n  .row {\n    display: flex;\n    gap: 12px;\n    justify-content: space-between;\n  }\n</style>\n</head>\n<body>\n  <div class=\"row\">\n    <div class=\"box\">Логотип</div>\n    <div class=\"box\">Меню</div>\n    <div class=\"box\">Кнопка</div>\n  </div>\n</body>\n</html>",
      },
    },
    {
      id: "css-grid",
      title: "Grid: сетки",
      minutes: 9,
      intro:
        "Если flexbox — про одну строку или колонку, то grid — про полноценную сетку: строки и колонки одновременно. Витрины товаров, галереи и целые каркасы страниц собирают именно на grid.",
      theory: [
        {
          t: "h",
          text: "Колонки и строки",
        },
        {
          t: "p",
          text: "Grid включается так же, как flexbox: `display: grid` на контейнере. Дальше вы описываете сетку: `grid-template-columns` задаёт колонки, `grid-template-rows` — строки. Элементы внутри сами рассаживаются по ячейкам слева направо, сверху вниз — вам не нужно считать, кто в какой строке.",
        },
        {
          t: "code",
          code: ".gallery {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 10px;\n}",
          caption: "Три равные колонки одной строкой",
        },
        {
          t: "p",
          text: "Разберём запись `repeat(3, 1fr)`: это три колонки, каждая шириной `1fr`. Единица `fr` — «одна доля свободного места»: все колонки делят ширину контейнера поровну. Можно комбинировать: `200px 1fr 2fr` — первая колонка фиксированная, остальные делят остаток в пропорции 1 к 2. Функция `repeat` просто избавляет от рутины: `repeat(3, 1fr)` — то же самое, что `1fr 1fr 1fr`.",
        },
        {
          t: "note",
          text: "Почему grid удобнее таблиц и float-ов из прошлого: сетка описывается в одном месте и сама следит за геометрией. Поменяли `repeat(3, 1fr)` на `repeat(4, 1fr)` — и вся галерея перестроилась в четыре колонки, хотя карточек может быть пятьдесят. Промежутки тоже задаёт сам grid через `gap` — не нужно придумывать margin каждой карточке и страдать от отступов по краям.",
        },
        {
          t: "h",
          text: "Flexbox или grid?",
        },
        {
          t: "p",
          text: "Простое правило: нужно выстроить элементы **в одну линию** (меню, строка кнопок) — берите flexbox. Нужна **двумерная сетка**, где важны и строки, и колонки (галерея, витрина, каркас страницы), — берите grid. Они не конкуренты: на реальной странице grid часто задаёт крупные области, а внутри каждой области работает flexbox.",
        },
      ],
      example: {
        caption: "Галерея из шести карточек в три равные колонки.",
        code: "<!DOCTYPE html>\n<html lang=\"ru\">\n<head>\n<meta charset=\"UTF-8\">\n<title>Grid</title>\n<style>\n  body { font-family: Arial, sans-serif; }\n  .gallery {\n    display: grid;\n    grid-template-columns: repeat(3, 1fr);\n    gap: 10px;\n  }\n  .ph {\n    background: #2563eb;\n    color: white;\n    text-align: center;\n    padding: 28px 0;\n    border-radius: 10px;\n    font-size: 20px;\n  }\n</style>\n</head>\n<body>\n  <div class=\"gallery\">\n    <div class=\"ph\">1</div>\n    <div class=\"ph\">2</div>\n    <div class=\"ph\">3</div>\n    <div class=\"ph\">4</div>\n    <div class=\"ph\">5</div>\n    <div class=\"ph\">6</div>\n  </div>\n</body>\n</html>",
      },
      task: {
        brief:
          "Сделайте из .gallery сетку: display: grid, три равные колонки через grid-template-columns: repeat(3, 1fr) и промежутки gap: 10px. Шесть плашек сами встанут в два ряда по три.",
        starter:
          "<!DOCTYPE html>\n<html lang=\"ru\">\n<head>\n<meta charset=\"UTF-8\">\n<title>Задание: grid</title>\n<style>\n  body { font-family: Arial, sans-serif; }\n  .ph {\n    background: #64748b;\n    color: white;\n    text-align: center;\n    padding: 28px 0;\n    border-radius: 10px;\n    font-size: 20px;\n  }\n  /* Сделайте .gallery сеткой:\n     display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px */\n</style>\n</head>\n<body>\n  <div class=\"gallery\">\n    <div class=\"ph\">1</div>\n    <div class=\"ph\">2</div>\n    <div class=\"ph\">3</div>\n    <div class=\"ph\">4</div>\n    <div class=\"ph\">5</div>\n    <div class=\"ph\">6</div>\n  </div>\n</body>\n</html>",
        checks: [
          {
            label: "У .gallery включён display: grid",
            run: (doc, win) => {
              const el = doc.querySelector(".gallery");
              return !!el && win.getComputedStyle(el).display === "grid";
            },
          },
          {
            label: "У сетки ровно три колонки",
            run: (doc, win) => {
              const el = doc.querySelector(".gallery");
              if (!el) return false;
              const cols = win.getComputedStyle(el).gridTemplateColumns;
              return cols !== "none" && cols.trim().split(/\s+/).length === 3;
            },
          },
          {
            label: "Промежутки между ячейками 10px",
            run: (doc, win) => {
              const el = doc.querySelector(".gallery");
              return !!el && win.getComputedStyle(el).columnGap === "10px";
            },
          },
        ],
        hint: "Всё пишется контейнеру: .gallery { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }",
        solution:
          "<!DOCTYPE html>\n<html lang=\"ru\">\n<head>\n<meta charset=\"UTF-8\">\n<title>Задание: grid</title>\n<style>\n  body { font-family: Arial, sans-serif; }\n  .ph {\n    background: #64748b;\n    color: white;\n    text-align: center;\n    padding: 28px 0;\n    border-radius: 10px;\n    font-size: 20px;\n  }\n  .gallery {\n    display: grid;\n    grid-template-columns: repeat(3, 1fr);\n    gap: 10px;\n  }\n</style>\n</head>\n<body>\n  <div class=\"gallery\">\n    <div class=\"ph\">1</div>\n    <div class=\"ph\">2</div>\n    <div class=\"ph\">3</div>\n    <div class=\"ph\">4</div>\n    <div class=\"ph\">5</div>\n    <div class=\"ph\">6</div>\n  </div>\n</body>\n</html>",
      },
    },
    {
      id: "css-position",
      title: "Позиционирование",
      minutes: 9,
      intro:
        "Обычно элементы идут друг за другом, как текст на странице. Позиционирование позволяет вырвать элемент из этого потока: прилепить бейдж в угол карточки, зафиксировать шапку или всплывающую подсказку.",
      theory: [
        {
          t: "h",
          text: "Пять значений position",
        },
        {
          t: "list",
          items: [
            "`static` — обычное положение, значение по умолчанию.",
            "`relative` — элемент остаётся на месте, но его можно чуть сдвинуть (top/left), а главное — он становится «якорем» для потомков.",
            "`absolute` — элемент вынимается из потока и ставится по координатам относительно ближайшего «якоря».",
            "`fixed` — как absolute, но относительно окна браузера: элемент не уезжает при прокрутке (шапки, кнопки «вверх»).",
            "`sticky` — гибрид: элемент едет вместе со страницей, пока не «прилипнет» к краю (заголовки разделов в длинных списках).",
          ],
        },
        {
          t: "h",
          text: "Родитель — точка отсчёта",
        },
        {
          t: "p",
          text: "Ключевой механизм: элемент с `position: absolute` ищет ближайшего предка, у которого position равен relative, absolute или fixed, — и отсчитывает `top`, `right`, `bottom`, `left` от его углов. Если такого предка нет, отсчёт пойдёт от всей страницы, и бейдж улетит в угол окна вместо угла карточки. Классическая пара: карточке — `position: relative`, бейджу внутри — `position: absolute` и координаты.",
        },
        {
          t: "code",
          code: ".card {\n  position: relative; /* я — точка отсчёта */\n}\n\n.badge {\n  position: absolute;\n  top: 8px;   /* 8px от верхнего края карточки */\n  right: 8px; /* 8px от правого края карточки */\n}",
          caption: "Бейдж в правом верхнем углу карточки",
        },
        {
          t: "note",
          text: "Почему absolute используют осторожно: элемент выпадает из потока, и соседи ведут себя так, будто его нет. Для бейджей, скидочных плашек «−30%» и всплывающих элементов это именно то, что нужно. А вот строить на absolute всю страницу — плохая идея: при другой ширине экрана элементы начнут налезать друг на друга, потому что поток им больше не помогает.",
        },
      ],
      example: {
        caption: "Карточка товара с бейджем «Новинка» строго в углу — куда бы карточку ни поставили.",
        code: "<!DOCTYPE html>\n<html lang=\"ru\">\n<head>\n<meta charset=\"UTF-8\">\n<title>Позиционирование</title>\n<style>\n  body { font-family: Arial, sans-serif; background: #f1f5f9; padding: 16px; }\n  .card {\n    position: relative;\n    background: white;\n    border-radius: 12px;\n    padding: 20px;\n    max-width: 320px;\n  }\n  .badge {\n    position: absolute;\n    top: 8px;\n    right: 8px;\n    background: tomato;\n    color: white;\n    font-size: 12px;\n    font-weight: bold;\n    padding: 4px 8px;\n    border-radius: 999px;\n  }\n</style>\n</head>\n<body>\n  <div class=\"card\">\n    <span class=\"badge\">Новинка</span>\n    <strong>Кроссовки беговые</strong>\n    <p>Лёгкие, дышащие, для ежедневных пробежек.</p>\n  </div>\n</body>\n</html>",
      },
      task: {
        brief:
          "Прилепите бейдж .badge в правый верхний угол карточки. Для этого карточке .card задайте position: relative (она станет точкой отсчёта), а бейджу — position: absolute и отступы top: 8px и right: 8px.",
        starter:
          "<!DOCTYPE html>\n<html lang=\"ru\">\n<head>\n<meta charset=\"UTF-8\">\n<title>Задание: позиционирование</title>\n<style>\n  body { font-family: Arial, sans-serif; background: #f1f5f9; padding: 16px; }\n  .card {\n    background: white;\n    border-radius: 12px;\n    padding: 20px;\n    max-width: 320px;\n  }\n  .badge {\n    background: tomato;\n    color: white;\n    font-size: 12px;\n    font-weight: bold;\n    padding: 4px 8px;\n    border-radius: 999px;\n  }\n  /* .card: position: relative.\n     .badge: position: absolute; top: 8px; right: 8px */\n</style>\n</head>\n<body>\n  <div class=\"card\">\n    <span class=\"badge\">−30%</span>\n    <strong>Рюкзак городской</strong>\n    <p>Бейдж со скидкой сейчас стоит в тексте. Отправьте его в правый верхний угол карточки.</p>\n  </div>\n</body>\n</html>",
        checks: [
          {
            label: "Карточка .card стала точкой отсчёта (position: relative)",
            run: (doc, win) => {
              const el = doc.querySelector(".card");
              return !!el && win.getComputedStyle(el).position === "relative";
            },
          },
          {
            label: "Бейдж .badge позиционируется абсолютно",
            run: (doc, win) => {
              const el = doc.querySelector(".badge");
              return !!el && win.getComputedStyle(el).position === "absolute";
            },
          },
          {
            label: "Бейдж отступает 8px сверху",
            run: (doc, win) => {
              const el = doc.querySelector(".badge");
              return !!el && win.getComputedStyle(el).top === "8px";
            },
          },
          {
            label: "Бейдж отступает 8px справа",
            run: (doc, win) => {
              const el = doc.querySelector(".badge");
              return !!el && win.getComputedStyle(el).right === "8px";
            },
          },
        ],
        hint: "Два правила: .card { position: relative; } и .badge { position: absolute; top: 8px; right: 8px; }. Без relative у карточки бейдж отсчитает углы от всей страницы.",
        solution:
          "<!DOCTYPE html>\n<html lang=\"ru\">\n<head>\n<meta charset=\"UTF-8\">\n<title>Задание: позиционирование</title>\n<style>\n  body { font-family: Arial, sans-serif; background: #f1f5f9; padding: 16px; }\n  .card {\n    position: relative;\n    background: white;\n    border-radius: 12px;\n    padding: 20px;\n    max-width: 320px;\n  }\n  .badge {\n    position: absolute;\n    top: 8px;\n    right: 8px;\n    background: tomato;\n    color: white;\n    font-size: 12px;\n    font-weight: bold;\n    padding: 4px 8px;\n    border-radius: 999px;\n  }\n</style>\n</head>\n<body>\n  <div class=\"card\">\n    <span class=\"badge\">−30%</span>\n    <strong>Рюкзак городской</strong>\n    <p>Бейдж со скидкой сейчас стоит в тексте. Отправьте его в правый верхний угол карточки.</p>\n  </div>\n</body>\n</html>",
      },
    },
    {
      id: "css-responsive",
      title: "Адаптив и медиа-запросы",
      minutes: 10,
      intro:
        "Сайт открывают и с телефона, и с большого монитора. Адаптивная вёрстка подстраивается под любую ширину: колонки становятся уже, а потом и вовсе выстраиваются в одну. Разберём проценты, max-width и медиа-запросы.",
      theory: [
        {
          t: "h",
          text: "Относительные размеры",
        },
        {
          t: "p",
          text: "Ширину можно задавать не только в пикселях. `width: 100%` — элемент занимает всю доступную ширину родителя, какой бы она ни была. А пара `max-width: 800px` + `width: 100%` даёт классический приём «резиновый, но не шире»: на большом экране блок ограничен 800px, на телефоне честно занимает весь экран. Добавьте `margin: 0 auto` — и блок встанет ровно по центру, потому что левый и правый отступы поделят свободное место поровну.",
        },
        {
          t: "code",
          code: ".container {\n  width: 100%;\n  max-width: 800px;\n  margin: 0 auto;    /* центрируем */\n  padding: 0 16px;   /* чтобы текст не лип к краям на телефоне */\n}",
          caption: "Стандартный контейнер страницы",
        },
        {
          t: "h",
          text: "Медиа-запросы: стили по условию",
        },
        {
          t: "p",
          text: "`@media` — это «если» в CSS: правила внутри сработают, только когда выполнится условие. Классический пример: `@media (max-width: 600px)` — «если экран не шире 600px». Внутри обычно перестраивают раскладку: колонки в одну, меню — компактнее, шрифт — чуть меньше. Ширины, на которых дизайн переключается, называют точками слома; самые ходовые — 600px (телефоны) и 900–1024px (планшеты).",
        },
        {
          t: "note",
          text: "Почему нельзя просто сверстать «под свой монитор»: фиксированная ширина 1200px на телефоне заставит пользователя бесконечно двигать страницу влево-вправо, а мелкий текст — увеличивать пальцами. Поисковые системы за такое понижают сайты в выдаче, а люди просто уходят. Адаптив — не украшение, а базовая гигиена современного сайта.",
        },
        {
          t: "p",
          text: "Есть две стратегии: **сначала десктоп** (desktop-first) — пишутся обычные стили, а медиа-запросами их упрощают для узких экранов; и **сначала мобильные** (mobile-first) — базовые стили сразу для телефона, а `@media (min-width: ...)` добавляет простор для широких экранов. Вторая считается современнее: телефон — самый частый гость, и пусть сначала будет хорошо ему.",
        },
      ],
      example: {
        caption: "Две колонки в ряд. Сожмите окно предпросмотра уже 600px (или откройте на телефоне) — колонки сами встанут одна под другую: это работает медиа-запрос.",
        code: "<!DOCTYPE html>\n<html lang=\"ru\">\n<head>\n<meta charset=\"UTF-8\">\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n<title>Адаптив</title>\n<style>\n  * { box-sizing: border-box; }\n  body { font-family: Arial, sans-serif; margin: 0; background: #f8fafc; }\n  .container {\n    width: 100%;\n    max-width: 800px;\n    margin: 0 auto;\n    padding: 0 16px;\n  }\n  .cols { display: flex; gap: 12px; }\n  .col {\n    flex: 1;\n    background: white;\n    border: 1px solid #e2e8f0;\n    border-radius: 12px;\n    padding: 16px;\n  }\n  @media (max-width: 600px) {\n    .cols { flex-direction: column; }\n  }\n</style>\n</head>\n<body>\n  <div class=\"container\">\n    <h1>Адаптивная страница</h1>\n    <div class=\"cols\">\n      <div class=\"col\"><strong>Колонка 1</strong><p>На широком экране мы стоим рядом.</p></div>\n      <div class=\"col\"><strong>Колонка 2</strong><p>На узком — одна под другой.</p></div>\n    </div>\n  </div>\n</body>\n</html>",
      },
      task: {
        brief:
          "Соберите адаптивный каркас страницы. Контейнеру .container задайте max-width: 800px, margin: 0 auto (центрирование) и padding: 0 16px. А блок .cols превратите во flex-строку (display: flex), чтобы две колонки встали рядом. В примере выше — как такой каркас усиливают медиа-запросом.",
        starter:
          "<!DOCTYPE html>\n<html lang=\"ru\">\n<head>\n<meta charset=\"UTF-8\">\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n<title>Задание: адаптив</title>\n<style>\n  * { box-sizing: border-box; }\n  body { font-family: Arial, sans-serif; margin: 0; background: #f8fafc; }\n  .col {\n    flex: 1;\n    background: white;\n    border: 1px solid #e2e8f0;\n    border-radius: 12px;\n    padding: 16px;\n  }\n  /* .container: max-width 800px; margin: 0 auto; padding: 0 16px.\n     .cols: display: flex */\n</style>\n</head>\n<body>\n  <div class=\"container\">\n    <h1>Наша страница</h1>\n    <div class=\"cols\">\n      <div class=\"col\"><strong>Новости</strong><p>Колонки пока стоят друг под другом на всю ширину.</p></div>\n      <div class=\"col\"><strong>Контакты</strong><p>А должны — рядом, внутри аккуратного контейнера по центру.</p></div>\n    </div>\n  </div>\n</body>\n</html>",
        checks: [
          {
            label: "Контейнер .container ограничен шириной 800px",
            run: (doc, win) => {
              const el = doc.querySelector(".container");
              return !!el && win.getComputedStyle(el).maxWidth === "800px";
            },
          },
          {
            label: "Контейнер .container выровнен по центру (margin: 0 auto)",
            run: (doc) => {
              for (const sheet of Array.from(doc.styleSheets)) {
                let rules: CSSRuleList | null = null;
                try { rules = sheet.cssRules; } catch { continue; }
                if (!rules) continue;
                for (const rule of Array.from(rules)) {
                  if (rule instanceof CSSStyleRule && rule.selectorText.split(",").map((s) => s.trim()).includes(".container")) {
                    if (rule.style.marginLeft === "auto" && rule.style.marginRight === "auto") return true;
                  }
                }
              }
              return false;
            },
          },
          {
            label: "У .container боковые отступы 16px",
            run: (doc, win) => {
              const el = doc.querySelector(".container");
              return !!el && win.getComputedStyle(el).paddingLeft === "16px";
            },
          },
          {
            label: "Колонки .cols стоят в ряд (display: flex)",
            run: (doc, win) => {
              const el = doc.querySelector(".cols");
              return !!el && win.getComputedStyle(el).display === "flex";
            },
          },
        ],
        hint: ".container { max-width: 800px; margin: 0 auto; padding: 0 16px; } и отдельно .cols { display: flex; }. Не забудьте gap по желанию — колонкам из стартера он не обязателен.",
        solution:
          "<!DOCTYPE html>\n<html lang=\"ru\">\n<head>\n<meta charset=\"UTF-8\">\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n<title>Задание: адаптив</title>\n<style>\n  * { box-sizing: border-box; }\n  body { font-family: Arial, sans-serif; margin: 0; background: #f8fafc; }\n  .col {\n    flex: 1;\n    background: white;\n    border: 1px solid #e2e8f0;\n    border-radius: 12px;\n    padding: 16px;\n  }\n  .container {\n    max-width: 800px;\n    margin: 0 auto;\n    padding: 0 16px;\n  }\n  .cols {\n    display: flex;\n    gap: 12px;\n  }\n</style>\n</head>\n<body>\n  <div class=\"container\">\n    <h1>Наша страница</h1>\n    <div class=\"cols\">\n      <div class=\"col\"><strong>Новости</strong><p>Колонки пока стоят друг под другом на всю ширину.</p></div>\n      <div class=\"col\"><strong>Контакты</strong><p>А должны — рядом, внутри аккуратного контейнера по центру.</p></div>\n    </div>\n  </div>\n</body>\n</html>",
      },
    },
    {
      id: "css-effects",
      title: "Эффекты: тени, скругления, hover",
      minutes: 8,
      intro:
        "Финальные штрихи, которые отделяют «работает» от «красиво»: мягкие тени, плавные переходы и реакция на наведение мыши. Плюс псевдокласс :hover — первый шаг к интерактивности без JavaScript.",
      theory: [
        {
          t: "h",
          text: "Тени: box-shadow",
        },
        {
          t: "p",
          text: "`box-shadow` задаётся четырьмя числами и цветом: `box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15)`. По порядку: сдвиг по горизонтали, сдвиг вниз, радиус размытия и цвет. Цвет удобнее задавать через `rgba` — четвёртое число (альфа) отвечает за прозрачность: 0.15 — едва заметная тень, и это правильно. Хорошая тень почти не видна, но без неё карточка выглядит плоской наклейкой.",
        },
        {
          t: "note",
          text: "Почему тень работает: в реальном мире предметы отбрасывают тень, и мозг считывает её как «объект приподнят над поверхностью». Поэтому карточки с мягкой тенью кажутся объёмными и кликабельными, а блоки с резкой чёрной тенью выглядят дёшево и тяжело. Правило простое: тень — большая, размытая и полупрозрачная.",
        },
        {
          t: "h",
          text: "Псевдокласс :hover и плавность",
        },
        {
          t: "p",
          text: "Селектор `.btn:hover` — это «та же кнопка, но когда на неё навели мышь». Псевдокласс с двоеточием описывает не другой элемент, а состояние того же самого. Сама по себе смена фона при наведении резкая и дёрганая, поэтому её смягчают свойством `transition: background-color 0.3s` — «меняй фон плавно, за 0,3 секунды». Transition ставят на обычное состояние элемента, а не на :hover, чтобы анимация работала в обе стороны.",
        },
        {
          t: "code",
          code: ".btn {\n  background: #2563eb;\n  transition: background-color 0.3s; /* плавность сюда */\n  cursor: pointer;\n}\n\n.btn:hover {\n  background: #1d4ed8; /* темнее при наведении */\n}",
          caption: "Кнопка, которая мягко темнеет под курсором",
        },
        {
          t: "list",
          items: [
            "`border-radius` вы уже знаете — у карточек красиво смотрятся 12–16px.",
            "`opacity: 0.5` — полупрозрачность элемента целиком (1 — непрозрачный, 0 — невидимый).",
            "`cursor: pointer` — курсор-«рука»: подсказывает, что элемент кликабельный. У настоящих <button> браузер, как ни странно, сам его не ставит.",
          ],
        },
      ],
      example: {
        caption: "Карточка с мягкой тенью и кнопка: наведите курсор — фон плавно потемнеет.",
        code: "<!DOCTYPE html>\n<html lang=\"ru\">\n<head>\n<meta charset=\"UTF-8\">\n<title>Эффекты</title>\n<style>\n  body { font-family: Arial, sans-serif; background: #f1f5f9; padding: 20px; }\n  .card {\n    background: white;\n    border-radius: 16px;\n    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);\n    padding: 20px;\n    max-width: 320px;\n  }\n  .btn {\n    background: #2563eb;\n    color: white;\n    border: none;\n    padding: 10px 20px;\n    border-radius: 999px;\n    font-size: 16px;\n    cursor: pointer;\n    transition: background-color 0.3s;\n  }\n  .btn:hover { background: #1d4ed8; }\n</style>\n</head>\n<body>\n  <div class=\"card\">\n    <strong>Карточка с тенью</strong>\n    <p>Тень мягкая и прозрачная — карточка будто парит над фоном.</p>\n    <button class=\"btn\">Наведите на меня</button>\n  </div>\n</body>\n</html>",
      },
      task: {
        brief:
          "Добавьте карточке и кнопке финальные эффекты. Карточке .card: border-radius 16px и box-shadow 0 10px 30px rgba(0, 0, 0, 0.15). Кнопке .btn: переход transition: background-color 0.3s, cursor: pointer и правило .btn:hover с более тёмным фоном #1d4ed8.",
        starter:
          "<!DOCTYPE html>\n<html lang=\"ru\">\n<head>\n<meta charset=\"UTF-8\">\n<title>Задание: эффекты</title>\n<style>\n  body { font-family: Arial, sans-serif; background: #f1f5f9; padding: 20px; }\n  .card {\n    background: white;\n    padding: 20px;\n    max-width: 320px;\n  }\n  .btn {\n    background: #2563eb;\n    color: white;\n    border: none;\n    padding: 10px 20px;\n    border-radius: 999px;\n    font-size: 16px;\n  }\n  /* .card: border-radius 16px; box-shadow 0 10px 30px rgba(0,0,0,0.15).\n     .btn: transition и cursor: pointer. Плюс .btn:hover с фоном #1d4ed8 */\n</style>\n</head>\n<body>\n  <div class=\"card\">\n    <strong>Почти красиво</strong>\n    <p>Не хватает тени, скругления и живой кнопки.</p>\n    <button class=\"btn\">Купить</button>\n  </div>\n</body>\n</html>",
        checks: [
          {
            label: "У карточки .card есть тень",
            run: (doc, win) => {
              const el = doc.querySelector(".card");
              return !!el && win.getComputedStyle(el).boxShadow !== "none";
            },
          },
          {
            label: "У карточки .card скругление 16px",
            run: (doc, win) => {
              const el = doc.querySelector(".card");
              return !!el && win.getComputedStyle(el).borderTopLeftRadius === "16px";
            },
          },
          {
            label: "У кнопки .btn задан плавный переход (transition)",
            run: (doc, win) => {
              const el = doc.querySelector(".btn");
              return !!el && win.getComputedStyle(el).transitionDuration !== "0s";
            },
          },
          {
            label: "У кнопки .btn курсор-«рука» (pointer)",
            run: (doc, win) => {
              const el = doc.querySelector(".btn");
              return !!el && win.getComputedStyle(el).cursor === "pointer";
            },
          },
        ],
        hint: "Тень: box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15). Переход пишется в обычное правило .btn, а смена фона — в отдельное правило .btn:hover { background: #1d4ed8; }.",
        solution:
          "<!DOCTYPE html>\n<html lang=\"ru\">\n<head>\n<meta charset=\"UTF-8\">\n<title>Задание: эффекты</title>\n<style>\n  body { font-family: Arial, sans-serif; background: #f1f5f9; padding: 20px; }\n  .card {\n    background: white;\n    padding: 20px;\n    max-width: 320px;\n    border-radius: 16px;\n    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);\n  }\n  .btn {\n    background: #2563eb;\n    color: white;\n    border: none;\n    padding: 10px 20px;\n    border-radius: 999px;\n    font-size: 16px;\n    transition: background-color 0.3s;\n    cursor: pointer;\n  }\n  .btn:hover {\n    background: #1d4ed8;\n  }\n</style>\n</head>\n<body>\n  <div class=\"card\">\n    <strong>Почти красиво</strong>\n    <p>Не хватает тени, скругления и живой кнопки.</p>\n    <button class=\"btn\">Купить</button>\n  </div>\n</body>\n</html>",
      },
    },
    {
      id: "css-project",
      title: "Проект: карточка товара",
      minutes: 10,
      intro:
        "Финальный проект модуля: собираем карточку товара, как в настоящем интернет-магазине. Здесь встретится всё изученное: классы, блочная модель, flexbox, цвета, тени и скругления.",
      theory: [
        {
          t: "h",
          text: "Из чего состоит карточка товара",
        },
        {
          t: "p",
          text: "Посмотрите на любую витрину: карточка — это белый блок на цветном фоне секции, внутри название, описание, крупная цена и заметная кнопка. Никакой магии: фон и тень отделяют карточку от страницы, flexbox внутри ставит содержимое в аккуратную колонку по центру, а цена выигрывает за счёт размера и цвета — глаз должен цепляться за неё первой после названия.",
        },
        {
          t: "list",
          items: [
            "Секция .showcase — фон страницы, на котором карточка «парит».",
            "Карточка .product — белый фон, padding 24px, border-radius 16px, мягкая тень.",
            "Внутри — flex-колонка: display: flex; flex-direction: column; align-items: center. Всё содержимое само встанет по центру.",
            "Цена .price — 32px, жирная, акцентного цвета #2563eb.",
            "Кнопка .buy — фон #2563eb, белый текст, круглые углы, cursor: pointer и :hover потемнее.",
          ],
        },
        {
          t: "note",
          text: "Почему карточку собирают именно так: пользователь сканирует витрину за секунды и принимает решение по трём вещам — что это, сколько стоит и где кнопка. Поэтому название — крупно сверху, цена — самая заметная цифра, кнопка — яркая и по центру. Хороший дизайн карточки — это не украшательство, а порядок, в котором мозг получает ответы на свои вопросы.",
        },
        {
          t: "p",
          text: "Обратите внимание, как мало здесь нового: вы просто комбинируете приёмы из прошлых уроков. Так и выглядит настоящая вёрстка — не изобретение трюков, а уверенное сочетание базовых инструментов.",
        },
      ],
      example: {
        caption: "Образец результата: готовая карточка товара, к которой мы стремимся в задании.",
        code: "<!DOCTYPE html>\n<html lang=\"ru\">\n<head>\n<meta charset=\"UTF-8\">\n<title>Карточка товара</title>\n<style>\n  * { box-sizing: border-box; }\n  body { font-family: Arial, sans-serif; margin: 0; }\n  .showcase {\n    background: #eef2ff;\n    padding: 32px 16px;\n  }\n  .product {\n    background: white;\n    max-width: 320px;\n    margin: 0 auto;\n    padding: 24px;\n    border-radius: 16px;\n    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n    text-align: center;\n    gap: 10px;\n  }\n  .price {\n    font-size: 32px;\n    font-weight: 700;\n    color: #2563eb;\n  }\n  .buy {\n    background: #2563eb;\n    color: white;\n    border: none;\n    padding: 12px 28px;\n    border-radius: 999px;\n    font-size: 16px;\n    cursor: pointer;\n    transition: background-color 0.3s;\n  }\n  .buy:hover { background: #1d4ed8; }\n</style>\n</head>\n<body>\n  <section class=\"showcase\">\n    <div class=\"product\">\n      <h3>Наушники беспроводные</h3>\n      <p>40 часов работы, шумоподавление и мягкие амбушюры.</p>\n      <div class=\"price\">4 990 ₽</div>\n      <button class=\"buy\">Купить</button>\n    </div>\n  </section>\n</body>\n</html>",
      },
      task: {
        brief:
          "Соберите карточку товара по описанию. .product: фон белый уже задан; добавьте padding 24px, border-radius 16px, тень 0 10px 30px rgba(0, 0, 0, 0.12) и flex-колонку по центру (display: flex; flex-direction: column; align-items: center). .price: размер 32px и цвет #2563eb. .buy: фон #2563eb и белый цвет текста.",
        starter:
          "<!DOCTYPE html>\n<html lang=\"ru\">\n<head>\n<meta charset=\"UTF-8\">\n<title>Проект: карточка товара</title>\n<style>\n  * { box-sizing: border-box; }\n  body { font-family: Arial, sans-serif; margin: 0; }\n  .showcase {\n    background: #eef2ff;\n    padding: 32px 16px;\n  }\n  .product {\n    background: white;\n    max-width: 320px;\n    margin: 0 auto;\n    text-align: center;\n  }\n  /* Дособерите карточку:\n     .product: padding 24px; border-radius 16px;\n       box-shadow 0 10px 30px rgba(0,0,0,0.12);\n       display: flex; flex-direction: column; align-items: center.\n     .price: font-size 32px; color #2563eb (и font-weight 700 для силы).\n     .buy: background #2563eb; color white. */\n</style>\n</head>\n<body>\n  <section class=\"showcase\">\n    <div class=\"product\">\n      <h3>Наушники беспроводные</h3>\n      <p>40 часов работы, шумоподавление и мягкие амбушюры.</p>\n      <div class=\"price\">4 990 ₽</div>\n      <button class=\"buy\">Купить</button>\n    </div>\n  </section>\n</body>\n</html>",
        checks: [
          {
            label: "Содержимое .product выстроено flex-колонкой по центру",
            run: (doc, win) => {
              const el = doc.querySelector(".product");
              if (!el) return false;
              const cs = win.getComputedStyle(el);
              return cs.display === "flex" && cs.alignItems === "center";
            },
          },
          {
            label: "У .product скругление углов 16px",
            run: (doc, win) => {
              const el = doc.querySelector(".product");
              return !!el && win.getComputedStyle(el).borderTopLeftRadius === "16px";
            },
          },
          {
            label: "У .product есть мягкая тень",
            run: (doc, win) => {
              const el = doc.querySelector(".product");
              return !!el && win.getComputedStyle(el).boxShadow !== "none";
            },
          },
          {
            label: "У .product внутренний отступ 24px",
            run: (doc, win) => {
              const el = doc.querySelector(".product");
              return !!el && win.getComputedStyle(el).paddingTop === "24px";
            },
          },
          {
            label: "Цена .price крупная — 32px",
            run: (doc, win) => {
              const el = doc.querySelector(".price");
              return !!el && win.getComputedStyle(el).fontSize === "32px";
            },
          },
          {
            label: "Цена .price акцентного цвета #2563eb",
            run: (doc, win) => {
              const el = doc.querySelector(".price");
              return !!el && win.getComputedStyle(el).color === "rgb(37, 99, 235)";
            },
          },
          {
            label: "У кнопки .buy фон #2563eb",
            run: (doc, win) => {
              const el = doc.querySelector(".buy");
              return !!el && win.getComputedStyle(el).backgroundColor === "rgb(37, 99, 235)";
            },
          },
        ],
        hint: "Идите по списку из брифа сверху вниз: сначала .product (padding, radius, тень, flex), потом .price, потом .buy. Все приёмы — из прошлых уроков.",
        solution:
          "<!DOCTYPE html>\n<html lang=\"ru\">\n<head>\n<meta charset=\"UTF-8\">\n<title>Проект: карточка товара</title>\n<style>\n  * { box-sizing: border-box; }\n  body { font-family: Arial, sans-serif; margin: 0; }\n  .showcase {\n    background: #eef2ff;\n    padding: 32px 16px;\n  }\n  .product {\n    background: white;\n    max-width: 320px;\n    margin: 0 auto;\n    text-align: center;\n    padding: 24px;\n    border-radius: 16px;\n    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n    gap: 10px;\n  }\n  .price {\n    font-size: 32px;\n    font-weight: 700;\n    color: #2563eb;\n  }\n  .buy {\n    background: #2563eb;\n    color: white;\n    border: none;\n    padding: 12px 28px;\n    border-radius: 999px;\n    font-size: 16px;\n    cursor: pointer;\n    transition: background-color 0.3s;\n  }\n  .buy:hover { background: #1d4ed8; }\n</style>\n</head>\n<body>\n  <section class=\"showcase\">\n    <div class=\"product\">\n      <h3>Наушники беспроводные</h3>\n      <p>40 часов работы, шумоподавление и мягкие амбушюры.</p>\n      <div class=\"price\">4 990 ₽</div>\n      <button class=\"buy\">Купить</button>\n    </div>\n  </section>\n</body>\n</html>",
      },
    },
  ],
};
