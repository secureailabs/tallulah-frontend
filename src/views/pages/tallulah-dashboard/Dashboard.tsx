'use client';

import { Box } from '@mui/material';
import styles from './Dashboard.module.css';
import PatientStoryDashboard from './components/PatientStoryDashboard';
import StaticDashboard from './components/StaticDashboard/StaticDashboard';

export interface IDashboard {}

const Dashboard: React.FC<IDashboard> = ({}) => {
  return (
    <Box>
      {/* Overview of all the dashboard */}
      {/* ------------- */}
      {/* Static Dashboard */}
      {/* ------------- */}

      <Box
        sx={{
          marginBottom:'50px'
        }}
      >
      <StaticDashboard />
      </Box>
      {/* Dynamic Dashboard */}
      <PatientStoryDashboard />
    </Box>
  );
};

export default Dashboard;
