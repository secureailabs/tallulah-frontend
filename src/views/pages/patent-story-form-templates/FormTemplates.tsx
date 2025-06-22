'use client'

import { FormTemplatesService, GetFormTemplate_Out } from '@/tallulah-ts-client'
import styles from './FormTemplates.module.css'
import { useEffect, useState } from 'react'
import { Box, Button, Typography, useRadioGroup } from '@mui/material'
import AppStripedDataGrid from '@/components/AppStripedDataGrid'
import { GridColDef } from '@mui/x-data-grid'
import { useRouter } from 'next/navigation'
import { set } from 'date-fns'
// import { useNavigate } from 'react-router-dom';

export interface IFormTemplates {
  sampleTextProp?: string
}

const FormTemplates: React.FC<IFormTemplates> = () => {
  const [formTemplates, setFormTemplates] = useState<GetFormTemplate_Out[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [userId, setUserId] = useState<string>('')

  // get logged in user data
  useEffect(() => {
    const user_info = localStorage.getItem('user_info')
    if (user_info) {
      const info = JSON.parse(user_info)
      setUserId(info.id)
    }
  }, [])

  // const navigate = useNavigate();

  const router = useRouter()

  const fetchFormTemplates = async () => {
    try {
      const res = await FormTemplatesService.getAllFormTemplates()
      setFormTemplates(res.templates)
      console.log(res)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchFormTemplates()
  }, [])

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerClassName: 'table--header',
      headerName: 'Name',
      flex: 1,
      sortable: false,
      renderCell: params => <Typography variant='body1'>{params.row.name}</Typography>
    },
    {
      field: 'creation_time',
      headerClassName: 'table--header',
      headerName: 'Creation Time',
      flex: 1,
      sortable: false,
      renderCell: params => <Typography variant='body1'>{params.row.creation_time}</Typography>
    },
    {
      field: 'last_edit_time',
      headerClassName: 'table--header',
      headerName: 'Last Edit Time',
      flex: 1,
      sortable: false,
      renderCell: params => <Typography variant='body1'>{params.row.last_edit_time}</Typography>
    },
    {
      field: 'state',
      headerClassName: 'table--header',
      headerName: 'State',
      flex: 1,
      sortable: false,
      renderCell: params => <Typography variant='body1'>{params.row.state}</Typography>
    },
    {
      field: 'actions',
      headerClassName: 'table--header',
      headerName: 'Actions',
      flex: 1,
      sortable: false,
      renderCell: params => (
        <Box>
          <Button
            variant='text'
            color='primary'
            onClick={() => {
              // TODO
              // navigate(`/form-builder/${params.row.id}`);
              router.push(`/patient-story/form-builder/${params.row.id}`)
            }}
          >
            Edit
          </Button>
          {params.row.state === 'TEMPLATE' && (
            <Button
              variant='text'
              color='primary'
              disabled={isLoading}
              onClick={async () => {
                setIsLoading(true)
                try {
                  await FormTemplatesService.publishFormTemplate(params.row.id)
                  fetchFormTemplates()
                } catch (err) {
                  console.log(err)
                }
                setIsLoading(false)
              }}
            >
              Publish
            </Button>
          )}
          <Button
            variant='text'
            color='primary'
            disabled={isLoading}
            onClick={async () => {
              setIsLoading(true)
              try {
                if (params.row.email_subscription && params.row.email_subscription.includes(userId)) {
                  await FormTemplatesService.unsubscribeFormTemplate(params.row.id)
                } else {
                  await FormTemplatesService.subscribeFormTemplate(params.row.id)
                }
                fetchFormTemplates()
              } catch (err) {
                console.log(err)
              }
              setIsLoading(false)
            }}
          >
            {params.row.email_subscription && params.row.email_subscription.includes(userId)
              ? 'Unsubscribe'
              : 'Subscribe'}
          </Button>
        </Box>
      )
    }
  ]

  const handleNewFormTemplateClicked = () => {
    // TODO
    // navigate('/form-builder');
    router.push('/patient-story/form-builder')
  }

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: '10px'
        }}
      >
        <Button variant='contained' color='primary' onClick={handleNewFormTemplateClicked}>
          Add New Form Template
        </Button>
      </Box>
      <Box
        sx={{
          backgroundColor: '#fff',
          height: '600px'
        }}
      >
        {isLoading && (
          <Box
            className={styles.loading}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.5)'
            }}
          >
            <Typography variant='h5'>Publishing...</Typography>
          </Box>
        )}
        <AppStripedDataGrid autoPageSize={true} rows={formTemplates} columns={columns} />
      </Box>
    </Box>
  )
}

export default FormTemplates
