import { useEffect, useState, useMemo, useRef, Suspense } from 'react'

import {
  Card,
  CardContent,
  CardHeader,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography
} from '@mui/material'
import { APIProvider, Map, useMap, useMapsLibrary } from '@vis.gl/react-google-maps'

import classnames from 'classnames'

import { green } from '@mui/material/colors'

import { useTheme } from '@mui/material/styles'

import type { ApexOptions } from 'apexcharts'
import ChartsEmbedSDK from '@mongodb-js/charts-embed-dom'

import styles from './CroPrDashboard.module.css'
import Chip from '@/@core/components/mui/Chip'
import OptionMenu from '@/@core/components/option-menu'
import type { CustomAvatarProps } from '@/@core/components/mui/Avatar'
import CustomAvatar from '@/@core/components/mui/Avatar'
import type { ThemeColor } from '@/@core/types'
import ProjectTables from '@/views/dashboards/analytics/ProjectsTable'
import AppReactApexCharts from '@/libs/styles/AppReactApexCharts'
import tableStyles from '@core/styles/table.module.css'
import HorizontalWithSubtitle from '@/components/card-statistics/HorizontalWithSubtitle'
import { AuthenticationService } from '@/tallulah-ts-client'
import { MongoChart, MongoDashboard } from '@/views/dashboards/MongoCharts'

const projectList = [
  {
    id: 1,
    title: 'Diabetes Study',
    subtitle: 'Diet Survey',
    leader: 'Keni, Sanofi',
    avatar: '/images/logos/react-bg.png',
    avatarGroup: ['/images/avatars/1.png', '/images/avatars/2.png', '/images/avatars/3.png', '/images/avatars/4.png'],
    status: 78
  },
  {
    id: 2,
    leader: 'Owen, Merck',
    title: 'Exercise and Asthma',
    subtitle: '',
    avatar: '/images/logos/figma-bg.png',
    avatarGroup: ['/images/avatars/5.png', '/images/avatars/6.png'],
    status: 18
  },
  {
    id: 3,
    title: 'Mitochondrial',
    subtitle: 'Disease Panel',
    leader: 'Keith',
    avatar: '/images/logos/vue-bg.png',
    avatarGroup: ['/images/avatars/7.png', '/images/avatars/8.png', '/images/avatars/1.png', '/images/avatars/2.png'],
    status: 62
  },
  {
    id: 4,
    title: 'Heart Disease',
    subtitle: 'Survey',
    leader: 'Merline',
    avatar: '/images/icons/mobile-bg.png',
    avatarGroup: ['/images/avatars/3.png', '/images/avatars/4.png', '/images/avatars/5.png', '/images/avatars/6.png'],
    status: 8
  },
  {
    id: 5,
    leader: 'Harmonia',
    title: 'Diabetes Registry',
    subtitle: 'Screening',
    avatar: '/images/logos/python-bg.png',
    avatarGroup: ['/images/avatars/7.png', '/images/avatars/8.png', '/images/avatars/1.png'],
    status: 36
  },
  {
    id: 6,
    leader: 'Allyson',
    title: 'Blockchain Website',
    subtitle: 'Sketch Project',
    avatar: '/images/logos/sketch-bg.png',
    avatarGroup: ['/images/avatars/2.png', '/images/avatars/3.png', '/images/avatars/4.png', '/images/avatars/5.png'],
    status: 92
  },
  {
    id: 7,
    title: 'Hoffman Website',
    subtitle: 'HTML Project',
    leader: 'Georgie',
    avatar: '/images/logos/html-bg.png',
    avatarGroup: ['/images/avatars/6.png', '/images/avatars/7.png', '/images/avatars/8.png', '/images/avatars/1.png'],
    status: 88
  },
  {
    id: 8,
    title: 'eCommerce Website',
    subtitle: 'React Project',
    leader: 'Eileen',
    avatar: '/images/logos/react-bg.png',
    avatarGroup: ['/images/avatars/1.png', '/images/avatars/2.png', '/images/avatars/3.png', '/images/avatars/4.png'],
    status: 78
  },
  {
    id: 9,
    leader: 'Owen',
    title: 'Retro Logo Design',
    subtitle: 'Figma Project',
    avatar: '/images/logos/figma-bg.png',
    avatarGroup: ['/images/avatars/5.png', '/images/avatars/6.png'],
    status: 18
  },
  {
    id: 10,
    title: 'Admin Dashboard',
    subtitle: 'VueJs Project',
    leader: 'Keith',
    avatar: '/images/logos/vue-bg.png',
    avatarGroup: ['/images/avatars/7.png', '/images/avatars/8.png', '/images/avatars/1.png', '/images/avatars/2.png'],
    status: 62
  }
]

