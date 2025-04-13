export interface ITopic {
  id: number;
  name: string;
  embedding: number[];
}

export class Topics {
  public static languageTopics: {
    [key: string]: number[];
  } = {
    ir: [1, 8, 13, 14, 15, 18, 19, 20],
    ae: [1, 4, 8, 10],
    in: [4, 5, 10, 11],
    cn: [2, 6, 11, 13, 7],
  };
  public static data: ITopic[] = [
    {
      id: 1,
      name: "Горы",
      embedding: [],
    },
    {
      id: 2,
      name: "Яхтинг",
      embedding: [],
    },
    {
      id: 3,
      name: "Театры",
      embedding: [],
    },
    {
      id: 4,
      name: "Рафтинг, сплав по горным рекам",
      embedding: [],
    },
    {
      id: 5,
      name: "Сыграть свадьбу",
      embedding: [],
    },
    {
      id: 6,
      name: "Отметить День рождения",
      embedding: [],
    },
    {
      id: 7,
      name: "Винные экскурсии",
      embedding: [],
    },
    {
      id: 8,
      name: "Горнолыжный курорт",
      embedding: [],
    },
    {
      id: 9,
      name: "Деловой туризм",
      embedding: [],
    },
    {
      id: 10,
      name: "Семейный отдых",
      embedding: [],
    },
    {
      id: 11,
      name: "Экскурсии",
      embedding: [],
    },
    {
      id: 12,
      name: "Русская кухня",
      embedding: [],
    },
    {
      id: 13,
      name: "Шоппинг",
      embedding: [],
    },
    {
      id: 14,
      name: "Море+горы",
      embedding: [],
    },
    {
      id: 15,
      name: "Чёрное море",
      embedding: [],
    },
    {
      id: 16,
      name: "Азовское море",
      embedding: [],
    },
    {
      id: 17,
      name: "Сочи-Парк",
      embedding: [],
    },
    {
      id: 18,
      name: "Казино",
      embedding: [],
    },
    {
      id: 19,
      name: "Безопасность",
      embedding: [],
    },
    {
      id: 20,
      name: "Гостеприимство",
      embedding: [],
    },
    {
      id: 21,
      name: "Казаки",
      embedding: [],
    },
    {
      id: 22,
      name: "Сувениры",
      embedding: [],
    },
    {
      id: 23,
      name: "Санатории",
      embedding: [],
    },
    {
      id: 24,
      name: "Олимпийский парк",
      embedding: [],
    },
    {
      id: 25,
      name: "Атамань",
      embedding: [],
    },
    {
      id: 26,
      name: "Медицинский туризм",
      embedding: [],
    },
    {
      id: 27,
      name: "Дайвинг",
      embedding: [],
    },
    {
      id: 28,
      name: "Виндсёрфинг",
      embedding: [],
    },
    {
      id: 29,
      name: "Кайтсёрфинг",
      embedding: [],
    },
    {
      id: 45,
      name: "Отели",
      embedding: [],
    },
  ];

  /**
   * Получить список актуальных тем по языку
   */
  public static getListOfTopickByLanguge(lagnuageSymbol: string) {
    console.log(this.languageTopics[lagnuageSymbol]);
    const listOfFilterTopics = this.data
      .filter((el) => {
        return this.languageTopics[lagnuageSymbol].includes(el.id);
      })
      .map((el) => {
        return {
          name: el.name,
          id: el.id,
        };
      });
    return listOfFilterTopics;
  }
}
