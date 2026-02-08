import { useCallback, useEffect, useRef, useState } from 'react'

import { Box, Button, CircularProgress, Grid, MenuItem, Select, Typography } from '@mui/material'

import {
  AdvancedMarker,
  APIProvider,
  CollisionBehavior,
  InfoWindow,
  Map,
  Marker,
  Pin,
  useAdvancedMarkerRef
} from '@vis.gl/react-google-maps'

import styles from './PatientStory.module.css'
import type {
  FormDataLocation,
  GetFormData_Out,
  GetFormTemplate_Out,
  GetMultipleFormData_Out,
  GetMultipleFormTemplate_Out
} from '@/tallulah-ts-client'
import { FormDataService, FormTemplatesService } from '@/tallulah-ts-client'
import SearchBar from '@/components/SearchBar'
import PatientDetailViewModal from './components/PatientDetailViewModal'
import CardTemplates from './components/CardTemplates'
import { TemplateNames } from './components/CardTemplates/CardTemplates'
import Filter from './components/Filter'
import FilterChip from './components/FilterChip'
import Sort from './components/Sort'

export interface IPatientStory {}

export type PatientStoryFilter = {
  name: string
  options: string[]
}

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''

export const MarkerWithInfoWindow = (props: any) => {
  const [markerRef, marker] = useAdvancedMarkerRef()
  const [infoWindowShown, setInfoWindowShown] = useState(false)

  const handleClose = useCallback(() => setInfoWindowShown(false), [])

  const handleMarkerClick = useCallback(() => setInfoWindowShown(isShown => !isShown), [])

  return (
    <>
      <AdvancedMarker position={props.position} ref={markerRef} onClick={handleMarkerClick} />
      {infoWindowShown && (
        <InfoWindow anchor={marker} onClose={handleClose}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {props.city}
            <Button onClick={props.handleOnClick}>View Details</Button>
          </Box>
        </InfoWindow>
      )}
    </>
  )
}

