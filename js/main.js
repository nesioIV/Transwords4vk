// НАЗНАЧЕНИЕ: главный модуль управления web-приложением
// РАЗРАБОТЧИК: Igor Nesiolovskiy

"use strict";

let iAmHere = 0;

// задать первоначальные настройки и параметры игры
let gameSettings = {  
  name: "TRANSWORDS game",  // наименование игры
  author: "Igor Nesiolovskiy",  // автор игры
  year: "2022",  // год выпуска
  model: "03x03_05x05_13x13",  // модель игры: размер карты - размер квадрата - размер поля
  version: "1.00",  // версия игры: предусматривает всего 8 уровней игры (от 0 до 7)
  lang: "RU",  // текущая языковая настройка игры: "RU" - русский, "EN" - английский
  sound: "ON",  // переключатель звука: "OFF" - выключен, "ON" - включен
  theme: "DARK",  // цветовая схема отображения игры на экране: "DARK" - темная, "LIGHT" - светлая
  level: 0,  // текущий уровень игры: 0 - первый уровень, 1 - второй и так далее (0-based)
  complexity: 0,  // степень сложности игры на данном уровне (ожидается 4 степени сложности - от 0 до 3)
                  // сложность позволяет нумеровать уровни игры, например, следующим образом:
                  // level * 10 + comlexity, например 13 или "1.3" - первый уровень с третьей сложностью
  status: "OFF",   // жизненный цикл игры: 
                  // "OFF" - не готова к выполнению
                  // "ON" - готова к выполнению
                  //   "START" - запущена
                  //   "PAUSE" - приостановлена
                  //   "RESUME" - возобновлена
                  //   "END" - успешно завершена
                  //  "QUIT" - игра более не активна
               
};

// подготовить общий текстовый буфер для обмена 
// служебными и игровыми сообщениями и вывода их на экран
 let textBuffer = { 
   textMsg: "",  // текст для вывода в область сообщений
   textMsgID: "",  // идентификатор текста сообщения
   textMsgLangID: "",  // идентификатор языка текста сообщения
   isDisplayedMsg: "Y",  // признак, был ли выполнен вывод на экран: "Y" - был, "N" - не был
   textSts: "",  // текст для вывода в область статистики
   textStsId: "",  // идентификатор текста статистики
   textStsLangID: "",  // идентификатор языка текста сообщения
   isDisplayedStS: "Y"  // признак, был ли выполнен вывод на экран: "Y" - был, "N" - не был
 }

// выполнить настройку языка игры по языку браузера
if (navigator.languages[0].substring(0, 2).toUpperCase() == "RU") {
  gameSettings.lang == "RU";
} else {
  gameSettings.lang == "EN";
}
switch (navigator.languages[0].substring(0, 2).toUpperCase()) {
  case "RU":
    gameSettings.lang = "RU";
    break;
  case "EN":
  default:
    gameSettings.lang = "EN";
    break;
}

// настроить параметры холста для рисования
var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// проверить наличие поддержки функциональности canvas в браузере пользователя
while (checkCanvas() == false) {};

// проверить функциональность работы браузера с локальным хранилищем данных
checkLocalStorage();

// настроить работу с локальным хранилищем данных браузера
let gameMemory = new(GameMemory);

// восстановить настройки игры из хранилища
gameMemory.getGameSettingsFromStore();

// восстановить таблицу игровых рекордов из хранилища
gameMemory.getRecordsTableFromStore();

// добавить контроль события изменения размеров окна браузера
window.addEventListener("resize", resizeCanvas, false);

// создать разметку игровой площадки
let playground = new (Playground);

// создать общий план (структуру) игрового поля
let gameField = new (GameField);

// выполнить подготовку игрового меню
let menuButtons = new (MenuButtons);

// выполнить разметку игрового поля для заданного уровня игры
// по соответствующей игровой карте этого уровня
let gameMarkup = new (GameMarkup);
gameMarkup.setGameMarkup(gameSettings.level);

// выполнить первоначальную раскладку слов на игровом поле,
// пока не разрешатся корректно все буквы на пересечениях
// сторон квадратов разметки игрового поля 
let wordLayout = new (WordLayout);
while (wordLayout.setWordLayout(gameSettings.lang, gameSettings.level) === false) { };

