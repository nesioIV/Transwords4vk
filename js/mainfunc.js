// НАЗНАЧЕНИЕ: прикладные функции главного модуля (main)
// РАЗРАБОТЧИК: Igor Nesiolovskiy

// функция определяет активную сторону квадрата,
// указанную пользователем на игровом поле для
// для выполнения операции трансвординга 
function getActiveSquareSide(x, y) // координаты клика пользователя на игровом поле
{
  let cellCol, cellRow;  // строка и столбец ячейки
  let squareSideIndex;  // индекс стороны квадрата в SquareSideArr
  let squareSideIntersectionIndex; //  индекс пары пересекающихся сторон квадратов

  // сбросить указатели на активные стороны квадрата
  if (gameField.activeSquareSide.first != -1 && gameField.activeSquareSide.second != -1) resetActiveSquareSide();

  // определить ячейку игрового поля, которую кликнул пользователь
  cellRow = Math.floor((y - gameField.yUpLeft) / gameField.cellSide);
  cellCol = Math.floor((x - gameField.xUpLeft) / gameField.cellSide);
  // проверить, что кликнутая ячейка непустая
  if (gameField.cellArr[cellRow][cellCol] != DUMMY_CHAR) {
    playSound("click");  // выдать звук 
    // проверить, что по выбранной пользователем ячейке можно идентифицировать
    // какую-либо сторону квадрата (т.е. ячейка является "частной", а не "общей")
    squareSideIndex = gameMarkup.getSquareSideIndexByCell(cellRow, cellCol);
    if (squareSideIndex != -1) {
      // назначить указанную пользователем сторону квадрата активной,
      if (gameField.activeSquareSide.first == -1) {gameField.activeSquareSide.first = squareSideIndex}
      else  // проверить вторую, указанную пользователем, сторону на смежность с первой активной стороной квадрата
      {
        // если эта сторона еще не была ранее указана пользователем
        if (squareSideIndex != gameField.activeSquareSide.first) {
          // проверить пересечение сторон квадрата
          squareSideIntersectionIndex = gameMarkup.checkSideIntersection(gameField.activeSquareSide.first, squareSideIndex);
          if (squareSideIntersectionIndex > -1)
          { // т.к. пересечение сторон присутствует, то назначить вторую сторону тоже активной   
            gameField.activeSquareSide.second = squareSideIndex;
            // и указать ряд и столбец ячейки пересечения
            gameField.activeSquareSide.cellIntersectionRow = squareSideIntersectionArr[squareSideIntersectionIndex][2];
            gameField.activeSquareSide.cellIntersectionCol = squareSideIntersectionArr[squareSideIntersectionIndex][3];
          }
          else
          { // т.к. пересечение сторон отсутствует, то первая сторона перестает быть активной,
            // а вторая сторона становится единственно активной и замещает первую
            resetActiveSquareSide();  // сбросить данные об активных сторонах и их пересечении
            gameField.activeSquareSide.first = squareSideIndex;
          }
        }
        // т.к. данная сторона повторно отмечена активной, то деактивируем её
        else resetActiveSquareSide();
      }
    }
  }
  // т.к. выбрана пустая ячейка, то деактивировать всё
  else resetActiveSquareSide();
}

// сброс указателей на активные стороны квадратов, выбранные пользователем для операции
// трансвординга, и координат ячейки пересечения этих сторон
function resetActiveSquareSide() {
  gameField.activeSquareSide.first = -1; gameField.activeSquareSide.second = -1;
  gameField.activeSquareSide.cellIntersectionRow = -1; gameField.activeSquareSide.cellIntersectionCol = -1;
}

