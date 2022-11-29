// НАЗНАЧЕНИЕ: поддержка игровых часов
// РАЗРАБОТЧИК: Igor Nesiolovskiy

// структура игрового поля
class GameClock {

  // счетчик времени игры
  timeControl = {
    startTime: 0, // время начала начала измерения отрезка времени, милисекунд 
    stopTime: 0,  // время окончания измерения отрезка времени, милисекунд
    durationTime: 0, // длительность отрезка, мс
    gameTime: 0,  // время текущего сеанса игры
    castTime: ""  // кастомизированное время в ЧЧ:ММ:CC
  };
  
  runCodeBlock = this.timeMeasureReset();  // инициализировать счетчик времени

  // метод фиксирует начальную точку временного отрезка
  timeMeasureOn() {  
    this.timeControl.startTime = new Date().getTime();
  }

  // метод фиксирует конечную точку временного отрезка
  // и выполняет подсчеты прошедшего в игре чистого времени
  timeMeasureOff() {  
    this.timeControl.stopTime = new Date().getTime();
    this.timeControl.durationTime = this.timeControl.stopTime - this.timeControl.startTime;
    this.timeControl.gameTime = this.timeControl.gameTime + this.timeControl.durationTime;
    this.timeControl.castTime = this.timeMeasureFormat(this.timeControl.gameTime); 
  }

  // метод сбрасывает данные счетчика времени игры
  timeMeasureReset() {  
    this.timeControl.startTime = 0;
    this.timeControl.stopTime = 0;
    this.timeControl.durationTime = 0;
    this.timeControl.gameTime = 0; 
    this.timeControl.castTime = this.timeMeasureFormat(this.timeControl.gameTime); 
  }

  // метод кастомизирует время в милисекундах к виду ЧЧ:ММ:СС
  timeMeasureFormat (milliseconds) {
    let ss = Math.floor(milliseconds / 1000);
    let mm = Math.floor(ss / 60);
    let hh = Math.floor(mm / 60);
    ss = ss % 60;
    mm = mm % 60;
    return [hh.toString(), mm.toString().padStart(2,'0'), ss.toString().padStart(2,'0')].join(':');
  }
}

