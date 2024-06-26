import { Measurement } from './types'

const LAMBDA_URL = 'https://x6ow3ijrgjoq3hypydwbyv6bmi0qqbrw.lambda-url.eu-central-1.on.aws'

type MongoDoc = {
  date: Date
  weight: string
  battery: string
  stepdownOut: string
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getDataFromLambda(date: Date, id: string): Promise<Measurement[]> {
  const request = await fetch(LAMBDA_URL + `/?date=${date.toISOString()}&id=1`)

  const response = await request.json()

  const result = ((response.documents || []) as Record<string, string | Date>[]).map(d => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, ...doc } = d

    return doc
  }) as MongoDoc[]

  const mapped: Measurement[] = result.map(d => ({
    weight: Number(((id === '1' ? -1 * +d.weight : +d.weight) / 1000).toFixed(2)),
    battery: +d.battery,
    date: d.date,
    diff: 0,
  }))

  return mapped
    .map((d, idx) => ({
      ...d,
      diff: mapped[idx - 1] ? d.weight - mapped[idx - 1].weight : 0,
    }))
    .reverse()
}

export async function getDataFromMerlServer(date: Date, id: string): Promise<Measurement[]> {
  const params = {
    id,
    y: date.getFullYear().toString(),
    m: (date.getMonth() + 1).toString(),
    d: date.getDate().toString(),
  }

  const request = await fetch(
    'https://merl.hu/api/get?' + new URLSearchParams(Object.entries(params)),
  )

  const response = await request.json()

  const result = ((response || []) as Record<string, string | Date>[]).map(d => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, ...doc } = d

    return doc
  }) as MongoDoc[]

  const mapped: Measurement[] = result.map(d => ({
    weight: Number(((id === '1' ? -1 * +d.weight : +d.weight) / 1000).toFixed(2)),
    battery: +d.battery,
    date: d.date,
    diff: 0,
  }))

  return mapped
    .map((d, idx) => ({
      ...d,
      diff: mapped[idx - 1] ? d.weight - mapped[idx - 1].weight : 0,
    }))
    .reverse()
}

export async function getAllData(id: string): Promise<Measurement[]> {
  const request = await fetch('https://merl.hu/api/get')
  const response = await request.json()

  const result = ((response || []) as Record<string, string | Date>[]).map(d => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, ...doc } = d

    return doc
  }) as MongoDoc[]

  const mapped: Measurement[] = result.map(d => ({
    weight: Number(((id === '1' ? -1 * +d.weight : +d.weight) / 1000).toFixed(2)),
    battery: +d.battery,
    date: d.date,
    diff: 0,
  }))

  return mapped
    .map((d, idx) => ({
      ...d,
      diff: mapped[idx - 1] ? d.weight - mapped[idx - 1].weight : 0,
    }))
    .reverse()
}
