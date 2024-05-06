process.env.TZ = "Europe/Budapest";

import express from "express";
// @ts-ignore
import cors from "cors";

import measurement from "./measurement";
import get from "./get";
import getAll from "./getAll";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

// w - weight
// b - battery

type MeasurementQuery = {
  w?: string;
  b?: string;
};

app.post("/m", measurement);

app.get("/get", get);

app.get("/get-all", getAll);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
