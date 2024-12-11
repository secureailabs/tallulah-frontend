// @ts-ignore
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { MenuItemData, NestedDropdown } from 'mui-nested-menu';
import { getAllEmailLabels } from '@/utils/helper';
import { useEffect, useState } from 'react';
// import { sendAmplitudeData } from 'src/utils/Amplitude/amplitude';

interface IFilterProps {
  setFilterByTags: (filters: any) => void;
  filtersByTags: string[];
  filtersByState: string[];
  setFilterByState: (filters: any) => void;
}

const Filter: React.FC<IFilterProps> = ({ setFilterByTags, filtersByTags, filtersByState, setFilterByState }) => {
  const [MENU_ITEMS_LABEL, setMENU_ITEMS_LABEL] = useState<any[]>([]);
  const [MENU_EMAIL_STATUS_ITEMS, setMENU_EMAIL_STATUS_ITEMS] = useState<any[]>([]);

  const getMenuItems = (filters: any) => {
    const labels = getAllEmailLabels();
    const menuItems = labels.map((label: any) => {
      let bgColor = 'white';
      if (filters.includes(label.label)) {
        bgColor = '#a1d0f7';
      }
      return {
        ...label,
        sx: {
          backgroundColor: bgColor
        },
        callback: () => {
          setFilterByTags((prevFilters: any) => {
            if (prevFilters.includes(label.label)) {
              return prevFilters.filter((filter: any) => filter !== label.label);
            } else {
              // sendAmplitudeData('Email Assistant - Filter by Email Tags Clicked');
              return [...prevFilters, label.label];
            }
          });
        }
      };
    });

    return menuItems;
  };

  const getFilterByStateMenuItems = (filters: any) => {
    const labels = ['NEW', 'TAGGED', 'RESPONDED', 'NOT RESPONDED', 'FAILED'];
    const menuItems = labels.map((label: any) => {
      let bgColor = 'white';
      if (filters.includes(label)) {
        bgColor = '#a1d0f7';
      }
      return {
        label: label,
        sx: {
          backgroundColor: bgColor
        },
        callback: () => {
          setFilterByState((prevFilters: any) => {
            if (prevFilters.includes(label)) {
              return prevFilters.filter((filter: any) => filter !== label);
            } else {
              // sendAmplitudeData('Email Assistant - Filter by Email Status Clicked');
              return [...prevFilters, label];
            }
          });
        }
      };
    });

    return menuItems;
  };

  useEffect(() => {
    setMENU_ITEMS_LABEL(getMenuItems(filtersByTags));
  }, [filtersByTags]);

  useEffect(() => {
    setMENU_EMAIL_STATUS_ITEMS(getFilterByStateMenuItems(filtersByState));
  }, [filtersByState]);

  const MenuItems: MenuItemData = {
    label: 'Filter',
    items: [
      {
        label: 'Tags',
        rightIcon: <ChevronRightIcon />,
        items: MENU_ITEMS_LABEL
      },
      {
        label: 'Email Status',
        rightIcon: <ChevronRightIcon />,
        items: MENU_EMAIL_STATUS_ITEMS
      }
    ]
  };

  return (
    <NestedDropdown
      menuItemsData={MenuItems}
      ButtonProps={{
        variant: 'outlined',
        startIcon: <FilterAltIcon />,
        endIcon: null,
        sx: { width: 1 }
      }}
    />
  );
};

export default Filter;
