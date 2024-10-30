import { Box, IconButton, Typography } from '@mui/material';
import styles from './FilterChip.module.css';
import CloseIcon from '@mui/icons-material/Close';
import { convertcamelCaseToTitleCase, getEmailLabel } from '@/utils/helper';

export interface IFilterChip {
  filterTag: string;
  setFilters?: (filters: any) => void;
  filterKey: string;
  onClose?: () => void;
}

const FilterChip: React.FC<IFilterChip> = ({ filterTag, setFilters, filterKey, onClose }) => {
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
        {convertcamelCaseToTitleCase(filterKey)} : {filterTag}
      </Typography>
      <IconButton
        size="small"
        className={styles.filterChipIcon}
        onClick={() => {
          if (onClose) {
              onClose();
          }
         else if (setFilters) {
            setFilters((prevFilters: any) => {
              // prevfiltgers is of object like {key: [value]}
              // find the key and remove the value from the array
              const updatedFilters = { ...prevFilters };
              const filterValues = updatedFilters[filterKey];
              const updatedFilterValues = filterValues.filter((value: string) => value !== filterTag);
              // if the filter values are empty, remove the key from the object
              if (updatedFilterValues.length === 0) {
                delete updatedFilters[filterKey];
              } else {
                updatedFilters[filterKey] = updatedFilterValues;
              }
              return updatedFilters;
            });
          }
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
