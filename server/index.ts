process.env.TZ = "Europe/Budapest";

import express from "express";

import measurement from "./measurement";
import get from "./get";

const app = express();
const port = process.env.PORT || 3000;

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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
