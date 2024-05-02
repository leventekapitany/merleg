import { Request, Response } from "express";

import config from "./config";

export default async function measurement(req: Request, res: Response) {
  const params = req.body;

  const { w, b } = params;

  if (w === undefined || b === undefined) {
    return res.json({
      statusCode: 400,
      body: "missing parameters w or b",
    });
  }

  const mongoData = {
    dataSource: config.DATA_SOURCE,
    collection: config.COLLECTION,
    database: config.DB_NAME,
    document: {
      date: new Date(),
      ...params,
    },
  };

  console.log("start req");
  const request = await fetch(config.DATA_API_URL + "/insertOne", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Request-Headers": "*",
      "api-key": config.DATA_API_API_KEY,
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
}
