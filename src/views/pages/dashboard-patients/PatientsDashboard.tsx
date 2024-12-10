import { useState, Suspense, useEffect } from 'react'

import ChartsEmbedSDK from '@mongodb-js/charts-embed-dom'

import {
  AuthenticationService,
  FormDataLocation,
  FormDataService,
  FormTemplatesService,
  GetFormTemplate_Out,
  GetMultipleFormTemplate_Out
} from '@/tallulah-ts-client'
import { MongoDashboard } from '@/views/dashboards/MongoCharts'
import { APIProvider, Map } from '@vis.gl/react-google-maps'
import { Box, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import { MarkerWithInfoWindow } from '../patient-story/PatientStory'

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''

const CroPrDashboard = () => {
  const [chartToken, setChartToken] = useState('')
  const [formDataLocation, setFormDataLocation] = useState<FormDataLocation[]>([])
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('')
  const [formTemplates, setFormTemplates] = useState<GetFormTemplate_Out[]>([])

  const [chartSdk, setChartSdk] = useState(
    new ChartsEmbedSDK({
      baseUrl: 'https://charts.mongodb.com/charts-tallulah-dev-qbykdfm',
      getUserToken: getToken
    })
  )

  const fetchPublishedFormTemplate = async () => {
    try {
      const res: GetMultipleFormTemplate_Out = await FormTemplatesService.getAllFormTemplates()
      // filter the published state
      const filteredData = res.templates.filter((formTemplate: any) => formTemplate.state === 'PUBLISHED')
      setFormTemplates(filteredData)
      setSelectedTemplateId('All')

      // Initialize map
      fetchZipCodes(filteredData[0].id)
    } catch (err) {
      console.log(err)
    }
  }

  const fetchZipCodes = async (formTemplateId: string) => {
    try {
      const res = await FormDataService.getZipcodes(formTemplateId)

      setFormDataLocation(res.form_data_location)
    } catch (err) {
      console.log(err)
    }
  }

  async function getToken(force: boolean = false) {
    if (chartToken && !force) return chartToken
    const token = (await AuthenticationService.getChartTokenApi()).chart_token

    setChartToken(token)

    return token
  }

  const handleMarkerClick = (form_data_id: string) => {}

  useEffect(() => {
    fetchPublishedFormTemplate()
  }, [])

  return (
    <div>
      <InputLabel id='form-template-select-label'>Form templates</InputLabel>
      <Select
        labelId='form-template-select-label'
        id='form-template-select'
        value={selectedTemplateId}
        label='Templates'
        onChange={(event: SelectChangeEvent) => {
          setSelectedTemplateId(event.target.value as string)
          fetchZipCodes(event.target.value as string)
        }}
      >
        <MenuItem key={'0'} value={'All'}>
          All
        </MenuItem>
        {formTemplates.map(formTemplate => (
          <MenuItem key={formTemplate.id} value={formTemplate.id}>
            {formTemplate.name}
          </MenuItem>
        ))}
      </Select>
      {formDataLocation.length > 0 && (
        <Box
          sx={{
            width: '100%',
            height: '400px',
            marginTop: '1rem'
          }}
        >
          <APIProvider apiKey={API_KEY}>
            <Map
              defaultCenter={{ lat: 44.5, lng: -89.5 }}
              defaultZoom={4}
              gestureHandling={'greedy'}
              disableDefaultUI={true}
              mapId={'429d97a6790fbaa6'}
            >
              {formDataLocation.length > 0 &&
                formDataLocation.map((formData, index) => (
                  <MarkerWithInfoWindow
                    key={formData.form_data_id}
                    position={{ lat: formData.location.latitude, lng: formData.location.longitude }}
                    city={formData.location.city}
                    handleOnClick={() => {
                      handleMarkerClick(formData.form_data_id)
                    }}
                  />
                ))}
            </Map>
          </APIProvider>
        </Box>
      )}
      <Box
        sx={{
          width: '100%',
          height: '400px',
          marginTop: '1rem'
        }}
      >
        <Suspense fallback={<div />}>
          <MongoDashboard
            width={'100%'}
            height={'800px'}
            filter={selectedTemplateId != 'All' ? { form_template_id: selectedTemplateId } : {}}
            dashboardId={'673b5e40-a897-4f8f-8060-b78c8f6e6e9a'}
            chartSdk={chartSdk}
          />
        </Suspense>
      </Box>
    </div>
  )
}

export default CroPrDashboard
