import { Box, FormControl, InputAdornment, OutlinedInput } from '@mui/material';
import styles from './PromptInputBox.module.css';
import { useState } from 'react';
import SendIcon from '@mui/icons-material/Send';

export interface IPromptInputBox {
  handleKeyPress?: (promptText: string) => void;
}

const PromptInputBox: React.FC<IPromptInputBox> = ({ handleKeyPress }) => {
  const [inputText, setInputText] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const handleEnterPressed = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleKeyPress && handleKeyPress(inputText);
      setInputText('');
      // unfocus the input box
      e.currentTarget.blur();
    }
  };

  return (
    <Box className={styles.container}>
      <FormControl
        sx={{
          width: '100%',
          backgroundColor: '#fff',
          boxShadow: '1px 2px 2px rgba(156, 156, 156, 0.25)',
          border: '1px solid #d1d1d1',
          borderRadius: '0.5rem',
          alignSelf: 'center'
        }}
        variant="outlined"
      >
        <OutlinedInput
          id="prompt-input"
          multiline
          rows={2}
          placeholder="Write your prompt here..."
          endAdornment={
            <InputAdornment position="end">
              <SendIcon />
            </InputAdornment>
          }
          value={inputText}
          onChange={handleInputChange}
          onKeyDown={handleEnterPressed}
          sx={{
            '& fieldset': {
              border: 'none'
            }
          }}
        />
      </FormControl>
    </Box>
  );
};

export default PromptInputBox;
