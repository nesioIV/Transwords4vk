// НАЗНАЧЕНИЕ: определение структуры и отображение игрового поля
// РАЗРАБОТЧИК: Igor Nesiolovskiy

const GAME_FIELD_ROWS = 13;  // число рядов на игровом поле
const GAME_FIELD_COLS = 13;  // число столбцов на игровом поле
const DUMMY_CHAR = "";  // признак "пустого" символа

// структура игрового поля
class GameField {

  // определить стиль отображения игрового поля
  drawStyle = {
    cellLineColor: getGameColor("field_line_color", gameSettings.theme),  // цвет границы области
    cellLineWidth: 2,  // толщина границы области
    charFontName:  "Georgia", // безопасный шрифт букв с словах: "Arial", "Verdana", "Georgia", "Impact", "Comic Sans MS", "Times New Roman"
    charFontStyleCommon : "",  // стиль основых букв в словах: "bold" или "" (пусто)
    charFontStyleActive : "",  // стиль букв на выбранных для трансвординга сторонах квадратов: "bold" или "" (пусто)  
    charFontColorCommon : getGameColor("field_font_color", gameSettings.theme),  // цвет основных букв в словах
    charFontColorActive: getGameColor("active_word_color", gameSettings.theme),  // цвет букв на выбранных для трансводинга сторонах квадратов
    charFontColorStencil : getGameColor("stencil_any_color", gameSettings.theme),  // цвет букв в игровом трафарете-задании для пользователя 
    charTextAlign : "center",  // параметр выравнивания букв по горизонтали
    charBaseline : "middle",  // middle - параметр выравнивания букв по вертикали
    charFontScaleNumerator: 80,  // 89 - числитель к-та масштабирования размера фонта к размеру ячейки поля
    charFontScaleDenominator: 100,  // знаменатель к-та масштабирования размера фонта к ячейке поля
    // вычисляемое свойство - коэфициент масштабирования шрифта по отношению к размеру ячейки игрового поля
    get charFontScale() {return this.charFontScaleNumerator / this.charFontScaleDenominator} 
  }; 

  cellSide; // сторона квадратной ячейки игрового поля 
  xUpLeft;  // правый верхний угол игрового поля
  yUpLeft;  // и первой ячейки (соответственно)
  cellArr;  // массив ячеек игрового поля

  cellArrStencil;  // массив-копия ячеек игрового поля с заданием-трафаретом для пользователя

  // активные стороны квадрата, выбираемые пользователем для трансвординга,
  // и ячейка их пересечения
  activeSquareSide = {  
    first: -1,  // значение индекса в SquareSideArr или -1 (т.е. нет активности) 
    second: -1,  // значение индекса в SquareSideArr или -1 (т.е. нет активности)
    cellIntersectionRow: - 1,  // ряд ячейки пересечения сторон квадрата из cellArr
    cellIntersectionCol: - 1  // столбец ячейки пересечения сторон квадрата из cellArr
  };

  // размер ячейки игрового поля
  cellSize() {
    return Math.min(playground.gameFieldArea.width, playground.gameFieldArea.height) / GAME_FIELD_COLS;
  }
  
  // метод определения размера ячейки игрового поля
  initCellSize() {
    this.cellSide = this.cellSize();

    // правый верхний угол поля (и первой ячейки)
    this.xUpLeft = playground.gameFieldArea.xUpLeft + 
              (playground.gameFieldArea.width - this.cellSide * GAME_FIELD_COLS) / 2;
    this.yUpLeft = playground.gameFieldArea.yUpLeft +
              (playground.gameFieldArea.height - this.cellSide * GAME_FIELD_ROWS) / 2;
  }
  runCodeBlock = this.initCellSize();  // определить размер ячейки первоначальный
  
  // массив ячеек игрового поля
  getcellArr() {
    return Array.from (
      Array(GAME_FIELD_ROWS), () => new Array(GAME_FIELD_COLS).fill(DUMMY_CHAR)  
    );
  }
  cellArr = this.getcellArr();

  // копия массива ячеек игрового поля
  cellArrStencil = Array.from (
    Array(GAME_FIELD_ROWS), () => new Array(GAME_FIELD_COLS).fill(DUMMY_CHAR)  
  );

  // начальная инициализация массива ячеек игрового поля 
  // (при обновлении или изменении уровня игры пользователем)
  initcellArr() {
    this.cellArr.forEach((row, j) => {
      row.forEach((value, i) => {
          this.cellArr[i][j] = DUMMY_CHAR;
      });
    });    
  }
  
  // начальная инициализация копии массива ячеек игрового поля 
  // (при получении начальной раскладки слов на игровое поле)
  getcellArrStencil() {
    let item = "";  // единичный элемент массива 
    this.cellArr.forEach((row, j) => {
      row.forEach((value, i) => {
          item = this.cellArr[i][j];
          this.cellArrStencil[i][j] = item;
      });
    });
    // добавить символ "пауза" в центральную ячейку массива
    this.cellArrStencil[PAUSE_BUTTON_ROW][PAUSE_BUTTON_COL] = PAUSE_BUTTON[0][1];   
  }

