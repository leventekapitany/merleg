import { useState } from 'react'

import styled from 'styled-components'

import Bolt from '../assets/bolt.svg'
import { Measurement } from '../types'
import getBatteryPercentage from '../utils/getBatteryPercentage'
import getDiffDetail, { DiffDetail } from '../utils/getDiffDetail'
import NavButton from './NavButton'

interface TableProps {
  data: Measurement[]
}

export default function Table({ data }: TableProps) {
  const [isExpanded, setIsExpanded] = useState<number | null>(null)

  const handleExpandClick = (index: number) => {
    if (index !== isExpanded) {
      setIsExpanded(index)
    } else {
      setIsExpanded(null)
    }
  }

  return (
    <Container>
      {data.map((item, index) => {
        const diff = getDiffDetail(item.diff)

        return (
          <Row key={index}>
            <Standard onClick={() => handleExpandClick(index)}>
              <StandardItem>
                <Time>
                  <TimeDate date={item.date} />
                  <NavButton down />
                </Time>
                <Weight>
                  <span>{item.weight}</span>
                  <Unit>kg</Unit>
                </Weight>
                <Diff type={diff.type}>
                  <span>{diff.text}</span>
                  {diff.type !== 'neutral' && <Unit>kg</Unit>}
                </Diff>
              </StandardItem>
            </Standard>
            <ExpandedPart isExpanded={isExpanded === index}>
              <ExpandedPartItem>
                <img src={Bolt} alt="Battery" />
                <span>
                  Akkumulátor feszültség: <strong>{item.battery}V</strong>
                </span>
              </ExpandedPartItem>
              <ExpandedPartItem>
                <img src={Bolt} alt="Battery" />
                <span>
                  Akkumulátor töltöttség szint:
                  <strong> {getBatteryPercentage(item.battery).toFixed(0)}%</strong>
                </span>
              </ExpandedPartItem>
            </ExpandedPart>
          </Row>
        )
      })}
    </Container>
  )
}

const TimeDate = ({ date }: { date: Date }) => (
  <span>
    {new Date(date).getHours().toString().padStart(2, '0')}
    {':'}
    {new Date(date).getMinutes().toString().padStart(2, '0')}
  </span>
)

const Container = styled('div')`
  height: 70vh;
  overflow-y: scroll;
  width: 100%;
  display: flex;
  flex-flow: column-reverse;
`

const Row = styled('div')`
  width: 100%;
  display: flex;
  flex-direction: column;
  border-top: 1px solid lightgrey;
`

const Time = styled('div')`
  display: flex;
  align-items: center;
  width: 30%;
  font-size: 18px;
`

const Weight = styled('div')`
  text-align: right;

  display: flex;
  gap: 4px;
  justify-content: flex-end;
  align-items: baseline;
  width: 40%;
  font-size: 32px;
`

const Diff = styled('div')<{ type: DiffDetail['type'] }>`
  width: 30%;
  color: var(
    --${p =>
        ({
          good: 'green',
          neutral: 'blue',
          bad: 'red',
        })[p.type]}
  );
  font-size: 18px;
  font-weight: 500;
`

const Unit = styled('span')`
  font-size: 16px;
`

const Standard = styled('div')`
  width: 100%;
  display: flex;
  z-index: 2;
  background-color: white;
`

const StandardItem = styled('div')`
  width: 100%;
  height: 80px;
  display: flex;
  place-items: center;
`

const ExpandedPart = styled('div')<{ isExpanded: boolean }>`
  width: 80%;
  margin: auto;
  height: ${p => (p.isExpanded ? '75px' : '0')};
  animation: expand 0.5s forwards;
  transition: height 0.5s;
  box-sizing: border-box;
`

const ExpandedPartItem = styled('div')`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: var(--lightgrey);
`