const projectListOld = [
  {
    id: 1,
    title: 'Breast Cancer',
    subtitle: 'Clinical Trial',
    leader: 'Eileen',
    avatar: '/images/logos/react-bg.png',
    avatarGroup: ['/images/avatars/1.png', '/images/avatars/2.png', '/images/avatars/3.png', '/images/avatars/4.png'],
    status: 78
  },
  {
    id: 2,
    leader: 'Owen',
    title: 'Lupus Clinical Trial',
    subtitle: '',
    avatar: '/images/logos/figma-bg.png',
    avatarGroup: ['/images/avatars/5.png', '/images/avatars/6.png'],
    status: 18
  },
  {
    id: 3,
    title: 'Mitochondrial',
    subtitle: 'Disease Panel',
    leader: 'Keith',
    avatar: '/images/logos/vue-bg.png',
    avatarGroup: ['/images/avatars/7.png', '/images/avatars/8.png', '/images/avatars/1.png', '/images/avatars/2.png'],
    status: 62
  },
  {
    id: 4,
    title: 'Heart Disease',
    subtitle: 'Survey',
    leader: 'Merline',
    avatar: '/images/icons/mobile-bg.png',
    avatarGroup: ['/images/avatars/3.png', '/images/avatars/4.png', '/images/avatars/5.png', '/images/avatars/6.png'],
    status: 8
  },
  {
    id: 5,
    leader: 'Harmonia',
    title: 'Diabetes Registry',
    subtitle: 'Screening',
    avatar: '/images/logos/python-bg.png',
    avatarGroup: ['/images/avatars/7.png', '/images/avatars/8.png', '/images/avatars/1.png'],
    status: 36
  },
  {
    id: 6,
    leader: 'Allyson',
    title: 'Blockchain Website',
    subtitle: 'Sketch Project',
    avatar: '/images/logos/sketch-bg.png',
    avatarGroup: ['/images/avatars/2.png', '/images/avatars/3.png', '/images/avatars/4.png', '/images/avatars/5.png'],
    status: 92
  },
  {
    id: 7,
    title: 'Hoffman Website',
    subtitle: 'HTML Project',
    leader: 'Georgie',
    avatar: '/images/logos/html-bg.png',
    avatarGroup: ['/images/avatars/6.png', '/images/avatars/7.png', '/images/avatars/8.png', '/images/avatars/1.png'],
    status: 88
  },
  {
    id: 8,
    title: 'eCommerce Website',
    subtitle: 'React Project',
    leader: 'Eileen',
    avatar: '/images/logos/react-bg.png',
    avatarGroup: ['/images/avatars/1.png', '/images/avatars/2.png', '/images/avatars/3.png', '/images/avatars/4.png'],
    status: 78
  },
  {
    id: 9,
    leader: 'Owen',
    title: 'Retro Logo Design',
    subtitle: 'Figma Project',
    avatar: '/images/logos/figma-bg.png',
    avatarGroup: ['/images/avatars/5.png', '/images/avatars/6.png'],
    status: 18
  },
  {
    id: 10,
    title: 'Admin Dashboard',
    subtitle: 'VueJs Project',
    leader: 'Keith',
    avatar: '/images/logos/vue-bg.png',
    avatarGroup: ['/images/avatars/7.png', '/images/avatars/8.png', '/images/avatars/1.png', '/images/avatars/2.png'],
    status: 62
  }
]

export type CardStatsVerticalProps = {
  title: string
  subtitle: string
  stats: string
  avatarIcon: string
  avatarSize?: number
  avatarSkin?: CustomAvatarProps['skin']
  avatarColor?: ThemeColor
}

