import { Card, CardContent, CardHeader, useTheme } from '@mui/material';
import styles from './BarchartItem.module.css';
import { BarChart } from '@mui/x-charts/BarChart';
import AppReactApexCharts from '@/libs/styles/AppReactApexCharts';
import { ApexOptions } from 'apexcharts';

export interface IBarchartItem {
  data_query: any;
  response?: any;
  cardHeader: string;
  cardSubHeader: string;
}

const BarchartItem: React.FC<IBarchartItem> = ({ response,cardHeader, cardSubHeader}) => {
  console.log('response', response);
  const response_array = Object.keys(response).map((key) => {
    return response[key];
  });

  const keys = response_array[0].buckets.map((bucket: any) => bucket.key);
  const counts = response_array[0].buckets.map((bucket: any) => bucket.doc_count);

  if (keys.every((key: any) => !isNaN(key))) {
    keys.sort((a: any, b: any) => a - b);
  }

  const series = [
    {
      name: 'Count',
      type: 'column',
      data: counts
    }
  ]

    const theme = useTheme()

    const options: ApexOptions = {
      chart: {
        type: 'line',
        stacked: false,
        parentHeightOffset: 0,
        toolbar: {
          show: false
        },
        zoom: {
          enabled: false
        }
      },
      markers: {
        size: 5,
        colors: '#fff',
        strokeColors: 'var(--mui-palette-primary-main)',
        hover: {
          size: 6
        },
        radius: 4
      },
      stroke: {
        curve: 'smooth',
        width: 3,
        lineCap: 'round'
      },
      legend: {
        show: true,
        position: 'bottom',
        markers: {
          width: 8,
          height: 8,
          offsetY: 1,
          offsetX: theme.direction === 'rtl' ? 8 : -4
        },
        height: 40,
        itemMargin: {
          horizontal: 10,
          vertical: 0
        },
        fontSize: '15px',
        fontFamily: 'Open Sans',
        fontWeight: 400,
        labels: {
          colors: 'var(--mui-palette-text-primary)'
        },
        offsetY: 10
      },
      grid: {
        strokeDashArray: 8,
        borderColor: 'var(--mui-palette-divider)'
      },
      colors: ['var(--mui-palette-warning-main)', 'var(--mui-palette-primary-main)'],
      fill: {
        opacity: [1, 1]
      },
      plotOptions: {
        bar: {
          columnWidth: '30%',
          borderRadius: 4,
          borderRadiusApplication: 'end'
        }
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        tickAmount: 10,
        categories: keys,
        labels: {
          style: {
            colors: 'var(--mui-palette-text-disabled)',
            fontSize: '13px',
            fontWeight: 400
          }
        },
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        }
      },
      yaxis: {
        tickAmount: 5,
        labels: {
          style: {
            colors: 'var(--mui-palette-text-disabled)',
            fontSize: '13px',
            fontWeight: 400
          }
        }
      }
    }

    return (
      <Card>
        <CardHeader title={cardHeader} subheader={cardSubHeader} />
        <CardContent>
          <AppReactApexCharts
            id='shipment-statistics'
            type='line'
            height={310}
            width='100%'
            series={series}
            options={options}
          />
        </CardContent>
      </Card>
    )
};

export default BarchartItem;
