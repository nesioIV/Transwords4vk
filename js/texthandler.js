// НАЗНАЧЕНИЕ: обработчик текстовых сообщений для пользователя в приложении
// РАЗРАБОТЧИК: Igor Nesiolovskiy

// метаданные выводимого текста
const MAX_TEXT_LINES = 12;  // максимальное количество строк текста в области сообщений
let MAX_TEXT_LENGTH = 35;  // максимальное количество символов текста в одной строке

class TextHandler {

  // определить стиль отрисовки выводимого текста
  drawStyle = {
    txtFontName:  "Arial", // безопасный шрифт символов текста: "Arial", "Verdana", "Georgia", "Impact", "Comic Sans MS", "Times New Roman"
    txtFontStyleMsg : "",  // стиль символов текста в блоке сообщения: "bold" или "" (пусто)
    txtFontStyleSts : "",  // стиль символов текста в блоке игровой статистики: "bold" или "" (пусто)
    txtFontColorMsg : getGameColor("output_message_color", gameSettings.theme),  // цвет символов текста в блоке сообщений
    txtFontColorSts : getGameColor("game_statistics_color", gameSettings.theme),  // цвет символов текста в блоке статистики
    txtTextAlign : "left",  // параметр выравнивания символов текста по горизонтали
    txtBaseline : "top",  // параметр выравнивания символов текста по вертикали
    txtFontSize : 0  // подбираемый размер шрифта
  }

  // заготовить объект с геометрическими характеристиками выводимого текста
  txtSize = {
    marginVert: 0,  // отступ текста от вертикальных границ бокса вывода
    marginHoriz: 0,  // отступ текста от горизонтальных границ бокса вывода
    width: 0,  // максимальная ширина символа в строке текста
    height: 0 }  // высота строки текста

  // метод определения габаритных характеристик текста
  initTxtSize() {
    switch (gameSettings.lang) {
      case "RU":
        MAX_TEXT_LENGTH = 35;  // кириллица в Comic Sans MS шире латиницы
        break;
      case "EN":
      default:
        MAX_TEXT_LENGTH = 36; 
        break;
    }
    this.txtSize = {
      marginVert: 10,
      marginHoriz: 10,
      get width() {return (playground.outputMessageArea.width - 2 * this.marginHoriz) / MAX_TEXT_LENGTH},
      get height() {return (playground.outputMessageArea.height - 2 * this.marginVert) / MAX_TEXT_LINES }
    }
  }
 
  // выполнить первоначальную инициализацию габаритных характеристик текста
  runCodeBlock = this.initTxtSize();
 
