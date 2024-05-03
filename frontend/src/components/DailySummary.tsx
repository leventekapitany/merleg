import styled from 'styled-components'

import { Measurement } from '../types'
import { DiffDetail } from '../utils/getDiffDetail'
import getDiffDetail from '../utils/getDiffDetail'

type Props = {
  data: Measurement[]
  diff?: DiffDetail
  timestamp: number
}

export default function DailySummary({ data, timestamp }: Props) {
  const dateText = new Date(timestamp).toLocaleDateString('hu-HU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  const diffData = getDiffDetail(
    data.length > 0 ? data.map(d => +d.diff).reduce((prev, curr) => prev + curr, 0) : 0,
  )

  return (
    <SummaryContainer>
      <DateContainer>{dateText}</DateContainer>
      <Weight>{data[0]?.weight} kg</Weight>
      <DiffContainer type={diffData.type}>
        <DiffText>{diffData.text}</DiffText>
        {diffData.type !== 'neutral' && <Unit>kg</Unit>}
      </DiffContainer>
    </SummaryContainer>
  )
}

const SummaryContainer = styled.div`
  display: grid;
  place-items: center;
  width: 100%;
`

const Weight = styled.span`
  font-size: 42px;
  font-weight: bold;
`

const DiffText = styled.span`
  font-size: 22px;
  font-weight: 500;
`

const Unit = styled.span`
  font-size: 14px;
  margin-left: 5px;
`

const DateContainer = styled.span`
  font-size: 18px;
  margin-bottom: 12px;
  font-weight: 500;
`

const DiffContainer = styled('div')<{ type: 'good' | 'neutral' | 'bad' }>`
  color: var(
    --${p =>
        ({
          good: 'green',
          neutral: 'blue',
          bad: 'red',
        })[p.type]}
  );
  display: flex;
  align-items: baseline;
`
