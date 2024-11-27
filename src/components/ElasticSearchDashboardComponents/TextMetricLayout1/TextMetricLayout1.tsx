import { Typography } from '@mui/material';
import styles from './TextMetricLayout1.module.css';

export interface ITextMetricLayout1 {
  data_query: any;
  response?: any;
}

const TextMetricLayout1: React.FC<ITextMetricLayout1> = ({ response }) => {
  return <Typography className={styles.metricText}>{response.total_count.value}</Typography>;
};

export default TextMetricLayout1;
