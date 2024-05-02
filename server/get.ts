import { Request, Response } from "express";
import { startOfDay, endOfDay } from "date-fns";

import config from "./config";

export default async function get(req: Request, res: Response) {
  const params = req.query;

  const { y, m, d } = params;

  if ([y, m, d].includes(undefined)) {
    return res.json({
      statusCode: 400,
      body: "missing parameters y/m/d",
    });
  }

  const date = new Date();

  const mongoData = {
    dataSource: config.DATA_SOURCE,
    collection: config.COLLECTION,
    database: config.DB_NAME,
    filter: {
      date: {
        $gte: startOfDay(date),
        $lte: endOfDay(date),
      },
    },
  };

  const request = await fetch(config.DATA_API_URL + "/find", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Request-Headers": "*",
      "api-key": config.DATA_API_API_KEY,
    },
    body: JSON.stringify(mongoData),
  });

  const response = await request.json();

  return res.json(response);
}
