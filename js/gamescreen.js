// НАЗНАЧЕНИЕ: отрисовка игрового экрана и обработка параметров цветовой темы экрана
// РАЗРАБОТЧИК: Igor Nesiolovskiy

// функция отрисовки игрового экрана
function drawGameScreen() {
  // очистить текущий экран
  ctx.fillStyle = playground.drawStyle.backColor;  // getGameColor("playground_back_color", gameSettings.theme);
  ctx.fillRect(playground.playgroundArea.xUpLeft,  // clearRect 
                playground.playgroundArea.yUpLeft, 
                playground.playgroundArea.width, 
                playground.playgroundArea.height);

  // выполнить отрисовку границ разметки всех областей игровой площадки
  if (gameSettings.status == "ON" || 
    gameSettings.status == "PAUSE" || 
    gameSettings.status == "END" ||
    gameSettings.status == "QUIT") playground.drawPlaygroundAllBorders();;
  
  // отобразить игровое поле
  gameField.drawGridCells();

  // отобразить кнопки меню
  if (gameSettings.status == "ON" || 
      gameSettings.status == "PAUSE" || 
      gameSettings.status == "END" ||
      gameSettings.status == "QUIT") menuButtons.drawButtons();

  // вывести сообщение и статистику
  if (gameSettings.status == "ON" || 
      gameSettings.status == "PAUSE" ||
      gameSettings.status == "END" ||
      gameSettings.status == "QUIT") {
 
    txtHandler.drawTextWrap(textBuffer.textMsg, PLAYGROUNDAREAS.outputMessage);
    // отметить, что текст сообщения показан (кроме терминального сообщения)
    textBuffer.isDisplayedMsg = (textBuffer.textMsg == "act_display_gameinactive") ? "N" : "Y";

    txtHandler.drawTextWrap(textBuffer.textSts, PLAYGROUNDAREAS.gameScoreboard);
  }

  // отобразить копию игрового поля с заданием-трафаретом для пользователя
  if (gameSettings.status == "START" || 
      gameSettings.status == "RESUME") gameField.drawGridCellsStencil();

}

// функция предоставляет данные цветовой настройки экрана игры 
// для темной или светлой темы его оформления 

function getGameColor(colorID, themeID) {
  let gameColors = {

    //**************************************************
    //************************************************** 
    "playground_back_color":
    {
      "DARK": `Black`,
      "LIGHT": `#FFBF40`
    },

    "playground_line_color":
    {
      "DARK": `DimGray`,
      "LIGHT": `#BF7130`
    },

    //**************************************************
    //************************************************** 
    "field_line_color":
    {
      "DARK": `DimGrey`,
      "LIGHT": `#BF7130`
    },

    "field_font_color":
    {
      "DARK": `White`,
      "LIGHT": `Maroon`
    },

    "active_word_color":
    {
      "DARK": `Yellow`,
      "LIGHT": `Red`
    },

    "stencil_any_color":
    {
      "DARK": `Lime`,
      "LIGHT": `#007536`
    },

    //**************************************************
    //************************************************** 
    "menu_font_color":
    {
      "DARK": `Tomato`,
      "LIGHT": `MediumSlateBlue`
    },

    "menu_line_color":
    {
      "DARK": `Tomato`,
      "LIGHT": `MediumSlateBlue`
    },

    //**************************************************
    //************************************************** 
    "output_message_color":
    {
      "DARK": `DeepSkyBlue`,
      "LIGHT": `Green`
    },

    "game_statistics_color":
    {
      "DARK": `Orchid`,
      "LIGHT": `BlueViolet`
    },

  }  // закрывающая скобка объекта gameColors 
  
  // выполнить в объекте gameColors поиск сообщения по ключу
  let color = "?????";  // цвет, значение которого не найдено
  let keys = Object.keys(gameColors);  // массив ключей цветов
  let values = Object.values(gameColors);  // массив значений цветов
  let index = keys.indexOf(colorID);  // индекс цвета в массиве
  if (index != -1) {  // ключ сообщения найден
    keys = Object.keys(values[index]);  // массив ключей тем цветов
    values = Object.values(values[index]);  // массив значений тем цветов
    index = keys.indexOf(themeID);  // индекс темы цвета в массиве 
    if (index != -1) {  // ключ перевода на указанный язык найден 
      color = values[index];
    }
  }
  return color;
}

// функция меняет настройки цветов в объектах игровой модели
// в зависимости от цветовой темы 
function changeColorTheme(themeID) {
  // игровая площадка
  playground.drawStyle.backColor = getGameColor("playground_back_color", themeID);
  playground.drawStyle.lineColor = getGameColor("playground_line_color", themeID);
  // игровое поле
  gameField.drawStyle.cellLineColor = getGameColor("field_line_color", themeID);
  gameField.drawStyle.charFontColorCommon = getGameColor("field_font_color", themeID);
  gameField.drawStyle.charFontColorActive = getGameColor("active_word_color", themeID);
  gameField.drawStyle.charFontColorStencil = getGameColor("stencil_any_color", themeID);
  // кнопки меню
  menuButtons.drawStyle.btnLineColor = getGameColor("menu_line_color", themeID);
  menuButtons.drawStyle.btnFontColor = getGameColor("menu_font_color", themeID);
  // сообщения и статистика игры
  txtHandler.drawStyle.txtFontColorMsg = getGameColor("output_message_color", themeID);
  txtHandler.drawStyle.txtFontColorSts = getGameColor("game_statistics_color", themeID);
}
  
  