import React, { useEffect, useState } from 'react'

import { addDays, isSameDay, subDays } from 'date-fns'
import styled from 'styled-components'

import { getDayData } from '../api'
import SummaryElement from '../components/DailySummary'
import NavButton from '../components/NavButton'
import Table from '../components/Table'
import { Measurement } from '../types'

export default function Daily() {
  const [data, setData] = useState<Measurement[]>([])
  const [date, setDate] = useState(new Date())
  const [id, setId] = useState(localStorage.getItem('id') || '1')

  const isToday = isSameDay(new Date(), date)

  useEffect(() => {
    const fetchData = async () => {
      setData(await getDayData(date, id))
    }
    fetchData().then(() => {
      window.scrollTo(0, document.body.scrollHeight)
    })
  }, [date, id])

  useEffect(() => {
    console.log('scroll')
  }, [])

  const handleBackwardClick = () => {
    console.log('b')
    setDate(subDays(date, 1))
  }

  const handleForwardClick = () => {
    setDate(addDays(date, 1))
  }

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setId(e.target.value)
  }

  return (
    <Container>
      <Table data={data} />
      <Footer>
        <div onClick={() => handleBackwardClick()}>
          <NavButton left large />
        </div>
        <SummaryContainer>
          <SummaryElement data={data} timestamp={date.getTime()} />
        </SummaryContainer>
        <div onClick={() => handleForwardClick()}>{!isToday && <NavButton right large />}</div>
      </Footer>
      <Selector>
        <SelectorSelect name="id" onChange={handleSelect}>
          <option value="1">1. Dénes</option>
          <option value="2">2. Apa</option>
        </SelectorSelect>
      </Selector>
    </Container>
  )
}

const SummaryContainer = styled.div`
  width: 300px;
`

const Container = styled('div')`
  padding: 12px;
  display: flex;
  flex-flow: column;
  width: 100%;
  height: 100%;
  gap: 50px;
`

const Footer = styled('div')`
  display: flex;
  width: 100%;
  max-width: 600px;
  position: absolute;
  bottom: 50px;
  margin-left: auto;
`

const Selector = styled('div')`
  position: absolute;
  bottom: 10px;
  left: 20px;
  width: 50px;
  height: 50px;
  border: 2px solid var(--blue);
  border-radius: 20px;
  display: grid;
  place-items: center;
`

const SelectorSelect = styled('select')`
  width: 70%;
  background-color: transparent;
  aspect-ratio: 1;
  border: none;
`
