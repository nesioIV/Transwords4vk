// НАЗНАЧЕНИЕ: определение областей разметки игровой площадки (игрового экрана)
// РАЗРАБОТЧИК: Igor Nesiolovskiy

const PLAYGROUNDAREAS = {  // области разметки игровой площадки 
  playground: "playground",  // собственно игровая площадка
  gameField: "gameField",  // область игрового поля
  menuButtons: "menuButtons",  // область кнопок меню
  gameScoreboard: "gameScoreboard",  // область игрового табло
  outputMessage: "outputMessage",  // область вывода игровых и технических сообщений
  gameStencil: "gameStencil"  // область игрового задания-трафарета для пользователя 
};

class Playground {

  // определить стиль отображения областей разметки игровой площадки
  drawStyle = {
    externalMargin: 10,  // отступ внешний у границ областей разметки
    lineColor: getGameColor("playground_line_color", gameSettings.theme),  // цвет границы области
    lineWidth: 2,  // толщина границы области
    backColor: getGameColor("playground_back_color", gameSettings.theme)  // цвет заливки области
  };

  // метод отображения границ области определенного объекта игровой площадки 
  drawPlaygroundAreaBorder (
    xUpLeft,  // коорд. x левого верхнего угла   
    yUpLeft,  // коорд. y левого верхнего угла
    width,  // ширина области
    height )  // высота области
    {
      ctx.strokeStyle = this.drawStyle.lineColor;  
      ctx.lineWidth = this.drawStyle.lineWidth;
      ctx.strokeRect(xUpLeft, yUpLeft, width, height);
    }

  // заготовить объекты - области разметки игровой площадки  
  playgroundArea = {xUpLeft: 0, yUpLeft: 0, width: 0, height: 0};
  gameFieldArea = {xUpLeft: 0, yUpLeft: 0, width: 0, height: 0};
  menuButtonsArea = {xUpLeft: 0, yUpLeft: 0, width: 0, height: 0};
  gameScoreboardArea = {xUpLeft: 0, yUpLeft: 0, width: 0, height: 0};
  outputMessageArea = {xUpLeft: 0, yUpLeft: 0, width: 0, height: 0};
  gameStencilArea = {xUpLeft: 0, yUpLeft: 0, width: 0, height: 0};
 
  // выполнить первоначальную инициализацию областей разметки игровой площадки
  runCodeBlock = this.initPlaygroundAreaBoders();

  // метод определения размеров областей разметки игровой площадки
  initPlaygroundAreaBoders() {

    // задать область разметки всей площадки в целом (всего экрана в целом)
    this.playgroundArea = {
      xUpLeft: 0,  // коорд. x левого верхнего угла   
      yUpLeft: 0,  // коорд. y левого верхнего угла
      width: canvas.width,  // ширина области
      height: canvas.height };  // высота области  

    this.gameFieldArea = {
      xUpLeft: this.playgroundArea.xUpLeft + this.drawStyle.externalMargin,
      yUpLeft: this.playgroundArea.yUpLeft + this.drawStyle.externalMargin +
        (this.playgroundArea.height - 2 * this.drawStyle.externalMargin) / 2 -  
        (Math.min(this.playgroundArea.width / 2, this.playgroundArea.height) - 
        this.drawStyle.externalMargin - this.drawStyle.externalMargin) / 2, 
      width: Math.min(this.playgroundArea.width / 2, this.playgroundArea.height) - 
        this.drawStyle.externalMargin - this.drawStyle.externalMargin,
      height: Math.min(this.playgroundArea.width / 2, this.playgroundArea.height) - 
        this.drawStyle.externalMargin - this.drawStyle.externalMargin };

    this.menuButtonsArea = {
      xUpLeft: this.playgroundArea.width - 
      (this.drawStyle.externalMargin + this.gameFieldArea.width),
      yUpLeft: this.gameFieldArea.yUpLeft,    
      width: this.gameFieldArea.width, // + 2 * this.drawStyle.externalMargin,
      height: Math.trunc(this.gameFieldArea.height / 5)};

    // задать область разметки игрового табло
    this.gameScoreboardArea = {
      xUpLeft: this.menuButtonsArea.xUpLeft, 
      yUpLeft: this.gameFieldArea.yUpLeft + 
        (this.gameFieldArea.height + this.drawStyle.externalMargin) - 
        (this.menuButtonsArea.height + this.drawStyle.externalMargin),
      width: this.menuButtonsArea.width, 
      height: this.menuButtonsArea.height * ( 1 / 1 ) };      

    // задать область разметки вывода игровых и технических сообщений
    this.outputMessageArea = {
      xUpLeft: this.menuButtonsArea.xUpLeft, 
      yUpLeft: this.menuButtonsArea.yUpLeft + 
        (this.menuButtonsArea.height + this.drawStyle.externalMargin),
      width: this.menuButtonsArea.width, 
      height: (this.gameFieldArea.height + 2 * this.drawStyle.externalMargin) - 
        (this.drawStyle.externalMargin + this.menuButtonsArea.height + 
        this.drawStyle.externalMargin + this.drawStyle.externalMargin + 
        this.gameScoreboardArea.height + this.drawStyle.externalMargin) };

    // задать область разметки игрового задания-трафарета для пользователя
    this.gameStencilArea = {  
      xUpLeft: this.playgroundArea.width - 
        (this.drawStyle.externalMargin + this.gameFieldArea.width), 
      yUpLeft: this.menuButtonsArea.yUpLeft,  
      width: this.gameFieldArea.width,
      height: this.gameFieldArea.height };   
  
  }

