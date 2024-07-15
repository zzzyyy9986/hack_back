import express, { Request, Response } from 'express';

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

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
