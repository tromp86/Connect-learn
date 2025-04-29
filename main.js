import { wordPairs } from "./wordPairs.js";

let filteredWordPairs = [...wordPairs]; // Початкові пари
const batchSize = 5; // Кількість слів в одному раунді
let shuffledPairs = shuffle([...filteredWordPairs]);
let currentIndex = 0;
let first = null;
let allCurrentWords = [];

let wrongAttempts = 0;
function updateWrongAttemptsDisplay() {
  const wrongCountSpan = document.getElementById("wrongCount");
  if (wrongCountSpan) {
    wrongCountSpan.textContent = wrongAttempts;
  }
}

const sectionLeft = document.querySelector(".sectionLeft");

const engColumn = document.createElement("div");
engColumn.className = "column";
sectionLeft.appendChild(engColumn);

const uaColumn = document.createElement("div");
uaColumn.className = "column";
sectionLeft.appendChild(uaColumn);

// Функція для випадкового перемішування масиву
function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
}

// Оновлення слів за рівнями
function updateWordPairsByLevel(level) {
  clearTimeout(window.updateTimeout);

  const circle = document.querySelector(".theme-circle");
  const spanLevel = document.querySelector(".spanLevel");

  window.updateTimeout = setTimeout(() => {
    const wordElements = document.querySelectorAll(".word");
    wordElements.forEach((wordElement) => {
      switch (level) {
        case "A1":
          wordElement.style.border = "1px solid #8fc8b3";
          circle.style.backgroundColor = "green";
          spanLevel.style.opacity = "1";
          break;
        case "B1":
          wordElement.style.border = "1px solid #dccb99";
          circle.style.backgroundColor = "yellow";
          spanLevel.style.opacity = "1";
          break;
        case "C1":
          wordElement.style.border = "1px solid #d9a2a8";
          circle.style.backgroundColor = "red";
          spanLevel.style.opacity = "1";
          break;
        default:
          wordElement.style.border = "0px solidrgb(255, 0, 0)";
          circle.style.backgroundColor = "grey";
          spanLevel.style.opacity = "1";
      }
    });
  }, 920);

  // Додаємо анімацію flip для всіх поточних карток
  allCurrentWords.forEach((card) => {
    card.classList.add("jello-horizontal");
  });

  // Чекаємо 500мс для завершення анімації, потім змінюємо текст букв
  setTimeout(() => {
    filteredWordPairs = wordPairs.filter((pair) => pair.level === level);
    shuffledPairs = shuffle([...filteredWordPairs]);
    currentIndex = 0;

    // Оновлення тексту для карток
    allCurrentWords.forEach((card, index) => {
      const wordPair = shuffledPairs[index]; // Беремо пару зі списку
      if (wordPair) {
        card.textContent = wordPair.en; // Оновлюємо текст
      }
    });
  }, 700);

  // Показуємо першу пару через 1000мс (завершення всіх дій)
  setTimeout(() => {
    showCurrentPair();
    allCurrentWords.forEach((card) => {
      addInteractiveHoverEffect(card);
    });
  }, 900);
}

// Додаємо обробники кліків для кнопок
document.querySelectorAll(".level-btn").forEach((btn) => {
  btn.addEventListener("click", function () {
    const level = this.getAttribute("data-level"); // Зчитуємо рівень із кнопки
    updateWordPairsByLevel(level); // Викликаємо оновлення рівня
  });
});