  // отображение сетки с ячейками игрового поля 
  drawGridCells() {
    this.initCellSize();  // уточнить размер ячейки игрового поля для случая ресайзинга окна браузера
    this.cellArr.forEach((row, j) => {
      row.forEach((value, i) => {
        if (value != DUMMY_CHAR) {
          // отобразить границы ячейки
          ctx.strokeStyle = this.drawStyle.cellLineColor;
          ctx.lineWidth = this.drawStyle.cellLineWidth;
          ctx.strokeRect(this.xUpLeft + this.cellSide * i, 
                    this.yUpLeft + this.cellSide * j, 
                    this.cellSide, this.cellSide);
          // отобразить значение ячейки - установленную букву слова
          ctx.font = this.drawStyle.charFontStyleCommon + " " + this.cellSide * this.drawStyle.charFontScale + 
            "px " + this.drawStyle.charFontName;
          ctx.fillStyle = this.drawStyle.charFontColorCommon;
          // уточнить стиль и цвет шрифта для случая, когда ячейка лежит на активной стороне квадрата,
          // выбранной пользователем
          if (isSquareSideCellActive(j, i)) { 
            ctx.font = this.drawStyle.charFontStyleActive + " " + this.cellSide * this.drawStyle.charFontScale + 
            "px " + this.drawStyle.charFontName;
            ctx.fillStyle = this.drawStyle.charFontColorActive;
          }
          ctx.textAlign = this.drawStyle.charTextAlign;
          ctx.baseLine = this.drawStyle.charBaseline;
          ctx.fillText(value,  
            this.xUpLeft + this.cellSide / 2  + this.cellSide * i,
            this.yUpLeft + this.cellSide * this.drawStyle.charFontScale + 
            //(this.cellSide - this.cellSide * this.drawStyle.charFontScale) / 4 + 
            // this.cellSide * j, this.cellSide);            
              (this.cellSide - this.cellSide * this.drawStyle.charFontScale) * 0 + this.cellSide * j -
               this.cellSide * (1 - this.drawStyle.charFontScale) * ( 1 / 4 ), this.cellSide);
        }
      });
    });
  }
  // отображение сетки с заданием-трафаретом на игру для пользователя 
  drawGridCellsStencil() {
    //this.initCellSize();  // уточнить размер ячейки игрового поля для случая ресайзинга окна браузера
    this.cellArrStencil.forEach((row, j) => {
      row.forEach((value, i) => {
        if (value != DUMMY_CHAR) {
          // отобразить границы ячейки
          ctx.strokeStyle = this.drawStyle.cellLineColor;
          ctx.lineWidth = this.drawStyle.cellLineWidth;
          // уточнить цвет и толщину линии для центральной ячейки с символом "меню"
          if (PAUSE_BUTTON_ROW == j && PAUSE_BUTTON_COL == i) {
            ctx.strokeStyle = menuButtons.drawStyle.btnLineColor;
            ctx.lineWidth = menuButtons.drawStyle.btnLineWidth; 
          }          
          ctx.strokeRect(playground.gameStencilArea.xUpLeft + this.cellSide * i, 
            playground.gameStencilArea.yUpLeft + this.cellSide * j, 
                    this.cellSide, this.cellSide);
          // отобразить значение ячейки - установленную букву слова
          ctx.font = this.drawStyle.charFontStyleCommon + " " + this.cellSide * this.drawStyle.charFontScale + 
            "px " + this.drawStyle.charFontName;
          ctx.fillStyle = this.drawStyle.charFontColorStencil;
          // уточнить стиль и цвет шрифта для центральной ячейки с символом "меню"
          if (PAUSE_BUTTON_ROW == j && PAUSE_BUTTON_COL == i) {
            ctx.font = menuButtons.drawStyle.btnFontStyle + " " + this.cellSide * this.drawStyle.charFontScale + 
            "px " + menuButtons.drawStyle.btnFontName;
            ctx.fillStyle = menuButtons.drawStyle.btnFontColor;
          }
          ctx.textAlign = this.drawStyle.charTextAlign;
          ctx.baseLine = this.drawStyle.charBaseline;
          ctx.fillText(value,  
            playground.gameStencilArea.xUpLeft + this.cellSide * ( 1 / 2 )  + this.cellSide * i,
            playground.gameStencilArea.yUpLeft + this.cellSide * this.drawStyle.charFontScale + 
              //(this.cellSide - this.cellSide * this.drawStyle.charFontScale) / 4 + 
              //this.cellSide * j, this.cellSide);
              (this.cellSide - this.cellSide * this.drawStyle.charFontScale) * 0 + this.cellSide * j -
               this.cellSide * (1 - this.drawStyle.charFontScale) * ( 1 / 4 ), this.cellSide);
        }
      });
    });
  }
}

