// НАЗНАЧЕНИЕ: набор общих сервисных функций приложения
// РАЗРАБОТЧИК: Igor Nesiolovskiy

// функция проверяет поддержку функциональности canvas
function checkCanvas() {
  if (!ctx) {
    pushTextToBuf("sys_problem_canvas", gameSettings.lang, PLAYGROUNDAREAS.outputMessage);
    alert(textBuffer.textMsg);  // alert-текст категории предупредительного сообщения (outputMessage)
    return false;
  } else return true;
}

// функция проверяет поддержку функциональности работы браузера с локальным хранилищем данных localStorage
function checkLocalStorage() {
  if (typeof(Storage) == 'undefined') {
    pushTextToBuf("sys_problem_localstorfunc", gameSettings.lang, PLAYGROUNDAREAS.outputMessage);
    alert(textBuffer.textMsg);  // alert-текст категории предупредительного сообщения (outputMessage)
  }
}

// функция переопределяет размеры canvas при ресайзинге окна браузера и 
// перерисовывает в нем объекты игрового экрана 
function resizeCanvas()
{
  var canvas = document.getElementById("gameCanvas");
  var ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  {  //  переопределить геометрические габариты объектов экрана
    playground.initPlaygroundAreaBoders();
    gameField.initCellSize();
    menuButtons.initButtonSize();
  }
  // отметить, что текст последнего сообщения не показан
  textBuffer.isDisplayedMsg = "N";
  drawGameScreen();
}

// функция возвращает целое случайное число в заданном диапазоне
// https://stackoverflow.com/a/1527820/2124254
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// функция подбирает размер шрифта для надписи, не выходящей за габариты прямоугольного бокса (кнопки)
function fitFontSize(text,  // текстовая надпись
  fontName,  // имя фонта 
  fontStyle,  // стиль фонта: например, "bold" или "" (пусто)
  fontMeasure,  // единицы измерения размера фонта: "px"
  xUpLeft, yUpLeft,  // координаты x, y правого верхнего угла прямоугольного бокса
  width, height  // ширина и высота прямоугольного бокса
  ) {
  let minSide = Math.min(width, height);  // минимальный габарит бокса
  for (let fontSize = 0; ; fontSize++) {  // цикл for с пропуском условия
    ctx.font = fontStyle + " " + fontSize + fontMeasure + " " + fontName;  // задается в формате вида "bold 12pt Аrial"
    if (ctx.measureText(text).width >= minSide) {  // ширина текста превышает минимальный габарит бокса
      return fontSize - 1;
    } 
  }
  return 30;  // экстремальное значение по умолчанию, не зависящее от габаритов бокса
}
