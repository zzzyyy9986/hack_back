export class MyTestQueue {
  public listOfHandlers: Array<() => Promise<any>>;
  public listOfWaitingHandlers: Array<() => Promise<any>>;
  public isRunning = false;
  public concurrency: number;
  public count: number = 0;
  constructor(concurrency: number) {
    this.listOfHandlers = [];
    this.listOfWaitingHandlers = [];
    this.concurrency = concurrency;
  }

  public static channels(concurrency: number) {
    return new MyTestQueue(concurrency);
  }
  public async addAndRun(f: () => Promise<any>) {
    if (this.listOfHandlers.length < this.concurrency) {
      this.listOfHandlers.push(f);
      if (this.count < this.concurrency) {
        this.count++;
        this.runner();
      }
    } else if (this.listOfHandlers.length === this.concurrency) {
      this.listOfWaitingHandlers.push(f);
    }
  }
  public async runner(f: () => Promise<any> = this.listOfHandlers.shift()) {
    try {
      await f();
      // this.listOfHandlers.shift();
      // this.listOfHandlers.shift();
      if (this.listOfHandlers.length || this.listOfWaitingHandlers.length) {
        /**
         * Добавляем из массива waiting. Одно место уже освободилось(shift выше)
         */
        if (this.listOfWaitingHandlers.length) {
          this.listOfHandlers.push(this.listOfWaitingHandlers.shift());
        }
        this.runner();
      } else {
        console.log("Нет функция для вызова!");
        console.log("Длин списка - " + this.listOfHandlers.length);
        this.count--;
        return;
      }
    } catch (e) {
    //   await LogService.log(message);
    }
  }
}

function doSomethingAsync(delay: number) {
  return timeoutPromise(delay);
}
function timeoutPromise(time) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve(Date.now());
    }, time);
  });
}

function testQueue() {
  const q = MyTestQueue.channels(2);
  let start = Date.now();
  q.addAndRun(async () => {
    console.log("Начинаю запрос 1");
    const res = (await doSomethingAsync(1000)) as number;
    const res2 = (await doSomethingAsync(2000)) as number;
    console.log("Закончил запрос 1 - " + (res - start));
  });
  q.addAndRun(async () => {
    console.log("Начинаю запрос 2");
    // throw new Error("какая-то ошибка");
    const res = (await doSomethingAsync(1000)) as number;
    console.log("Закончил запрос 2 -" + (res - start));
  });
  q.addAndRun(async () => {
    console.log("Начинаю запрос 3");
    const res = (await doSomethingAsync(1000)) as number;
    console.log("Закончил запрос 3 - " + (res - start));
  });
}


export class MyCurrentQueue{
    private static currentQueue: MyTestQueue = null;
    constructor() {
       
    }
    /**
     * Получить текущую очередь
     * @returns 
     */
    public static getService() {
        if (!this.currentQueue) {
            this.currentQueue = new MyTestQueue(1)
        }
        return this.currentQueue
        
    }
}
