import { Request, Response } from "express";
import { startOfDay, endOfDay } from "date-fns";

import config from "./config";

export default async function getAll(req: Request, res: Response) {
  const mongoData = {
    dataSource: config.DATA_SOURCE,
    collection: config.COLLECTION,
    database: config.DB_NAME,
    filter: {},
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