// Показувати поточну пару слів
function showCurrentPair() {
  // Якщо раніше було "Всі слова вгадані!" — повертаємо колонки
  engColumn.style.display = "";
  uaColumn.style.display = "";

  engColumn.innerHTML = "";
  uaColumn.innerHTML = "";
  allCurrentWords = [];
  first = null;

  const learnedCount = Math.min(currentIndex, filteredWordPairs.length);
  const totalCount = filteredWordPairs.length;
  const progressPercent =
    totalCount > 0 ? Math.floor((learnedCount / totalCount) * 100) : 0;

  document.getElementById("batteryFill").style.width = `${progressPercent}%`;

  if (currentIndex >= shuffledPairs.length) {
    // Сховати колонки зі словами
    engColumn.style.display = "none";
    uaColumn.style.display = "none";

    // Показати повідомлення
    const doneMsg = document.createElement("div");
    doneMsg.textContent = "🎉 Всі слова вгадані!";
    doneMsg.style.fontSize = "46px";
    doneMsg.style.color = "green";
    doneMsg.style.fontWeight = "bold";
    doneMsg.style.textAlign = "center";
    doneMsg.style.fontFamily = "Play, sans-serif";
    doneMsg.style.textShadow = "2px 2px 5px rgba(0,0,0,0.2)";
    sectionLeft.appendChild(doneMsg);

    // Через 2 секунди — прибрати повідомлення, показати всі слова
    setTimeout(() => {
      doneMsg.remove();

      // Повернути колонки
      engColumn.style.display = "flex";
      uaColumn.style.display = "flex";

      // Скинути фільтр — показати всі слова
      filteredWordPairs = [...wordPairs];
      shuffledPairs = shuffle([...filteredWordPairs]);
      currentIndex = 0;
      showCurrentPair();

      allCurrentWords.forEach((card) => {
        addInteractiveHoverEffect(card);
      });
    }, 6000);
    return;
  }

  const currentBatch = shuffledPairs.slice(
    currentIndex,
    currentIndex + batchSize
  );

  currentBatch.forEach((pair) => {
    const engWord = document.createElement("div");
    engWord.className = "word";
    engWord.textContent = pair.en;
    engWord.dataset.word = pair.en;
    engWord.dataset.lang = "en";

    const uaWord = document.createElement("div");
    uaWord.className = "word";
    uaWord.textContent = pair.ua;
    uaWord.dataset.word = pair.ua;
    uaWord.dataset.lang = "ua";

    allCurrentWords.push(engWord, uaWord);
  });

  // Перемішати і додати в колонки
  shuffle(allCurrentWords).forEach((div) => {
    if (div.dataset.lang === "en") {
        engColumn.appendChild(div);
    } else {
        uaColumn.appendChild(div);
    }

    div.addEventListener("click", () => {
        if (div.classList.contains("matched") || div === first) return;

        div.classList.add("selected");

        if (!first) {
            first = div;
        } else {
            const word1 = first.dataset.word;
            const lang1 = first.dataset.lang;
            const word2 = div.dataset.word;
            const lang2 = div.dataset.lang;

            // Перевіряємо, що вибрані слова мають різні мови
            if (lang1 !== lang2) {
                const isMatch = wordPairs.some(
                    (p) =>
                        (p.en === word1 && p.ua === word2) ||
                        (p.en === word2 && p.ua === word1)
                );

                const firstCopy = first;
                const secondCopy = div;

                if (isMatch) {
                    firstCopy.classList.remove("selected");
                    secondCopy.classList.remove("selected");
                    firstCopy.classList.add("matched");
                    secondCopy.classList.add("matched");

                    const allMatched = allCurrentWords.every((el) =>
                        el.classList.contains("matched")
                    );
                    if (allMatched) {
                        setTimeout(() => {
                            currentIndex += batchSize;
                            showCurrentPair();
                        }, 50);
                    } else {
                        first = null;
                    }
                } else {
                    // Тільки якщо слова різних мов і невгадані, збільшуємо лічильник
                    firstCopy.classList.add("wrong");
                    secondCopy.classList.add("wrong");
                    wrongAttempts += 1;
                    updateWrongAttemptsDisplay();

                    setTimeout(() => {
                        firstCopy.classList.remove("selected", "wrong");
                        secondCopy.classList.remove("selected", "wrong");
                        first = null;
                        updateRating();
                    }, 500);
                }
            } else {
                // Якщо обидва слова одного мовного типу, просто скидаємо вибір
                first.classList.remove("selected");
                div.classList.remove("selected");
                first = null;
            }
        }
    });
});

}

