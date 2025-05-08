'use client'

import { Box } from '@mui/material'
import styles from './Dashboard.module.css'
import PatientStoryDashboard from './components/PatientStoryDashboard'
import StaticDashboard from './components/StaticDashboard/StaticDashboard'
import { useEffect } from 'react'
import { AuthenticationService } from '@/tallulah-ts-client'

export interface IDashboard {}

const Dashboard: React.FC<IDashboard> = ({}) => {
  useEffect(() => {
    // If not authenticated, redirect to login page
    const accessToken = localStorage.getItem('access_token')
    if (!accessToken) {
      window.location.href = '/login'
    }
    // call /me api to get user info
    AuthenticationService.getCurrentUserInfo()
      .then(res => {
        console.log(res)
      })
      .catch(err => {
        console.log(err)
        // If token expired, redirect to login page
        if (err.response.status === 401) {
          window.location.href = '/login'
        }
      })
  }, [])
  return (
    <Box>
      {/* Overview of all the dashboard */}
      {/* ------------- */}
      {/* Static Dashboard */}
      {/* ------------- */}

      <Box
        sx={{
          marginBottom: '50px'
        }}
      >
        <StaticDashboard />
      </Box>
      {/* Dynamic Dashboard */}
      <PatientStoryDashboard />
    </Box>
  )
}

export default Dashboard
