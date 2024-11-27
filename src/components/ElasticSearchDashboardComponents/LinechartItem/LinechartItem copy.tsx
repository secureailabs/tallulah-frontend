import { LineChart } from '@mui/x-charts/LineChart';
import styles from './Linechartitem.module.css';
import { BarChart } from '@mui/x-charts/BarChart';
import { formatDateTimeEpoch } from '@/utils/helper';
import { Card, CardContent, CardHeader, useTheme } from '@mui/material';
import AppReactApexCharts from '@/libs/styles/AppReactApexCharts';
import { ApexOptions } from 'apexcharts';

export interface ILinechartitem {
  data_query: any;
  response?: any;
}

const Linechartitem: React.FC<ILinechartitem> = ({ response }) => {

  const response_array = Object.keys(response).map((key) => {
    return response[key];
  });

  const keys = response_array[0].buckets.map((bucket: any) => formatDateTimeEpoch(bucket.key));
  const counts = response_array[0].buckets.map((bucket: any) => bucket.doc_count);


  const series = [
    {
      name: 'Shipment',
      type: 'column',
      data: [38, 45, 33, 38, 32, 48, 45, 40, 42, 37]
    },
    {
      name: 'Delivery',
      type: 'line',
      data: [23, 28, 23, 32, 25, 42, 32, 32, 26, 24]
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
        width: [0, 3],
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
        categories: ['1 Jan', '2 Jan', '3 Jan', '4 Jan', '5 Jan', '6 Jan', '7 Jan', '8 Jan', '9 Jan', '10 Jan'],
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
        <CardHeader title='Shipment Statistics' subheader='Total number of deliveries 23.8k' />
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

export default Linechartitem;
