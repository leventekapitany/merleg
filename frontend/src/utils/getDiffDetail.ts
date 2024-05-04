export type DiffDetail = {
  type: 'good' | 'neutral' | 'bad'
  text: string
}

export default function getDiffDetail(n: number): DiffDetail {
  const type = n > 0 ? 'good' : n < 0 ? 'bad' : 'neutral'

  return {
    type,
    text: {
      good: `+ ${n?.toFixed(2)}`,
      neutral: '-',
      bad: `- ${Math.abs(n).toFixed(2)}`,
    }[type],
  }
}
