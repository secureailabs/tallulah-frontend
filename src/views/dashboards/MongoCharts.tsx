'use client'

import { useEffect, useRef, useState } from 'react'

import type ChartsEmbedSDK from '@mongodb-js/charts-embed-dom'

export const MongoDashboard = ({
  filter,
  dashboardId,
  height,
  width,
  chartSdk
}: {
  filter: any
  dashboardId: string
  height?: string
  width?: string
  chartSdk: ChartsEmbedSDK
}) => {
  const chartDiv = useRef(null)
  const [rendered, setRendered] = useState(false)

  const [chart] = useState(
    chartSdk.createDashboard({
      dashboardId: dashboardId,
      height: height,
      width: width,
      theme: 'light',
      showAttribution: false,
      widthMode: 'scale',
      heightMode: 'scale'
    })
  )

  useEffect(() => {
    if (chartDiv && chartDiv.current) {
      chart
        .render(chartDiv.current)
        .then(() => setRendered(true))
        .catch(err => console.log('Error during Charts rendering.', err))
    }
  }, [chart, height, width])

  useEffect(() => {
    if (rendered && filter) {
      chart.setFilter(filter).catch(err => console.log('Error while filtering.', err))
    }
  }, [chart, filter, rendered])

  return chartDiv ? <div className='dashboard' ref={chartDiv}></div> : null
}

export const MongoChart = ({
  filter,
  chartId,
  height,
  width,
  chartSdk
}: {
  filter: any
  chartId: string
  height?: string
  width?: string
  chartSdk: ChartsEmbedSDK
}) => {
  const chartDiv = useRef(null)
  const [rendered, setRendered] = useState(false)

  const [chart] = useState(
    chartSdk.createChart({ chartId: chartId, height: height, width: width, theme: 'light', showAttribution: false })
  )

  useEffect(() => {
    if (chartDiv && chartDiv.current) {
      chart
        .render(chartDiv.current)
        .then(() => setRendered(true))
        .catch(err => console.log('Error during Charts rendering.', err))
    }
  }, [chart, height, width])

  useEffect(() => {
    if (rendered && filter) {
      chart.setFilter(filter).catch(err => console.log('Error while filtering.', err))
    }
  }, [chart, filter, rendered])

  return chartDiv ? <div className='chart' ref={chartDiv}></div> : null

  // return <div className='chart'></div>
}