  // функция выполняет отрисовку границ разметки всех областей игровой площадки
  drawPlaygroundAllBorders() {       
    // // уточнить границы разметки всех областей игровой площадки для случая ресайзинга окна браузера
    // this.initPlaygroundAreaBoders();

    // нарисовать границы области игровой площадки в целом
    this.drawPlaygroundAreaBorder(this.playgroundArea.xUpLeft, this.playgroundArea.yUpLeft, 
      this.playgroundArea.width, this.playgroundArea.height);

    // нарисовать границы области игрового поля
    // !!! решено закомметировать отрисовку !!!
    //this.drawPlaygroundAreaBorder(this.gameFieldArea.xUpLeft, this.gameFieldArea.yUpLeft, 
    //  this.gameFieldArea.width, this.gameFieldArea.height);
    
    switch (gameSettings.status) { 
      
      //case ("ON"):
      //case ("PAUSE"):
      //case ("END"):
      //case ("QUIT"):
      default:  // закомментировать эту строку, если "откомментировать" case-ы выше

        // нарисовать границы области разметки кнопок меню
        this.drawPlaygroundAreaBorder(this.menuButtonsArea.xUpLeft, this.menuButtonsArea.yUpLeft, 
          this.menuButtonsArea.width, this.menuButtonsArea.height);
        // нарисовать границы области игрового табло
        this.drawPlaygroundAreaBorder(this.gameScoreboardArea.xUpLeft, this.gameScoreboardArea.yUpLeft, 
          this.gameScoreboardArea.width, this.gameScoreboardArea.height);
        // нарисовать границы области вывода сообщений
        this.drawPlaygroundAreaBorder(this.outputMessageArea.xUpLeft, this.outputMessageArea.yUpLeft, 
          this.outputMessageArea.width, this.outputMessageArea.height);
        break;

      case ("START"):
      case ("RESUME"):
        // нарисовать границы области задания-трафарета на игру
        // !!! решено закомметировать отрисовку !!!
        //this.drawPlaygroundAreaBorder(this.gameStencilArea.xUpLeft, this.gameStencilArea.yUpLeft, 
        //  this.gameStencilArea.width, this.gameStencilArea.height);
        break;      

    }
  }

