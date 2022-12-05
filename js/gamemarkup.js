// НАЗНАЧЕНИЕ: выполнение разметки игрового поля для 
//   заданного уровня игры (т.е. по игровой карте для этого уровня)
// РАЗРАБОТЧИК: Igor Nesiolovskiy

const GAME_FIELD_SQUARE_SIZE = 5;  // размер стороны квадрата игрового поля 

let squareArr = [];  // массив квадратов игрового поля (с ключами сторон)
let squareSideArr = [];  // массив сторон квадратов игрового поля (с координатами ячеек стороны и её ключом)
let squareSideIntersectionArr = []; // массив пересечений смежных парных сторон квадратов 
                                    // (с ключами сторон и координатами ячейки переcечения сторон)

class GameMarkup {

  level;  // уровень игры
  mapRow;  // номер строки игровой карты
  mapCol;  // номер столбца игровой карты
   
  // разметка отдельного квадрата игрового поля
  getSquareMarkup ( 
    level,  
    mapRow,  
    mapCol )  
  {   
    // определение координат 4-х углов квадрата игрового поля по заданному элементу игровой карты
    // (реально важны 3 угла согласно направлениям чтения слова в игре - справа налево и сверху вниз)
    // R(right)/L(left) - левый/правый, U(upper)/L(lower) - верхний/нижний, C(corner) - угол

    let squareLUC = [
      (mapRow + 0) * (GAME_FIELD_SQUARE_SIZE - 1),  // координаты row, col    
      (mapCol + 0) * (GAME_FIELD_SQUARE_SIZE - 1) ];  // левого верхнего угла квадрата игрового поля
    let squareRUC = [
      (mapRow + 0) * (GAME_FIELD_SQUARE_SIZE - 1),  // координаты row, col 
      (mapCol + 1) * (GAME_FIELD_SQUARE_SIZE - 1) ];  // правого верхнего угла квадрата игрового поля  
    let squareLLC = [
      (mapRow + 1) * (GAME_FIELD_SQUARE_SIZE - 1),  // координаты row, col 
      (mapCol + 0) * (GAME_FIELD_SQUARE_SIZE - 1) ];  // левого нижнего угла квадрата игрового поля 
    // let squareRLC = [
    //   (mapRow + 1) * (GAME_FIELD_SQUARE_SIZE - 1),  // координаты row, col 
    //   (mapCol + 1) * (GAME_FIELD_SQUARE_SIZE - 1) ];  // правого нижнего угла квадрата игрового поля 
    
    // добавить ключи 4-х сторон квадрата в массив квадратов
    squareArr.push( [
      this.getSquareSideKey (  // ключ первой (верхней) стороны квадрата
        squareLUC[0] + 0, squareLUC[1] + 0,  // первая ячейка верхней стороны квадрата 
        squareLUC[0] + 0, squareLUC[1] + 4 ),   // последняя ячейка верхней стороны квадрата
      this.getSquareSideKey (  // ключ второй (левой) стороны квадрата
        squareLUC[0] + 0, squareLUC[1] + 0,  // первая ячейка левой стороны квадрата
        squareLUC[0] + 4, squareLUC[1] + 0 ),  // последняя ячейка левой стороны квадрата
      this.getSquareSideKey (  // ключ третьей (правой) стороны квадрата
        squareRUC[0] + 0, squareRUC[1] + 0,  // первая ячейка правой стороны квадрата
        squareRUC[0] + 4, squareRUC[1] + 0 ),  // последняя ячейка правой стороны квадрата  
      this.getSquareSideKey (  // ключ четвертой (нижней) стороны квадрата
        squareLLC[0] + 0, squareLLC[1] + 0,  // первая ячейка нижней стороны квадрата
        squareLLC[0] + 0, squareLLC[1] + 4 )  // последняя ячейка нижней стороны квадрата   
      ] );

    // определение ячеек у каждой из 4-х сторон квадрата игрового поля 
    // по координатам углов квадрата (сторона состоит из 5-ти смежных ячеек поля)
   
    let squareSideKey = squareArr[squareArr.length - 1][0]; // ключ первой (верхней) стороны квадрата

    // проверить по ключу, зафиксирована ли сторона квадрата в массиве сторон квадратов,
    // и если нет, то добавить ее в массив  
    if (this.findSquareSideIndex(squareSideKey, squareSideArr) < 0) {
      squareSideArr.push( [
        squareLUC[0] + 0, squareLUC[1] + 0,  // координаты row, col 
        squareLUC[0] + 0, squareLUC[1] + 1,  // каждой из 5-ти 
        squareLUC[0] + 0, squareLUC[1] + 2,  // смежных ячеек
        squareLUC[0] + 0, squareLUC[1] + 3,  // верхней стороны
        squareLUC[0] + 0, squareLUC[1] + 4,
        squareSideKey ] );  
    };

    squareSideKey = squareArr[squareArr.length - 1][1] // ключ второй (левой) стороны квадрата      

    if (this.findSquareSideIndex(squareSideKey, squareSideArr) < 0) {
      squareSideArr.push( [
        squareLUC[0] + 0, squareLUC[1] + 0,  // координаты row, col
        squareLUC[0] + 1, squareLUC[1] + 0,  // каждой из 5-ти 
        squareLUC[0] + 2, squareLUC[1] + 0,  // смежных ячеек 
        squareLUC[0] + 3, squareLUC[1] + 0,  // левой стороны 
        squareLUC[0] + 4, squareLUC[1] + 0,
        squareSideKey ] );         
    };

    squareSideKey = squareArr[squareArr.length - 1][2] // ключ третьей (левой) стороны квадрата   

    if (this.findSquareSideIndex(squareSideKey, squareSideArr) < 0) {
      squareSideArr.push( [
      squareRUC[0] + 0, squareRUC[1] + 0,  // координаты row, col
      squareRUC[0] + 1, squareRUC[1] + 0,  // каждой из 5-ти 
      squareRUC[0] + 2, squareRUC[1] + 0,  // смежных ячеек 
      squareRUC[0] + 3, squareRUC[1] + 0,  // правой стороны
      squareRUC[0] + 4, squareRUC[1] + 0, 
      squareSideKey ] );          
      };

    squareSideKey = squareArr[squareArr.length - 1][3] // ключ четвертой (нижней) стороны квадрата   

    if (this.findSquareSideIndex(squareSideKey, squareSideArr) < 0) {
      squareSideArr.push( [
        squareLLC[0] + 0, squareLLC[1] + 0,  // координаты row, col
        squareLLC[0] + 0, squareLLC[1] + 1,  // каждой из 5-ти 
        squareLLC[0] + 0, squareLLC[1] + 2,  // смежных ячеек 
        squareLLC[0] + 0, squareLLC[1] + 3,  // нижней стороны 
        squareLLC[0] + 0, squareLLC[1] + 4,
        squareSideKey ] );          
    };        
  }
  
