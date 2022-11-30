// НАЗНАЧЕНИЕ: реализация функциональных кнопок управления игрой
// РАЗРАБОТЧИК: Igor Nesiolovskiy

const BUTTONS = [  // массив данных о кнопках управления 
  ["PlayGame",      " ► "],  // "🞂"],
  ["LevelUpdate",   " ↻ "],  // ⭮"],
  ["LevelDown",     " – "],  // " 🠗 "],
  ["LevelUp",       " + "],  // 🠕 "],
  //["LevelReset",    " ↯ "],
  ["Language",      " ∪ "],  
  ["Sound",         " ♫ "],  // ♪ - выключен, ♫ - включен
  ["Theme",         " ◑ "],  // "◐"],
  ["Help",          " ? "],
  ["Quit",     " × "] ];  // "×"] ];

// метаданные кнопки "пауза"
const PAUSE_BUTTON = [["GamePause", " ◄ "]];  // "☰"
const PAUSE_BUTTON_ROW = Math.floor(GAME_FIELD_ROWS / 2);  // положение на сетке задания-трафарета:
const PAUSE_BUTTON_COL = Math.floor(GAME_FIELD_COLS / 2);  // в центральной ячейку сетки задания-трафарета


class MenuButtons {

  btnAmount = BUTTONS.length;  // количество кнопок игрового меню

  // определить стиль отрисовки кнопок меню
  drawStyle = {
    btnLineColor: getGameColor("menu_line_color", gameSettings.theme),  // цвет границы вокруг кнопки
    btnLineWidth: 2,  // толщина границы вокруг кнопки
    btnFontName:  "Verdana", // безопасный шрифт символов: "Verdana", "Arial", "Georgia", "Impact", "Comic Sans MS", "Times New Roman"
    btnFontStyle : "bold",  // стиль символов на кнопке: "bold" или "" (пусто) 
    btnFontColor : getGameColor("menu_font_color", gameSettings.theme),  // цвет символов на кнопке: "Chocolate"
    btnTextAlign : "center",  // параметр выравнивания символов на кнопке по горизонтали
    btnBaseline : "middle",  // параметр выравнивания символов на кнопке по вертикали
    btnFontSize : 0  // подбираемый размер шрифта
  }

  // заготовить объект с геометрическими габаритами кнопок (иконок)
  btnSize = {
    marginVert: 0,  // отступ кнопки от границы области меню вертикальный
    marginHoriz: 0,  // отступ между кнопками и границами области меню горизонтальный
    width: 0,  // ширина кнопки
    height: 0 }  // высота кнопки

  // метод определения габаритов кнопок меню
  initButtonSize() {
    this.btnSize = {
      marginVert: playground.menuButtonsArea.height / ( 3 ),
      marginHoriz: playground.menuButtonsArea.width / ( ( 5 / 2 ) * BUTTONS.length + 1),
      get width() {return (playground.menuButtonsArea.width - this.marginHoriz * (BUTTONS.length + 1)) / BUTTONS.length},
      get height() {return (playground.menuButtonsArea.height - 2 * this.marginVert)}
    }
  }
 
  // выполнить первоначальную инициализацию габаритов кнопок меню
  runCodeBlock = this.initButtonSize();
 
  // метод отображения кнопок меню 
  drawButtons() {
    // отобразить кнопки
    BUTTONS.forEach((row, i) => {
      ctx.strokeStyle = this.drawStyle.btnLineColor;
      ctx.lineWidth = this.drawStyle.btnLineWidth;
      ctx.strokeRect(
        playground.menuButtonsArea.xUpLeft + this.btnSize.marginHoriz + (this.btnSize.width + this.btnSize.marginHoriz) * i,
        playground.menuButtonsArea.yUpLeft + this.btnSize.marginVert, 
        this.btnSize.width, 
        this.btnSize.height);
      //ctx.stroke();
      // подобрать размер для требуемого шрифта по длине надписи на кнопке и габаритам кнопки       
      this.drawStyle.fontSize = fitFontSize(BUTTONS[2][1],  // текстовая надпись на кнопке
      this.drawStyle.btnFontName,  // имя фонта 
      this.drawStyle.btnFontStyle,  // стиль фонта: например, "bold" или "" (пусто)
      "px",  // единицы измерения размера фонта: "px"
      playground.menuButtonsArea.xUpLeft + this.btnSize.marginHoriz + (this.btnSize.width + this.btnSize.marginHoriz) * i,
      playground.menuButtonsArea.yUpLeft + this.btnSize.marginVert,  // координаты x, y правого верхнего угла прямоугольного бокса
      this.btnSize.width, 
      this.btnSize.height); // ширина и высота прямоугольного бокса

      ctx.font = this.drawStyle.btnFontStyle + " " + this.drawStyle.fontSize  + 
      "px " + this.drawStyle.btnFontName;
      ctx.fillStyle = this.drawStyle.btnFontColor;
      ctx.textAlign = this.drawStyle.btnTextAlign;
      ctx.baseLine = this.drawStyle.btnBaseline;
      ctx.fillText(row[1], 
        playground.menuButtonsArea.xUpLeft + this.btnSize.marginHoriz + 
          (this.btnSize.width + this.btnSize.marginHoriz) * i + this.btnSize.width / 2,
          playground.menuButtonsArea.yUpLeft + this.btnSize.marginVert + this.btnSize.height - this.btnSize.height / ( 22 / 5 ), 
        this.btnSize.width) ;         
    });
  }

  // функция определяет кнопку игрового меню  
  // по координатам точки элемента canvas, в которой сделан клик мыши
  getMenuButtonName(x, y) {
    let buttomName = "noButton";  // наименование кнопки
    let xUpLft, yUpLft;  // координаты левого верхнего угла кнопки на элементе canvas
    BUTTONS.forEach((row, i) => {  // выполнить перебор кнопок
      xUpLft = playground.menuButtonsArea.xUpLeft + this.btnSize.marginHoriz + (this.btnSize.width + this.btnSize.marginHoriz) * i;
      yUpLft = playground.menuButtonsArea.yUpLeft + this.btnSize.marginVert; 
      if ( (xUpLft <= x && x <= xUpLft + this.btnSize.width) && (yUpLft <= y && y <= yUpLft + this.btnSize.height) )
      {  // выявлена точка клика на определенной кнопке
          buttomName = BUTTONS[i][0];
          playSound("buz");  // выдать звук
      }
    });
    return buttomName;
  } 
  
  // функция определяет символ на кнопке меню по идентификатору кнопки
  getButtonSymb (buttonID) {
    let found = false;  // признак нахождения символа
    let symb = "☹";  // знак, что символ не найден
    for (let i = 0; i < BUTTONS.length; i++) {  // кнопки основного меню
      if (BUTTONS[i][0] == buttonID) {
        symb = BUTTONS[i][1];
        found = true;  // символ определен
        i = BUTTONS.length;
      }
    }
    if (found == false) {
      if (PAUSE_BUTTON[0][0] == buttonID) {  // отдельная кнопка меню (вызов паузы в игре)
        symb = PAUSE_BUTTON[0][1];
        found = true;  // символ определен
      }
    }
    return symb;
  }

  // функция определяет индекс кнопки меню по идентификатору кнопки
  getButtonIndex (buttonID) {
    let index = -1;  // несуществующее значение индекса
    for (let i = 0; i < BUTTONS.length; i++) {  // кнопки основного меню
      if (BUTTONS[i][0] == buttonID) {
        index = i;
        i = BUTTONS.length;
      }
    }
    return index;
  }

}

