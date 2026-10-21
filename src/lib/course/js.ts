import type { CourseModule } from "./types";

export const MODULE_JS: CourseModule = {
  id: "js",
  title: "JavaScript: оживляем страницу",
  icon: "⚡",
  desc: "Первые шаги в программировании: переменные, события, условия и взаимодействие с пользователем.",
  lessons: [
    {
      id: "js-first",
      title: "Первый скрипт и переменные",
      minutes: 8,
      intro:
        "HTML строит страницу, CSS её украшает, а JavaScript заставляет реагировать на действия. В этом уроке подключим первый скрипт, познакомимся с переменными и выведем текст на страницу не руками, а кодом.",
      theory: [
        {
          t: "h",
          text: "Где живёт скрипт",
        },
        {
          t: "p",
          text: "Код на JavaScript кладут в тег `<script>` — обычно в самом конце `<body>`, прямо перед закрывающим тегом. Браузер читает страницу сверху вниз: встретил скрипт — сразу выполняет. Если скрипт стоит в начале, он попытается найти элементы, которых ещё нет на странице, и получит пустоту вместо них.",
        },
        {
          t: "note",
          text: "Почему именно конец body: скрипт почти всегда работает с уже построенной страницей. Конец документа гарантирует, что все элементы существуют и к ним можно обращаться.",
        },
        {
          t: "h",
          text: "Переменные — коробки с именами",
        },
        {
          t: "p",
          text: "Переменная — это именованная «коробка», в которой лежит значение: текст, число, что угодно. Объявляют её словами `let` (значение можно менять) и `const` (нельзя). Имя придумываете вы — главное, чтобы оно описывало содержимое: `city`, `price`, `userName`.",
        },
        {
          t: "code",
          code: "let age = 25;        // число, можно менять\nconst city = \"Москва\"; // строка (текст в кавычках)\nage = 26;            // так можно: это let\n// city = \"Казань\";  // а так нельзя: это const",
          caption: "Два главных типа значений для старта: числа и строки",
        },
        {
          t: "p",
          text: "Чтобы показать результат человеку, а не в консоль разработчика, скрипт находит элемент по его `id` и меняет его текст через свойство `textContent`. Найти элемент помогает `document.querySelector(\"#out\")` — в скобках тот же селектор, что и в CSS.",
        },
      ],
      example: {
        caption: "Скрипт внизу страницы берёт элемент и пишет в него текст, собранный из переменных",
        code: "<!DOCTYPE html>\n<html lang=\"ru\">\n<head>\n<meta charset=\"UTF-8\">\n<title>Приветствие</title>\n</head>\n<body>\n<h1 id=\"title\">Заголовок</h1>\n<p id=\"demo\">Здесь будет текст от скрипта…</p>\n\n<script>\nconst userName = \"Аня\";\nconst points = 120;\n\nconst demo = document.querySelector(\"#demo\");\ndemo.textContent = \"Игрок \" + userName + \" набрал \" + points + \" очков\";\n\nconsole.log(\"Скрипт отработал\");\n</script>\n</body>\n</html>",
      },
      task: {
        brief:
          "В заготовке уже есть абзац с `id=\"out\"` и переменная `city` со значением «Москва». Напишите скрипт, который выводит в этот абзац фразу «Город: Москва», собрав её из переменной (конкатенацией через `+` или шаблонной строкой). Хардкодить готовую фразу целиком нельзя — смысл именно в сборке из переменной.",
        starter:
          "<!DOCTYPE html>\n<html lang=\"ru\">\n<head>\n<meta charset=\"UTF-8\">\n<title>Город</title>\n</head>\n<body>\n<h1>Мой город</h1>\n<p id=\"out\"></p>\n\n<script>\n// Переменная уже объявлена:\nconst city = \"Москва\";\n\n// TODO: найдите элемент #out через document.querySelector\n// и запишите в его textContent фразу «Город: » + city\n\n</script>\n</body>\n</html>",
        checks: [
          {
            label: "В элементе #out появился текст",
            run: (doc) => {
              const out = doc.querySelector("#out");
              return !!out && (out.textContent ?? "").trim().length > 0;
            },
          },
          {
            label: "Текст содержит «Город:»",
            run: (doc) => {
              const out = doc.querySelector("#out");
              return !!out && (out.textContent ?? "").includes("Город:");
            },
          },
          {
            label: "Текст содержит название города из переменной",
            run: (doc) => {
              const out = doc.querySelector("#out");
              return !!out && (out.textContent ?? "").includes("Москва");
            },
          },
        ],
        hint: "Три шага: const out = document.querySelector(\"#out\"); затем out.textContent = \"Город: \" + city; — обратите внимание на пробел после двоеточия.",
        solution:
          "<!DOCTYPE html>\n<html lang=\"ru\">\n<head>\n<meta charset=\"UTF-8\">\n<title>Город</title>\n</head>\n<body>\n<h1>Мой город</h1>\n<p id=\"out\"></p>\n\n<script>\nconst city = \"Москва\";\n\nconst out = document.querySelector(\"#out\");\nout.textContent = \"Город: \" + city;\n</script>\n</body>\n</html>",
      },
    },
    {
      id: "js-events",
      title: "События и клики",
      minutes: 8,
      intro:
        "Страница оживает, когда реагирует на действия: клики, ввод текста, прокрутку. Такие действия называются событиями. Сегодня научим кнопку отвечать на клик.",
      theory: [
        {
          t: "h",
          text: "Что такое событие",
        },
        {
          t: "p",
          text: "Событие — это сигнал от браузера: «пользователь кликнул», «клавиша нажата», «страница загрузилась». Скрипт может подписаться на событие и выполнить код в ответ. Подписка выглядит так: элемент, метод `addEventListener`, имя события и функция, которая сработает.",
        },
        {
          t: "code",
          code: "button.addEventListener(\"click\", () => {\n  // этот код выполнится при каждом клике\n});",
          caption: "Стрелочная функция в скобках — обработчик события",
        },
        {
          t: "p",
          text: "Функция-обработчик не вызывается сразу — она просто передаётся браузеру «на хранение». Браузер вызовет её сам, когда событие произойдёт. Поэтому скобки после имени функции в `addEventListener` не ставят: вызов сейчас сломал бы всю идею.",
        },
        {
          t: "note",
          text: "Почему не атрибут onclick в HTML: разметка отвечает за структуру, скрипт — за поведение. Разделяя их, вы можете повесить на один элемент несколько обработчиков и легко менять логику, не трогая вёрстку.",
        },
        {
          t: "list",
          items: [
            "`click` — клик мышью или касание",
            "`input` — изменение текста в поле ввода (разберём дальше)",
            "`mouseover` — курсор навели на элемент",
            "`keydown` — нажата клавиша",
          ],
        },
      ],
      example: {
        caption: "Живой пример: нажимайте кнопку — счётчик кликов растёт",
        code: "<!DOCTYPE html>\n<html lang=\"ru\">\n<head>\n<meta charset=\"UTF-8\">\n<title>Счётчик кликов</title>\n</head>\n<body>\n<h1>Счётчик кликов</h1>\n<button id=\"btn\">Нажимай!</button>\n<p>Кликов: <span id=\"num\">0</span></p>\n\n<script>\nlet clicks = 0;\nconst btn = document.querySelector(\"#btn\");\nconst num = document.querySelector(\"#num\");\n\nbtn.addEventListener(\"click\", () => {\n  clicks = clicks + 1;\n  num.textContent = clicks;\n});\n</script>\n</body>\n</html>",
      },
      task: {
        brief:
          "Даны кнопка с `id=\"btn\"` и абзац с `id=\"msg\"`. Подпишитесь на клик по кнопке: после клика текст абзаца должен стать «Кнопка нажата!» (ровно такой, с восклицательным знаком).",
        starter:
          "<!DOCTYPE html>\n<html lang=\"ru\">\n<head>\n<meta charset=\"UTF-8\">\n<title>Клик</title>\n</head>\n<body>\n<h1>Проверка клика</h1>\n<button id=\"btn\">Нажми меня</button>\n<p id=\"msg\">Здесь появится результат.</p>\n\n<script>\n// TODO: найдите кнопку и абзац через querySelector\n// TODO: подпишитесь на событие click у кнопки\n// TODO: внутри обработчика поменяйте textContent абзаца\n//       на «Кнопка нажата!»\n</script>\n</body>\n</html>",
        checks: [
          {
            label: "После клика текст абзаца — «Кнопка нажата!»",
            run: (doc) => {
              const btn = doc.querySelector("#btn") as HTMLButtonElement | null;
              const msg = doc.querySelector("#msg");
              if (!btn || !msg) return false;
              btn.click();
              return (msg.textContent ?? "").trim() === "Кнопка нажата!";
            },
          },
          {
            label: "Повторный клик не ломает результат",
            run: (doc) => {
              const btn = doc.querySelector("#btn") as HTMLButtonElement | null;
              const msg = doc.querySelector("#msg");
              if (!btn || !msg) return false;
              btn.click();
              return (msg.textContent ?? "").trim() === "Кнопка нажата!";
            },
          },
        ],
        hint: "const btn = document.querySelector(\"#btn\"); const msg = document.querySelector(\"#msg\"); btn.addEventListener(\"click\", () => { msg.textContent = \"Кнопка нажата!\"; });",
        solution:
          "<!DOCTYPE html>\n<html lang=\"ru\">\n<head>\n<meta charset=\"UTF-8\">\n<title>Клик</title>\n</head>\n<body>\n<h1>Проверка клика</h1>\n<button id=\"btn\">Нажми меня</button>\n<p id=\"msg\">Здесь появится результат.</p>\n\n<script>\nconst btn = document.querySelector(\"#btn\");\nconst msg = document.querySelector(\"#msg\");\n\nbtn.addEventListener(\"click\", () => {\n  msg.textContent = \"Кнопка нажата!\";\n});\n</script>\n</body>\n</html>",
      },
    },
    {
      id: "js-styles",
      title: "Стили и классы через JS",
      minutes: 8,
      intro:
        "JavaScript умеет менять внешний вид страницы: перекрашивать блоки, прятать элементы, включать «тёмную тему». Есть два пути — писать стили прямо из кода или переключать классы. Разберём оба и поймём, какой лучше.",
      theory: [
        {
          t: "h",
          text: "Путь первый: element.style",
        },
        {
          t: "p",
          text: "У каждого элемента есть объект `style` — те же CSS-свойства, только записанные в стиле camelCase: `background-color` превращается в `backgroundColor`. Присваиваете значение — браузер сразу применяет стиль, как будто он написан в атрибуте `style`.",
        },
        {
          t: "code",
          code: "box.style.background = \"#111\";\nbox.style.color = \"#fff\";\nbox.style.padding = \"24px\";",
          caption: "Работает, но стили размазываются по коду",
        },
        {
          t: "h",
          text: "Путь второй: классы",
        },
        {
          t: "p",
          text: "У элемента есть список классов — `classList` — с методами `add` (добавить), `remove` (убрать), `contains` (проверить) и `toggle` (переключить: есть — уберёт, нет — добавит). Сами стили при этом живут в CSS, где им и место.",
        },
        {
          t: "note",
          text: "Почему класс лучше строки стиля: дизайн остаётся в CSS и меняется в одном месте, код только говорит «включи тёмную тему», а как она выглядит — решает таблица стилей. Плюс toggle одной строкой заменяет проверку «а какой режим сейчас?».",
        },
        {
          t: "code",
          code: "box.classList.toggle(\"dark\"); // было светло — стало тёмно, и наоборот",
          caption: "Одна строка вместо ручной проверки состояния",
        },
      ],
      example: {
        caption: "Живой пример: кнопка переключает класс у карточки",
        code: "<!DOCTYPE html>\n<html lang=\"ru\">\n<head>\n<meta charset=\"UTF-8\">\n<title>Тёмная карточка</title>\n<style>\n.card { background: #ffffff; color: #111111; padding: 24px; border: 1px solid #cccccc; border-radius: 12px; transition: 0.25s; }\n.card.night { background: #1d1d2b; color: #f2f2ff; }\n</style>\n</head>\n<body>\n<h1>Переключатель темы</h1>\n<div class=\"card\" id=\"card\">\n<p>Я карточка. Нажми кнопку ниже — и я поменяю тему.</p>\n<button id=\"sw\">Сменить тему</button>\n</div>\n\n<script>\nconst card = document.querySelector(\"#card\");\nconst sw = document.querySelector(\"#sw\");\n\nsw.addEventListener(\"click\", () => {\n  card.classList.toggle(\"night\");\n});\n</script>\n</body>\n</html>",
      },
      task: {
        brief:
          "В заготовке есть блок `id=\"box\"` и кнопка `id=\"toggle\"`. В CSS уже описан класс `.dark` — тёмный фон и светлый текст. Сделайте так, чтобы по клику на кнопку блок получал и терял класс `dark` (переключался).",
        starter:
          "<!DOCTYPE html>\n<html lang=\"ru\">\n<head>\n<meta charset=\"UTF-8\">\n<title>Тема блока</title>\n<style>\n#box { background: #ffffff; color: #111111; padding: 24px; border: 1px solid #cccccc; border-radius: 12px; }\n#box.dark { background: #111111; color: #ffffff; }\n</style>\n</head>\n<body>\n<h1>Тема блока</h1>\n<button id=\"toggle\">Переключить тему</button>\n<div id=\"box\">Блок, который меняет тему</div>\n\n<script>\n// TODO: найдите блок #box и кнопку #toggle\n// TODO: по клику на кнопку переключайте у блока класс dark\n//       через classList.toggle\n</script>\n</body>\n</html>",
        checks: [
          {
            label: "После клика у блока появляется класс dark",
            run: (doc) => {
              const btn = doc.querySelector("#toggle") as HTMLButtonElement | null;
              const box = doc.querySelector("#box");
              if (!btn || !box) return false;
              btn.click();
              return box.classList.contains("dark");
            },
          },
          {
            label: "Фон блока реально становится тёмным (#111)",
            run: (doc, win) => {
              const btn = doc.querySelector("#toggle") as HTMLButtonElement | null;
              const box = doc.querySelector("#box");
              if (!btn || !box) return false;
              if (!box.classList.contains("dark")) btn.click();
              return win.getComputedStyle(box).backgroundColor === "rgb(17, 17, 17)";
            },
          },
        ],
        hint: "const box = document.querySelector(\"#box\"); const toggle = document.querySelector(\"#toggle\"); toggle.addEventListener(\"click\", () => { box.classList.toggle(\"dark\"); });",
        solution:
          "<!DOCTYPE html>\n<html lang=\"ru\">\n<head>\n<meta charset=\"UTF-8\">\n<title>Тема блока</title>\n<style>\n#box { background: #ffffff; color: #111111; padding: 24px; border: 1px solid #cccccc; border-radius: 12px; }\n#box.dark { background: #111111; color: #ffffff; }\n</style>\n</head>\n<body>\n<h1>Тема блока</h1>\n<button id=\"toggle\">Переключить тему</button>\n<div id=\"box\">Блок, который меняет тему</div>\n\n<script>\nconst box = document.querySelector(\"#box\");\nconst toggle = document.querySelector(\"#toggle\");\n\ntoggle.addEventListener(\"click\", () => {\n  box.classList.toggle(\"dark\");\n});\n</script>\n</body>\n</html>",
      },
    },
    {
      id: "js-inputs",
      title: "Ввод, условия, живой счётчик",
      minutes: 9,
      intro:
        "Самое приятное в веб-разработке — когда страница откликается на каждое нажатие клавиши. Для этого нужны поля ввода, событие input и условия: «если ввели имя — поздоровайся по имени, если пусто — иначе».",
      theory: [
        {
          t: "h",
          text: "Читаем поле ввода",
        },
        {
          t: "p",
          text: "У поля `<input>` есть свойство `value` — то, что в нём написано прямо сейчас. Важно: `value` всегда строка, даже если человек ввёл цифры. Событие `input` срабатывает при каждом изменении — на каждую букву, вставку и удаление. Это идеальный момент, чтобы обновить страницу.",
        },
        {
          t: "h",
          text: "Условия: если — иначе",
        },
        {
          t: "code",
          code: "if (value) {\n  // выполнится, если значение «правдивое»\n} else {\n  // выполнится во всех остальных случаях\n}",
          caption: "Пустая строка считается ложью, непустая — правдой",
        },
        {
          t: "p",
          text: "В JavaScript пустая строка `\"\"` — ложное значение, а любая непустая строка — истинное. Поэтому проверка «поле пустое?» выглядит просто как `if (value)`. А метод `.trim()` срезает пробелы по краям: имя из одних пробелов после trim честно станет пустым.",
        },
        {
          t: "note",
          text: "Почему событие input, а не change: change срабатывает только когда поле потеряет фокус — пользователь устанет ждать реакции. Для живых подсказок, счётчиков и предпросмотра нужен именно input: реакция на каждую клавишу.",
        },
        {
          t: "p",
          text: "Длина строки читается через `.length` — так делают счётчики «осталось 200 символов» в соцсетях. Всё вместе: слушаем input, читаем value, проверяем условие, обновляем текст на странице.",
        },
      ],
      example: {
        caption: "Живой пример: печатайте — счётчик символов обновляется сам",
        code: "<!DOCTYPE html>\n<html lang=\"ru\">\n<head>\n<meta charset=\"UTF-8\">\n<title>Счётчик символов</title>\n</head>\n<body>\n<h1>Сколько вы написали?</h1>\n<label>Ваш текст: <input id=\"field\" type=\"text\" placeholder=\"Печатайте сюда\"></label>\n<p id=\"info\">Символов: 0</p>\n\n<script>\nconst field = document.querySelector(\"#field\");\nconst info = document.querySelector(\"#info\");\n\nfield.addEventListener(\"input\", () => {\n  info.textContent = \"Символов: \" + field.value.length;\n});\n</script>\n</body>\n</html>",
      },
      task: {
        brief:
          "Даны поле ввода `id=\"name\"` и абзац `id=\"hello\"`. Сделайте живое приветствие: пока пользователь печатает имя, абзац показывает «Привет, {имя}!». Если поле пустое — «Привет, незнакомец!». Реакция должна быть мгновенной, на событие `input`.",
        starter:
          "<!DOCTYPE html>\n<html lang=\"ru\">\n<head>\n<meta charset=\"UTF-8\">\n<title>Приветствие</title>\n</head>\n<body>\n<h1>Как вас зовут?</h1>\n<label>Имя: <input id=\"name\" type=\"text\" placeholder=\"Введите имя\"></label>\n<p id=\"hello\">Здесь будет приветствие</p>\n\n<script>\n// TODO: найдите поле #name и абзац #hello\n// TODO: напишите функцию обновления: читает value поля,\n//       если не пусто — «Привет, {имя}!», иначе «Привет, незнакомец!»\n// TODO: подпишите функцию на событие input у поля\n//       и вызовите один раз сразу, чтобы текст не был пустым\n</script>\n</body>\n</html>",
        checks: [
          {
            label: "При вводе имени показывает «Привет, Аня!»",
            run: (doc, win) => {
              const input = doc.querySelector("#name") as HTMLInputElement | null;
              const hello = doc.querySelector("#hello");
              if (!input || !hello) return false;
              input.value = "Аня";
              input.dispatchEvent(new (win as unknown as { Event: typeof Event }).Event("input", { bubbles: true }));
              return (hello.textContent ?? "").trim() === "Привет, Аня!";
            },
          },
          {
            label: "При пустом поле показывает «Привет, незнакомец!»",
            run: (doc, win) => {
              const input = doc.querySelector("#name") as HTMLInputElement | null;
              const hello = doc.querySelector("#hello");
              if (!input || !hello) return false;
              input.value = "Аня";
              input.dispatchEvent(new (win as unknown as { Event: typeof Event }).Event("input", { bubbles: true }));
              input.value = "";
              input.dispatchEvent(new (win as unknown as { Event: typeof Event }).Event("input", { bubbles: true }));
              return (hello.textContent ?? "").trim() === "Привет, незнакомец!";
            },
          },
        ],
        hint: "Функция update читает nameInput.value.trim(): если строка не пустая — hello.textContent = `Привет, ${value}!`, иначе — «Привет, незнакомец!». Подпишите её на событие \"input\" и вызовите один раз при старте.",
        solution:
          "<!DOCTYPE html>\n<html lang=\"ru\">\n<head>\n<meta charset=\"UTF-8\">\n<title>Приветствие</title>\n</head>\n<body>\n<h1>Как вас зовут?</h1>\n<label>Имя: <input id=\"name\" type=\"text\" placeholder=\"Введите имя\"></label>\n<p id=\"hello\">Здесь будет приветствие</p>\n\n<script>\nconst nameInput = document.querySelector(\"#name\");\nconst hello = document.querySelector(\"#hello\");\n\nfunction update() {\n  const value = nameInput.value.trim();\n  hello.textContent = value ? `Привет, ${value}!` : \"Привет, незнакомец!\";\n}\n\nnameInput.addEventListener(\"input\", update);\nupdate();\n</script>\n</body>\n</html>",
      },
    },
    {
      id: "js-counter",
      title: "Проект: счётчик с кнопками",
      minutes: 10,
      intro:
        "Собираем всё изученное в один маленький, но настоящий проект: счётчик с кнопками плюс, минус и сброс — и бонусную кнопку, которая красит блок в случайный цвет. Так выглядят 90% интерфейсов: состояние, кнопки, обновление экрана.",
      theory: [
        {
          t: "h",
          text: "Состояние живёт в переменной",
        },
        {
          t: "p",
          text: "У счётчика есть одно главное число. Оно хранится в переменной `let count = 0` — это и есть состояние приложения. Кнопки не «рисуют» цифры напрямую: они только меняют переменную, а отдельная функция `render()` показывает её актуальное значение на экране.",
        },
        {
          t: "note",
          text: "Почему разделяют изменение и отображение: если каждая кнопка сама пишет в элемент, легко забыть обновить что-то ещё — например, цвет или подпись. Когда есть один render(), экран всегда честно показывает состояние, а не то, что кто-то успел подправить.",
        },
        {
          t: "code",
          code: "let count = 0;\n\nfunction render() {\n  view.textContent = count; // число само станет строкой\n}\n\nplusBtn.addEventListener(\"click\", () => {\n  count = count + 1;\n  render();\n});",
          caption: "Кнопка меняет состояние, render показывает результат",
        },
        {
          t: "h",
          text: "Случайность: Math.random",
        },
        {
          t: "p",
          text: "`Math.random()` возвращает случайное число от 0 до 1 (не включая 1). Умножив его на длину массива и округлив вниз через `Math.floor`, получают случайный индекс — так выбирают случайный цвет, цитату или картинку.",
        },
        {
          t: "code",
          code: "const colors = [\"#f87171\", \"#4ade80\", \"#60a5fa\"];\nconst i = Math.floor(Math.random() * colors.length);\nbox.style.background = colors[i];",
          caption: "Случайный элемент массива за три строки",
        },
      ],
      example: {
        caption: "Живой пример: кубик — та же схема «состояние → кнопка → экран»",
        code: "<!DOCTYPE html>\n<html lang=\"ru\">\n<head>\n<meta charset=\"UTF-8\">\n<title>Кубик</title>\n</head>\n<body>\n<h1>Бросок кубика</h1>\n<p style=\"font-size: 48px\" id=\"dice\">🎲</p>\n<button id=\"roll\">Бросить</button>\n\n<script>\nconst dice = document.querySelector(\"#dice\");\nconst roll = document.querySelector(\"#roll\");\n\nroll.addEventListener(\"click\", () => {\n  const value = Math.floor(Math.random() * 6) + 1;\n  dice.textContent = value;\n});\n</script>\n</body>\n</html>",
      },
      task: {
        brief:
          "Соберите счётчик внутри блока `id=\"board\"`: элемент `id=\"count\"` показывает число (начинаем с 0), кнопки `id=\"plus\"` и `id=\"minus\"` прибавляют и вычитают единицу, `id=\"reset\"` возвращает счётчик к нулю. Бонус: кнопка `id=\"color\"` красит фон блока #board в случайный цвет из массива — каждый клик должен реально менять цвет.",
        starter:
          "<!DOCTYPE html>\n<html lang=\"ru\">\n<head>\n<meta charset=\"UTF-8\">\n<title>Счётчик</title>\n<style>\n#board { padding: 28px; border-radius: 16px; background: #eeeeee; text-align: center; }\n#count { font-size: 56px; font-weight: 700; margin: 8px 0 16px; }\nbutton { font-size: 16px; padding: 8px 16px; margin: 0 4px; cursor: pointer; }\n</style>\n</head>\n<body>\n<h1>Мой счётчик</h1>\n<div id=\"board\">\n  <div id=\"count\">0</div>\n  <button id=\"minus\">−</button>\n  <button id=\"plus\">+</button>\n  <button id=\"reset\">Сброс</button>\n  <button id=\"color\">Случайный цвет</button>\n</div>\n\n<script>\n// Состояние счётчика:\nlet count = 0;\n\n// TODO: найдите все элементы через querySelector\n// TODO: напишите функцию render(), которая показывает count в #count\n// TODO: подпишите кнопки: plus (+1), minus (−1), reset (0) —\n//       каждая после изменения вызывает render()\n// TODO: кнопка color: массив из 4–5 цветов, случайный выбор\n//       через Math.random, фон ставится в board.style.background\n</script>\n</body>\n</html>",
        checks: [
          {
            label: "Кнопки + и − меняют счётчик",
            run: (doc) => {
              const plus = doc.querySelector("#plus") as HTMLButtonElement | null;
              const minus = doc.querySelector("#minus") as HTMLButtonElement | null;
              const reset = doc.querySelector("#reset") as HTMLButtonElement | null;
              const view = doc.querySelector("#count");
              if (!plus || !minus || !reset || !view) return false;
              reset.click();
              plus.click();
              plus.click();
              minus.click();
              return (view.textContent ?? "").trim() === "1";
            },
          },
          {
            label: "Сброс возвращает к нулю, и счётчик работает дальше",
            run: (doc) => {
              const plus = doc.querySelector("#plus") as HTMLButtonElement | null;
              const reset = doc.querySelector("#reset") as HTMLButtonElement | null;
              const view = doc.querySelector("#count");
              if (!plus || !reset || !view) return false;
              plus.click();
              reset.click();
              const afterReset = (view.textContent ?? "").trim();
              plus.click();
              const afterPlus = (view.textContent ?? "").trim();
              return afterReset === "0" && afterPlus === "1";
            },
          },
          {
            label: "Кнопка «Случайный цвет» меняет фон блока",
            run: (doc, win) => {
              const colorBtn = doc.querySelector("#color") as HTMLButtonElement | null;
              const board = doc.querySelector("#board");
              if (!colorBtn || !board) return false;
              const before = win.getComputedStyle(board).backgroundColor;
              colorBtn.click();
              const after = win.getComputedStyle(board).backgroundColor;
              return before !== after;
            },
          },
        ],
        hint: "Держите число в let count и функцию render(). Для цвета: следите за текущим цветом в отдельной переменной и выбирайте случайный, пока он не станет другим, — тогда каждый клик гарантированно меняет фон.",
        solution:
          "<!DOCTYPE html>\n<html lang=\"ru\">\n<head>\n<meta charset=\"UTF-8\">\n<title>Счётчик</title>\n<style>\n#board { padding: 28px; border-radius: 16px; background: #eeeeee; text-align: center; }\n#count { font-size: 56px; font-weight: 700; margin: 8px 0 16px; }\nbutton { font-size: 16px; padding: 8px 16px; margin: 0 4px; cursor: pointer; }\n</style>\n</head>\n<body>\n<h1>Мой счётчик</h1>\n<div id=\"board\">\n  <div id=\"count\">0</div>\n  <button id=\"minus\">−</button>\n  <button id=\"plus\">+</button>\n  <button id=\"reset\">Сброс</button>\n  <button id=\"color\">Случайный цвет</button>\n</div>\n\n<script>\nlet count = 0;\n\nconst view = document.querySelector(\"#count\");\nconst board = document.querySelector(\"#board\");\n\nfunction render() {\n  view.textContent = count;\n}\n\ndocument.querySelector(\"#plus\").addEventListener(\"click\", () => {\n  count = count + 1;\n  render();\n});\n\ndocument.querySelector(\"#minus\").addEventListener(\"click\", () => {\n  count = count - 1;\n  render();\n});\n\ndocument.querySelector(\"#reset\").addEventListener(\"click\", () => {\n  count = 0;\n  render();\n});\n\nconst colors = [\"#fca5a5\", \"#86efac\", \"#93c5fd\", \"#fcd34d\", \"#c4b5fd\"];\nlet currentColor = \"#eeeeee\";\n\ndocument.querySelector(\"#color\").addEventListener(\"click\", () => {\n  let next = currentColor;\n  while (next === currentColor) {\n    next = colors[Math.floor(Math.random() * colors.length)];\n  }\n  currentColor = next;\n  board.style.background = currentColor;\n});\n\nrender();\n</script>\n</body>\n</html>",
      },
    },
  ],
};