  // опрелеление порядкого номера ячейки по индексам row, col
  // (начало адресации - со значения 0)
  getCellNumber(row, col) {
    return (GAME_FIELD_ROWS * row + col)
  };

  // опрелеление ряда ячейки по её адресу (сквозному номеру)
  // getCellRow(cellAddress) {
  //   return (Math.floor(cellAddress / GAME_FIELD_ROWS))
  // };

  // опрелеление столбца ячейки по её адресу (сквозному номеру)
  // getCellCol(cellAddress) {
  //   return (cellAddress - GAME_FIELD_ROWS * this.getCellRow(cellAddress))
  // };

  // формирование ключа, идентифицирующего сторону квадрата
  getSquareSideKey( 
    firstRow, firstCol,  // индексы первой ячейки стороны квадрата
    lastRow, lastCol )  // индексы последней ячейки стороны квадрата
  {
    return (
      this.getCellNumber(firstRow, firstCol) * 1000 +
      this.getCellNumber(lastRow, lastCol)
    )
  }

  // нахождение значения индекса стороны квадрата в squareSideArr 
  // по её ключу - если поиск неудачный, то возвращается значение -1
  findSquareSideIndex(squareSideKey, squareSideArr) {
    let arrLen = squareSideArr.length;
    let index = -1;  // результат завершения поиска
    if (arrLen != 0) {
      for (let i = 0; i < arrLen; i++) {
        if (squareSideArr[i][GAME_FIELD_SQUARE_SIZE * 2] == squareSideKey) { 
          index = i;
          i = arrLen; 
        };
      };
    };
    return index
  }

  // нахождение значения индекса стороны квадрата в squareSideArr 
  // по её характерной точке - т.е. "частной" ячейке, а не "общей" 
  // (кот. не является началом или концом стороны квадрата);
  // ячейка идентифицируется по её ряду (row) и столбцу (col) в cellArr 
  getSquareSideIndexByCell(row, col) {
    let arrLen = squareSideArr.length;
    let index = -1;  // результат завершения поиска
    if (arrLen != 0) {
      for (let i = 0; i < arrLen; i++) {
        if (
          (squareSideArr[i][2] == row && squareSideArr[i][3] == col) ||
          (squareSideArr[i][4] == row && squareSideArr[i][5] == col) ||
          (squareSideArr[i][6] == row && squareSideArr[i][7] == col)
          ) 
        { 
          index = i;
          i = arrLen; 
        };
      };
    };
    return index
  }