// Додавання логіки для кнопок рівнів
document.querySelectorAll(".level-btn").forEach((button) => {
  button.addEventListener("click", () => {
    const selectedLevel = button.dataset.level;
    updateWordPairsByLevel(selectedLevel);
  });
});

window.onload = () => {
  setTimeout(() => {
    showCurrentPair();
  }, 500); // Затримка 1 секунда
};

const sectionRight = document.querySelector(".sectionRight");
function updateRating() {
  sectionRight.innerHTML = "";

  const ratings = [
    // { max: 1, emoji: "🌟", message: "Покажи на що ти здатний!" },
    // { max: 2, emoji: "🎯", message: "Початок багатообіцяючий!" },
    // { max: 3, emoji: "🙂", message: "Ну, ти точно не новачок!" },
    // { max: 4, emoji: "📘", message: "Вже щось згадуєш." },
    // { max: 5, emoji: "🧐", message: "Не все так погано." },
    // { max: 6, emoji: "😐", message: "Хмм... не так уже й круто." },
    // { max: 7, emoji: "🤓", message: "Може ще раз перечитати?" },
    // { max: 8, emoji: "😬", message: "Ти хоч вчив ці слова?" },
    // { max: 9, emoji: "📖", message: "Десь бачив ці слова, еге ж?" },
    // { max: 10, emoji: "😵", message: "Мабуть, ти відкрив словник навмання?" },
    // { max: 11, emoji: "🥴", message: "Очевидно, день був важкий." },
    // { max: 12, emoji: "🤔", message: "Англійська — не твоє?" },
    // { max: 13, emoji: "🙄", message: "Ну ти даєш..." },
    // { max: 14, emoji: "🥱", message: "Може, варто прокинутись?" },
    // { max: 15, emoji: "🫠", message: "Тане твоя памʼять, як морозиво." },
    // { max: 16, emoji: "😓", message: "Десь поміж вух загубився словник." },
    // { max: 17, emoji: "🤖", message: "Навіть робот помилився б менше." },
    // { max: 18, emoji: "😑", message: "Без емоцій, як твій результат." },
    // { max: 19, emoji: "🙃", message: "Все перевернулось з ніг на голову." },
    // { max: 20, emoji: "😕", message: "Це був тест? А я думав, гра." },
    // { max: 21, emoji: "🫣", message: "Навіть не знаю, як коментувати." },
    // { max: 22, emoji: "🧠", message: "Мозок... підʼєднано невірно." },
    // { max: 23, emoji: "🎃", message: "Гарбуз на плечах замість голови?" },
    // { max: 24, emoji: "👀", message: "Ти взагалі бачив ці слова раніше?" },
    // { max: 25, emoji: "🧌", message: "Мовне чудовисько в дії." },
    // { max: 26, emoji: "🐢", message: "Повільно і неправильно." },
    // { max: 27, emoji: "🐌", message: "Ще повільніше і ще менш правильно." },
    // { max: 28, emoji: "💤", message: "Здається, ти спиш." },
    // { max: 29, emoji: "🤡", message: "Трошки клоунади не завадить." },
    // { max: 30, emoji: "🎭", message: "Вистава провалена." },
    // { max: 31, emoji: "💩", message: "Щось пішло дуже не так." },
    // { max: 32, emoji: "🪦", message: "Мовні знання померли." },
    // { max: 33, emoji: "🧟‍♂️", message: "Знання зомбі-режиму." },
    // { max: 34, emoji: "🔚", message: "Кінець — як у серіалу без фіналу." },
    // { max: 35, emoji: "📉", message: "Падаєш, як ринок криптовалют." },
    // { max: 36, emoji: "🚽", message: "Результат злився..." },
    // { max: 37, emoji: "🕳️", message: "Всі знання кудись провалились." },
    // { max: 38, emoji: "🎲", message: "Може, ти просто грав у вдачу?" },
    // { max: 39, emoji: "🎬", message: "Сцена повного провалу." },
    // { max: 40, emoji: "🥸", message: "Прикидаєшся, що знаєш?" },
    // { max: 41, emoji: "🪫", message: "Рівень знань: батарея розряджена." },
    // { max: 42, emoji: "⚠️", message: "Попередження: критичний рівень." },
    // { max: 43, emoji: "🧯", message: "Горить! Вчи слова!" },
    // { max: 44, emoji: "🧻", message: "Цей результат можна змити." },
    // { max: 45, emoji: "🗑️", message: "Краще почати спочатку." },
    // { max: 46, emoji: "🚫", message: "Мова відмовляється з тобою говорити." },
    // { max: 47, emoji: "📛", message: "Режим самознищення знань активовано." },
    // { max: 48, emoji: "📵", message: "Заборонено знати так мало!" },
    // { max: 49, emoji: "🤯", message: "Мозок вибухнув від неправильностей." },
    { max: 1, emoji: "🌟", message: "Покажи на що ти здатний!" },
    { max: 2, emoji: "🎯", message: "Майже бездоганно, чітко по цілі!" },
    { max: 3, emoji: "🙂", message: "Ну, ти точно не новачок у з'єднанні!" },
    {
      max: 4,
      emoji: "📘",
      message: "Вже щось згадуєш, майже всі пари в точку.",
    },
    {
      max: 5,
      emoji: "🧐",
      message: "Не все так погано — десь влучив, десь ні.",
    },
    { max: 6, emoji: "😐", message: "Хмм... зв’язки не надто міцні сьогодні." },
    { max: 7, emoji: "🤓", message: "Може ще раз глянути на пари?" },
    { max: 8, emoji: "😬", message: "Ти хоч перевіряв, що з чим з’єднуєш?" },
    {
      max: 9,
      emoji: "📖",
      message: "Може, щось і бачив раніше, але що з чим?",
    },
    {
      max: 10,
      emoji: "😵",
      message: "Здається, ти навмання тягнув стрілки...",
    },
    {
      max: 11,
      emoji: "🥴",
      message: "Мозок трохи поплив — плутанина з’єднань.",
    },
    { max: 12, emoji: "🤔", message: "Це точно англійська, а не ребус?" },
    { max: 13, emoji: "🙄", message: "Мда... це були дуже творчі пари 😅" },
    {
      max: 14,
      emoji: "🥱",
      message: "З таким темпом пари самі не складуться.",
    },
    { max: 15, emoji: "🫠", message: "Твої зв’язки — як морозиво на сонці." },
    {
      max: 16,
      emoji: "😓",
      message: "Десь згубився між словами й перекладами.",
    },
    { max: 17, emoji: "🤖", message: "Навіть штучний інтелект плакав би..." },
    { max: 18, emoji: "😑", message: "Зв’язки без емоцій, як і результат." },
    {
      max: 19,
      emoji: "🙃",
      message: "Переплутав усе: верх, низ, праве, ліве...",
    },
    { max: 20, emoji: "😕", message: "Ти слова грав, а не вчив?" },
    { max: 21, emoji: "🫣", message: "Мабуть, краще промовчати про ці пари..." },
    { max: 22, emoji: "🧠", message: "Мозок з'єднав не ті дроти." },
    {
      max: 23,
      emoji: "🎃",
      message: "Гарбуз на плечах не допоміг із перекладом.",
    },
    { max: 24, emoji: "👀", message: "Ти точно колись бачив ці слова, так?" },
    {
      max: 25,
      emoji: "🧌",
      message: "Мовне чудовисько на полюванні за парами!",
    },
    { max: 26, emoji: "🐢", message: "Повільно і не в той бік." },
    { max: 27, emoji: "🐌", message: "Ще повільніше і ще більш хибно..." },
    { max: 28, emoji: "💤", message: "Може, прокинься й спробуй ще раз?" },
    { max: 29, emoji: "🤡", message: "Весело, але не точно..." },
    { max: 30, emoji: "🎭", message: "Ця вистава про невірні з’єднання." },
    { max: 31, emoji: "💩", message: "З'єднав так, що й слова злякались." },
    { max: 32, emoji: "🪦", message: "Словниковий запас пішов спочивати..." },
    { max: 33, emoji: "🧟‍♂️", message: "Пари живі... але як зомбі." },
    { max: 34, emoji: "🔚", message: "Це був фінал без щасливого кінця." },
    { max: 35, emoji: "📉", message: "Знання падають швидше за біткоїн." },
    { max: 36, emoji: "🚽", message: "Всі з'єднання злились у нікуди." },
    { max: 37, emoji: "🕳️", message: "Куди поділись правильні пари?" },
    { max: 38, emoji: "🎲", message: "Це була гра на вдачу?" },
    {
      max: 39,
      emoji: "🎬",
      message: "Сцена провалу: головний герой — неправильне з'єднання.",
    },
    { max: 40, emoji: "🥸", message: "Прикидаєшся, що все знав?" },
    {
      max: 41,
      emoji: "🪫",
      message: "Мозок розряджено — жодної правильної пари.",
    },
    {
      max: 42,
      emoji: "⚠️",
      message: "Попередження! Небезпечний рівень помилок.",
    },
    { max: 43, emoji: "🧯", message: "Палає від неправильних з’єднань!" },
    { max: 44, emoji: "🧻", message: "Це можна стерти... і забути." },
    { max: 45, emoji: "🗑️", message: "Краще почати все спочатку." },
    { max: 46, emoji: "🚫", message: "Англійська відмовляється відповідати." },
    { max: 47, emoji: "📛", message: "Активація режиму самознищення пар." },
    { max: 48, emoji: "📵", message: "Заборонено з'єднувати так безглуздо!" },
    { max: 49, emoji: "🤯", message: "Твій мозок і слова — антиподи." },
    {
      max: Infinity,
      emoji: "💀",
      message: "Повний морок. Повторення — мати навчання!",
    },
  ];

  const rating = ratings.find((r) => wrongAttempts <= r.max);

  const emojiDiv = document.createElement("div");
  emojiDiv.className = "emoji"; // Додаємо клас і анімацію
  emojiDiv.textContent = rating.emoji;

  const textDiv = document.createElement("div");
  textDiv.className = "fancy-message"; // Додаємо основний клас
  textDiv.innerHTML = `<span class="text-flip">${rating.message}</span>`;

  // Додаємо елементи у sectionRight
  sectionRight.appendChild(emojiDiv);
  sectionRight.appendChild(textDiv);

  // ❌ Помилкові спроби
  const wrongBox = document.createElement("div");
  wrongBox.className = "wrong-box";
  wrongBox.innerHTML = `<div class="label">Помилкових спроб:</div> <div id="wrongCount">${wrongAttempts}</div>`;
  sectionRight.appendChild(wrongBox);
}

updateRating(); // початковий стан

document.getElementById("themeToggle").addEventListener("click", function () {
  const body = document.body;

  if (body.dataset.theme === "dark") {
    body.dataset.theme = "light";
    localStorage.setItem("theme", "light"); // 🔐 зберігаємо тему
    console.log("light");
  } else {
    body.dataset.theme = "dark";
    localStorage.setItem("theme", "dark"); // 🔐 зберігаємо тему
    console.log("dark");
  }
});

window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    document.body.dataset.theme = savedTheme;
  }
});

function addInteractiveHoverEffect(card) {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const offsetX = (centerX - x) / centerX;
    const offsetY = (centerY - y) / centerY;

    const rotateX = -offsetY * 4;
    const rotateY = offsetX * 4;
    const moveX = offsetX * 3;
    const moveY = offsetY * 3;

    card.style.transform = `translate(${moveX}px, ${moveY}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "translate(0, 0) rotateX(0) rotateY(0) scale(1)";
  });
}
setTimeout(() => {
  allCurrentWords.forEach((card) => {
    addInteractiveHoverEffect(card);
  });
}, 510);