import styles from './ResponseTemplateSelection.module.css';
import { useEffect, useState } from 'react';
import { GetResponseTemplate_Out, ResponseTemplatesService } from '@/tallulah-ts-client';
import { Box, Icon, IconButton, InputBase, Typography, styled } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import ResponseTemplateCard from '@/views/pages/tallulah-email-response-template/components/ResponseTemplateCard';

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
export interface IResponseTemplateSelection {
  setEmailSubject: (subject: string) => void;
  setEmailBody: (body: string) => void;
  setIsTemplateSelectionModalOpen: (isOpen: boolean) => void;
}

const ResponseTemplateSelection: React.FC<IResponseTemplateSelection> = ({
  setEmailSubject,
  setEmailBody,
  setIsTemplateSelectionModalOpen
}) => {
  const [initialTemplateList, setInitialTemplateList] = useState<GetResponseTemplate_Out[]>([]);
  const [templateList, setTemplateList] = useState<GetResponseTemplate_Out[]>([]);
  const [searchText, setSearchText] = useState<string>('');

  const fetchResponseTemplates = async () => {
    try {
      const response = await ResponseTemplatesService.getAllResponseTemplates();
      setTemplateList(response.templates);
      setInitialTemplateList(response.templates);
    } catch (error) {
      console.log(error);
    }
  };

  const handleOnSelect = (template: GetResponseTemplate_Out) => {
    if (template && template.subject) {
      setEmailSubject(template.subject);
    }
    if (template && template.body) {
      setEmailBody(template.body.content);
    }
    setIsTemplateSelectionModalOpen(false);
  };

  useEffect(() => {
    fetchResponseTemplates();
  }, []);

  const handleRefresh = () => {
    fetchResponseTemplates();
  };

  useEffect(() => {
    if (searchText === '') {
      setTemplateList(initialTemplateList);
    } else {
      const filteredTemplateList = initialTemplateList.filter((template) => {
        return template.name.toLowerCase().includes(searchText.toLowerCase());
      });
      setTemplateList(filteredTemplateList);
    }
  }, [searchText]);

  return (
    <Box className={styles.container}>
      <Box
        sx={{
          position: 'absolute',
          right: '1rem',
          top: '10px'
        }}
      >
        <IconButton
          onClick={() => {
            setIsTemplateSelectionModalOpen(false);
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#f5f5f5',
          padding: '1rem'
        }}
      >
        <Typography variant="h5">Select Template</Typography>
      </Box>
      <Box
        sx={{
          padding: '1rem'
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search by Name ..."
              inputProps={{ 'aria-label': 'search' }}
              value={searchText}
              onChange={(e: any) => setSearchText(e.target.value)}
            />
            {searchText !== '' ? (
              <IconButton aria-label="delete">
                <CloseIcon />
              </IconButton>
            ) : null}
          </Search>
        </Box>
        {templateList && templateList.length > 0 ? (
          <Box>
            {templateList.map((_template, _index) => (
              <ResponseTemplateCard
                key={_template.id}
                data={_template}
                editable={false}
                selection={true}
                onSelect={handleOnSelect}
                handleRefresh={handleRefresh}
              />
            ))}
          </Box>
        ) : (
          <Box>No Template Responses Found</Box>
        )}
      </Box>
    </Box>
  );
};

export default ResponseTemplateSelection;
