'use client'

import { useEffect, useState } from 'react'
import {
  FormDataService,
  FormMediaTypes,
  FormTemplatesService,
  GetMultipleFormTemplate_Out
} from '@/tallulah-ts-client'
import styles from './PatientDetailEditModal.module.css'
import CloseIcon from '@mui/icons-material/Close'
import {
  TextField,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Button,
  Select,
  MenuItem,
  InputLabel,
  Box,
  Typography,
  CircularProgress,
  Modal
} from '@mui/material'
import { TMediaFileUpload } from '@/components/ImageEditComponent/ImageUpload'
import ImageEditComponent from '@/components/ImageEditComponent'
import { set } from 'react-hook-form'
import axios from 'axios'
import { toast } from 'react-toastify'

export interface IPatientDetailEditModal {
  openModal: boolean
  handleCloseModal: () => void
  data: any
  handleParentClose: (refresh: boolean) => void
  formDataId: string
  formTemplateId: string
}

const PatientDetailEditModal: React.FC<IPatientDetailEditModal> = ({
  openModal,
  handleCloseModal,
  data,
  formDataId,
  formTemplateId,
  handleParentClose
}) => {
  const [formData, setFormData] = useState<any>({ ...data })
  const [formTemplate, setFormTemplate] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [privateFields, setPrivateFields] = useState<any>([])
  const [imageFiles, setImageFiles] = useState<TMediaFileUpload[]>([])
  const [savedPhotosList, setSavedPhotosList] = useState<any[]>([])
  const [newProfilePicture, setNewProfilePicture] = useState<any[]>([])

  useEffect(() => {
    const fetchFormTemplate = async () => {
      const template = await FormTemplatesService.getFormTemplate(formTemplateId)
      setFormTemplate(template)
    }

    if (formTemplateId && !formTemplate) {
      fetchFormTemplate()
    }
  }, [formTemplateId])

  const getCorrespondingLabel = (fieldName: string) => {
    const field = privateFields.find((field: any) => field?.name === fieldName)
    return field?.label
  }

  const getCorrespondingType = (fieldName: string) => {
    const field = privateFields.find((field: any) => field?.name === fieldName)
    return field?.type
  }

  const handleFormDataChange = (event: any, privateField = false) => {
    const name = event.target.name
    const value = event.target.value
    const newFormData = { ...formData }
    if (name in newFormData) {
      newFormData[name] = { ...newFormData[name], value: value }
    } else {
      newFormData[name] = {
        value: value,
        type: getCorrespondingType(event.target.name),
        private: privateField,
        label: getCorrespondingLabel(event.target.name)
      }
    }

    setFormData(newFormData)
  }

  const handleRadioFormDataChange = (event: any, privateField = false) => {
    setFormData({
      ...formData,
      [event.target.name]: {
        value: [event.target.value],
        label: getCorrespondingLabel(event.target.name),
        type: getCorrespondingType(event.target.name),
        private: privateField
      }
    })
  }

  const handleCheckboxFormDataChange = (event: any, privateField = false) => {
    const keyName = event.target.name
    if (event.target.checked) {
      setFormData({
        ...formData,
        [event.target.name]: {
          value: [...(formData[keyName]?.value || []), event.target.value],
          label: getCorrespondingLabel(keyName),
          type: getCorrespondingType(keyName),
          private: privateField
        }
      })
    } else {
      setFormData({
        ...formData,
        [event.target.name]: {
          value: formData[keyName]?.value.filter((value: any) => value !== event.target.value),
          label: getCorrespondingLabel(keyName),
          type: getCorrespondingType(keyName),
          private: privateField
        }
      })
    }
  }

  const handleMediaUpload = async (file: any, type: string, fieldName: string) => {
    const typeEnum =
      type === 'FILE' ? FormMediaTypes.FILE : type === 'IMAGE' ? FormMediaTypes.IMAGE : FormMediaTypes.VIDEO

    const response = await FormDataService.getUploadUrl(typeEnum)
    const { id, url } = response

    const uploadResponse = await axios({
      method: 'PUT',
      url: url,
      data: file,
      headers: {
        'x-ms-blob-type': 'BlockBlob',
        'Content-Type': file.type
      }
    })

    if (!uploadResponse) {
      throw new Error('Failed to upload media')
    }

    return { id, fieldName, fileType: file.type, fileName: file.name } // or any other relevant data from the response
  }

  const handleSubmit = async () => {
    if (isLoading) return
    setIsLoading(true)

    const newFormData = { ...formData }
    // check if there is a field named 'Images' in the form data
    const isImagesFieldExist = Object.keys(newFormData).includes('photos')
    if (isImagesFieldExist) {
      // remove the 'Images' field from the form data
      delete newFormData['photos']
      newFormData['photos'] = { value: savedPhotosList, type: 'IMAGE', label: 'Photos' }
      const mediaUploadPromises: any[] = []

      imageFiles?.forEach((imageFile: any) => {
        imageFile.files.forEach((file: any) => {
          mediaUploadPromises.push(handleMediaUpload(file.file, 'IMAGE', imageFile.fieldName))
        })
      })

      // filter the

      const mediaUploadResults = await Promise.all(mediaUploadPromises)

      mediaUploadResults.forEach((mediaUploadResult: any) => {
        newFormData[mediaUploadResult.fieldName].value.push({
          id: mediaUploadResult.id,
          type: mediaUploadResult.fileType,
          name: mediaUploadResult.fileName
        })
      })
    }

    const isProfilePictureFieldExist = Object.keys(newFormData).includes('profilePicture')
    if (isProfilePictureFieldExist && newProfilePicture.length > 0) {
      delete newFormData['profilePicture']
      newFormData['profilePicture'] = { value: [], type: 'IMAGE', label: 'Profile Picture' }
      const mediaUploadPromises: any[] = []

      newProfilePicture?.forEach((imageFile: any) => {
        imageFile.files.forEach((file: any) => {
          mediaUploadPromises.push(handleMediaUpload(file.file, 'IMAGE', 'profilePicture'))
        })
      })

      const mediaUploadResults = await Promise.all(mediaUploadPromises)

      mediaUploadResults.forEach((mediaUploadResult: any) => {
        newFormData['profilePicture'].value.push({
          id: mediaUploadResult.id,
          type: mediaUploadResult.fileType,
          name: mediaUploadResult.fileName
        })
      })
    }

    try {
      await FormDataService.updateFormData(formDataId, { values: newFormData })
      handleCloseModal()
      handleParentClose(true)
    } catch (error) {
      console.log(error)
      toast.error('Failed to edit story')
    }
    setIsLoading(false)
  }

  const handleRemoveSavedPhoto = (photoId: string) => {
    const newSavedPhotosList = savedPhotosList.filter(image => image.id !== photoId)
    setSavedPhotosList(newSavedPhotosList)
  }

  /*const renderField = (fieldName: any, field: any) => {
    switch (field.type) {
      case 'TEXTAREA':
        return (
          <>
            <Typography>{field.label}</Typography>
            <TextField
              name={fieldName}
              defaultValue={field.value}
              fullWidth
              multiline
              rows={6}
              onChange={handleFormDataChange}
              sx={{
                width: '100%'
              }}
            />
          </>
        )
      case 'IMAGE':
        return (
          <Box
            sx={{
              width: '100%'
            }}
          >
            {fieldName === 'profilePicture' ? (
              <ImageEditComponent
                type='profilePicture'
                setImageFiles={setNewProfilePicture}
                imageFileIds={field.value}
                handleRemovePhoto={(photoId: string) => {
                  setNewProfilePicture([])
                }}
              />
            ) : (
              <ImageEditComponent
                setImageFiles={setImageFiles}
                imageFileIds={savedPhotosList}
                handleRemovePhoto={handleRemoveSavedPhoto}
              />
            )}
          </Box>
        )
      case 'FILE':
      case 'VIDEO':
        return null
      default:
        return (
          <TextField
            name={fieldName}
            defaultValue={field.value}
            fullWidth
            className={styles.inputStyle}
            type='text'
            variant='outlined'
            onChange={handleFormDataChange}
            label={field.label}
          />
        )
    }
  }*/

  const findTemplateField = (fieldName: string) => {
    let field: any = null
    for (const group in formTemplate?.field_groups) {
      field = formTemplate?.field_groups[group]['fields'].find((field: any) => field.name === fieldName)
      if (field) {
        console.log('Found: ' + fieldName)
        return field
      }
    }
    return null
  }

  const renderField = (fieldName: any, field: any, privateField: boolean = false) => {
    const templateField = findTemplateField(fieldName)
    switch (field.type) {
      case 'TEXTAREA':
        return (
          <>
            <Typography>{field.label}</Typography>
            <TextField
              name={fieldName}
              defaultValue={field.value}
              fullWidth
              multiline
              rows={6}
              onChange={e => handleFormDataChange(e, privateField)}
              sx={{
                width: '100%'
              }}
            />
          </>
        )
      case 'NUMBER':
        return (
          <TextField
            name={fieldName}
            defaultValue={field.value}
            fullWidth
            type='number'
            variant='outlined'
            onChange={e => handleFormDataChange(e, privateField)}
            label={field.label}
          />
        )
      case 'DATE':
        return (
          <TextField
            name={fieldName}
            defaultValue={field.value}
            fullWidth
            type='date'
            variant='outlined'
            onChange={e => handleFormDataChange(e, privateField)}
            label={field.label}
            InputLabelProps={{ shrink: true }}
          />
        )
      case 'TIME':
        return (
          <TextField
            name={fieldName}
            defaultValue={field.value}
            fullWidth
            type='time'
            variant='outlined'
            onChange={e => handleFormDataChange(e, privateField)}
            label={field.label}
            InputLabelProps={{ shrink: true }}
          />
        )
      case 'DATETIME':
        return (
          <TextField
            name={fieldName}
            defaultValue={field.value}
            fullWidth
            type='datetime-local'
            variant='outlined'
            onChange={e => handleFormDataChange(e, privateField)}
            label={field.label}
            InputLabelProps={{ shrink: true }}
          />
        )
      case 'SELECT':
        return (
          <FormControl fullWidth>
            <InputLabel
              id={field.label}
              sx={{
                backgroundColor: 'white',
                paddingX: '5px'
              }}
            >
              {field.label}
            </InputLabel>
            <Select
              onChange={e => handleFormDataChange(e, privateField)}
              labelId={field.label}
              name={fieldName}
              defaultValue={field.value}
            >
              {templateField?.options.map((option: any) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )
      case 'RADIO':
        return (
          <>
            <Box
              sx={{
                display: 'flex',
                width: '100%'
              }}
            >
              <Typography>{field.label}</Typography>
            </Box>
            <FormControl component='fieldset'>
              <RadioGroup
                aria-label={fieldName}
                onChange={e => handleRadioFormDataChange(e, privateField)}
                row
                name={fieldName}
                defaultValue={field.value}
              >
                {templateField?.options.map((option: any) => (
                  <FormControlLabel key={option} value={option} control={<Radio />} label={option} />
                ))}
              </RadioGroup>
            </FormControl>
          </>
        )
      case 'CHECKBOX':
        return (
          <>
            <Box
              sx={{
                display: 'flex',
                width: '100%'
              }}
            >
              <Typography>{field.label}</Typography>
            </Box>
            {templateField?.options.map((option: any) => (
              <FormControlLabel
                key={option}
                control={<Checkbox />}
                label={option}
                onChange={e => handleCheckboxFormDataChange(e, privateField)}
                name={fieldName}
                value={option}
              />
            ))}
          </>
        )
      case 'IMAGE':
        return (
          <Box
            sx={{
              width: '100%'
            }}
          >
            {fieldName === 'profilePicture' ? (
              <ImageEditComponent
                type='profilePicture'
                setImageFiles={setNewProfilePicture}
                imageFileIds={field.value}
                handleRemovePhoto={(photoId: string) => {
                  setNewProfilePicture([])
                }}
              />
            ) : (
              <ImageEditComponent
                setImageFiles={setImageFiles}
                imageFileIds={savedPhotosList}
                handleRemovePhoto={handleRemoveSavedPhoto}
              />
            )}
          </Box>
        )
      case 'FILE':
      case 'VIDEO':
        return null
      default:
        return (
          <TextField
            name={fieldName}
            defaultValue={field.value}
            fullWidth
            className={styles.inputStyle}
            type='text'
            variant='outlined'
            onChange={handleFormDataChange}
            label={field.label}
          />
        )
    }
  }

  const renderPrivateField = (field: any) => {
    switch (field.type) {
      case 'STRING':
      case 'EMAIL':
      case 'PHONE':
      case 'URL':
        return (
          <TextField
            name={field.name}
            fullWidth
            className={styles.inputStyle}
            type='text'
            placeholder={field.place_holder}
            required={field.required}
            variant='outlined'
            onChange={e => handleFormDataChange(e, true)}
            label={field.description}
            defaultValue={data[field.name]?.value}
          />
        )
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
              onChange={e => handleFormDataChange(e, true)}
              sx={{
                width: '100%'
              }}
              defaultValue={data[field.name]?.value}
            />
          </>
        )
      default:
        return null
    }
  }

  const renderEditablePrivateFields = (
    <Box>
      {privateFields.map((field: any) => (
        <Box
          sx={{
            margin: '1rem'
          }}
        >
          {renderPrivateField(field)}
        </Box>
      ))}
    </Box>
  )

  const fetchFormTemplate = async () => {
    try {
      const res: GetMultipleFormTemplate_Out = await FormTemplatesService.getAllFormTemplates()
      const filteredData = res.templates.filter((formTemplate: any) => formTemplate.state === 'PUBLISHED')
      const formTemplate = filteredData[0]
      const allFields = formTemplate?.field_groups?.flatMap((group: any) => group.fields)
      const privateFields = allFields?.filter((field: any) => 'private' in field && field.private)
      setPrivateFields(privateFields)
    } catch (err) {
      console.log(err)
    }
  }

  const isPrivateField = (fieldName: string) => {
    return privateFields.some((field: any) => field.name === fieldName)
  }

  useEffect(() => {
    fetchFormTemplate()
    try {
      const savedPhotos: any = Object.entries(data).filter(
        ([key, value]: [string, any]) => value.type === 'IMAGE' && key !== 'profilePicture'
      )
      const savedPhotosList = savedPhotos[0][1].value
      setSavedPhotosList(savedPhotosList)
    } catch (err) {
      console.log(err)
    }
  }, [])

  return (
    <Modal open={openModal} onClose={handleCloseModal}>
      <Box className={styles.container}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: '1rem',
            padding: '1rem',
            position: 'absolute',
            top: '0',
            right: '0'
          }}
        >
          <CloseIcon
            onClick={handleCloseModal}
            sx={{
              cursor: 'pointer'
            }}
          />
        </Box>

        <Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderBottom: '1px solid #e0e0e0',
              padding: '1rem',
              width: '100%'
            }}
          >
            <Typography variant='h4' sx={{ margin: '1rem', textAlign: 'center' }}>
              Edit Patient Story Details
            </Typography>
          </Box>
          <Box
            sx={{
              padding: '1rem'
            }}
          >
            {Object.entries(data).map((field: any) => {
              if (isPrivateField(field[0])) return null
              return (
                <Box key={field[1].name} sx={{ margin: '1rem' }}>
                  {renderField(field[0], field[1])}
                </Box>
              )
            })}
            {renderEditablePrivateFields}
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '1rem',
            bottom: '0',
            width: '100%'
          }}
        >
          {isLoading && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '1rem'
              }}
            >
              <CircularProgress />
            </Box>
          )}
          <Button variant='contained' color='primary' sx={{ margin: '1rem' }} fullWidth onClick={handleSubmit}>
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}

export default PatientDetailEditModal
