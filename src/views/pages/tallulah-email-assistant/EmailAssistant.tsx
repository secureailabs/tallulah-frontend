'use client';

import { Box, Button, Dialog, Drawer, Icon, IconButton, InputBase, Menu, MenuItem, styled } from '@mui/material';
import styles from './EmailAssistant.module.css';
import { useEffect, useRef, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';
import EmailDisplaySection from './components/EmailDisplaySection';
import Filter from './components/Filter';
import Sort from './components/Sort';
import MicrosoftIcon from '@mui/icons-material/Microsoft';
import { GetMailbox_Out, MailboxService } from '@/tallulah-ts-client';
// import { OUTLOOK_REDIRECT_URI } from 'src/config';
// import { useNavigate } from 'react-router-dom';
import EmailReply from './components/EmailReply';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FilterChip from './components/FilterChip';
// import { sendAmplitudeData } from 'src/utils/Amplitude/amplitude';
import RefreshIcon from '@mui/icons-material/Refresh';
import { EmailDisplaySectionRef } from './components/EmailDisplaySection/EmailDisplaySection';

const urlToEncodded = (url: string) => {
  const encodedURL = encodeURIComponent(url);
  const URL = `https://login.microsoftonline.com/organizations/oauth2/v2.0/authorize?client_id=5f247444-fff8-42b2-9362-1d2fe5246de1&response_type=code&redirect_uri=${encodedURL}&scope=Mail.Read+Mail.Send+User.Read+offline_access+openid+profile`;
  return URL;
};

export interface IEmailAssistant {}

const EmailAssistant: React.FC<IEmailAssistant> = ({}) => {
  const [isMailAdded, setIsMailAdded] = useState(false);
  const [mailboxes, setMailboxes] = useState<any[]>([]);
  const [selectedEmailsIds, setselectedEmailsIds] = useState<string[]>([]);
  const [selectedEmails, setSelectedEmails] = useState<any[]>([]);
  const [openReplyModal, setOpenReplyModal] = useState<boolean>(false);
  const [selectedMailBoxId, setselectedMailBoxId] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [sortKey, setSortKey] = useState<string>('received_time');
  const [sortDirection, setSortDirection] = useState<-1 | 1>(-1);
  const [filterByTags, setFilterByTags] = useState<string[]>([]);
  const [filterByState, setFilterByState] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const emailDisplayRef = useRef<EmailDisplaySectionRef | null>(null);

  // read from env
  const OUTLOOK_REDIRECT_URI = process.env.REACT_APP_OUTLOOK_REDIRECT_URI || '';

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // TODO
  // const navigate = useNavigate();

  const getAllMailBoxes = async () => {
    setIsLoading(true);
    try {
      const response = await MailboxService.getAllMailboxes();
      if (response.mailboxes.length > 0) {
        setIsMailAdded(true);
        setMailboxes(response.mailboxes);
        setselectedMailBoxId(response.mailboxes[0].id);
      }
    } catch (e) {
      console.log(e);
    }
    setIsLoading(false);
  };

  const handleRemoveMailBoxClicked = async () => {
    if (!selectedMailBoxId) return;
    try {
      const response = await MailboxService.deleteMailbox(selectedMailBoxId);
      setIsMailAdded(false);
      setMailboxes([]);
      setselectedMailBoxId(null);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getAllMailBoxes();
  }, []);

  if (isLoading && !isMailAdded) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          flex: '1 1 auto'
        }}
      >
        <Box>Fetching mailbox details...</Box>
      </Box>
    );
  }

  return (
    <>
      {isMailAdded ? (
        <Box
          sx={{
            position: 'relative'
          }}
        >
          <Box
            sx={{
              position: 'sticky',
              top: '60px',
              backgroundColor: '#f5f5f5',
              zIndex: 1,
              paddingTop: '20px',
              paddingBottom: '20px',
              boxShadow: '0px 3px 0px rgba(0, 0, 0, 0.02)',
              borderBottom: '1px solid #e3e3e3'
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '20px'
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  gap: '20px'
                }}
              >
                <Box
                  sx={{
                    display: 'flex'
                  }}
                >
                  <Filter
                    filtersByTags={filterByTags}
                    setFilterByTags={setFilterByTags}
                    filtersByState={filterByState}
                    setFilterByState={setFilterByState}
                  />
                </Box>
                <Box sx={{ display: 'flex' }}>
                  <Sort sortDirection={sortDirection} setSortDirection={setSortDirection} />
                </Box>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: '20px'
                }}
              >
                {selectedEmailsIds.length > 0 ? (
                  <Box>
                    <Button
                      variant="contained"
                      onClick={() => {
                        // sendAmplitudeData('Email Assistant Screen - Reply Selected Button Clicked');
                        setOpenReplyModal(true);
                      }}
                    >
                      Reply Selected
                    </Button>
                  </Box>
                ) : null}

                <Button
                  variant="outlined"
                  onClick={() => {
                    // sendAmplitudeData('Email Assistant Screen - Response Template Button Clicked');
                    // navigate('/email-assistant/response-template');
                  }}
                  endIcon={<SettingsIcon />}
                >
                  Response Template
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => {
                    if (emailDisplayRef.current) {
                      emailDisplayRef.current.handleEmailRefresh();
                    }
                  }}
                  endIcon={<RefreshIcon />}
                >
                  Refresh
                </Button>
                {/* dropdown menu */}
                {/* <Box>
                  <IconButton
                    id="menu-button"
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                  >
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                      'aria-labelledby': 'basic-button'
                    }}
                  >
                    <MenuItem onClick={handleRemoveMailBoxClicked}>Remove Mailbox</MenuItem>
                  </Menu>
                </Box> */}
              </Box>
            </Box>
            <Box
              sx={{
                marginTop: '20px'
              }}
            >
              {filterByTags.map((tag) => (
                <FilterChip filterTag={tag} setFilters={setFilterByTags} />
              ))}
              {filterByState.map((tag) => (
                <FilterChip filterTag={tag} setFilters={setFilterByState} />
              ))}
            </Box>
          </Box>
          <Box>
            {selectedMailBoxId ? (
              <EmailDisplaySection
                mailBoxId={selectedMailBoxId}
                selectionModel={selectedEmailsIds}
                setSelectionModel={setselectedEmailsIds}
                sortKey={sortKey}
                sortDirection={sortDirection}
                filterByTags={filterByTags}
                filterByState={filterByState}
                ref={emailDisplayRef}
              />
            ) : null}
          </Box>
          {/* Modal for email response */}
          <Dialog
            open={openReplyModal}
            onClose={() => {
              setOpenReplyModal(false);
            }}
            fullWidth
          >
            <EmailReply
              setOpenReplyModal={setOpenReplyModal}
              selectedEmailsIds={selectedEmailsIds}
              mailBoxId={selectedMailBoxId as string}
            />
          </Dialog>
        </Box>
      ) : null}
      {!isMailAdded && !isLoading ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flex: '1 1 auto'
          }}
        >
          <Box>No mails added yet. Please add a mail.</Box>
          <Box
            sx={{
              marginTop: '20px',
              display: 'flex',
              flexDirection: 'row',
              gap: '20px'
            }}
          >
            <Button variant="contained" color="primary" href={urlToEncodded(OUTLOOK_REDIRECT_URI)} startIcon={<MicrosoftIcon />}>
              Login With Microsoft
            </Button>
          </Box>
        </Box>
      ) : null}
    </>
  );
};

export default EmailAssistant;