  // функция определяет область разметки игровой площадки 
  // по координатам точки элемента canvas, в которой сделан клик мыши
  getPlaygroundAreaName(x, y) {
    let areaName = PLAYGROUNDAREAS.playground;  // наименование области
    if (  (this.playgroundArea.xUpLeft <= x && x <= this.playgroundArea.xUpLeft + this.playgroundArea.width) &&
          (this.playgroundArea.yUpLeft <= y && y <= this.playgroundArea.yUpLeft + this.playgroundArea.height) )
    { // точка в области "playgroundArea"
      switch (gameSettings.status) { 
        case ("ON"):
        case ("END"):
          if (  (this.menuButtonsArea.xUpLeft <= x && x <= this.menuButtonsArea.xUpLeft + this.menuButtonsArea.width) &&
                (this.menuButtonsArea.yUpLeft <= y && y <= this.menuButtonsArea.yUpLeft + this.menuButtonsArea.height) )
          {  // точка в области "menuButtonsArea"
              return PLAYGROUNDAREAS.menuButtons;
          }
          if (  (this.gameScoreboardArea.xUpLeft <= x && x <= this.gameScoreboardArea.xUpLeft + this.gameScoreboardArea.width) &&
                (this.gameScoreboardArea.yUpLeft <= y && y <= this.gameScoreboardArea.yUpLeft + this.gameScoreboardArea.height) )
          {  // точка в области "gameScoreboardArea"
              return PLAYGROUNDAREAS.gameScoreboard;
          }
          if (  (this.outputMessageArea.xUpLeft <= x && x <= this.outputMessageArea.xUpLeft + this.gameScoreboardArea.width) &&
                (this.outputMessageArea.yUpLeft <= y && y <= this.outputMessageArea.yUpLeft + this.outputMessageArea.height) )
          {  // точка в области "outputMessageArea"
              return PLAYGROUNDAREAS.outputMessage;
          }      
          if (  (this.gameFieldArea.xUpLeft <= x && x <= this.gameFieldArea.xUpLeft + this.gameFieldArea.width) &&
            (this.gameFieldArea.yUpLeft <= y && y <= this.gameFieldArea.yUpLeft + this.gameFieldArea.height) )
            {  // точка в области "gameFieldArea"
              return PLAYGROUNDAREAS.gameField;
            }
          break;      
        case ("PAUSE"):
          if (  (this.menuButtonsArea.xUpLeft <= x && x <= this.menuButtonsArea.xUpLeft + this.menuButtonsArea.width) &&
                (this.menuButtonsArea.yUpLeft <= y && y <= this.menuButtonsArea.yUpLeft + this.menuButtonsArea.height) )
          {  // точка в области "menuButtonsArea"
              return PLAYGROUNDAREAS.menuButtons;
          }
          if (  (this.gameScoreboardArea.xUpLeft <= x && x <= this.gameScoreboardArea.xUpLeft + this.gameScoreboardArea.width) &&
                (this.gameScoreboardArea.yUpLeft <= y && y <= this.gameScoreboardArea.yUpLeft + this.gameScoreboardArea.height) )
          {  // точка в области "gameScoreboardArea"
              return PLAYGROUNDAREAS.gameScoreboard;
          }
          if (  (this.outputMessageArea.xUpLeft <= x && x <= this.outputMessageArea.xUpLeft + this.gameScoreboardArea.width) &&
                (this.outputMessageArea.yUpLeft <= y && y <= this.outputMessageArea.yUpLeft + this.outputMessageArea.height) )
          {  // точка в области "outputMessageArea"
              return PLAYGROUNDAREAS.outputMessage;
          }      
          break;
        case ("START"):
        case ("RESUME"):
          if (  (this.gameFieldArea.xUpLeft <= x && x <= this.gameFieldArea.xUpLeft + this.gameFieldArea.width) &&
            (this.gameFieldArea.yUpLeft <= y && y <= this.gameFieldArea.yUpLeft + this.gameFieldArea.height) )
            {  // точка в области "gameFieldArea"
              return PLAYGROUNDAREAS.gameField;
            }
          if (  (this.gameStencilArea.xUpLeft <= x && x <= this.gameStencilArea.xUpLeft + this.gameStencilArea.width) &&
          (this.gameStencilArea.yUpLeft <= y && y <= this.gameStencilArea.yUpLeft + this.gameStencilArea.height) )
          {  // точка в области "gameStencilArea"
            return PLAYGROUNDAREAS.gameStencil;
          }
          break;      
      }      
    }
    return areaName;
  }

}