const CardStatsVertical = (props: CardStatsVerticalProps) => {
  // Props
  const { stats, title, subtitle, avatarIcon, avatarColor, avatarSize, avatarSkin } = props

  return (
    <Card>
      <CardContent className='flex flex-col gap-y-3 items-center'>
        <CustomAvatar variant='rounded' skin={avatarSkin} size={avatarSize} color={avatarColor}>
          <i className={classnames(avatarIcon, 'text-[20px]')} />
        </CustomAvatar>
        <div className='flex flex-col gap-y-1 items-center'>
          <Typography variant='h5'>{title}</Typography>
          <Typography color='text.primary'>{stats}</Typography>
          <Typography align='center' color='text.disabled'>
            {subtitle}
          </Typography>
        </div>
        {/* <Chip label={chipText} color={chipColor} variant={chipVariant} size='small' /> */}
      </CardContent>
    </Card>
  )
}

const DiagnosisAgeCard = (props: any) => {
  type DataType = {
    disease: string
    age: number
    avatarIcon: string
    avatarColor: ThemeColor
  }

  const data: DataType[] = [
    {
      disease: 'Diabetes',
      age: 52,
      avatarIcon: 'tabler-users',
      avatarColor: 'success'
    },
    {
      disease: 'Asthma',
      age: 63,
      avatarIcon: 'tabler-users',
      avatarColor: 'primary'
    },
    {
      disease: 'Breast Cancer',
      age: 68,
      avatarIcon: 'tabler-users',
      avatarColor: 'warning'
    },
    {
      disease: 'Multiple Sclerosis',
      age: 45,
      avatarIcon: 'tabler-users',
      avatarColor: 'info'
    },
    {
      disease: 'Psoriasis',
      age: 38,
      avatarIcon: 'tabler-users',
      avatarColor: 'secondary'
    },
    {
      disease: 'Kidney Disease',
      age: 57,
      avatarIcon: 'tabler-users',
      avatarColor: 'error'
    }
  ]

  return (
    <Card className={props.className}>
      <CardHeader
        title='Average Age at Diagnosis'
        subheader='by Disease'
        action={<OptionMenu options={['Refresh', 'Update', 'Share']} />}
      />
      <CardContent className='flex flex-col gap-5'>
        {data.map((item, index) => (
          <div key={index} className='flex items-center gap-4'>
            <CustomAvatar skin='light' variant='rounded' color={item.avatarColor} size={34}>
              <i className={classnames(item.avatarIcon, 'text-[22px]')} />
            </CustomAvatar>
            <div className='flex flex-wrap justify-between items-center gap-x-4 gap-y-1 is-full'>
              <div className='flex flex-col'>
                <Typography variant='body2' color='text.primary'>
                  {item.disease}
                </Typography>
              </div>
              <div className='flex items-right gap-4'>
                <Typography className='flex-1' variant='body2'>
                  {item.age} years old
                </Typography>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

const AgeAtDiagnosisCard = (props: any) => {
  const theme = useTheme()

  const agePercentages = [13, 25, 22, 40]

  const options: ApexOptions = {
    labels: ['0-18 years old', '19-29 years old', '30-40 years old', '40+ years old'],
    stroke: {
      width: 0
    },
    colors: [
      'var(--mui-palette-success-main)',
      'rgba(var(--mui-palette-success-mainChannel) / 0.8)',
      'rgba(var(--mui-palette-success-mainChannel) / 0.6)',
      'rgba(var(--mui-palette-success-mainChannel) / 0.4)'
    ],
    dataLabels: {
      enabled: false,
      formatter(val: string) {
        return `${Number.parseInt(val)}%`
      }
    },
    legend: {
      show: true,
      position: 'bottom',
      offsetY: 10,
      markers: {
        width: 8,
        height: 8,
        offsetY: 1,
        offsetX: theme.direction === 'rtl' ? 8 : -4
      },
      itemMargin: {
        horizontal: 15,
        vertical: 5
      },
      fontSize: '13px',
      fontWeight: 400,
      labels: {
        colors: 'var()',
        useSeriesColors: false
      }
    },
    grid: {
      padding: {
        top: 15
      }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '75%',
          labels: {
            show: true,
            value: {
              fontSize: '24px',
              color: 'var(--mui-palette-text-primary)',
              fontWeight: 500,
              offsetY: -20
            },
            name: { offsetY: 20 },
            total: {
              show: true,
              fontSize: '0.9375rem',
              fontWeight: 400,
              label: 'Average Diagnosis Age',
              color: 'var(--mui-palette-text-secondary)',
              formatter() {
                return '52'
              }
            }
          }
        }
      }
    }
  }

  return (
    <Card className={props.className}>
      <CardHeader
        title='Age at Diagnosis'
        subheader=''
        action={<OptionMenu options={['Refresh', 'Update', 'Share']} />}
      />
      <CardContent className='flex flex-col gap-5'>
        <AppReactApexCharts type='donut' height={370} width='100%' series={agePercentages} options={options} />
      </CardContent>
    </Card>
  )
}

const TopDiagnosesCard = (props: any) => {
  type DataType = {
    disease: string
    patients: number
    percentage: number
    avatarIcon: string
    avatarColor: ThemeColor
  }

  const data: DataType[] = [
    {
      disease: 'Diabetes',
      patients: 103142,
      percentage: 34.9,
      avatarIcon: 'tabler-users',
      avatarColor: 'success'
    },
    {
      disease: 'Asthma',
      patients: 58734,
      percentage: 19.9,
      avatarIcon: 'tabler-users',
      avatarColor: 'primary'
    },
    {
      disease: 'Breast Cancer',
      patients: 43032,
      percentage: 14.6,
      avatarIcon: 'tabler-users',
      avatarColor: 'warning'
    },
    {
      disease: 'Multiple Sclerosis',
      patients: 41283,
      percentage: 14.1,
      avatarIcon: 'tabler-users',
      avatarColor: 'info'
    },
    {
      disease: 'Psoriasis',
      patients: 12431,
      percentage: 4.2,
      avatarIcon: 'tabler-users',
      avatarColor: 'secondary'
    },
    {
      disease: 'Kidney Disease',
      patients: 7013,
      percentage: 2.4,
      avatarIcon: 'tabler-users',
      avatarColor: 'error'
    }
  ]

  return (
    <Card className={props.className}>
      <CardHeader
        title='Top Diagnoses'
        subheader='295,653 Total Patients'
        action={<OptionMenu options={['Refresh', 'Update', 'Share']} />}
      />
      <CardContent className='flex flex-col gap-5'>
        {data.map((item, index) => (
          <div key={index} className='flex items-center gap-4'>
            <CustomAvatar skin='light' variant='rounded' color={item.avatarColor} size={34}>
              <i className={classnames(item.avatarIcon, 'text-[22px]')} />
            </CustomAvatar>
            <div className='flex flex-wrap justify-between items-center gap-x-4 gap-y-1 is-full'>
              <div className='flex flex-col'>
                <Typography variant='body2' color='text.primary'>
                  {item.disease}
                </Typography>
              </div>
              <div className='flex items-right gap-4'>
                <Typography className='flex-1' variant='body2'>
                  {item.patients}
                </Typography>
                <Typography
                  className='flex-none'
                  variant='body2'
                  color='success'
                  style={{ color: green[300] }}
                >{`${item.percentage}%`}</Typography>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

const SentimentTable = (props: any) => {
  type DataType = {
    sentiment: string
    related: string
    demographics: string[]
    frequency: string
    avatarIcon: string
    avatarColor: ThemeColor
  }

  const data: DataType[] = [
    {
      sentiment: 'Anxiety',
      related: 'Stress at Diagnosis',
      demographics: ['50-60 years old', 'Northeast US'],
      frequency: '1.2k Mentions',
      avatarIcon: 'tabler-microphone-2',
      avatarColor: 'primary'
    },
    {
      sentiment: 'Gratefulness',
      related: 'Community',
      demographics: ['40-50 years old', 'Female'],
      frequency: '834 Mentions',
      avatarIcon: 'tabler-microphone-2',
      avatarColor: 'info'
    },
    {
      sentiment: 'Hope',
      related: 'Cure',
      demographics: ['Southeast US'],
      frequency: '724 Mentions',
      avatarIcon: 'tabler-microphone-2',
      avatarColor: 'success'
    },
    {
      sentiment: 'Struggle',
      related: 'Financial Worries',
      demographics: ['60-70 years old', 'Black'],
      frequency: '632 Mentions',
      avatarIcon: 'tabler-microphone-2',
      avatarColor: 'warning'
    },
    {
      sentiment: 'Community',
      related: 'Peers',
      demographics: ['Southeast US', 'Southwest US'],
      frequency: '453 Mentions',
      avatarIcon: 'tabler-microphone-2',
      avatarColor: 'error'
    }
  ]

  const TableCard = (props: any) => {
    const data = props.data ?? null

    if (!data || data.length === 0) {
      return <div>No data</div>
    }

    return (
      <div className='flex flex-col gap-4'>
        <div className='border rounded overflow-x-auto'>
          <table className={tableStyles.table}>
            <thead className='border-0'>
              <tr>
                <th className='flex-0 is-1/12'></th>
                <th className='flex-1'>Top Sentiment</th>
                <th className='flex-1'>Related Sentiment</th>
                <th className='flex-1'>Demographics</th>
                <th className='flex-1'>Frequency</th>
              </tr>
            </thead>
            <tbody className='border-0'>
              {data.map((item: any, index: number) => (
                <tr key={index}>
                  <td className='text-textPrimary'>
                    <CustomAvatar skin='light' variant='rounded' color={item.avatarColor} size={34}>
                      <i className={classnames(item.avatarIcon, 'text-[22px]')} />
                    </CustomAvatar>
                  </td>
                  <td>{item.sentiment}</td>
                  <td>{item.related}</td>
                  <td>
                    <div className='flex gap-2 flex-wrap'>
                      {item.demographics.map((demo: any, index: number) => (
                        <Chip key={index} label={demo} color={item.avatarColor} variant='tonal' size='small' />
                      ))}
                    </div>
                  </td>
                  <td>
                    <Chip key={index} label={item.frequency} color='secondary' variant='tonal' size='small' />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  return (
    <Card className={props.className}>
      <CardHeader title='' subheader='' action={<OptionMenu options={['Refresh', 'Update', 'Share']} />} />
      <CardContent className='fullWidth'>
        <TableCard data={data} />
      </CardContent>
    </Card>
  )
}

type PatientLocation = {
  coordinates: [number, number]
  mag: number
}

type HeatmapProps = {
  data: PatientLocation[]
  radius: number
  opacity: number
}

const Heatmap = ({ data, radius, opacity }: HeatmapProps) => {
  const map = useMap()
  const visualization = useMapsLibrary('visualization')

  const heatmap = useMemo(() => {
    if (!visualization) return null

    return new google.maps.visualization.HeatmapLayer({
      radius: radius,
      opacity: opacity
    })
  }, [visualization, radius, opacity])

  useEffect(() => {
    if (!heatmap) return

    heatmap.setData(
      data.map(point => {
        const [lat, lng] = point.coordinates

        return {
          location: new google.maps.LatLng(lat, lng),
          weight: point.mag
        }
      })
    )
  }, [heatmap, data, radius, opacity])

  useEffect(() => {
    if (!heatmap) return

    heatmap.setMap(map)

    return () => {
      heatmap.setMap(null)
    }
  }, [heatmap, map])

  return null
}

const CroPrDashboard = () => {
  const [filterValue, setFilterValue] = useState('')
  const [sortValue, setSortValue] = useState('')
  const [chartToken, setChartToken] = useState('')

  const [chartSdk] = useState(
    new ChartsEmbedSDK({
      baseUrl: 'https://charts.mongodb.com/charts-tallulah-dev-qbykdfm',
      getUserToken: getToken
    })
  )

  async function getToken() {
    if (chartToken) return chartToken
    const token = (await AuthenticationService.getChartTokenApi()).chart_token

    setChartToken(token)

    return token
  }

  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''

  const patientLocations: PatientLocation[] = [
    {
      coordinates: [40.7045402, -74.1573085],
      mag: 100
    },
    {
      coordinates: [38.8936509, -77.1704621],
      mag: 75
    },
    {
      coordinates: [33.7672695, -84.5760179],
      mag: 40
    },
    {
      coordinates: [47.6082926, -122.651595],
      mag: 110
    },
    {
      coordinates: [37.7575973, -122.5934864],
      mag: 90
    },
    {
      coordinates: [-32.004051365793835, 115.89147646170217],
      mag: 75
    },
    {
      coordinates: [-12.958207003332209, 130.62547970430714],
      mag: 40
    },
    {
      coordinates: [-16.95119801220686, 145.49064987861618],
      mag: 60
    },
    {
      coordinates: [-33.88998401520078, 151.06523711505199],
      mag: 90
    },
    {
      coordinates: [-37.77466516992534, 144.97806088007516],
      mag: 110
    }
  ]

  return (
    <div>
      {/* <h2>Reddit Search</h2> */}
      <Card className={styles.mainCard} component='form' noValidate sx={{ mt: 1, width: '100%' }}>
        <div className='flex gap-6'>
          <FormControl className='w-2/12'>
            <InputLabel id='filter-label'>Filter</InputLabel>
            <Select
              labelId='filter-label'
              label='Filter'
              value={filterValue}
              onChange={e => {
                setFilterValue(e.target.value)
              }}
            >
              <MenuItem value='all'>All</MenuItem>
              <MenuItem value='patient'>Patient</MenuItem>
              <MenuItem value='doctor'>Doctor</MenuItem>
            </Select>
          </FormControl>
          <FormControl className='w-2/12'>
            <InputLabel id='sort-label'>Sort</InputLabel>
            <Select
              labelId='sort-label'
              label='Sort'
              value={sortValue}
              onChange={e => {
                setSortValue(e.target.value)
              }}
            >
              <MenuItem value='new'>New</MenuItem>
              <MenuItem value='old'>Old</MenuItem>
            </Select>
          </FormControl>
        </div>
      </Card>
      <div className='flex gap-6 fullWidth' style={{ marginBlockEnd: '20px', borderRadius: '10px' }}>
        <APIProvider apiKey={API_KEY}>
          <Map
            defaultCenter={{ lat: 44.5, lng: -89.5 }}
            defaultZoom={4}
            gestureHandling={'greedy'}
            disableDefaultUI={true}
            mapId={'429d97a6790fbaa6'}
            style={{ height: '400px', width: '100%', display: 'inline-block' }}
          >
            {patientLocations && <Heatmap data={patientLocations} radius={25} opacity={0.8} />}
          </Map>
        </APIProvider>
      </div>
      <div className='flex gap-6 fullWidth' style={{ marginBlockEnd: '20px' }}>
        <TopDiagnosesCard className='flex-none w-1/3' />
        <ProjectTables projectTable={projectList} className='flex-none w-2/3' />
      </div>
      <div className='flex gap-6 fullWidth' style={{ marginBlockEnd: '20px' }}>
        <DiagnosisAgeCard className='flex-none w-1/3' />
        <AgeAtDiagnosisCard className='flex-none w-1/3' />
        <Grid container spacing={6}>
          <Grid item xs={6} sm={6} md={6} lg={6}>
            <CardStatsVertical
              title=''
              subtitle='Recruited to panels'
              stats='1.2k'
              avatarColor='success'
              avatarIcon='tabler-messages'
              avatarSkin='light'
              avatarSize={34}
            />
          </Grid>
          <Grid item xs={6} sm={6} md={6} lg={6}>
            <CardStatsVertical
              title=''
              subtitle='Recruited to focus groups'
              stats='3.6k'
              avatarColor='success'
              avatarIcon='tabler-users'
              avatarSkin='light'
              avatarSize={34}
            />
          </Grid>
          <Grid item xs={6} sm={6} md={6} lg={6}>
            <CardStatsVertical
              title=''
              subtitle='Recruited to clinical trials'
              stats='24.6k'
              avatarColor='success'
              avatarIcon='tabler-pill'
              avatarSkin='light'
              avatarSize={34}
            />
          </Grid>
          <Grid item xs={6} sm={6} md={6} lg={6}>
            <CardStatsVertical
              title=''
              subtitle='Recruited to surveys'
              stats='6.8k'
              avatarColor='success'
              avatarIcon='tabler-report-analytics'
              avatarSkin='light'
              avatarSize={34}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12}>
            <HorizontalWithSubtitle
              {...{
                title: 'Recently added Patients',
                stats: '4,567',
                avatarIcon: 'tabler-user-plus',
                avatarColor: 'error',
                trend: 'positive',
                trendNumber: '18%',
                subtitle: 'Last week analytics'
              }}
            />
          </Grid>
        </Grid>
      </div>
      <div className='fullWidth' style={{ marginBlockEnd: '20px' }}>
        <SentimentTable className='fullWidth' />
      </div>
    </div>
  )
}

export default CroPrDashboard
