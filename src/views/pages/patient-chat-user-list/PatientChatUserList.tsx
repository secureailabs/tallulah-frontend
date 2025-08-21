'use client'

// import { useNavigate, useParams } from 'react-router-dom';
import styles from './PatientChatUserList.module.css'
import {
  Context,
  FormDataService,
  FormTemplatesService,
  GetFormData_Out,
  GetFormTemplate_Out,
  GetMultipleFormData_Out,
  GetMultipleFormTemplate_Out,
  PatientChatService
} from '@/tallulah-ts-client'
import { useEffect, useRef, useState } from 'react'
import { Box, CircularProgress, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material'
import logo from '@/assets/images/array_insights_small.png'
import user_avatar from '@/assets/images/users/avatar-3.png'
import SearchBar from '@/components/SearchBar'
import Sort from '../patient-story/components/Sort'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'

export interface IPatientChat {
  sampleTextProp?: string
}

export const DynamicUserNameBreadCrumb = ({ match }: any) => {
  const id = match.params.id
  const [name, setName] = useState<string>('')

  const getName = (formData: any) => {
    if (formData?.values?.firstName) {
      return 'Patient Chat :' + ' ' + formData?.values?.firstName?.value + ' ' + formData?.values?.lastName?.value
    } else if (formData?.values?.name) {
      return 'Patient Chat :' + ' ' + formData?.values?.name?.value
    }
    return id
  }

  const fetchPatientFormDataById = async () => {
    try {
      const res = await FormDataService.getFormData(id as string)
      setName(getName(res))
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchPatientFormDataById()
  }, [])

  return <span>{name}</span>
}

const PatientChat: React.FC<IPatientChat> = ({ sampleTextProp }) => {
  const [chatId, setChatId] = useState('')
  const [chatHistory, setChatHistory] = useState<Context[] | undefined | null>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [formData, setFormData] = useState<GetFormData_Out[]>([])
  const [filteredData, setFilteredData] = useState<GetFormData_Out[]>([])
  const [isFormDataFetching, setIsFormDataFetching] = useState<boolean>(false)
  const [searchText, setSearchText] = useState<string | undefined>(undefined)
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('')
  const [formTemplates, setFormTemplates] = useState<GetFormTemplate_Out[]>([])
  const [sortDirection, setSortDirection] = useState<number>(-1)
  const [sortKey, setSortKey] = useState<string>('creation_time')

  // const navigate = useNavigate();

  const params = useParams()
  const id = params.id

  const router = useRouter()

  function findClosestValue(name: string, defValue: string, values: any, prefix?: string): string {
    if (!prefix) prefix = ''
    for (const key in values) {
      if (key.toLowerCase().includes(name.toLowerCase())) {
        return prefix + values[key].value
      }
    }
    return defValue
  }

  const getName = (formData: any) => {
    const closestName = findClosestValue('name', formData.id, formData?.values)
    if (formData?.values?.firstName) {
      return formData?.values?.firstName?.value + ' ' + formData?.values?.lastName?.value
    } else if (formData?.values?.name) {
      return formData?.values?.name?.value
    } else if (closestName) {
      return closestName
    }
    return formData.id
  }

  const fetchSearchResults = async (text: string) => {
    setIsLoading(true)
    const res = await FormDataService.searchFormData(selectedTemplateId, text)
    const data = res.hits.hits.map((hit: any) => hit._id)
    const newfilteredData = formData.filter((item: GetFormData_Out) => data.includes(item.id))
    setFilteredData(newfilteredData)
    setIsLoading(false)
  }

  const fetchFormData = async (formId: string) => {
    setIsLoading(true)
    try {
      const filterFormTemplateId = formId
      const filterSkip = 0
      const filterLimit = 200
      const filterSortKey = sortKey
      const filterSortDirection = sortDirection
      const res: GetMultipleFormData_Out = await FormDataService.getAllFormData(
        filterFormTemplateId,
        filterSkip,
        filterLimit,
        filterSortKey,
        filterSortDirection
      )
      setFormData(res.form_data)
      setFilteredData(res.form_data)
    } catch (err) {
      console.log(err)
    }
    setIsLoading(false)
  }

  const startPatientChat = async () => {
    setIsLoading(true)
    try {
      const res = await PatientChatService.startPatientChat({
        form_data_id: id as string
      })
      setChatId(res.id)
      // strip the 0 index as it is the initial message from the assistant
      setChatHistory(res?.chat?.slice(1))
    } catch (error) {
      console.log(error)
    }
    setIsLoading(false)
  }

  const fetchPatientFormDataById = async () => {
    try {
      const res = await FormDataService.getFormData(id as string)
      startPatientChat()
    } catch (error) {
      console.log(error)
    }
  }

  const fetchPublishedFormTemplate = async () => {
    try {
      const res: GetMultipleFormTemplate_Out = await FormTemplatesService.getAllFormTemplates()
      // filter the published state
      const filteredData = res.templates.filter((formTemplate: any) => formTemplate.state === 'PUBLISHED')
      setFormTemplates(filteredData)
      setSelectedTemplateId(filteredData[0].id)
      fetchFormData(filteredData[0].id)
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

  const patientChatApi = async (promptText: string) => {
    setIsLoading(true)
    try {
      const res = await PatientChatService.patientChat(chatId as string, promptText)
      setChatHistory(res?.chat?.slice(1))
    } catch (error) {
      console.log(error)
    }
    setIsLoading(false)
  }

  const handleKeyPress = (p: string) => {
    patientChatApi(p)
  }

  useEffect(() => {
    if (id !== undefined) {
      fetchPatientFormDataById()
    } else {
      fetchPublishedFormTemplate()
    }
  }, [])

  const ConversationComponent = (
    <Box className={styles.conversationBox}>
      {chatHistory?.map((chat, index) =>
        chat.role === 'assistant' ? (
          <Box key={index} className={styles.assistantBox}>
            <Image src={logo} alt='Sail-Logo' width='30' />
            <div dangerouslySetInnerHTML={{ __html: chat.content }} />
          </Box>
        ) : (
          <Box key={index} className={styles.patientBox}>
            <Box className={styles.patientText}>{chat.content}</Box>
            <Image src={user_avatar} alt='Sail-Logo' width='30' />
          </Box>
        )
      )}
    </Box>
  )

  const handleSearchChange = (searchText: string) => {
    setSearchText(searchText)
  }

  const PatientSelectionComponent = (
    <Box className={styles.patientSelectionBox}>
      <Typography variant='h4' className={styles.patientSelectionBoxText}>
        Select a patient to begin
      </Typography>
      <InputLabel id='form-template-select-label'>Form templates</InputLabel>
      <Select
        labelId='form-template-select-label'
        id='form-template-select'
        value={selectedTemplateId}
        label='Templates'
        onChange={(event: SelectChangeEvent) => {
          setSelectedTemplateId(event.target.value as string)
          fetchFormData(event.target.value as string)
        }}
      >
        {formTemplates.map(formTemplate => (
          <MenuItem key={formTemplate.id} value={formTemplate.id}>
            {formTemplate.name}
          </MenuItem>
        ))}
      </Select>
      <Box className={styles.searchBarBox}>
        <SearchBar placeholder='Search Patient By Name ' searchText={''} handleSearchChange={handleSearchChange} />
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          marginBottom: '20px'
        }}
      >
        <Sort
          sortDirection={sortDirection}
          setSortDirection={setSortDirection}
          sortKey={sortKey}
          setSortKey={setSortKey}
        />
      </Box>

      {isLoading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <CircularProgress />
        </Box>
      ) : null}

      <Grid container spacing={3}>
        {filteredData?.map((patientData: GetFormData_Out) => (
          <Grid
            item
            key={patientData.id}
            xs={12}
            sm={3}
            md={3}
            lg={3}
            onClick={() => {
              // TODO
              // navigate(`/patient-chat/${patientData.id}`);
              router.push(`/patient-chat/${patientData.id}`)
            }}
            className={styles.patientCardGridItem}
          >
            <Box className={styles.patientNameSelectionCard}>
              <Typography variant='h6' className={styles.patientCardText}>
                {getName(patientData)}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  )

  useEffect(() => {
    if (selectedTemplateId) {
      fetchFormData(selectedTemplateId)
    }
  }, [sortKey, sortDirection])

  return <Box className={styles.container}>{PatientSelectionComponent}</Box>
}

export default PatientChat
