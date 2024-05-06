import { Request, Response } from "express";
import { startOfDay, endOfDay } from "date-fns";

import config from "./config";

export default async function get(req: Request, res: Response) {
  const params = req.query;

  const { y, m, d } = params;

  if (y === undefined || m === undefined || d === undefined) {
    return res.json({
      statusCode: 400,
      body: "missing parameters y/m/d",
    });
  }

  const date = new Date();
  date.setFullYear(+y);
  date.setMonth(+m - 1);
  date.setDate(+d);

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

  const result = ((response.documents || []) as Record<string, string>[]).map(
    (d) => {
      const { _id, ...doc } = d;

      return doc;
    }
  );

  return res.json(result);
}
