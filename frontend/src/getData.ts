const LAMBDA_URL = 'https://x6ow3ijrgjoq3hypydwbyv6bmi0qqbrw.lambda-url.eu-central-1.on.aws'

export default async function getData(date: Date, id: string) {
  const request = await fetch(LAMBDA_URL + `/?date=${date.toISOString()}&id=1`)

  const response = await request.json()

  const result = ((response.documents || []) as Record<string, string>[]).map(d => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, ...doc } = d

    return doc
  })

  return result
}
