import { Measurement } from './types'

function getTestData(): Measurement[] {
  return [...new Array(105)]
    .map(() => ({
      weight: Math.random() * 100 * 1000,
      date: new Date(),
      battery: 12,
      diff: 2,
    }))
    .reverse()
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getDayData(timestamp: number, id: string): Promise<Measurement[]> {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const result: Measurement[] =
    import.meta.env.MODE === 'test'
      ? getTestData()
      : await (await fetch(`http://165.232.65.144/api/get?y=${year}&m=${month}&d=${day}`)).json()

  const weightedDatas = result.map(data => ({
    ...data,
    weight: Math.round(data.weight / 100) / 10,
  }))

  const diffedDatas = weightedDatas.reverse().map((data, index) => ({
    ...data,
    diff: index ? +Number(data.weight - weightedDatas[index - 1].weight).toFixed(1) : 0,
  }))

  return diffedDatas.reverse()
}
