import { Box, CircularProgress, Grid, Typography } from '@mui/material';
import styles from './StaticDashboard.module.css';
import {
  DashboardTemplatesService,
  DashboardWidget,
  FormTemplatesService,
  GetDashboardTemplate_Out,
  GetFormTemplate_Out,
  GetMultipleFormTemplate_Out
} from '@/tallulah-ts-client';
import { useEffect, useState } from 'react';
import DashboardItem from '../DashboardItem';
import { set } from 'date-fns';

export interface IStaticDashboard {
  sampleTextProp?: string;
}

export interface IDashboardTemplate extends GetDashboardTemplate_Out {
  response?: any;
  isResponseLoading?: boolean;
}

const StaticDashboard: React.FC<IStaticDashboard> = ({ sampleTextProp }) => {
  const [formTemplates, setFormTemplates] = useState<GetFormTemplate_Out[]>([]);
  const [selectedFormTemplate, setSelectedFormTemplate] = useState<GetFormTemplate_Out | null>(null);
  const [dashboardTemplates, setDashboardTemplates] = useState<IDashboardTemplate[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchPublishedFormTemplate = async () => {
    try {
      const res: GetMultipleFormTemplate_Out = await FormTemplatesService.getAllFormTemplates();
      // filter the published state
      const filteredData: GetFormTemplate_Out[] = res.templates.filter(
        (formTemplate) => formTemplate.state === 'PUBLISHED'
      );
      setFormTemplates(filteredData);
      setSelectedFormTemplate(filteredData[0]);
    } catch (err) {
      console.log(err);
    }
  };

  const executeDashboardTemplates = async (templates: any) => {
    setIsLoading(true);
    for (const dashboardTemplate of templates) {
      try {
        const res: GetDashboardTemplate_Out = await DashboardTemplatesService.executeDashboardTemplate(
          dashboardTemplate.id,
          dashboardTemplate.repository_id
        );
        setDashboardTemplates((prev) => {
          return prev.map((template) => {
            if (template.id === dashboardTemplate.id) {
              return {
                ...template,
                response: res,
                isResponseLoading: false
              };
            }
            return template;
          });
        });
      } catch (err) {
        console.log(err);
      }
    }
    setIsLoading(false);
  };

  const fetchDashboardTemplates = async () => {

    if (selectedFormTemplate === null) {
      return;
    }

    const res :GetDashboardTemplate_Out[] = await DashboardTemplatesService.getDashboardTemplates(selectedFormTemplate.id);
    const dashboardTemplates = res.map((dashboardTemplate) => {
      return {
        ...dashboardTemplate,
        isResponseLoading: false
      };
    });
    // filter out the overview dashboard
    const staticDashboardTemplate = res.filter((dashboardTemplate) => dashboardTemplate.name === 'Overview');
    setDashboardTemplates(staticDashboardTemplate);
    executeDashboardTemplates(staticDashboardTemplate);

  };

  useEffect(() => {
    if (selectedFormTemplate !== null) {
      fetchDashboardTemplates();
    }

  }, [selectedFormTemplate]);

  useEffect(() => {
    fetchPublishedFormTemplate();
  }, []);

  const getResponseObject = (dashboard: IDashboardTemplate, widget: DashboardWidget) => {
    if (dashboard.response) {
      return dashboard.response[widget.name];
    }
    return null;
  };

  return (
    <Box>
      {dashboardTemplates.map((dashboard: IDashboardTemplate) => (
        <Box key={dashboard.id} className={styles.outerDashboardDiv}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'center',
              marginBottom: '20px'
            }}
          >
            <Typography variant="h5">{dashboard?.name}</Typography> 
            {isLoading && <CircularProgress sx={{ margin: '20px' }} />}
          </Box>
          <Grid container spacing={4}
          >
            {/* First Grid Item */}
            <Grid
              item
              xs={12}
              md={6}
            >
              <Box
                sx={{
                  display: 'flex',
                  height: '100%',
                  flexDirection: 'column',
                  gap: '15px',
                  justifyContent: 'space-between',

                }}
              >
                {/* Display first 2 widgets here */}
                {dashboard?.layout?.widgets?.slice(0, 2).map((widget: DashboardWidget, index: number) => (
                  <Box key={`widget-1-${index}`} sx={{
                    height: '100%'
                  }}>
                    <DashboardItem widget={widget} response={getResponseObject(dashboard, widget)} />
                  </Box>
                ))}
              </Box>
            </Grid>

            {/* Second Grid Item */}
            <Grid
              item
              xs={12}
              md={6}
            >
              <Box
              >
                {/* Display next 2 widgets here */}
                {dashboard?.layout?.widgets?.slice(2, 4).map((widget: DashboardWidget, index: number) => (
                  <Box key={`widget-2-${index}`}>
                    <DashboardItem widget={widget} response={getResponseObject(dashboard, widget)} />
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Box>
      ))}
    </Box>
  );
};

export default StaticDashboard;
