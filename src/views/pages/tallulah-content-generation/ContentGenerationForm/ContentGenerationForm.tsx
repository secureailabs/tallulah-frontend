'use client';

import {
  ContentGenerationTemplatesService,
  ContentGenerationsService,
  GetContentGenerationTemplate_Out,
  GetMultipleContentGenerationTemplate_Out
} from '@/tallulah-ts-client';
import styles from './ContentGenerationForm.module.css';
import { useEffect, useState } from 'react';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
// import useNotification from 'src/hooks/useNotification';
// import { useNavigate } from 'react-router-dom';
import { set } from 'react-hook-form';
import { useRouter } from 'next/navigation';

export interface IContentGenerationForm {}

const ContentGenerationForm: React.FC<IContentGenerationForm> = ({}) => {
  const [contentGenerationTemplates, setContentGenerationTemplates] = useState<GetContentGenerationTemplate_Out[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<GetContentGenerationTemplate_Out>();
  const [formData, setFormData] = useState<any>({});
  const [selectedGender, setSelectedGender] = useState<string>('');
  const [isDataSubmitting, setIsDataSubmitting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // const navigate = useNavigate();
  // const [sendNotification] = useNotification();

  const router = useRouter();

  const fetchAllContentGenerartionTemplates = async () => {
    setIsLoading(true);
    try {
      const response: GetMultipleContentGenerationTemplate_Out = await ContentGenerationTemplatesService.getAllContentGenerationTemplates();
      setContentGenerationTemplates(response.templates);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  const handleFormDataChange = (event: any) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  const handleTemplateChange = (event: any) => {
    const template = contentGenerationTemplates.find((template) => template.name === event.target.value);
    setSelectedTemplate(template);
    // set all parameters to empty
    const newFormData: any = {};
    template?.parameters?.forEach((parameter: any) => {
      newFormData[parameter.name] = '';
    });
    setFormData(newFormData);
  };

  const handleGenderChange = (event: any) => {
    setSelectedGender(event.target.value);
    handleFormDataChange(event);
  };

  const renderField = (field: any) => {
    switch (field.type) {
      case 'TEXT':
      case 'STRING':
      case 'EMAIL':
      case 'PHONE':
      case 'URL':
        return (
          <TextField
            name={field.name}
            fullWidth
            className={styles.inputStyle}
            type="text"
            placeholder={field.place_holder}
            required={field.required}
            variant="outlined"
            onChange={handleFormDataChange}
            label={field.description}
          />
        );
      case 'NUMBER':
        return (
          <TextField
            name={field.name}
            fullWidth
            type="number"
            placeholder={field.place_holder}
            required={field.required}
            variant="outlined"
            onChange={handleFormDataChange}
            label={field.description}
          />
        );
      case 'DATE':
        return (
          <TextField
            name={field.name}
            fullWidth
            type="date"
            required={field.required}
            variant="outlined"
            onChange={handleFormDataChange}
            label={field.description}
            InputLabelProps={{ shrink: true }}
          />
        );
      case 'TIME':
        return (
          <TextField
            name={field.name}
            fullWidth
            type="time"
            required={field.required}
            variant="outlined"
            onChange={handleFormDataChange}
            label={field.description}
            InputLabelProps={{ shrink: true }}
          />
        );
      case 'DATETIME':
        return (
          <TextField
            fullWidth
            type="datetime-local"
            required={field.required}
            variant="outlined"
            onChange={handleFormDataChange}
            label={field.description}
            InputLabelProps={{ shrink: true }}
          />
        );
      case 'TEXTAREA':
        return (
          <>
            <Typography>{field.description}</Typography>
            <TextField
              name={field.name}
              fullWidth
              multiline
              rows={6}
              placeholder={field.place_holder}
              required={field.required}
              onChange={handleFormDataChange}
              sx={{
                width: '100%'
              }}
            />
          </>
        );
      case 'SELECT':
        if (field.name === 'gender') {
          return (
            <FormControl fullWidth>
              <InputLabel
                id={field.place_holder}
                sx={{
                  backgroundColor: 'white',
                  paddingX: '5px'
                }}
              >
                {field.place_holder}
              </InputLabel>
              <Select
                labelId={`${field.name}-label`}
                name={field.name}
                onChange={handleGenderChange}
                value={selectedGender}
                required={field.required}
              >
                {field.options.map((option: any) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
              {selectedGender === 'Other' && (
                <TextField
                  fullWidth
                  type="text"
                  name={`${field.name}-other`}
                  variant="outlined"
                  placeholder="Please specify (optional)"
                  onChange={handleFormDataChange}
                  sx={{
                    marginTop: '10px'
                  }}
                />
              )}
            </FormControl>
          );
        } else {
          return (
            <FormControl fullWidth>
              <InputLabel
                id={field.place_holder}
                sx={{
                  backgroundColor: 'white',
                  paddingX: '5px'
                }}
              >
                {field.place_holder}
              </InputLabel>
              <Select required={field.required} onChange={handleFormDataChange} labelId={field.place_holder} name={field.name}>
                {field.options.map((option: any) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          );
        }
      default:
        return null;
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const body = {
      template_id: selectedTemplate?.id as string,
      values: formData
    };
    setIsDataSubmitting(true);
    try {
      const response = await ContentGenerationsService.createContentGeneration(body);
      // navigate('/content-generation');
      router.push('/content-generation');
      // sendNotification({
      //   msg: 'Content generated successfully',
      //   variant: 'success'
      // });
    } catch (error) {
      console.error(error);
      // sendNotification({
      //   msg: 'Failed to generate content',
      //   variant: 'error'
      // });
    }
    setIsDataSubmitting(false);
  };

  useEffect(() => {
    fetchAllContentGenerartionTemplates();
  }, []);

  return (
    <Box>
      {isDataSubmitting && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Typography variant="h4" color="white">
            Submitting. Please wait ...
          </Typography>
          <Typography variant="h5" color="white">
            It may take a while, kindly do not refresh the page.
          </Typography>
        </Box>
      )}
      <FormControl
        fullWidth
        sx={{
          marginTop: '40px',
          backgroundColor: 'white'
        }}
      >
        <InputLabel id="template-select-label">Select a Template</InputLabel>
        <Select labelId="template-select-label" value={selectedTemplate} label="Select a Template" onChange={handleTemplateChange}>
          {contentGenerationTemplates.map((template: any) => (
            <MenuItem key={template.id} value={template.name}>
              {template.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {isLoading && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%'
          }}
        >
          <Typography>Fetching templates please wait...</Typography>
        </Box>
      )}
      <Typography
        sx={{
          fontSize: '12px',
          fontStyle: 'italic'
        }}
      >
        {selectedTemplate?.description}
      </Typography>

      {selectedTemplate && (
        <Box
          sx={{
            backgroundColor: 'white',
            padding: '20px',
            marginTop: '20px'
          }}
        >
          <form onSubmit={handleSubmit}>
            <Box>
              {selectedTemplate?.parameters?.map((field: any) => (
                <Box
                  key={field.name}
                  mt={2}
                  sx={{
                    backgroundColor: 'white'
                  }}
                >
                  {renderField(field)}
                </Box>
              ))}
            </Box>
            <Box>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{
                  marginTop: '20px'
                }}
                type="submit"
              >
                Generate Content
              </Button>
            </Box>
          </form>
        </Box>
      )}
    </Box>
  );
};

export default ContentGenerationForm;