  // метод проверяет, пересекаются ли две стороны квадрата
  // с индексами из squareSideArr
  checkSideIntersection(fstSideIndex, sndSideIndex) {
    let fstSideKey, sndSideKey;  // ключи сторон квадрата
    fstSideKey = squareSideArr[fstSideIndex][10];
    sndSideKey = squareSideArr[sndSideIndex][10]; 
    let arrLen = squareSideIntersectionArr.length;
    let index = -1;  // результат завершения поиска
    if (arrLen != 0) {
      for (let i = 0; i < arrLen; i++) {
        if (squareSideIntersectionArr[i][0] * squareSideIntersectionArr[i][1] == fstSideKey * sndSideKey) 
        { 
          index = i;
          i = arrLen;
        };
      };
    };
    return index
  }

  // выполнение разметки игрового поля для заданного уровня игры
  // (т.е. по игровой карте для этого уровня) в массиве squareSideArr
  setGameMarkup(level) {

    squareArr.length = 0;  // очистка массив квадратов игрового поля
    squareSideArr.length = 0;  // очистка массива сторон квадратов игрового поля
    squareSideIntersectionArr.length = 0;   // очистка массива пересечений смежных парных сторон квадратов

    for (let i = 0; i < GAME_MAP_ROWS; i++) {
      for (let j = 0; j < GAME_MAP_COLS; j++) {
        if (LEVEL_MAPS[level][i][j] === 1) {
          this.getSquareMarkup(level, i, j); 
        }
      }
    }
    // наполнение массива смежных парных сторон квадратов игрового поля
    let lenArr = squareSideArr.length;
    for (let i = 0; i < lenArr; i++) {
      for (let j = i; j < lenArr; j++) {
        if (i != j) {
          if ( (squareSideArr[i][0] == squareSideArr[j][0] &&  // ряд и столбец первой ячейки стороны одного квадрата
                squareSideArr[i][1] == squareSideArr[j][1] ) ||  // и ряд и столбец первой ячейки стороны другого квадрата
               (squareSideArr[i][0] == squareSideArr[j][8] &&  // ряд и столбец первой ячейки стороны одного квадрата
                squareSideArr[i][1] == squareSideArr[j][9]) ) // ряд и столбец последней ячейки стороны другого квадрата
          {
            // проверить, что ключи обеих смежных сторон входят в один квадрат
            if (this.checkSideKeysInSquare(squareSideArr[i][10], squareSideArr[j][10]))
            {
              squareSideIntersectionArr.push( [
                squareSideArr[i][10],  // ключ стороны одного квадрата 
                squareSideArr[j][10],  // ключ стороны другого квадрата
                squareSideArr[i][0],  // ряд общей ячейки 
                squareSideArr[i][1] ] ) // столбец общей ячейки
              continue  // перейти к следующей стороне - по индексу j
            }
          }   

          if ( (squareSideArr[i][8] == squareSideArr[j][0] &&  // ряд и столбец последней ячейки стороны одного квадрата
                squareSideArr[i][9] == squareSideArr[j][1]) ||  // и ряд и столбец первой ячейки стороны другого квадрата
               (squareSideArr[i][8] == squareSideArr[j][8] &&  // ряд и столбец последней ячейки стороны одного квадрата
                squareSideArr[i][9] == squareSideArr[j][9]) ) // ряд и столбец последней ячейки стороны другого квадрата
          {
            // проверить, что ячейка пересечения смежных сторон возможного квадрата
            // является одним из углов определенного квадрата
            if (this.checkSideKeysInSquare(squareSideArr[i][10], squareSideArr[j][10]))
            {
              squareSideIntersectionArr.push( [
                squareSideArr[i][10],  // ключ стороны одного квадрата 
                squareSideArr[j][10],  // ключ стороны другого квадрата
                squareSideArr[i][8],  // ряд общей ячейки
                squareSideArr[i][9] ] )  // столбец общей ячейки
              continue  // перейти к следующей стороне - по индексу j
            }      
          }   
        }
      }
    }
    // отсортировать массив пересечений сторон квадратов по первому столбцу
    // (по ключу первой из сторон пересечения)
    squareSideIntersectionArr.sort(function(a, b) { return a[0] - b[0] })
  }

  // проверить, что ключи обеих сторон входят в один квадрат
  checkSideKeysInSquare(fstSideKey, sndSideKey)  
  {
    let checkResult = false;  // результат проверки
    if (squareArr.some(row => row.includes(fstSideKey) && row.includes(sndSideKey))) 
      {  // оба ключа находятся в одной строке squareArr, 
         // т.е. две стороны находятся в одном квадрате
        checkResult = true;
      }
    return checkResult
  }

}


