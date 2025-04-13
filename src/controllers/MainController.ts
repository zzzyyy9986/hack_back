import express, { Request, Response } from "express";
import { Topics } from "../Models/Topics";
import { Places } from "../Models/Places";
import { GigaHelper } from "../helpers/GigaHelper";
import { dataWithEmbeddings } from "../db/dataWithEmbeddings";
import { MyCurrentQueue } from "../helpers/MyTestQueue";
interface IMatch {
  placeId: number;
  diff: number;
}

export class MainController {
  public static async getLllResponse(req: Request, res: Response) {
    const { spawnSync } = require("child_process");
    const search = req.body.value ?? "Добрый день! Хочу выбрать телефон";
    const uniqueId = req.body.uniqueId ?? 123123;

    // const chatKey = "1234";

    const pythonProcess = await spawnSync("python3", [
      "./src/python/main.py",
      uniqueId,
      search,
      'Испаснкий'
    ]);

    const result = pythonProcess.stdout?.toString()?.trim();
    const error = pythonProcess.stderr?.toString()?.trim();
    console.log(result);
    if (result) {
      res.send({
        data: { result },
      });
    } else {
      res.send({
        error,
      });
    }

    // process.stdout.on("data", function (data: any) {
    //   res.send(data.toString());
    // });
  }

  /**
   * Получить список актуальных тем по языку(этнической категории).
   * @param req
   * @param res
   */
  public static getListOfTopicsByLanguage(req: Request, res: Response) {
    const languageId = req.body.languageId ?? "ru";
    const listOfTopics = Topics.getListOfTopickByLanguge(languageId);
    res.send({
      data: { listOfTopics },
    });
  }
  /**
   * Получить список мест по тэгам
   * @param req
   * @param res
   */
  public static getListOfPlacesByTag(req: Request, res: Response) {
    const topicId = req.body.topicId ?? 7;
    const listOfPlaces = Places.getListOfPlacesByTag(topicId);
    res.send({
      data: { listOfPlaces },
    });
  }
  /**
   * Заполнять инфу об embeddings
   * @param req
   * @param res
   */
  public static async getGigaEmbedding(req: Request, res: Response) {
    const gigaRes: any = await GigaHelper.getGigaEmbedings("test");
    console.log(gigaRes);
    const finalRes = [];
    for (let i = 0; i < Places.data.length; i++) {
      // if (Places.data[i].id !== dataWithEmbeddings[i]?.id) {
      const giga = await GigaHelper.getGigaEmbedings(
        Places.data[i].description
      );
      console.log("Добавляю новое!!");
      finalRes.push({
        ...Places.data[i],
        embedding: giga["data"][0]["embedding"],
      });
    }
    if (1 > 2) {
      console.log("here!!");
      finalRes.push(dataWithEmbeddings);
      // }
    }
    res.send({
      data: finalRes,
    });
  }
  /**
   * Поиск по embedding
   * @param req
   * @param res
   */
  public static async embeddingSearch(req: Request, res: Response) {
        const { spawnSync } = require("child_process");
    var distance = require("compute-cosine-distance");
    const search = req.body.value ?? "Винодельня у моря";
    const currentQueue = MyCurrentQueue.getService();
    const giga = await currentQueue.addAndRun(async () => {
      const giga = await GigaHelper.getGigaEmbedings(search)
       console.log("here");
       console.log(giga);
       let bestMatch: IMatch[] = [];
       const bestMatchLenght = 3;
       dataWithEmbeddings.forEach((el) => {
         if (el.embedding) {
           let diff = distance(giga["data"][0]["embedding"], el.embedding);
           if (bestMatch.filter((a) => a.placeId == el.id).length) return false;
           bestMatch.push({
             placeId: el.id,
             diff,
           });
         } else {
           console.log(el.id);
         }
       });
       bestMatch.sort((a: IMatch, b: IMatch) => {
         if (a.diff > b.diff) return 1;
         else return -1;
       });
       console.log("Все совпадения");
       console.log(bestMatch);
       bestMatch = bestMatch.slice(0, bestMatchLenght);
       console.log("лучшие совпадения");
       console.log(bestMatch);
       bestMatch = bestMatch.filter((e) => e.diff < 0.241);
       const finalRes = dataWithEmbeddings
         .filter((el) => {
           return bestMatch.map((e) => e.placeId).includes(el.id);
         })
         .map((el) => {
           const tempEl = structuredClone(el);
           delete tempEl["embedding"];
          //  tempEl.description = result;

           return tempEl;
         });
       res.send({
         data: finalRes,
       });
    });
  }
}