// проверка, принадлежит ли ячейка активной стороне квадрата, выбранной пользователем
function isSquareSideCellActive(row, col) {
  let checkResult = false;  // результат выполнения проверки
  let activeSquareSideIndex = -1;  // индекс активной стороны квадрата в squareSideArr 
  // проверить вхождение ячейки в первую активную сторону квадрата
  activeSquareSideIndex = gameField.activeSquareSide.first;
  if (activeSquareSideIndex > -1) {
    for (let i = 0; i < GAME_FIELD_SQUARE_SIZE; i++) {
      if (squareSideArr[activeSquareSideIndex][2 * i] == row && 
          squareSideArr[activeSquareSideIndex][2 * i + 1] == col) 
      { 
        i = GAME_FIELD_SQUARE_SIZE;
        checkResult = true;
      }
    }
  }
  // проверить вхождение ячейки во вторую активную сторону квадрата
  activeSquareSideIndex = gameField.activeSquareSide.second;
  if (activeSquareSideIndex > -1) {
    for (let i = 0; i < GAME_FIELD_SQUARE_SIZE; i++) {
      if (squareSideArr[activeSquareSideIndex][2 * i] == row && 
          squareSideArr[activeSquareSideIndex][2 * i + 1] == col) 
      { 
        i = GAME_FIELD_SQUARE_SIZE;
        checkResult = true;
      }
    }
  }
  return checkResult
}

