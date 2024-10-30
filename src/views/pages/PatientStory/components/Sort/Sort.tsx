import SortIcon from '@mui/icons-material/Sort';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { MenuItemData, NestedDropdown } from 'mui-nested-menu';

import styles from './Sort.module.css';

export interface ISort {
  sortDirection: number;
  setSortDirection: (sortDirection: number) => void;
  sortKey: string;
  setSortKey: (sortKey: string) => void;
}

const Sort: React.FC<ISort> = ({ sortDirection, setSortDirection, sortKey, setSortKey }) => {
  const MenuItems: MenuItemData = {
    label: 'Sort',
    items: [
      {
        label: 'Date',
        rightIcon: <ChevronRightIcon />,
        items: [
          {
            label: 'Oldest',
            callback: (event, item) => {
              setSortDirection(1);
              setSortKey('creation_time');
            },
            sx:
              sortDirection === 1 && sortKey === 'creation_time'
                ? {
                    backgroundColor: '#a1d0f7'
                  }
                : {}
          },
          {
            label: 'Newest',
            callback: (event, item) => {
              setSortDirection(-1);
              setSortKey('creation_time');
            },
            sx:
              sortDirection === -1 && sortKey === 'creation_time'
                ? {
                    backgroundColor: '#a1d0f7'
                  }
                : {}
          }
        ]
      },
      {
        label: 'Recent Chat',
        rightIcon: <ChevronRightIcon />,
        items: [
          {
            label: 'Oldest',
            callback: (event, item) => {
              setSortDirection(1);
              setSortKey('chat_time');
            },
            sx:
              sortDirection === 1 && sortKey === 'chat_time'
                ? {
                    backgroundColor: '#a1d0f7'
                  }
                : {}
          },
          {
            label: 'Newest',
            callback: (event, item) => {
              setSortDirection(-1);
              setSortKey('chat_time');
            },
            sx:
              sortDirection === -1 && sortKey === 'chat_time'
                ? {
                    backgroundColor: '#a1d0f7'
                  }
                : {}
          }
        ]
      },
      {
        label: 'First Name',
        rightIcon: <ChevronRightIcon />,
        items: [
          {
            label: 'A - Z',
            callback: (event, item) => {
              setSortDirection(1);
              setSortKey('values.firstName.value');
            },
            sx:
              sortDirection === 1 && sortKey === 'values.firstName.value'
                ? {
                    backgroundColor: '#a1d0f7'
                  }
                : {}
          },
          {
            label: 'Z - A',
            callback: (event, item) => {
              setSortDirection(-1);
              setSortKey('values.firstName.value');
            },
            sx:
              sortDirection === -1 && sortKey === 'values.firstName.value'
                ? {
                    backgroundColor: '#a1d0f7'
                  }
                : {}
          }
        ]
      },
      {
        label: 'Last Name',
        rightIcon: <ChevronRightIcon />,
        items: [
          {
            label: 'A - Z',
            callback: (event, item) => {
              setSortDirection(1);
              setSortKey('values.lastName.value');
            },
            sx:
              sortDirection === 1 && sortKey === 'values.lastName.value'
                ? {
                    backgroundColor: '#a1d0f7'
                  }
                : {}
          },
          {
            label: 'Z - A',
            callback: (event, item) => {
              setSortDirection(-1);
              setSortKey('values.lastName.value');
            },
            sx:
              sortDirection === -1 && sortKey === 'values.lastName.value'
                ? {
                    backgroundColor: '#a1d0f7'
                  }
                : {}
          }
        ]
      }
    ]
  };

  return (
    <NestedDropdown
      menuItemsData={MenuItems}
      ButtonProps={{
        variant: 'outlined',
        startIcon: <SortIcon />,
        endIcon: null,
        sx: { width: 1 }
      }}
    />
  );
};

export default Sort;
