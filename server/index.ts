process.env.TZ = "Europe/Budapest";

import express, { Request } from "express";

import measurement from "./measurement";
import get from "./get";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// w - weight
// b - battery

type MeasurementQuery = {
  w?: string;
  b?: string;
};

app.get("/m", measurement);

app.get("/get", get);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
