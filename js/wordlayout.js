// НАЗНАЧЕНИЕ: выполнение раскладки слов на размеченном игровое поле 
//   для заданного уровня игры
// РАЗРАБОТЧИК: Igor Nesiolovskiy
// МОДИФИКАЦИЯ: 2022-03-27

let gameWords;  // строка для чтения в нее ресурсного файла с набором слов для игры
let squareWordSideArr = [];  // массив сторон квадратов игрового поля со словами
const DUMMY_WORD = "?????";  // признак "пустого" слова

class WordLayout {

  // выполнить раскладку слов на разметку игрового поля
  setWordLayout(gameLang, gameLevel) {

    let retCodeOk = true;  // код возврата результата раскладки слов (false - некорретно) 
    let wordsArr = [];  // массив подмножеств слов из gameWords

    // определить набор слов согласно языковой настройке
    switch (gameLang) {
      case "RU":
        gameWords = WORDS_RU;
        break;
      case "EN":
        default:
        gameWords = WORDS_EN;
          break;
    }

    // выполнить начальную инициализацию массива ячеек игрового поля (dummy-значениями)
    gameField.initcellArr();  
    squareWordSideArr.length = 0;  // очистить массив сторон квадратов игрового поля со словами

    // подготовить массив сторон квадратов игрового поля со словами
    let arrLen = squareSideArr.length;
    for (let i = 0; i < arrLen; i++) {
      squareWordSideArr.push( [
        squareSideArr[i][10],  // ключ стороны квадрата 
        DUMMY_WORD] );  // признак, что этой стороне слово еще не назначено
    }

    // цикл выполнения раскладки слов по выполненой разметке
    // игрового поля squareSideArr и squareSideIntersectionArr
    
    let wordCounter = 0;  // счетчик назначенных слов раскладки
    let relativeIndex = -1;  // относительный индекс элемента в массиве
    let absoluteIndex = -1;  // абсолютный индекс элемента в массиве
    let fstWordChar = "";  // первый символ слова
    let lstWordChar = "";  // последний символ слова
    let regExpPattern = ".....";  // шаблон поиска слова для регулярного выражения

    for (let i = 0; i < arrLen; i++) {
      // выбрать случайным образом относительный индекс стороны квадрата
      // в массиве для назначения ей слова
      relativeIndex = getRandomInt(1, arrLen - wordCounter) - 1;
      // определить абсолютный индекс элемента массива
      for (let j = 0; j < arrLen; j++) {
        if (squareWordSideArr[j][1] == DUMMY_WORD) { relativeIndex-- }
        if (relativeIndex < 0) {
          absoluteIndex = j;  // индекс установлен
          j = arrLen;  // завершить цикл поиска абсолютного индекса
        } 
      }
      // установить первую букву слова (по сетке ячеек игрового поля)
      fstWordChar = gameField.cellArr [ squareSideArr[absoluteIndex][0] ]   
                                      [ squareSideArr[absoluteIndex][1] ];
      // проверить первую ячейку на "пустоту"
      fstWordChar = (fstWordChar == DUMMY_CHAR) ? "." : fstWordChar;
      // установить последнюю букву слова
      lstWordChar = gameField.cellArr [ squareSideArr[absoluteIndex][8] ]   
                                      [ squareSideArr[absoluteIndex][9] ];
      // проверить последнюю ячейку на "пустоту"
      lstWordChar = (lstWordChar == DUMMY_CHAR) ? "." : lstWordChar;
      // сформировать шаблон поиска слов для регулярного выражения
      regExpPattern = fstWordChar + "..." + lstWordChar;
      
      // получить подмножество слов из регулярного выражения
      wordsArr = gameWords.match( new RegExp (regExpPattern, "g") );

      // проверить корректность получения слов из регулярного выражения
      // и в случае возврата пустого массива завершить процедуру раскладки слов
      //console.log(wordsArr.length);
      if (wordsArr == null) {
        // отладка:
        //console.log(wordsArr.length, relativeIndex, wordsArr[relativeIndex])
        gameField.cellArr.length = 0;  // сбросить данные массива ячеек игрового поля
        gameField.cellArr = gameField.getcellArr();  // проинициализировать ячейки
        return false
      }

      // выбрать случайное слово из подмножества
      // (здесь переменная relativeIndex используется утилитарно)
      // и проверить слово на дублирование в массиве уже выбранных слов
      while (wordsArr != null) {
        relativeIndex = getRandomInt(1, wordsArr.length) - 1;
        if (squareWordSideArr.some(row => row.includes(wordsArr[relativeIndex]) == true)) {  // слово дублируется
          wordsArr.splice(relativeIndex, 1)  // удалить слово из выборки по регулярному выражения
        } else break; // слово не дублируется
      }  

      // вновь проверить корректность слов из выборки по регулярному выражению
      // (т.к. эта выборка из-за устранения дублирования слов может оказаться пустой)
      // и в случае возврата значения null завершить процедуру раскладки слов
      if (wordsArr.length == 0) {
        // отладка:
        //console.log(wordsArr.length, relativeIndex, wordsArr[relativeIndex])
        gameField.cellArr.lenght = 0;  // сбросить данные массива ячеек игрового поля
        gameField.cellArr = gameField.getcellArr();  // проинициализировать ячейки
        return false
      }      

      wordCounter++;  // увеличить счетчик слов, подобранных для раскладки на поле
      
      // зафиксировать выбранное слово в массиве сторон квадратов
      squareWordSideArr[absoluteIndex][1] = wordsArr[relativeIndex];

      // зафиксировать выбранное слово в массиве ячеек игрового поля
      this.putWordOnField (
        squareWordSideArr[absoluteIndex][0],  // ключ стороны квадрата
        squareWordSideArr[absoluteIndex][1] );  // выбранное слово
    }

    // при успешной раскладке получить копию массива ячеек игрового поля
    // с заданием-трафаретом для пользователя
    //gameField.cellArrStencil = gameField.cellArr.slice(0);
    gameField.getcellArrStencil(); 

    return retCodeOk  // раскладка слов прошла успешно
  }

  // метод размещает указанное слово в массиве ячеек игрового поля  
  putWordOnField (squareSideKey, gameWord) {
    let index = -1;  // индекс стороны квадрата в массиве сторон квадратов
    index = gameMarkup.findSquareSideIndex(squareSideKey, squareSideArr);
    if (index > -1) {
      for (let i = 0; i < GAME_FIELD_SQUARE_SIZE; i++) {
        gameField.cellArr [ squareSideArr[index][2 * i] ]   
                          [ squareSideArr[index][2 * i + 1] ] =
                          gameWord.substr(i, 1);
      }
    } else
    {
      // подготовить и вывести в консоль сообщение об ошибке, что индекс не найден
      // в массиве сторон квадратов
      pushTextToBuf("sys_error_noindex", gameSettings.lang, PLAYGROUNDAREAS.outputMessage);  // индекс не найден
      console.log(textBuffer.textMsg); 
    };
    return
  }

}


