// НАЗНАЧЕНИЕ: функциональность выдачи игровых сообщений (примечаний)
// РАЗРАБОТЧИК: Igor Nesiolovskiy

// функция выдает для показа текстовое сообщение по его ключу и ключу языка игры
// катеории сообщений:
//  sys (system) - общесистемные сообщения
//  act (action) - примечания в ответ на действия пользователя
//  evnt (event) - сообщения, связанные с событиями в игре

function getGameNote(noteID, languageID) {
let gameNotes = {
//**************************************************
//**************************************************
"act_display_rules":  // правила игры 
{
"RU":
`                      ПРАВИЛА ИГРЫ:
Собирайте слова (на игровом поле слева) согласно выданному заданию-образцу (оно будет показано справа). 
Для сборки используйте операцию "транс- вординга": в любом буквенном квадрате размером 5x5 укажите последовательно две его любые соседние стороны, тогда они поменяются местами вместе с их буквами.
                  ЭКРАННЫЕ КНОПКИ:
Для описания экранных кнопок нажмите кнопку [${menuButtons.getButtonSymb("Help")}].`
,
"EN": 
`                         GAME RULES:
Assemble words (on the playing field on the left) according to the given stencil (on the right).
To assemble use the "transwording" operation: in any letter square of 5x5 size indicate sequentially two of its any neighboring sides, then they will swap places with their letters.
                     SCREEN BUTTONS:
The description of the screen buttons is displayed by the button [${menuButtons.getButtonSymb("Help")}].`
},

//**************************************************
//**************************************************

"act_display_menufunc":  // функции меню 
{
"RU":
`                  ЭКРАННЫЕ КНОПКИ:
${menuButtons.getButtonSymb("PlayGame")} запустить или продолжить игру
${menuButtons.getButtonSymb("GamePause")} сделать паузу в игре
${menuButtons.getButtonSymb("LevelUpdate")}  обновить уровень игры
${menuButtons.getButtonSymb("LevelDown")}   понизить уровень игры
${menuButtons.getButtonSymb("LevelUp")}   повысить уровень игры
${menuButtons.getButtonSymb("Language")}  изменить настройку языка 
${menuButtons.getButtonSymb("Sound")}  изменить настройку звука
${menuButtons.getButtonSymb("Theme")}  изменить экранную тему
${menuButtons.getButtonSymb("Help")}   показать правила игры
${menuButtons.getButtonSymb("Quit")}   завершить работу приложения`
,
"EN": 
`                     SCREEN BUTTONS:
${menuButtons.getButtonSymb("PlayGame")} start or resume the game
${menuButtons.getButtonSymb("GamePause")} pause the game
${menuButtons.getButtonSymb("LevelUpdate")}  update game level
${menuButtons.getButtonSymb("LevelDown")}   level down the game
${menuButtons.getButtonSymb("LevelUp")}   level up the game
${menuButtons.getButtonSymb("Language")}  change language setting 
${menuButtons.getButtonSymb("Sound")}  change sound setting
${menuButtons.getButtonSymb("Theme")}  change screen theme
${menuButtons.getButtonSymb("Help")}   show game rules
${menuButtons.getButtonSymb("Quit")}   shut down the application`
},

//**************************************************
//**************************************************
"evnt_display_statistics":  // статистика
{
"RU":
`                ИГРОВАЯ СТАТИСТИКА:
Текущий уровень игры......${gameSettings.level + 1}
Текущее время игры..........${gameClock.timeControl.castTime}
Лучшее время игры...........${gameClock.timeMeasureFormat(gameMemory.recordsTableArr[gameSettings.level][gameSettings.complexity])}`
,
"EN":
`                     GAME STATISTICS:
Current game level......${gameSettings.level + 1}
Current game time......${gameClock.timeControl.castTime}
Best game time...........${gameClock.timeMeasureFormat(gameMemory.recordsTableArr[gameSettings.level][gameSettings.complexity])}`
},

//**************************************************
//**************************************************
"evnt_nextlevel_prohibited":
{
"RU":
`

 

☀ Для перехода на следующий уровень игры необходимо пройти текущий уровень игры.`
,
"EN":
`



☀ Сomplete the current game level to go to the next one.`
},

//**************************************************
//**************************************************
"act_display_gameinactive":
{
"RU":
`


                                  ☁  

В этом сеансе игра больше не активна.


                                  ☁`
,
"EN":
`


                                    ☁

The game is inactive in this session.


                                    ☁`
},

//**************************************************
//**************************************************
"evnt_display_congratulations":  // игра успешно завершена
{
"RU":
 `

 ☀ ☀ ☀ ☀ ☀ ☀ ☀ ☀ ☀ ☀ ☀ ☀ ☀ ☀ ☀ ☀ ☀ ☀
         
               ТРАНСВОРД РАЗГАДАН!

            ПРИМИТЕ ПОЗДРАВЛЕНИЯ!

 ☀ ☀ ☀ ☀ ☀ ☀ ☀ ☀ ☀ ☀ ☀ ☀ ☀ ☀ ☀ ☀ ☀ ☀`
,
"EN":
`

 ☀ ☀ ☀ ☀ ☀ ☀ ☀ ☀ ☀ ☀ ☀ ☀ ☀ ☀ ☀ ☀ ☀ ☀
        
        THE TRANSWORD'S BEEN SOLVED!

                   CONGRATULATIONS!!!

 ☀ ☀ ☀ ☀ ☀ ☀ ☀ ☀ ☀ ☀ ☀ ☀ ☀ ☀ ☀ ☀ ☀ ☀`
},

//**************************************************
//**************************************************
"sys_problem_canvas":
{
"RU":
`Холст рисования, используемый в игре, в вашем браузере не поддерживается.
Пожалуйста, закройте эту вкладку и выберите для игры HTML5-совместимый браузер.`
,
"EN":
`The drawing canvas used in the game is not supported in your browser.
Please close this tab and select an HTML5 compatible browser to play the game.`
},

//**************************************************
//**************************************************
"sys_error_noindex":
{
"RU":
`"ОШИБКА: при раскладке слов индекс стороны квадрата в массиве сторон квадратов не определен."`
,
"EN":
`ERROR: The square side index is not defined in the square sides array.`
},

//**************************************************
//**************************************************
"sys_problem_localstormemo":
{
"RU":
`В локальном хранилище вашего браузера недостаточно места для сохранения текущих настроек и статистики игры.
Освободите место в хранилище стандартными средствами вашего браузера.`
,
"EN":
`There is not enough space in your browser's local storage to save your current settings and game statistics.
Free up storage space using your browser's standard tools.`
},

//**************************************************
//**************************************************
"sys_problem_localstorfunc":
{
"RU":
`Ваш браузер не поддерживает функциональность работы с его локальным хранилищем данных.
Поэтому отстутствует возможность сохранения текущих настроек и статистики игры и восстановления из хранилища при следующем запуске игры.`
,
"EN":
`Your browser does not support the functionality of working with its local data storage.
Therefore, it is not possible to save the current settings and statistics of the game and restore from storage the next time you start the game.`
},

//**************************************************
//**************************************************
"act_????_????":
{
"RU":
`...`
,
"EN":
``
},

//**************************************************
//**************************************************

}  // закрывающая скобка объекта gameNotes 

  // выполнить в объекте gameNotes поиск сообщения по ключу
  let note = "?????";  // сообщение, значение которого не найдено
  let keys = Object.keys(gameNotes);  // массив ключей сообщений
  let values = Object.values(gameNotes);  // массив значений сообщений
  let index = keys.indexOf(noteID);  // индекс сообщения в массиве
  if (index != -1) {  // ключ сообщения найден
    keys = Object.keys(values[index]);  // массив ключей переводов сообщения на разные языки
    values = Object.values(values[index]);  // массив значений переводов сообщения на разные языки
    index = keys.indexOf(languageID);  // индекс перевода сообщения в массиве переводов
    if (index != -1) {  // ключ перевода на указанный язык найден 
      note = values[index];
    }
  }
  return note;
}


