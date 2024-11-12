import { PieChart } from '@mui/x-charts/PieChart';
import styles from './PieChart.module.css';
import { Card, CardContent, CardHeader, useTheme } from '@mui/material';
import AppReactApexCharts from '@/libs/styles/AppReactApexCharts';
import { ApexOptions } from 'apexcharts';

export interface IPieChartItem {
  data_query: any;
  response?: any;
  cardHeader: string;
  cardSubHeader: string;
}

const PieChartItem: React.FC<IPieChartItem> = ({ response, cardHeader,cardSubHeader }) => {
  const theme = useTheme();

    const response_array = Object.keys(response).map((key) => {
    return response[key];
  });

  const data = response_array[0].buckets.map((bucket: any) => {
    return bucket.doc_count;
  });

  const labels = response_array[0].buckets.map((bucket: any) => {
    return bucket.key;
  }
  );

  const options: ApexOptions = {
    chart: {
      type: 'pie',
      parentHeightOffset: 0,
    },
    labels: labels,
    colors: [
      'var(--mui-palette-primary-main)',
      'var(--mui-palette-secondary-main)',
      'var(--mui-palette-warning-main)',
      'var(--mui-palette-info-main)',
    ],
    legend: {
      show: true,
      position: 'bottom',
      markers: {
        width: 8,
        height: 8,
        offsetY: 1,
        offsetX: theme.direction === 'rtl' ? 8 : -4,
      },
      height: 40,
      itemMargin: {
        horizontal: 10,
        vertical: 0,
      },
      fontSize: '15px',
      fontFamily: 'Open Sans',
      fontWeight: 400,
      labels: {
        colors: 'var(--mui-palette-text-primary)',
      },
      offsetY: 10,
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '14px',
        fontFamily: 'Open Sans',
        fontWeight: 'bold',
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
  };

  return (
    <Card>
      <CardHeader title={cardHeader} subheader={cardSubHeader} />
      <CardContent>
        <AppReactApexCharts
          id='pie-chart'
          type='pie'
          height={310}
          width='100%'
          series={data}
          options={options}
        />
      </CardContent>
    </Card>
  );
};

export default PieChartItem;
