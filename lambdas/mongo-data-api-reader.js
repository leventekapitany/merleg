/* global fetch */

process.env.TZ = "Europe/Budapest";

const DATA_API_API_KEY =
  "22uskTag2QQsHgZyNaVdRAKfZd44fxrvn6qHkUFA6wOmAiuU6NtIdYwt6KldXX34";
const DATA_API_URL =
  "https://data.mongodb-api.com/app/data-lygoe/endpoint/data/v1/action/find";

const database = "merleg";
const collection = "data";
const dataSource = "Cluster0";

export const handler = async (event, context) => {
  const id = event.queryStringParameters?.id;
  const date = event.queryStringParameters?.date;

  if (!id || !date) {
    return {
      statusCode: 400,
      body: "missing parameters id or date",
    };
  }

  const startOfDay = new Date(date);
  startOfDay.setHours(0);
  startOfDay.setMinutes(0);
  startOfDay.setSeconds(0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23);
  endOfDay.setMinutes(59);
  endOfDay.setSeconds(59);

  const mongoData = {
    dataSource: dataSource,
    collection: collection,
    database: database,
    filter: {
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
      id,
    },
  };

  const request = await fetch(DATA_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Request-Headers": "*",
      "api-key": DATA_API_API_KEY,
    },
    body: JSON.stringify(mongoData),
  });

  const response = await request.json();

  return {
    statusCode: 200,
    body: JSON.stringify(response),
  };
};
