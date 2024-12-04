import { Box, Button, Dialog, Icon, IconButton, TextField, Typography } from '@mui/material';
import styles from './EmailReply.module.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import ResponseTemplateSelection from '../ResponseTemplateSelection';
import { Body_reply_to_emails, EmailBody, EmailsService } from '@/tallulah-ts-client';
// import useNotification from 'src/hooks/useNotification';
// import { sendAmplitudeData } from 'src/utils/Amplitude/amplitude';

export interface IEmailReply {
  setOpenReplyModal: (isOpen: boolean) => void;
  selectedEmailsIds: string[];
  mailBoxId: string;
}

const EmailReply: React.FC<IEmailReply> = ({ setOpenReplyModal, mailBoxId, selectedEmailsIds }) => {
  const [toField, setToField] = useState<string>(`${selectedEmailsIds.length} selected emails`);
  const [emailSubject, setEmailSubject] = useState<string>('');
  const [emailBody, setEmailBody] = useState<string>('');
  const [isTemplateSelectionModalOpen, setIsTemplateSelectionModalOpen] = useState<boolean>(false);
  // TODO
  // const [sendNotification] = useNotification();

  const EmailSignatureLogo = `<img src="https://tallulahstorageiuvew.blob.core.windows.net/logos/TOUCH_logo_Final.png" alt="Sail Logo" width="150" height="150" border="0" style="display: block; padding-bottom: 10px;" />`;
  const EmailSignatureLog_2 = `<img src="https://tallulahstorageiuvew.blob.core.windows.net/logos/When_We_Trial_Logo.png" alt="Sail Logo" width="250" height="100" border="0" style="display: block; padding-bottom: 10px;" />`;

  const handleSendEmail = async () => {
    // sendAmplitudeData('Email Reply Modal - Send Button Clicked');
    const emailBodyWithSignature = `${emailBody} <br/> ${EmailSignatureLogo} <br/> ${EmailSignatureLog_2}`;
    const body: Body_reply_to_emails = {
      subject: emailSubject.length > 0 ? emailSubject : undefined,
      reply: {
        contentType: 'html',
        content: emailBodyWithSignature
      }
    };
    const tags = undefined;
    try {
      const response = await EmailsService.replyToEmails(mailBoxId, selectedEmailsIds, tags, body);
      // sendNotification({
      //   msg: 'Response sent successfully',
      //   variant: 'success'
      // });
      setOpenReplyModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box className={styles.container}>
      <Box
        sx={{
          backgroundColor: '#f5f5f5',
          padding: '10px',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.10)'
        }}
      >
        <Typography variant="h6">Reply to selected emails</Typography>
        <Box>
          <IconButton
            onClick={() => {
              setOpenReplyModal(false);
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>
      <Box
        sx={{
          padding: '20px'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '30px'
          }}
        >
          <TextField
            label="To"
            variant="outlined"
            fullWidth
            size="small"
            InputProps={{
              readOnly: true
            }}
            value={toField}
            sx={{
              flex: 3
            }}
          />
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '10px',
            width: '100%'
          }}
        >
          <Button
            variant="outlined"
            onClick={() => {
              // sendAmplitudeData('Email Reply Modal - Choose from response templates button clicked');
              setIsTemplateSelectionModalOpen(true);
            }}
          >
            Choose from response templates
          </Button>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '10px',
            width: '100%'
          }}
        >
          <Typography variant="h6">OR</Typography>
        </Box>
        <Box>
          <TextField
            className={styles.textField}
            label="Subject"
            variant="outlined"
            fullWidth
            size="small"
            value={emailSubject}
            onChange={(e) => {
              setEmailSubject(e.target.value);
            }}
            InputLabelProps={{
              shrink: true
            }}
          />
          <ReactQuill theme="snow" value={emailBody} onChange={setEmailBody} className={styles.textField} />
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
            width: '100%',
            marginTop: '40px'
          }}
        >
          <Button
            variant="outlined"
            fullWidth
            sx={{ marginTop: '20px' }}
            onClick={() => {
              setOpenReplyModal(false);
            }}
          >
            Cancel
          </Button>
          <Button variant="contained" fullWidth sx={{ marginTop: '20px', marginLeft: '10px' }} onClick={handleSendEmail}>
            Send
          </Button>
        </Box>
      </Box>
      <Dialog
        open={isTemplateSelectionModalOpen}
        onClose={() => {
          setIsTemplateSelectionModalOpen(false);
        }}
        fullWidth
      >
        <ResponseTemplateSelection
          setEmailBody={setEmailBody}
          setEmailSubject={setEmailSubject}
          setIsTemplateSelectionModalOpen={setIsTemplateSelectionModalOpen}
        />
      </Dialog>
    </Box>
  );
};

export default EmailReply;
