import { Box, Typography } from '@mui/material';
import styles from './ContentDetailView.module.css';
import { formatReceivedTimeFull } from '@/utils/helper';

export interface IContentDetailView {
  data: any;
  getTemplateName: (templateId: string) => string | undefined;
}

const LabelValue: React.FC<{ label: string; value: string }> = ({ label, value }) => {
  return (
    <Box
      sx={{
        marginBottom: 2
      }}
    >
      <Typography variant="h6" className={styles.label}>
        {label}
      </Typography>
      <Typography variant="h6" className={styles.value}>
        {value}
      </Typography>
    </Box>
  );
};

const getEntries = (data: any) => {
  return Object.entries(data);
};

const ContentDetailView: React.FC<IContentDetailView> = ({ data, getTemplateName }) => {
  const createMarkup = (htmlText: any) => {
    return { __html: htmlText };
  };

  const paragraphs = data?.generated?.split('\n').filter((p: any) => p); // filter out any empty strings

  return (
    <Box>
      <LabelValue label="Template Name" value={getTemplateName(data?.template_id) as string} />
      <LabelValue label="Created On" value={formatReceivedTimeFull(data?.creation_time)} />

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100px'
        }}
      >
        <Typography variant="h6" className={styles.label}>
          Status
        </Typography>
        <Typography
          variant="h6"
          className={styles.value}
          sx={{
            padding: '5px',
            backgroundColor:
              data.state === 'DONE' ? '#C9EAC8' : data.state === 'ERROR' ? '#f58c8c' : data.state === 'RECEIVED' ? '#AEDFF7' : '#F8D7E9'
          }}
        >
          {data.state}
        </Typography>
      </Box>
      <Box
        sx={{
          marginTop: '20px'
        }}
      >
        <Typography variant="h6" className={styles.label}>
          Parameter Values
        </Typography>
        {getEntries(data.values).map(([key, value]: [any, any]) => (
          <Typography key={key}>{`${key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')} - ${value}`}</Typography>
        ))}
      </Box>
      <Box
        sx={{
          marginTop: '20px'
        }}
      >
        <Typography variant="h6" className={styles.label}>
          Generated Content
        </Typography>
        {paragraphs?.map((paragraph: any, index: any) => (
          <Typography
            key={index}
            variant="body1"
            gutterBottom
            sx={{
              marginTop: '5px',
              marginBottom: '5px'
            }}
          >
            {paragraph}
          </Typography>
        ))}
      </Box>
    </Box>
  );
};

export default ContentDetailView;
