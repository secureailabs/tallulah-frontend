'use client';

import { useEffect, useState } from 'react';
import { Box, Button, Typography, Select, Paper, MenuItem, Divider, IconButton } from '@mui/material';
import styles from './DataExportRequests.module.css';
// import useNotification from 'src/hooks/useNotification';
import { ExportData_Out, OrganizationService } from '@/tallulah-ts-client';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { RefreshOutlined } from '@mui/icons-material';

const DataExportRequests = ({}) => {
  const [exportType, setExportType] = useState('json');
  const [exports, setExports] = useState<ExportData_Out[]>([]);

  // const [sendNotification] = useNotification();


  useEffect(() => {
    refresh();
  }, []);

  const refresh = async () => {
    setExports(await OrganizationService.getAllExportStatus());
  };

  const handleSubmitClick = async () => {
    var message = "Export requested successfully";
    var exportStatus = "success";
    try {
      const res = await OrganizationService.exportOrganizationData(exportType);
    } catch (e) {
      console.error(e);
      message = "Export request failed";
      exportStatus = "error";
    }
    // sendNotification({
    //   msg: message,
    //   variant: exportStatus,
    // });
    refresh();
  };

  const columns: GridColDef[] = [
    {
      field: 'id' ,
      headerName: 'SI',
      filterable: false,
      renderCell:(params:any) => params.api.getAllRowIds().indexOf(params.id)+1,
    },
    { field: 'request_time', headerName: 'Date',
      width: 200,
      renderCell: (params) => (
        new Date(params.row.request_time).toLocaleString()
      ),
    },
    { field: 'export_type', headerName: 'Type', width: 75 },
    { field: 'status', headerName: 'Status', width: 150 },
    { field: 'download_link', headerName: 'Download',
      renderCell: (params) => ( params.row.status === 'COMPLETED' ? (
        <Button
          variant="contained"
          color="primary"
          onClick={async () => {
            const res = await OrganizationService.downloadExport(params.row.id);
            window.open(res.url);
          }}
        >
          Download
        </Button>
      ) : 'Unavailable'
      ),
     },
  ];

  return (
    <Box className={styles.container}>
      <Typography variant="h3">Data Export Requests</Typography>
      <Box>
        <Typography>Request or download data export files</Typography>
      </Box>
      <Box mt={2}>
        <Select
          variant="standard"
          value={exportType}
          onChange={(e) => {console.log(e); setExportType(e.target.value as string)}}>
          <MenuItem value="json">JSON</MenuItem>
          <MenuItem value="csv">CSV</MenuItem>
        </Select>
        <Button variant="contained" color="primary" style={{ margin: '20px' }} onClick={handleSubmitClick}>
          Request New Data Export
        </Button>
      </Box>
      <Divider />
      <Box>
        <Typography variant="h4">Previously requested Data Exports
          <IconButton onClick={refresh}>
            <RefreshOutlined />
          </IconButton>
        </Typography>
      </Box>
      <Paper sx={{ marginTop: '20px', height: 400, width: '100%' }}>
      <DataGrid
        rows={exports}
        columns={columns}
        checkboxSelection={false}
        sx={{ border: 0 }}
      />
    </Paper>
    </Box>
  );
};

export default DataExportRequests;