// выполнить подготовку к выводу текстовых сообщений в ходе игры
let txtHandler = new (TextHandler);

// активировать игру
gameSettings.status = "ON";

// подготовить к работе игровые часы
let gameClock = new(GameClock);

// подготовить в буфере начальное сообщение для пользователя
pushTextToBuf("act_display_menufunc", gameSettings.lang, PLAYGROUNDAREAS.outputMessage);  // экранные кнопки

// подготовить в буфере начальную статистику для пользователя
pushTextToBuf("evnt_display_statistics", gameSettings.lang, PLAYGROUNDAREAS.gameScoreboard);  // данные статистики

// подстроить вид меню
gameSettings.sound == "ON" ? BUTTONS[menuButtons.getButtonIndex("Sound")][1] =  " ♫ " : BUTTONS[menuButtons.getButtonIndex("Sound")][1] =  " ♪ ";

// отобразить игровой экран
drawGameScreen();

// обрабатывать событие клика мыши на элементе canvas
let  x, y, rect;
canvas.addEventListener('click', mainGameCycle); 

function mainGameCycle(event) {

  rect = canvas.getBoundingClientRect();
  x = event.clientX - rect.left;
  y = event.clientY - rect.top;
  switch (playground.getPlaygroundAreaName(x, y)) {
    case PLAYGROUNDAREAS.gameField:  // клик на игровом поле
      if (gameSettings.status == "ON" || gameSettings.status == "START"  || gameSettings.status == "RESUME") {
        // в случае, если игра активирована, получить активную сторону квадрата, 
        // указанную пользователем на игровом поле
        getActiveSquareSide(x, y);
        // выполнить трансвординг, если активны две смежные стороны квадрата
        if (gameField.activeSquareSide.first != - 1 && gameField.activeSquareSide.second != - 1) 
        {
          drawGameScreen();  // отобразить игровой экран - для показа второй активной стороны
          doTranswording(gameField.activeSquareSide.first, gameField.activeSquareSide.second, 
            gameField.activeSquareSide.cellIntersectionRow, gameField.activeSquareSide.cellIntersectionCol);
          playSound("flip");  // выдать звук
          // проверить успешность сборки трансворда
          if (gameSettings.status != "ON") {
            if (isGameCompleted() == true) {  
              gameSettings.status = "END";  // завершить текущую игру
              // остановить время на игровых часах
              gameClock.timeMeasureOff();
              // обновить игровую статистику
              if (gameMemory.updateRecordsTable() == true) {  // появился новый рекорд
                // записать игровую статистику в локальное хранилище браузера
                gameMemory.putRecordsTableToStore();
              }
              // вывести поздравительное сообщение для пользователя
              pushTextToBuf("evnt_display_congratulations", gameSettings.lang, PLAYGROUNDAREAS.outputMessage);  // поздравления
              // актуализировать выводимую информацию об игровой статистике 
              pushTextToBuf("evnt_display_statistics", gameSettings.lang, PLAYGROUNDAREAS.gameScoreboard);  // статистика
              // показать экран
              //drawGameScreen();
              playSound("congr");  // выдать звук
            }
          }
        }
      }
      break;
    case PLAYGROUNDAREAS.menuButtons:  // клик в области меню
      switch (menuButtons.getMenuButtonName(x, y)) {
        case "PlayGame":
          if (gameSettings.status == "ON" || gameSettings.status == "END") {
            let flag = true;
            while (flag === true) { 
              // выполнить случайную перемешку слов для начала игры
              doWordMixing();
              // выполнить проверку, не эквивалентна ли перемешка начальной раскладке слов
              flag = isGameCompleted();
            };
            // включить игру
            gameSettings.status = "START";
            // сбросить время на игровых часах
            gameClock.timeMeasureReset();
          }
          if (gameSettings.status == "PAUSE") {
            // возобновить игру
            gameSettings.status = "RESUME";
          }
          // включить игровые часы
          gameClock.timeMeasureOn();
          break;
        case "LevelUpdate":
          // выключить игру
          gameSettings.status = "OFF";
          // сбросить время на игровых часах
          gameClock.timeMeasureReset();
          // сбросить активные стороны квадрата, если они есть, и ячейку их пересечения
          resetActiveSquareSide();
          // выполнить раскладку слов на игровом поле
          while (wordLayout.setWordLayout(gameSettings.lang, gameSettings.level) === false) { };
          // включить игру
          gameSettings.status = "ON";
          break;
        case "LevelDown":
          // VK Bridge: проверить готовность рекламы к показу
          vkBridge.send('VKWebAppShowNativeAds', { ad_format: 'interstitial' });         
          // выключить игру
          gameSettings.status = "OFF";
          // сбросить время на игровых часах
          gameClock.timeMeasureReset();
          // понизить уровень игры с текущего до минимального
          gameSettings.level = (gameSettings.level > 0) ? (gameSettings.level - 1) : 0;
          // записать текущие настройки игры в локальное хранилище
          gameMemory.putGameSettingsToStore();
          // сбросить активные стороны квадрата, если они есть, и ячейку их пересечения
          resetActiveSquareSide();
          // переразметить игровое поле для заданного уровня
          gameMarkup.setGameMarkup(gameSettings.level);
          // выполнить раскладку слов на игровом поле
          while (wordLayout.setWordLayout(gameSettings.lang, gameSettings.level) === false) { };
          // включить игру
          gameSettings.status = "ON";
          // VK Bridge: показать рекламу
          vkBridge.send('VKWebAppShowNativeAds', { ad_format: 'interstitial' })
            .then((data) => {
              if (data.result) {
                console.log('Реклама показана');
                // отобразить игровой экран
                drawGameScreen();
              } else
                console.log('Ошибка при показе');
            })
            .catch((error) => { console.log(error); /* Ошибка */ });                  
          break;        
        case "LevelUp":
          // VK Bridge: проверить готовность рекламы к показу
          vkBridge.send('VKWebAppShowNativeAds', { ad_format: 'interstitial' });
          // выключить игру
          gameSettings.status = "OFF";
          // сбросить время на игровых часах
          gameClock.timeMeasureReset();
          // повысить уровень игры с текущего до максимального
          if (ifNextGameLevelAccept() == true) {  // проверить, пройден ли текущий уровень
            gameSettings.level = (gameSettings.level < LEVEL_MAPS.length - 1) ? (gameSettings.level + 1) : LEVEL_MAPS.length - 1;
            // записать текущие настройки игры в локальное хранилище
            gameMemory.putGameSettingsToStore();
          }
          // сбросить активные стороны квадрата, если они есть, и ячейку их пересечения
          resetActiveSquareSide();
          // переразметить игровое поле для заданного уровня
          gameMarkup.setGameMarkup(gameSettings.level);
          // выполнить раскладку слов на игровом поле          
          while (wordLayout.setWordLayout(gameSettings.lang, gameSettings.level) === false) { };
          // включить игру
          gameSettings.status = "ON";
          // VK Bridge: показать рекламу
          vkBridge.send('VKWebAppShowNativeAds', { ad_format: 'interstitial' })
            .then((data) => {
              if (data.result) {
                console.log('Реклама показана');
                // отобразить игровой экран
                drawGameScreen();
              } else
                console.log('Ошибка при показе');
            })
            .catch((error) => { console.log(error); /* Ошибка */ });                  
          break;
        case "Language":
          // выключить игру
          gameSettings.status = "OFF";
          // сбросить время на игровых часах
          gameClock.timeMeasureReset();         
          // изменить настройку языка игры
          switch (gameSettings.lang) {
            case "RU":
              gameSettings.lang = "EN";
              break;
            case "EN":
            default:
              gameSettings.lang = "RU";
              break;
          }
          // записать текущие настройки игры в локальное хранилище
          gameMemory.putGameSettingsToStore();
          // сбросить активные стороны квадрата, если они есть, и ячейку их пересечения
          resetActiveSquareSide();
          // переразметить игровое поле для заданного уровня
          gameMarkup.setGameMarkup(gameSettings.level);
          // выполнить раскладку слов на игровом поле          
          while (wordLayout.setWordLayout(gameSettings.lang, gameSettings.level) === false) { };
          // включить игру
          gameSettings.status = "ON";
          break; 
        case "Sound":
           // изменить настройку звука
          switch (gameSettings.sound ) {
            case "OFF":
              gameSettings.sound = "ON";
              BUTTONS[menuButtons.getButtonIndex("Sound")][1] =  " ♫ " // ♪ - выключен, ♫ - включен
              playSound("buz");  // выдать звук
              break;
            case "ON":
            default:
              gameSettings.sound = "OFF";
              BUTTONS[menuButtons.getButtonIndex("Sound")][1] =  " ♪ "
              break;
          }
          // записать текущие настройки игры в локальное хранилище
          gameMemory.putGameSettingsToStore();
          break;
        case "Theme":
          // изменить настройку экранных цветов
          switch (gameSettings.theme) {
            case "DARK":
              gameSettings.theme = "LIGHT";
              break;
            case "LIGHT":
            default:
              gameSettings.theme = "DARK";
              break;
          }
          changeColorTheme(gameSettings.theme);
          // записать текущие настройки игры в локальное хранилище
          gameMemory.putGameSettingsToStore();
          break;
        case "Help":
          // вывести текст на экран
          switch (textBuffer.textMsgID) {
            case "act_display_rules":
              pushTextToBuf("act_display_menufunc", gameSettings.lang, PLAYGROUNDAREAS.outputMessage)  // экранные кнопки
              break;
            case "act_display_menufunc":
            default:
              pushTextToBuf("act_display_rules", gameSettings.lang, PLAYGROUNDAREAS.outputMessage)  // правила игры
              break;
          }
          // отобразить игровой экран
          drawGameScreen();
          break;
        case "Quit":
          // записать текущие настройки игры в локальное хранилище
          gameMemory.putGameSettingsToStore();
          // записать игровую статистику в локальное хранилище браузера
          gameMemory.putRecordsTableToStore();
          // вывести сообщение пользователю о завершении работы с игрой
          pushTextToBuf("act_display_gameinactive", gameSettings.lang, PLAYGROUNDAREAS.outputMessage)  // игра неактивна
          // деактивировать игру
          gameSettings.status = "QUIT";
          break;
      }
      break;
    case PLAYGROUNDAREAS.gameStencil:  // клик на игровом задании-трафарете
      if (gameSettings.status == "START" || gameSettings.status == "RESUME") {
        // в случае, если игра выполняется, проверить нажатие кнопки "пауза"
        // PAUSE_BUTTON = [["GamePause", " ◄ "]]
        if (getStencilPauseCell(x, y) == PAUSE_BUTTON[0][0])  // сверка наименования кнопки
        {
          gameSettings.status = "PAUSE";
          playSound("buz");  // выдать звук
          // приостановить время на игровых часах
          gameClock.timeMeasureOff();
        }
      }
      break;
    default:
      return;  
  }
  // вывести подсказку по экранным кнопкам, если игра активирована или приостановлена или завершена
  if (gameSettings.status == "ON" || gameSettings.status == "PAUSE" || gameSettings.status == "END") 
  { 
      // отменить статус игры "END" как исполненный
    textBuffer.isDisplayedMsg == "END" ? "ON" : textBuffer.isDisplayedMsg; 
    if (textBuffer.isDisplayedMsg == "Y")  // удостовериться, что нет еще невыведенного сообщения
    { 
      if (textBuffer.textMsgID != "act_display_rules") {  // правила могут быть запрошены выше кнопкой "Help"
        pushTextToBuf("act_display_menufunc", gameSettings.lang, PLAYGROUNDAREAS.outputMessage)  // функции меню
      }
      else
      {
        pushTextToBuf("act_display_rules", gameSettings.lang, PLAYGROUNDAREAS.outputMessage)  // правила игры
      }
    }
    pushTextToBuf("evnt_display_statistics", gameSettings.lang, PLAYGROUNDAREAS.gameScoreboard)  // статистика игры
  }
  // отобразить игровой экран
  drawGameScreen();
};




