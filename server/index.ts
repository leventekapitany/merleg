process.env.TZ = "Europe/Budapest";

import express, { Request } from "express";

const DATA_API_API_KEY =
  "22uskTag2QQsHgZyNaVdRAKfZd44fxrvn6qHkUFA6wOmAiuU6NtIdYwt6KldXX34";
const DATA_API_URL =
  "https://data.mongodb-api.com/app/data-lygoe/endpoint/data/v1/action/insertOne";

const database = "merleg";
const collection = "data";
const dataSource = "Cluster0";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// w - weight
// b - battery

type MeasurementQuery = {
  w?: string;
  b?: string;
};

app.get("/m", async (req: Request<{}, {}, {}, MeasurementQuery>, res) => {
  const params = req.query;

  const { w, b } = params;

  if (w === undefined || b === undefined) {
    return res.json({
      statusCode: 400,
      body: "missing parameters v or b",
    });
  }

  const mongoData = {
    dataSource,
    collection,
    database,
    document: {
      date: new Date(),
      ...params,
    },
  };

  console.log("start req");
  const request = await fetch(DATA_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Request-Headers": "*",
      "api-key": DATA_API_API_KEY,
    },
    body: JSON.stringify(mongoData),
  });

  if (request.ok) {
    return res.json({
      statusCode: 201,
      body: {
        message: "Document inserted successfully",
        params,
      },
    });
  }

  return res.json({
    statusCode: 500,
    body: JSON.stringify({
      error: JSON.stringify(await request.json()),
      params: req.params,
    }),
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
