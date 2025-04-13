import express, { Request, Response } from 'express';
import { MainController } from './controllers/MainController';

const app = express();
const port = process.env.PORT || 8000;
const pathToFront = __dirname + "/build/";

var cors = require("cors");
let corsOptions = {};
corsOptions = {
    origin: "http://localhost:3000",
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
};
app.use(express.static(pathToFront));
app.use(require("express-domain-middleware"));
app.use(express.json());
app.use(cors(corsOptions));

app.get('/', (req: Request, res: Response) => {
    console.log(pathToFront)
    return res.sendFile(pathToFront + '/index.html')
});
app.get("/getLlmResponse", (req: Request, res: Response) => {
    MainController.getLllResponse(req, res);
});
app.post("/getLlmResponse", (req: Request, res: Response) => {
    MainController.getLllResponse(req, res);
});


app.get("/getListOfTopicsByLanguage", (req: Request, res: Response) => {
  MainController.getListOfTopicsByLanguage(req, res);
});
app.post("/getListOfTopicsByLanguage", (req: Request, res: Response) => {
  MainController.getListOfTopicsByLanguage(req, res);
});


app.get("/getListOfPlacesByTag", (req: Request, res: Response) => {
  MainController.getListOfPlacesByTag(req, res);
});
app.post("/getListOfPlacesByTag", (req: Request, res: Response) => {
  MainController.getListOfPlacesByTag(req, res);
});

app.get("/getGigaEmbedding", (req: Request, res: Response) => {
  MainController.getGigaEmbedding(req, res);
});

app.get("/embeddingSearch", (req: Request, res: Response) => {
  MainController.embeddingSearch(req, res);
});
app.post("/embeddingSearch", (req: Request, res: Response) => {
  MainController.embeddingSearch(req, res);
});




app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