// выполнение операции трасвординга
function doTranswording(fstSideIndex, sndSideIndex, cellRow, cellCol) {
  let fstActiveSideCellsArr = [];  // массив координат ячеек первой активной стороны квадрата
  let sndActiveSideCellsArr = [];  // массив координат ячеек второй активной стороны квадрата

  // нормализовать представление ячеек первой стороны, 
  // т.е. представить их в порядке, чтобы ячейка пересечения
  // двух активных сторон была первой
  if (squareSideArr[fstSideIndex][0] == cellRow && squareSideArr[fstSideIndex][1] == cellCol) {
    // выполнить прямую инициализацию fstActiveSideCellsArr
    fstActiveSideCellsArr[0] = squareSideArr[fstSideIndex][0];
    fstActiveSideCellsArr[1] = squareSideArr[fstSideIndex][1];
    fstActiveSideCellsArr[2] = squareSideArr[fstSideIndex][2];
    fstActiveSideCellsArr[3] = squareSideArr[fstSideIndex][3];
    fstActiveSideCellsArr[4] = squareSideArr[fstSideIndex][4];
    fstActiveSideCellsArr[5] = squareSideArr[fstSideIndex][5];
    fstActiveSideCellsArr[6] = squareSideArr[fstSideIndex][6];
    fstActiveSideCellsArr[7] = squareSideArr[fstSideIndex][7];
    fstActiveSideCellsArr[8] = squareSideArr[fstSideIndex][8];
    fstActiveSideCellsArr[9] = squareSideArr[fstSideIndex][9];
  }
  else {
   // выполнить обратную инициализацию fstActiveSideCellsArr
    fstActiveSideCellsArr[0] = squareSideArr[fstSideIndex][8];
    fstActiveSideCellsArr[1] = squareSideArr[fstSideIndex][9];
    fstActiveSideCellsArr[2] = squareSideArr[fstSideIndex][6];
    fstActiveSideCellsArr[3] = squareSideArr[fstSideIndex][7];
    fstActiveSideCellsArr[4] = squareSideArr[fstSideIndex][4];
    fstActiveSideCellsArr[5] = squareSideArr[fstSideIndex][5];
    fstActiveSideCellsArr[6] = squareSideArr[fstSideIndex][2];
    fstActiveSideCellsArr[7] = squareSideArr[fstSideIndex][3];
    fstActiveSideCellsArr[8] = squareSideArr[fstSideIndex][0];
    fstActiveSideCellsArr[9] = squareSideArr[fstSideIndex][1];
  }    
  // нормализовать представление ячеек второй стороны, 
  if (squareSideArr[sndSideIndex][0] == cellRow && squareSideArr[sndSideIndex][1] == cellCol) {
    // выполнить прямую инициализацию sndActiveSideCellsArr
    sndActiveSideCellsArr[0] = squareSideArr[sndSideIndex][0];
    sndActiveSideCellsArr[1] = squareSideArr[sndSideIndex][1];
    sndActiveSideCellsArr[2] = squareSideArr[sndSideIndex][2];
    sndActiveSideCellsArr[3] = squareSideArr[sndSideIndex][3];
    sndActiveSideCellsArr[4] = squareSideArr[sndSideIndex][4];
    sndActiveSideCellsArr[5] = squareSideArr[sndSideIndex][5];
    sndActiveSideCellsArr[6] = squareSideArr[sndSideIndex][6];
    sndActiveSideCellsArr[7] = squareSideArr[sndSideIndex][7];
    sndActiveSideCellsArr[8] = squareSideArr[sndSideIndex][8];
    sndActiveSideCellsArr[9] = squareSideArr[sndSideIndex][9];
  }
  else {
   // выполнить обратную инициализацию sndActiveSideCellsArr
    sndActiveSideCellsArr[0] = squareSideArr[sndSideIndex][8];
    sndActiveSideCellsArr[1] = squareSideArr[sndSideIndex][9];
    sndActiveSideCellsArr[2] = squareSideArr[sndSideIndex][6];
    sndActiveSideCellsArr[3] = squareSideArr[sndSideIndex][7];
    sndActiveSideCellsArr[4] = squareSideArr[sndSideIndex][4];
    sndActiveSideCellsArr[5] = squareSideArr[sndSideIndex][5];
    sndActiveSideCellsArr[6] = squareSideArr[sndSideIndex][2];
    sndActiveSideCellsArr[7] = squareSideArr[sndSideIndex][3];
    sndActiveSideCellsArr[8] = squareSideArr[sndSideIndex][0];
    sndActiveSideCellsArr[9] = squareSideArr[sndSideIndex][1];
  }    

  // выполнить синхронную пересылку значений ячеек игрового поля
  // между активными сторонами квадрата
  let letter = gameField.cellArr[fstActiveSideCellsArr[0]][fstActiveSideCellsArr[1]];
  gameField.cellArr[fstActiveSideCellsArr[0]][fstActiveSideCellsArr[1]] = gameField.cellArr[sndActiveSideCellsArr[0]][sndActiveSideCellsArr[1]];
  gameField.cellArr[sndActiveSideCellsArr[0]][sndActiveSideCellsArr[1]] = letter;

  letter = gameField.cellArr[fstActiveSideCellsArr[2]][fstActiveSideCellsArr[3]];
  gameField.cellArr[fstActiveSideCellsArr[2]][fstActiveSideCellsArr[3]] = gameField.cellArr[sndActiveSideCellsArr[2]][sndActiveSideCellsArr[3]];
  gameField.cellArr[sndActiveSideCellsArr[2]][sndActiveSideCellsArr[3]] = letter;

  letter = gameField.cellArr[fstActiveSideCellsArr[4]][fstActiveSideCellsArr[5]];
  gameField.cellArr[fstActiveSideCellsArr[4]][fstActiveSideCellsArr[5]] = gameField.cellArr[sndActiveSideCellsArr[4]][sndActiveSideCellsArr[5]];
  gameField.cellArr[sndActiveSideCellsArr[4]][sndActiveSideCellsArr[5]] = letter;

  letter = gameField.cellArr[fstActiveSideCellsArr[6]][fstActiveSideCellsArr[7]];
  gameField.cellArr[fstActiveSideCellsArr[6]][fstActiveSideCellsArr[7]] = gameField.cellArr[sndActiveSideCellsArr[6]][sndActiveSideCellsArr[7]];
  gameField.cellArr[sndActiveSideCellsArr[6]][sndActiveSideCellsArr[7]] = letter;

  letter = gameField.cellArr[fstActiveSideCellsArr[8]][fstActiveSideCellsArr[9]]; 
  gameField.cellArr[fstActiveSideCellsArr[8]][fstActiveSideCellsArr[9]] = gameField.cellArr[sndActiveSideCellsArr[8]][sndActiveSideCellsArr[9]];
  gameField.cellArr[sndActiveSideCellsArr[8]][sndActiveSideCellsArr[9]] = letter;

}

// функция определяет, нажата ли пользователем кнопка "пауза", связанная 
// с соответствующей ячейкой игрового задания-трафарета для пользователя 
function getStencilPauseCell(x, y) // координаты клика пользователя на игровом поле
{
  let buttomName = "noButton";  // наименование кнопки
  let cellCol, cellRow;  // строка и столбец ячейки

  // определить ячейку задания-трафарета, которую кликнул пользователь
  cellRow = Math.floor((y - playground.gameStencilArea.yUpLeft) / gameField.cellSide);
  cellCol = Math.floor((x - playground.gameStencilArea.xUpLeft) / gameField.cellSide);
  // проверить, что кликнутая ячейка содержит символ "пауза"
  // PAUSE_BUTTON = [["GamePause", " ◄ "]]
  if (gameField.cellArrStencil[cellRow][cellCol] == PAUSE_BUTTON[0][1]) {
    buttomName = PAUSE_BUTTON[0][0];  // наименование кнопки
  }
  return buttomName;
}

