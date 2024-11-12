import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Modal,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography
} from '@mui/material';
import styles from './FormPreviewModal.module.css';
import CloseIcon from '@mui/icons-material/Close';

export interface IFormPreviewModal {
  openModal: boolean;
  handleCloseModal: () => void;
  form: any;
}

const spanFullWidth = (field: any) => {
  const fullWidthTypes = ['TEXTAREA', 'FILE', 'IMAGE', 'VIDEO', 'CHECKBOX', 'RADIO', 'CONSENT_CHECKBOX'];
  return fullWidthTypes.includes(field.type);
};

const FormPreviewModal: React.FC<IFormPreviewModal> = ({ openModal, handleCloseModal, form }) => {
  const renderField = (field: any) => {
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
            type="text"
            placeholder={field.place_holder}
            required={field.required}
            variant="outlined"
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
              <Select labelId={`${field.name}-label`} name={field.name} required={field.required}>
                {field.options.map((option: any) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
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
              <Select required={field.required} labelId={field.place_holder} name={field.name}>
                {field.options.map((option: any) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          );
        }
      case 'RADIO':
        return (
          <>
            <Box
              sx={{
                display: 'flex',
                width: '100%'
              }}
            >
              <Typography dangerouslySetInnerHTML={{ __html: field.description }} />
              {field.required ? <Typography color="red"> &nbsp; (*Required)</Typography> : null}
            </Box>
            <FormControl component="fieldset">
              <RadioGroup aria-label={field.name} row name={field.name}>
                {field.options.map((option: any) => (
                  <FormControlLabel key={option} value={option} control={<Radio />} label={option} />
                ))}
              </RadioGroup>
            </FormControl>
          </>
        );
      case 'CHECKBOX':
        return (
          <>
            <Box
              sx={{
                display: 'flex',
                width: '100%'
              }}
            >
              <Typography dangerouslySetInnerHTML={{ __html: field.description }} />
              {field.required ? <Typography color="red"> &nbsp; (*Required)</Typography> : null}
            </Box>
            {field.options.map((option: any) => (
              <FormControlLabel key={option} control={<Checkbox />} label={option} name={field.name} value={option} />
            ))}
          </>
        );
      case 'CONSENT_CHECKBOX':
        return (
          <>
            {/* in this description it also has <a></a> tag which needs to be displayed as link so use dangerouslySetInnerHTML */}
            <Box
              sx={{
                display: 'flex',
                width: '100%'
              }}
            >
              <Typography dangerouslySetInnerHTML={{ __html: field.description }} />
              {field.required ? <Typography color="red"> &nbsp; (*Required)</Typography> : null}
            </Box>

            {field.options.map((option: any) => (
              <FormControlLabel key={option} control={<Checkbox />} label={option} name={field.name} value={option} />
            ))}
          </>
        );
      default:
        return null;
    }
  };

  const renderModalCardHeader = (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: '1rem',
        padding: '1rem'
      }}
    >
      <CloseIcon
        onClick={handleCloseModal}
        sx={{
          cursor: 'pointer'
        }}
      />
    </Box>
  );

  return (
    <Modal open={openModal} onClose={handleCloseModal}>
      <Box
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          outline: 'none',
          width: '1000px',
          overflowY: 'scroll',
          height: '90%',
          backgroundColor: '#fff'
        }}
      >
        {renderModalCardHeader}
        <Box
          sx={{
            padding: '40px'
          }}
        >
          {form?.field_groups?.map((field: any) => {
            const nonPrivateFields = field.fields.filter((field: any) => !field.private);
            if (nonPrivateFields.length === 0) {
              return null;
            }
            return (
              <Box
                key={field.name}
                sx={{
                  marginY: '30px'
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    marginBottom: '20px'
                  }}
                >
                  {field.description}
                </Typography>

                <Box className={styles.gridContainer}>
                  {field.fields.map((field: any) => (
                    <Box
                      key={field.name}
                      className={`${styles.gridItem} ${spanFullWidth(field) ? styles.fullWidth : ''}`}
                      sx={{
                        width: '100%'
                      }}
                    >
                      {renderField(field)}
                    </Box>
                  ))}
                </Box>
              </Box>
            );
          })}
          <Button type="submit" variant="contained" fullWidth>
            Submit
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default FormPreviewModal;
