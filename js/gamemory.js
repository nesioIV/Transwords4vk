// НАЗНАЧЕНИЕ: поддержка обработки данных настроек и статистики игры в локальном хранилище
// РАЗРАБОТЧИК: Igor Nesiolovskiy

const KEY_GAME_SETTINGS = "gameSettings";  // ключ объекта gameSettings в localStorage
const KEY_RECORDS_TABLE = "recordsTable";  // ключ объекта recordsTable в localStorage
const GAME_COMLEXITY_UPBOUND = 3;  // верхняя граница категории сложности игры на каждом уровне (zero-based!!!) 

// класс реализует функционал работы с локальным хранилищем
class GameMemory {

  // подготовка двумерного массива рекордов времени игры по её уровням (в милисекундах)
  getRecordsTableArr() {
    return Array.from (
      Array(LEVEL_MAPS.length), () => new Array(GAME_COMLEXITY_UPBOUND + 1).fill(0)  
    );
  }
  recordsTableArr = this.getRecordsTableArr();

  // начальная инициализация переменных для работы с localStorage
  gameSettingsJson = JSON.stringify(gameSettings);  // строка представления настроек игры в формате JSON
  gameSettingsParce = JSON.parse(this.gameSettingsJson);  // объект с настройками игры, восстановленный из строки JSON
  recordsTableJson = JSON.stringify(this.recordsTableArr);  // строка представления таблицы рекордов игры в формате JSON
  recordsTableParce = JSON.parse(this.recordsTableJson);  // объект с рекордами игры, восстановленный из строки JSON

  // извлечение строки игровых настроек из локального хранилища браузера (localStorage)
  // и их применение к текущему состоянию игры
  getGameSettingsFromStore() {
    if (localStorage[KEY_GAME_SETTINGS]) {
      this.gameSettingsParce = JSON.parse(localStorage[KEY_GAME_SETTINGS]);  // JSON-объект восстановлен из хранилища
      // применение ранее сохраненных настроек к игре
      gameSettings.lang = this.gameSettingsParce.lang;
      gameSettings.sound = this.gameSettingsParce.sound;
      gameSettings.theme = this.gameSettingsParce.theme;
      gameSettings.level = Number(this.gameSettingsParce.level);
      gameSettings.complexity = Number(this.gameSettingsParce.complexity);
    }
  }

  // запись объекта игровых настроек в локальное хранилище браузера (localStorage)
  // в формате JSON
  putGameSettingsToStore() {
    this.gameSettingsJson = JSON.stringify(gameSettings);  // объект свёрнут в строку JSON
    try {
      localStorage[KEY_GAME_SETTINGS] = this.gameSettingsJson; // запись строки в хранилище
    } catch (e) {
      if (e == QUOTA_EXCEEDED_ERR) {  // недостаточно места в локальном хранилище браузера
        pushTextToBuf("sys_problem_localstormemo", gameSettings.lang, PLAYGROUNDAREAS.outputMessage);
        alert(textBuffer.textMsg);  // alert-текст категории предупредительного сообщения (outputMessage)
      }
    }
  }

  // извлечение строки игровых рекордов из локального хранилища браузера (localStorage)
  // и их актуализация в игре
  getRecordsTableFromStore() {
    if (localStorage[KEY_RECORDS_TABLE]) {
      this.recordsTableParce = JSON.parse(localStorage[KEY_RECORDS_TABLE]);  // JSON-объект восстановлен из хранилища
      // актуализация ранее сохраненных рекордов в игре
      this.recordsTableArr.forEach((row, i) => {
        row.forEach((col, j) => {
          this.recordsTableArr[i][j] = this.recordsTableParce[i][j];
        });
      });
    }
  }

  // запись массива игровых рекордов в локальное хранилище браузера (localStorage)
  // в формате JSON
  putRecordsTableToStore() {
    this.recordsTableJson = JSON.stringify(this.recordsTableArr);  // объект свёрнут в строку JSON
    try {
      localStorage[KEY_RECORDS_TABLE] = this.recordsTableJson; // запись строки в хранилище
    } catch (e) {
      if (e == QUOTA_EXCEEDED_ERR) {  // недостаточно места в локальном хранилище браузера
        pushTextToBuf("sys_problem_localstormemo", gameSettings.lang, PLAYGROUNDAREAS.outputMessage);
        alert(textBuffer.textMsg);  // alert-текст категории предупредительного сообщения (outputMessage)
      }
    }
  }

  // проверка, состоялся ли новый игровой рекорд для данного уровня и степени сложности игры, и
  // и фиксация рекорда  
  updateRecordsTable() {
    let newRecord = false;  // признак, что рекорд для данного уровня и степени сложности игры состоялся 
    if (this.recordsTableArr[gameSettings.level][gameSettings.complexity] > gameClock.timeControl.gameTime ||
      this.recordsTableArr[gameSettings.level][gameSettings.complexity] == 0) 
    {
      // зафиксировать новый рекорд в массиве рекордов
      this.recordsTableArr[gameSettings.level][gameSettings.complexity] = gameClock.timeControl.gameTime;
      newRecord = true;
    }
    return newRecord;
  }

}