  // метод отображения многострочного текста c переносом слов;
  // параметры - выводимый текст, область экрана для выводимого текста (область сообщений или статистики)
  drawTextWrap(text, playgroundArea) {

    // проверить, выводился ли текст ранее на экран
    if (playgroundArea == PLAYGROUNDAREAS.outputMessage && textBuffer.isDisplayedMsg == "Y") return;
    if (playgroundArea == PLAYGROUNDAREAS.gameScoreboard && textBuffer.isDisplayedSts == "Y") return;
    
    let txtFontStyle = "";  // стиль фонта для текста
    let txtFontColor = "";  // цвет шрифта для текста
   
    // выполнить инициализацию габаритных характеристик текста
    this.initTxtSize();

    // настроить стилевые параметры и базовую точку бокса 
    switch(playgroundArea) {
      case PLAYGROUNDAREAS.outputMessage:
        txtFontStyle = this.drawStyle.txtFontStyleMsg;  // для области сообщений
        txtFontColor = this.drawStyle.txtFontColorMsg;
          break;
      case PLAYGROUNDAREAS.gameScoreboard:
        txtFontStyle = this.drawStyle.txtFontStyleSts;  // для области игровой статистики
        txtFontColor = this.drawStyle.txtFontColorSts;
        break;
    }
    
    // подобрать размер требуемого шрифта для выводимого текста    
    this.drawStyle.txtFontSize = fitFontSize("  ",  // текстовый символ для оценки
    this.drawStyle.txtFontName,  // имя фонта 
    txtFontStyle,  // стиль фонта: например, "bold" или "" (пусто)
    "px",  // единицы измерения размера фонта: "px"
    playground.outputMessageArea.xUpLeft + this.txtSize.marginHoriz, // координаты x, y правого верхнего
    playground.outputMessageArea.yUpLeft + this.txtSize.marginVert, // угла прямоугольного бокса
    this.txtSize.width, // ширина и высота прямоугольного 
    this.txtSize.height); // бокса для тестового символа
    
    // определить дополнительные стилевые параметры выводимого текста
    ctx.fillStyle = txtFontColor;
    ctx.textAlign = this.drawStyle.txtTextAlign;
    ctx.baseLine = this.drawStyle.txtBaseline;
    ctx.font = txtFontStyle + " " + this.drawStyle.txtFontSize + "px " + this.drawStyle.txtFontName;
    // отобразить текст выводимый текст
    let txtParagraph = text.split('\n');  // парсинг текста с разбивкой на абзацы по наличию символа разрыва строки
    let txtLine = "";  // выводимая текстовая строка
    let txtWidth = 0;  // ширина строки как measureText
    let txtLength = 0;  // длина строки в символах
    let lineNum = 0;  // номер строки

    txtParagraph.forEach((paragraph) => {
      let txtWords = paragraph.split(' ');  // парсинг абзаца с разбивкой на слова по наличию пробела между ними
      txtWords.forEach((word, i) => {
        if (word.indexOf('\n') != -1) isLineBreakChar = true;  // перенос строки найден

        txtWidth = ctx.measureText(txtLine + word + " ").width;
        txtLength = (txtLine + word + " ").length;

        if ( lineNum < MAX_TEXT_LINES &&  // контроль допустимого количества строк вывода
            //( (txtWidth - (playground.outputMessageArea.width - 2 * this.txtSize.marginHoriz) > 0) ||
            ( (txtLength - MAX_TEXT_LENGTH > 0) ||
               i == txtWords.length - 1 ) ) // контроль последней укороченной строки текста
        {
          // вывести полученную строку, т.к. добавление нового слова приводит к превышению 
          // длины строки над допустимой шириной в боксе вывода
          switch(playgroundArea) {  // учесть экранную область вывода
            case PLAYGROUNDAREAS.outputMessage:
              ctx.fillText(txtLine + word, 
                playground.outputMessageArea.xUpLeft + Math.min(this.txtSize.marginHoriz, this.txtSize.width),
                playground.outputMessageArea.yUpLeft + ( 1 / 2 ) * Math.min(this.txtSize.marginVert, this.txtSize.height) + this.txtSize.height * (lineNum + 1),
                playground.outputMessageArea.width - 2 * Math.min(this.txtSize.marginHoriz, this.txtSize.width));
                
                //textBuffer.isDisplayedMsg = "Y";  // отметить, что текст показан на экране
              break;
            case PLAYGROUNDAREAS.gameScoreboard:
              ctx.fillText(txtLine + word, 
                playground.gameScoreboardArea.xUpLeft + Math.min(this.txtSize.marginHoriz, this.txtSize.width),
                playground.gameScoreboardArea.yUpLeft + ( 1 / 2) * Math.min(this.txtSize.marginVert, this.txtSize.height) + this.txtSize.height * (lineNum + 1),
                playground.gameScoreboardArea.width - 2 * Math.min(this.txtSize.marginHoriz, this.txtSize.width));

                //textBuffer.isDisplayedSts = "Y";  // отметить, что текст показан на экране
              break;
          } 
          txtLine = "";
          lineNum += 1;
        } 
        else
        {
          txtLine = txtLine + (word + " "); 
        }
      });
    });
  }

}
