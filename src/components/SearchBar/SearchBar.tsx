import { Box, IconButton, InputBase } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import styles from './SearchBar.module.css';
import { useRef, useState } from 'react';

export interface ISearchBar {
  placeholder?: string;
  searchText: string | undefined;
  handleSearchChange: (text: string) => void;
}

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: '#fff',
  width: '100%',
  border: '1px solid #d1d1d1',
  height: '50px'
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: '#000',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '500px'
    }
  }
}));

const SearchBar: React.FC<ISearchBar> = ({ placeholder, searchText, handleSearchChange }) => {
  const [text, setText] = useState<string>('');
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onSearchChange = (text: string) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(() => {
      handleSearchChange(text);
    }, 500); // 500ms delay
  };

  return (
    <Box sx={{ flex: 1, marginRight: '20px' }}>
      <Search>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          value={text}
          placeholder={placeholder ? placeholder : 'Search…'}
          inputProps={{ 'aria-label': 'search' }}
          onChange={(e) => {
            setText(e.target.value);
            onSearchChange(e.target.value);
          }}
        />
        {searchText !== '' && searchText !== undefined ? (
          <IconButton
            aria-label="delete"
            onClick={() => {
              setText('');
              onSearchChange('');
            }}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </Search>
    </Box>
  );
};

export default SearchBar;
