import getData from './getData'
import { Measurement } from './types'

export function getTestData(): Measurement[] {
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
export async function getDayData(date: Date, id: string): Promise<Measurement[]> {
  return getData(date, id) as unknown as Promise<Measurement[]>
}
