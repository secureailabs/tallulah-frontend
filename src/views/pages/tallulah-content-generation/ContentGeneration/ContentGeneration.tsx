'use client';

import { Box, Button, Drawer, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import styles from './ContentGeneration.module.css';
import {
  ContentGenerationTemplatesService,
  ContentGenerationsService,
  GetContentGenerationTemplate_Out,
  GetMultipleContentGenerationTemplate_Out
} from '@/tallulah-ts-client';
import { useEffect, useState } from 'react';
import AppStripedDataGrid from '@/components/AppStripedDataGrid';
import { GridColDef, GridSelectionModel } from '@mui/x-data-grid';
import { formatReceivedTimeFull } from '@/utils/helper';
import ContentDetailView from './components/ContentDetailView';
// import useNotification from '@/hooks/useNotification';

export interface IContentGeneration {}

const resetPaginationData = {
  count: 0,
  next: 0,
  limit: 25
};

const ContentGeneration: React.FC<IContentGeneration> = ({}) => {
  const [contentGenerationTemplates, setContentGenerationTemplates] = useState<GetContentGenerationTemplate_Out[]>([]);
  const [generatedContent, setGeneratedContent] = useState<any[]>([]);
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [paginationData, setPaginationData] = useState(resetPaginationData);
  const [page, setPage] = useState<number>(1);
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<any>({});
  const [selectedTemplate, setSelectedTemplate] = useState<any>('all');
  // const [sendNotification] = useNotification();

  const fetchGeneratedContentForTemplates = async (templates: GetContentGenerationTemplate_Out[], offset = 0) => {
    setLoading(true);
    try {
      let allGeneratedContents: any[] = [];
      await Promise.all(
        templates.map(async (template) => {
          const content = await ContentGenerationsService.getAllContentGenerations(template.id, offset, resetPaginationData.limit);
          const generatedContents = content.content_generations;

          allGeneratedContents = [...allGeneratedContents, ...generatedContents];

          setPaginationData({
            count: content.count,
            limit: content.limit,
            next: content.next
          });
        })
      );
      allGeneratedContents.sort((a, b) => {
        return new Date(b.creation_time).getTime() - new Date(a.creation_time).getTime();
      });

      setRows(allGeneratedContents);
      setGeneratedContent(allGeneratedContents);
    } catch (error) {
      console.error('Error fetching generated content', error);
    }
    setLoading(false);
  };

  const fetchAllContentGenerartionTemplates = async () => {
    try {
      const response: GetMultipleContentGenerationTemplate_Out = await ContentGenerationTemplatesService.getAllContentGenerationTemplates();
      setContentGenerationTemplates(response.templates);
      fetchGeneratedContentForTemplates(response.templates);
    } catch (error) {
      console.error(error);
    }
  };

  const getTemplateName = (id: string) => {
    const template = contentGenerationTemplates.find((template) => template.id === id);
    return template?.name;
  };

  const handleTemplateChange = (event: any) => {
    setSelectedTemplate(event.target.value);
  };

  useEffect(() => {
    fetchAllContentGenerartionTemplates();
  }, []);

  useEffect(() => {
    let active = true;

    (async () => {
      if (!active) {
        return;
      }

      const newOffset = page * resetPaginationData.limit;
    })();

    return () => {
      active = false;
    };
  }, [page]);

  const getFirst2Entries = (data: any) => {
    return Object.entries(data).slice(0, 2);
  };

  const filterRowsByTemplate = (templateName: string) => {
    if (templateName === 'all') {
      setRows(generatedContent);
    } else {
      const template = contentGenerationTemplates.find((t) => t.name === templateName);
      if (template) {
        const filteredContent = generatedContent.filter((content) => content.template_id === template.id);
        setRows(filteredContent);
      }
    }
  };

  useEffect(() => {
    filterRowsByTemplate(selectedTemplate);
  }, [selectedTemplate]);

  const handleRefresh = () => {
    fetchAllContentGenerartionTemplates();
  };

  const handleRetry = async (id: string) => {
    setLoading(true);
    try {
      const response = await ContentGenerationsService.retryContentGeneration(id);
      fetchAllContentGenerartionTemplates();
      // sendNotification({
      //   msg: 'Content generation has been retried',
      //   variant: 'success'
      // });
    } catch (error) {
      console.error('Error retrying content generation', error);
      // sendNotification({
      //   msg: 'Error retrying content generation',
      //   variant: 'error'
      // });
    }
    setLoading(false);
  };

  const columns: GridColDef[] = [
    {
      field: 'Template Name',
      headerClassName: 'table--header',
      headerName: 'Name',
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <Typography
          variant="body1"
          sx={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '120ch',
            fontSize: '0.8rem'
          }}
        >
          {getTemplateName(params.row.template_id)}
        </Typography>
      )
    },
    {
      field: 'Created on',
      headerClassName: 'table--header',
      headerName: 'Created on',
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <Typography
          variant="body1"
          sx={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '120ch',
            fontSize: '0.8rem'
          }}
        >
          {formatReceivedTimeFull(params.row.creation_time)}
        </Typography>
      )
    },
    {
      field: 'Status',
      headerClassName: 'table--header',
      headerName: 'Status',
      flex: 0.75,
      sortable: false,
      renderCell: (params) => (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Typography
            variant="body1"
            sx={{
              fontSize: '0.6rem',
              padding: '5px',
              borderRadius: '5px',
              backgroundColor:
                params.row.state === 'DONE'
                  ? '#C9EAC8'
                  : params.row.state === 'ERROR'
                  ? '#f58c8c'
                  : params.row.state === 'RECEIVED'
                  ? '#AEDFF7'
                  : '#F8D7E9'
            }}
          >
            {params.row.state}
          </Typography>
          {params.row.state === 'ERROR' && <Button onClick={() => handleRetry(params.row.id)}>Retry</Button>}
        </Box>
      )
    },
    {
      field: 'Form values',
      headerClassName: 'table--header',
      headerName: 'Form values',
      flex: 1.5,
      sortable: false,
      renderCell: (params) => (
        <Typography
          variant="body1"
          sx={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '120ch',
            fontSize: '0.8rem'
          }}
        >
          <>
            {getFirst2Entries(params.row.values).map(([key, value]) => (
              <Typography key={key}>{`${key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}: ${value}`}</Typography>
            ))}
            {Object.keys(params.row.values).length > 2 && <Typography variant="body1">...</Typography>}
          </>
        </Typography>
      )
    },

    {
      field: 'Generated Content',
      headerClassName: 'table--header',
      headerName: 'Generated Content',
      flex: 1.5,
      sortable: false,
      renderCell: (params) => (
        <Typography
          variant="body1"
          sx={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '120ch',
            fontSize: '0.8rem'
          }}
        >
          {params.row.generated}
        </Typography>
      )
    },
    {
      field: 'Action',
      headerClassName: 'table--header',
      headerName: 'Action',
      flex: 0.75,
      sortable: false,
      renderCell: (params) => (
        <Button
          variant="outlined"
          onClick={() => {
            setOpenDrawer(true);
            setSelectedRow(params.row);
          }}
        >
          View
        </Button>
      )
    }
  ];

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '30px',
          marginTop: '50px'
        }}
      >
        <FormControl
          sx={{
            width: '200px',
            backgroundColor: 'white'
          }}
        >
          <InputLabel id="template-select-label">Select a Template</InputLabel>
          <Select labelId="template-select-label" value={selectedTemplate} label="Select a Template" onChange={handleTemplateChange}>
            <MenuItem key={'all'} value={'all'}>
              All
            </MenuItem>
            {contentGenerationTemplates.map((template: any) => (
              <MenuItem key={template.id} value={template.name}>
                {template.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box>
          <Button variant="contained" onClick={handleRefresh}>
            Refresh
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          backgroundColor: '#fff',
          marginTop: '50px',
          height: '700px'
        }}
      >
        <AppStripedDataGrid
          rows={rows}
          columns={columns}
          pagination
          pageSize={25}
          rowsPerPageOptions={[25]}
          rowCount={paginationData.count}
          paginationMode="server"
          onPageChange={(newPage: any) => {
            setPage(newPage);
          }}
          disableSelectionOnClick
          getRowId={(row: any) => row.id}
          getCellClassName={(params: any) => {
            return styles.cell;
          }}
          onRowClick={(params: any) => {}}
          loading={loading}
          keepNonExistentRowsSelected
          emptyRowsMessage="No data found. Kindly refresh."
        />
      </Box>
      <Drawer
        anchor="right"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        PaperProps={{
          sx: { width: '60%', padding: '20px 0 0 20px' }
        }}
      >
        <ContentDetailView data={selectedRow} getTemplateName={getTemplateName} />
      </Drawer>
    </Box>
  );
};

export default ContentGeneration;
