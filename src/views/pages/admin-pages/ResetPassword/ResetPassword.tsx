'use client';

import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import styles from './ResetPassword.module.css';
// import useNotification from 'src/hooks/useNotification';
import { AuthenticationService } from '@/tallulah-ts-client';
import PasswordChecklist from 'react-password-checklist';
export interface IResetPassword {}

const ResetPassword: React.FC<IResetPassword> = ({}) => {
  const [newPassword, setNewPassword] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // const [sendNotification] = useNotification();

  const handleSubmitClick = async () => {
    if(!isValid) {
      // sendNotification({
      //   msg: 'Password does not meet the requirements.',
      //   variant: 'error'
      // });
      return;
    }

    try {
      await AuthenticationService.resetUserPassword({
        current_password: '',
        new_password: newPassword
      });
      // sendNotification({
      //   msg: 'Password reset successful.',
      //   variant: 'success'
      // });
      // Reset state
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error) {
      // sendNotification({
      //   msg: 'Password reset failed. Please try again.',
      //   variant: 'error'
      // });
    }
  };

  return (
    <Box className={styles.container}>
      <Typography variant="h3">Reset Password</Typography>
      <Box>
        <Typography>Change your password here.</Typography>
      </Box>
      <Box mt={2}>
        <TextField
          label="New Password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <TextField
          label="Confirm New Password"
          variant="outlined"
          type="password"
          fullWidth
          margin="normal"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
        />
        <PasswordChecklist
          rules={["lowercase", "capital", "minLength", "number", "specialChar", "match"]}
          minLength={15}
          value={newPassword}
          valueAgain={confirmNewPassword}
          onChange={(isValid) => {
            setIsValid(isValid);
          }}
        />
      </Box>
      <Button disabled={!isValid} variant="contained" color="primary" style={{ marginTop: '20px' }} onClick={handleSubmitClick}>
        Reset Password
      </Button>
    </Box>
  );
};

export default ResetPassword;
