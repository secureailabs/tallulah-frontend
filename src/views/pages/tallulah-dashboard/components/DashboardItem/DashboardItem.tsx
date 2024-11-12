import { DashboardWidget } from '@/tallulah-ts-client';
import styles from './DashboardItem.module.css';
import { SignalCellularNullSharp } from '@mui/icons-material';
import PieChart from '@/components/ElasticSearchDashboardComponents/PieChart';
import { Box, Typography } from '@mui/material';
import TextMetricLayout1 from '@/components/ElasticSearchDashboardComponents/TextMetricLayout1';
import BarchartItem from '@/components/ElasticSearchDashboardComponents/BarchartItem';
import LinechartItem from '@/components/ElasticSearchDashboardComponents/LinechartItem';
import CardStatsSquare from '@/components/card-statistics/CardStatsSquare';

export interface IDashboardItem {
  widget: DashboardWidget;
  response?: any;
}

const ItemDiv = ({ children, widget }: { children: React.ReactNode; widget: DashboardWidget }) => (
  <div className={styles.dashboardItem}>
    <Box className={styles.dashboardItemContentDiv}>{children}</Box>
    <Box className={styles.dashboardItemTitleDiv}>
      <Typography variant="h6" className={styles.dashboardItemTitle}>
        {widget.name}
      </Typography>
    </Box>
  </div>
);

const DashboardItem: React.FC<IDashboardItem> = ({ widget, response }) => {
  if (!response) return null;

  switch (widget.type) {
    case 'PIE_CHART':
      return (
        <PieChart data_query={widget.data_query} response={response} cardHeader={widget.name} cardSubHeader='' />
      );
    case 'TEXT':
      return (
        <CardStatsSquare
            avatarIcon='tabler-clipboard-list'
            avatarColor= 'primary'
            stats={response.total_count.value}
            statsTitle={widget.name}
            avatarSize={60}
          />
      );
    case 'BAR_CHART':
      return (
        <BarchartItem data_query={widget.data_query} response={response} cardHeader={widget.name} cardSubHeader='' />
      );
    case 'LINE_CHART':
      return (
          <LinechartItem data_query={widget.data_query} response={response} cardHeader={widget.name} cardSubHeader='' />
      );
    default:
      return null;
  }
};

export default DashboardItem;
