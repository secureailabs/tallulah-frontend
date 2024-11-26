import { useState, Suspense } from 'react'

import ChartsEmbedSDK from '@mongodb-js/charts-embed-dom'

import { AuthenticationService } from '@/tallulah-ts-client'
import { MongoDashboard } from '@/views/dashboards/MongoCharts'

const CroPrDashboard = () => {
  const [chartToken, setChartToken] = useState('')

  const [chartSdk] = useState(
    new ChartsEmbedSDK({
      baseUrl: 'https://charts.mongodb.com/charts-tallulah-dev-qbykdfm',
      getUserToken: getToken
    })
  )

  async function getToken() {
    if (chartToken) return chartToken
    const token = (await AuthenticationService.getChartTokenApi()).chart_token

    setChartToken(token)

    return token
  }

  return (
    <div>
      <Suspense fallback={<div />}>
        <MongoDashboard
          width={'100%'}
          height={'800px'}
          filter={null}
          dashboardId={'673b5e40-a897-4f8f-8060-b78c8f6e6e9a'}
          chartSdk={chartSdk}
        />
      </Suspense>
    </div>
  )
}

export default CroPrDashboard