const PatientStory: React.FC<IPatientStory> = ({}) => {
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [searchText, setSearchText] = useState<string | undefined>(undefined)
  const [formData, setFormData] = useState<GetFormData_Out[]>([])
  const [filteredData, setFilteredData] = useState<GetFormData_Out[]>([]) // filteredData is a subset of formData
  const [formTemplate, setFormTemplate] = useState<GetFormTemplate_Out>()
  const [selectedPatientData, setSelectedPatientData] = useState<GetFormData_Out>()
  const [isFormTemplateFetching, setIsFormTemplateFetching] = useState<boolean>(false)
  const [isFormDataFetching, setIsFormDataFetching] = useState<boolean>(false)
  const [selectedFilter, setSelectedFilter] = useState<any>({})
  const [publishedTemplateList, setPublishedTemplateList] = useState<GetFormTemplate_Out[]>([])
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('')
  const [sortKey, setSortKey] = useState<string>('creation_time')
  const [sortDirection, setSortDirection] = useState<number>(-1)
  const [formDataLocation, setFormDataLocation] = useState<FormDataLocation[]>([])
  const [filterHasVideo, setFilterHasVideo] = useState<boolean | null>(null)
  const [page, setPage] = useState<number>(0)
  const [showNext, setShowNext] = useState<boolean>(true)

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const templateNameString = formTemplate?.card_layout?.name || 'TEMPLATE0'
  const templateNameEnum = TemplateNames[templateNameString as keyof typeof TemplateNames]

  const getFilterObjects = () => {
    const fields = formTemplate?.field_groups?.flatMap(fieldGroup => fieldGroup.fields)
    const filterObject: PatientStoryFilter[] = []

    fields?.forEach(field => {
      if (field?.type === 'SELECT' || field?.type === 'RADIO' || field?.type === 'CHECKBOX') {
        const options = field?.options || []

        filterObject.push({ name: field.name, options })
      }
    })

    return filterObject
  }

  const getVideoKey = () => {
    // from formTemplate get the key of the video field
    const fields = formTemplate?.field_groups?.flatMap(fieldGroup => fieldGroup.fields)
    const videoField = fields?.find(field => field?.type === 'VIDEO')

    return videoField?.name || ''
  }

  const fetchFormData = async (formId: string, page: number = 0) => {
    setIsFormDataFetching(true)

    try {
      const filterFormTemplateId = formId
      const filterSkip = page * 200
      const filterLimit = 200
      const filterSortKey = sortKey
      const filterSortDirection = sortDirection

      const filterRequestBody = {
        kv: selectedFilter,
        values_present: filterHasVideo ? [getVideoKey()] : null
      }

      const res: GetMultipleFormData_Out = await FormDataService.getAllFormData(
        filterFormTemplateId,
        filterSkip,
        filterLimit,
        filterSortKey,
        filterSortDirection,
        filterRequestBody
      )

      if (res.form_data.length < filterLimit) {
        setShowNext(false)
      } else {
        setShowNext(true)
      }

      if (page > 0) {
        setFormData([...formData, ...res.form_data])
        setFilteredData([...filteredData, ...res.form_data])
      } else {
        setFormData(res.form_data)
        setFilteredData(res.form_data)
      }
    } catch (err) {
      console.log(err)
    }

    setIsFormDataFetching(false)
  }

  const fetchPublishedFormTemplate = async () => {
    console.log('fetching published form template')
    setIsFormTemplateFetching(true)

    try {
      const res: GetMultipleFormTemplate_Out = await FormTemplatesService.getAllFormTemplates()

      console.log('res', res)

      // filter the published state
      const filteredData = res.templates.filter((formTemplate: any) => formTemplate.state === 'PUBLISHED')

      setPublishedTemplateList(filteredData)
      setSelectedTemplateId(filteredData[0].id)
      fetchZipCodes(filteredData[0].id)
      setFormTemplate(filteredData[0])
      fetchFormData(filteredData[0].id)
    } catch (err) {
      console.log(err)
    }

    setIsFormTemplateFetching(false)
  }

  const handleRefresh = () => {
    fetchPublishedFormTemplate()
  }

  const fetchSearchResults = async (text: string) => {
    setIsFormDataFetching(true)
    const res = await FormDataService.searchFormData(selectedTemplateId, text)
    const data = res.hits.hits.map((hit: any) => hit._id)
    const newfilteredData = formData.filter((item: GetFormData_Out) => data.includes(item.id))

    setFilteredData(newfilteredData)
    setIsFormDataFetching(false)
  }

  const handleSearchChange = (text: string) => {
    setSearchText(text)
  }

  const fetchZipCodes = async (formTemplateId: string) => {
    try {
      const res = await FormDataService.getZipcodes(formTemplateId)

      setFormDataLocation(res.form_data_location)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if (searchText === undefined) {
      return
    }

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }

    debounceTimer.current = setTimeout(() => {
      if (searchText === '' || searchText === undefined) {
        setFilteredData(formData)
      } else {
        fetchSearchResults(searchText)
      }
    }, 500) // 500ms delay
  }, [searchText]) // Effect runs on searchText change

  const handleCloseModal = () => {
    setOpenModal(false)
  }

  useEffect(() => {
    fetchPublishedFormTemplate()
  }, [])

  useEffect(() => {
    if (selectedTemplateId) {
      fetchFormData(selectedTemplateId)
    }
  }, [selectedFilter, filterHasVideo])

  useEffect(() => {
    if (selectedTemplateId) {
      fetchFormData(selectedTemplateId)
    }
  }, [sortKey, sortDirection])

  const handleMarkerClick = (form_data_id: string) => {
    const patientData = formData.find(data => data.id === form_data_id)

    if (patientData) {
      setOpenModal(true)
      setSelectedPatientData(patientData)
    }
  }

  const TemplateSelector = () => {
    return (
      <Box className={styles.templateSelectorDiv}>
        <Select
          labelId='demo-simple-select-label'
          id='demo-simple-select'
          value={selectedTemplateId}
          onChange={(event: any) => {
            setSelectedTemplateId(event.target.value as string)
            setFormDataLocation([])
            fetchZipCodes(event.target.value as string)

            // update new form template
            const selectedTemplate = publishedTemplateList.find(template => template.id === event.target.value)

            setFormTemplate(selectedTemplate)

            // fetch form data
            fetchFormData(event.target.value)

            // clear filters
            setSelectedFilter({})
            setPage(0)
          }}
          fullWidth
          sx={{
            backgroundColor: 'white',
            borderRadius: '5px',
            marginTop: '1rem'
          }}
        >
          {publishedTemplateList?.map(template => (
            <MenuItem key={template.id} value={template.id}>
              {template.name}
            </MenuItem>
          ))}
        </Select>
      </Box>
    )
  }

  const handleVideoFilterClick = (value: string) => {
    if (filterHasVideo === null && value === 'Yes') {
      setFilterHasVideo(true)
    } else if (filterHasVideo === null && value === 'No') {
      setFilterHasVideo(false)
    } else if (filterHasVideo === true && value === 'Yes') {
      setFilterHasVideo(null)
    } else if (filterHasVideo === true && value === 'No') {
      setFilterHasVideo(false)
    } else if (filterHasVideo === false && value === 'Yes') {
      setFilterHasVideo(true)
    } else if (filterHasVideo === false && value === 'No') {
      setFilterHasVideo(null)
    }
  }

  return (
    <Box className={styles.container}>
      <Box>
        <TemplateSelector />
      </Box>
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
      <Box className={styles.patientStoryContainer}>
        <Box className={styles.searchContainer}>
          <SearchBar
            placeholder='Search Patient By Name, Tags or Journey '
            searchText={searchText}
            handleSearchChange={handleSearchChange}
          />
        </Box>
        <Box className={styles.filterContainer}>
          <Filter
            filterObjects={getFilterObjects()}
            setSelectedFilter={setSelectedFilter}
            selectedFilter={selectedFilter}
            handleVideoFilter={handleVideoFilterClick}
          />
          <Sort
            sortDirection={sortDirection}
            setSortDirection={setSortDirection}
            sortKey={sortKey}
            setSortKey={setSortKey}
          />
        </Box>
        <Box>
          {/* get keys of selectedFilter and loop to disl;ay all the filter tags */}
          <Box
            className={styles.filterTagsContainer}
            sx={{
              display: 'flex',
              marginBottom: '1rem'
            }}
          >
            {Object.keys(selectedFilter).map(key =>
              selectedFilter[key].map((tag: string) => {
                return (
                  <Box key={key} className={styles.filterTag}>
                    <FilterChip filterTag={tag} filterKey={key} setFilters={setSelectedFilter} />
                  </Box>
                )
              })
            )}
            {filterHasVideo !== null ? (
              <Box key={'video'} className={styles.filterTag}>
                <FilterChip
                  filterTag={filterHasVideo ? 'Video Present' : 'No Video'}
                  filterKey={'Video'}
                  onClose={() => {
                    setFilterHasVideo(null)
                  }}
                />
              </Box>
            ) : null}
          </Box>
        </Box>

        {isFormTemplateFetching || isFormDataFetching ? (
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              marginY: '2rem'
            }}
          >
            <CircularProgress />
            <Typography
              variant='h6'
              sx={{
                marginLeft: '1rem'
              }}
            >
              Loading...
            </Typography>
          </Box>
        ) : null}

        {filteredData.length === 0 && !isFormTemplateFetching && !isFormDataFetching ? (
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              marginY: '2rem'
            }}
          >
            <Typography
              variant='h6'
              sx={{
                marginLeft: '1rem'
              }}
            >
              No Patient Story Found
            </Typography>
          </Box>
        ) : null}

        <Grid container spacing={3}>
          {filteredData?.map((patientData: GetFormData_Out) => (
            <Grid
              item
              key={patientData.id}
              xs={12}
              sm={6}
              md={6}
              lg={6}
              onClick={() => {
                setOpenModal(true)
                setSelectedPatientData(patientData)
              }}
              className={styles.patientCardGridItem}
            >
              <CardTemplates data={patientData} templateName={templateNameEnum} formTemplate={formTemplate} />
            </Grid>
          ))}
        </Grid>
        {showNext && !isFormDataFetching ? (
          <Grid container justifyContent='flex-end'>
            <Button
              variant='contained'
              color='primary'
              sx={{
                marginTop: '1rem',
                marginBottom: '2rem'
              }}
              onClick={() => {
                fetchFormData(selectedTemplateId, page + 1)
                setPage(page + 1)
              }}
            >
              Show More
            </Button>
          </Grid>
        ) : null}
        {selectedPatientData ? (
          <PatientDetailViewModal
            openModal={openModal}
            handleCloseModal={handleCloseModal}
            data={selectedPatientData as GetFormData_Out}
            handleRefresh={handleRefresh}
          />
        ) : null}
      </Box>
    </Box>
  )
}

export default PatientStory
