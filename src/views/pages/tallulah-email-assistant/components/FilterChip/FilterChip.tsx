import { Box, IconButton, Typography } from '@mui/material';
import styles from './FilterChip.module.css';
import CloseIcon from '@mui/icons-material/Close';
import { getEmailLabel } from '@/utils/helper';
import { set } from 'react-hook-form';

export interface IFilterChip {
  filterTag: string;
  setFilters: (filters: any) => void;
}

const FilterChip: React.FC<IFilterChip> = ({ filterTag, setFilters }) => {
  const getEmailLabelColor = (label: string) => {
    return getEmailLabel(label)?.color ? getEmailLabel(label)?.color : '#71decc';
  };
  return (
    <Box
      className={styles.filterChipContainer}
      sx={{
        backgroundColor: getEmailLabelColor(filterTag)
      }}
    >
      <Typography variant="body1" className={styles.filterChip}>
        {filterTag}
      </Typography>
      <IconButton
        size="small"
        className={styles.filterChipIcon}
        onClick={() => {
          setFilters((prevFilters: any) => {
            if (prevFilters.includes(filterTag)) {
              return prevFilters.filter((filter: any) => filter !== filterTag);
            } else {
              return [...prevFilters, filterTag];
            }
          });
        }}
      >
        <CloseIcon
          sx={{
            fontSize: '1rem'
          }}
        />
      </IconButton>
    </Box>
  );
};

export default FilterChip;
