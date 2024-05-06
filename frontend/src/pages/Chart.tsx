import { useEffect, useRef } from 'react'

import { IChartApi, ISeriesApi, createChart } from 'lightweight-charts'

import { Measurement } from '../types'

export default function Chart({ data }: { data: Measurement[] }) {
  const chart = useRef<IChartApi>()
  const lineSeries = useRef<ISeriesApi<'Line'>>()

  useEffect(() => {
    chart.current = createChart(document.body, { width: 400, height: 300 })
    lineSeries.current = chart.current.addLineSeries()
  }, [])

  useEffect(() => {
    lineSeries.current?.setData(
      (data || []).map(d => ({
        time: d.date.toISOString(),
        value: d.weight,
      })),
    )
  }, [data])
}
