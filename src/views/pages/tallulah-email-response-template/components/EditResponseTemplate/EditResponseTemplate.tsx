import { Box, Button, IconButton, TextField, Typography } from '@mui/material';
import styles from './EditResponseTemplate.module.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useState } from 'react';
import { GetResponseTemplate_Out, RegisterResponseTemplate_In, ResponseTemplatesService } from '@/tallulah-ts-client';
// import useNotification from 'src/hooks/useNotification';
import CloseIcon from '@mui/icons-material/Close';

export interface IEditResponseTemplate {
  initialData?: GetResponseTemplate_Out;
  setIsModalOpen: (isOpen: boolean) => void;
  handleRefresh: () => void;
}

const EditResponseTemplate: React.FC<IEditResponseTemplate> = ({ initialData, setIsModalOpen, handleRefresh }) => {
  const [templateName, setTemplateName] = useState<string>(initialData ? initialData.name : '');
  const [templateSubject, setTemplateSubject] = useState<string>(initialData && initialData.subject ? initialData.subject : '');
  const [templateBody, setTemplateBody] = useState<string>(initialData && initialData.body?.content ? initialData.body.content : '');
  const [isEditMode, setIsEditMode] = useState<boolean>(initialData ? true : false);
  // TODO
  // const [sendNotification] = useNotification();

  const handleOnSaveClicked = async () => {
    const body: RegisterResponseTemplate_In = {
      name: templateName,
      subject: templateSubject,
      body: {
        contentType: 'text/html',
        content: templateBody
      }
    };
    try {
      const response = await ResponseTemplatesService.addNewResponseTemplate(body);
      handleRefresh();
      // sendNotification({
      //   msg: 'Template added successfully',
      //   variant: 'success'
      // });
      setIsModalOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleOnEditClicked = async () => {
    const body = {
      subject: templateSubject,
      body: {
        contentType: 'text/html',
        content: templateBody
      }
    };
    try {
      const response = await ResponseTemplatesService.updateResponseTemplate(initialData!.id, body);
      handleRefresh();
      // sendNotification({
      //   msg: 'Template modified successfully',
      //   variant: 'success'
      // });
      setIsModalOpen(false);
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
        <Typography variant="h6">Enter Template Details</Typography>
        <Box>
          <IconButton
            onClick={() => {
              setIsModalOpen(false);
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
        <TextField
          className={styles.textField}
          label="Template Name"
          variant="outlined"
          fullWidth
          size="small"
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
        />
        <TextField
          className={styles.textField}
          label="Template Subject"
          variant="outlined"
          fullWidth
          size="small"
          value={templateSubject}
          onChange={(e) => setTemplateSubject(e.target.value)}
        />
        <ReactQuill theme="snow" value={templateBody} onChange={setTemplateBody} className={styles.textField} />
      </Box>
      <Box
        sx={{
          position: 'absolute',
          bottom: '0',
          left: '0',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          marginTop: '20px',
          padding: '20px',
          gap: '20px'
        }}
      >
        <Button
          variant="outlined"
          fullWidth
          onClick={() => {
            setIsModalOpen(false);
          }}
        >
          Cancel
        </Button>
        <Button fullWidth variant="contained" className={styles.button} onClick={isEditMode ? handleOnEditClicked : handleOnSaveClicked}>
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default EditResponseTemplate;