// выполнение случайной перемешки слов в качестве задания пользователю на игру
function doWordMixing() {
  let repeater = 99999  // повторитель операции трансводинга для каждой пары смежных строн
  let lenghtArr = squareSideIntersectionArr.length  // длина массива пар смежных сторон
  let randomIndex  // случайный индекс элемента в массива
  let i  // счетчик цикла
  // выполнить попарную случайную перемешку слов
  for (i = 0; i < lenghtArr * repeater; i++) {
    // выбрать случайную пару смежных слов
    randomIndex = getRandomInt(0, lenghtArr - 1); 
    gameField.activeSquareSide = {  
      // функция gameMarkup.findSquareSideIndex(squareSideKey, squareSideArr)
      // выполняет поиск индекса в squareSideArr по ключу стороны squareSideKey
      first: gameMarkup.findSquareSideIndex(squareSideIntersectionArr[randomIndex][0],
        squareSideArr) ,// значение индекса первой стороны в SquareSideArr 
      second: gameMarkup.findSquareSideIndex(squareSideIntersectionArr[randomIndex][1],  
        squareSideArr) ,// значение индекса второй стророны в SquareSideArr
      cellIntersectionRow: squareSideIntersectionArr[randomIndex][2],  // ряд ячейки пересечения сторон квадрата из cellArr
      cellIntersectionCol: squareSideIntersectionArr[randomIndex][3]  // столбец ячейки пересечения сторон квадрата из cellArr
    }
    // выполнить операцию трансвордина для смежной пары слов
    doTranswording(gameField.activeSquareSide.first, 
      gameField.activeSquareSide.second, 
      gameField.activeSquareSide.cellIntersectionRow, 
      gameField.activeSquareSide.cellIntersectionCol)
  }
}

// функция передачи текстовых данных в буфер вывода
function pushTextToBuf (textID,  // идентификатор текстового сообщения
  languageID,  // идентификатор языка
  playgroundArea)  // имя экранной области для вывода текста
{
  let text = getGameNote(textID, languageID)
  switch (playgroundArea) 
  {
    case PLAYGROUNDAREAS.outputMessage:
      textBuffer.textMsg = text;
      textBuffer.textMsgID = textID;
      textBuffer.textMsgLangID = languageID;
      textBuffer.isDisplayedMsg = "N";  // при помещении в буфер текст еще не выводился на экран
      break;
    case PLAYGROUNDAREAS.gameScoreboard:
      textBuffer.textSts = text;
      textBuffer.textStsID = textID;
      textBuffer.textStsLangID = languageID;      
      textBuffer.isDisplayedSts = "N";
      break;
  }
}

// функция проверяет, успешно ли собран трансворд
// и в случае успеха возвращает true, иначе - false
function isGameCompleted() {
  isSuccess = true;
  let cntDiff = 0;  // счетчик отличий элементов игрового поля и задания-трафарета
  let i, j;
  gameField.cellArr.forEach(function(row, i) {
    row.forEach(function(element, j) {
      if (element != gameField.cellArrStencil[i][j]) {
        cntDiff++;
        if (cntDiff > 1) {  // допускается расхождение в 1 элементе, используемом для кнопки "PAUSE"
          isSuccess = false;
          return isSuccess;
        }
      }
    });
  });
  return isSuccess;
}

// функция проверяет допустимость перехода на следующий уровень игры
function ifNextGameLevelAccept() {
  let retValue = true;
  if (gameMemory.recordsTableArr[gameSettings.level][gameSettings.complexity] == 0)
  {
    // вывести сообщение о невозможности перехода
    pushTextToBuf("evnt_nextlevel_prohibited", gameSettings.lang, PLAYGROUNDAREAS.outputMessage);  // уровень игры
    retValue = false;
  }
  return retValue;
}

// воспроизведение аудио из указанного файла
function playSound(soundName) {
  if (gameSettings.sound == "ON") {
    audio = new Audio();
    audio.src = './res/' + soundName + ".mp3";
    audio.play();
  }
}
