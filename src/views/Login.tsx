'use client'

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { MuiTelInput } from 'mui-tel-input';
import { Divider, IconButton, InputAdornment, Stack } from '@mui/material';
import styles from './Login.module.css';
import { Controller, useForm } from 'react-hook-form';
import { useState } from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { LoginSuccess_Out, OpenAPI, AuthenticationService, Body_login, UserRole } from '@/tallulah-ts-client';

// import useNotification from 'src/hooks/useNotification';
// import { activeAccessToken, activeRefreshToken, tokenType, updateAuthState } from '@/store/reducers/Auth';
// import { useNavigate } from 'react-router-dom';
import { Otptimer } from "otp-timer-ts";

import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  RecaptchaVerifier,
  multiFactor,
  getMultiFactorResolver,
  PhoneMultiFactorGenerator,
  PhoneAuthProvider,
  User,
  MultiFactorResolver
} from 'firebase/auth';
import { auth } from '@/firebase';
import { Router } from 'next/router';
import { useDispatch } from 'react-redux';
import { setToken } from '@/redux-store/slices/auth';
import { useRouter } from 'next/navigation';

export interface IEmailAndPassword {
  username: string;
  password: string;
}

// export const storeLoginCredentials = (tokens: LoginSuccess_Out) => {
//   dispatch(
//     updateAuthState({
//       accessToken: tokens.access_token,
//       refreshToken: tokens.refresh_token,
//       tokenType: tokens.token_type
//     })
//   );
// };

export const roleBasedHomeRouting = (roles: UserRole[]) => {
  if (roles.includes(UserRole.TALLULAH_ADMIN) || roles.includes(UserRole.EMAIL_INTEGRATION_USER)) {
    return '/email-assistant';
  } else if (roles.includes(UserRole.FORM_INTAKE_USER)) {
    return '/patient-story';
  } else if (roles.includes(UserRole.CONTENT_GENERATION_USER)) {
    return '/content-generation';
  } else if (roles.includes(UserRole.PATIENT_PROFILE_USER)) {
    return '/patient-profile';
  } else {
    return '/email-assistant';
  }
};

const Login: React.FC = () => {
  const { handleSubmit, control, getValues, formState, reset } = useForm({
    mode: "onChange"
  });
  // const navigate = useNavigate();

   // Reducer
   const dispatch = useDispatch()
   const router = useRouter()

  const onSubmit = (data: any) => {
    postLogin(data);
  };
  const [showPassword, setShowPassword] = useState(false);
  // const [sendNotification] = useNotification();
  const [fuser, setFUser] = useState<User | null>(null);
  const [verificationId, setVerificationId] = useState('');
  const [resolver, setResolver] = useState<any>(null);
  const [loginStep, setLoginStep] = useState("login");

  const handleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const showInfoNotification = () => {
    // sendNotification({
    //   msg: 'Please contact your administrator',
    //   variant: 'info'
    // });
  };

  async function forgotPassword() {
    const { username } = getValues();
    if (!username) {
      // sendNotification({
      //   msg: 'Email is empty',
      //   variant: 'error'
      // });
      return;
    }
    sendPasswordResetEmail(auth, username)
      .then(() => {
        // sendNotification({
        //   msg: 'Password reset email sent',
        //   variant: 'success'
        // });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        // sendNotification({
        //   msg: 'Invalid email or password',
        //   variant: 'error'
        // });
      });
  }

  async function sendOtp(recaptchaVerifier: RecaptchaVerifier, resolver: MultiFactorResolver) {
    const phoneAuthProvider = new PhoneAuthProvider(auth);
    var idx = 0;
    for (const hint of resolver.hints) {
      if (hint.factorId === PhoneMultiFactorGenerator.FACTOR_ID) {
        break;
      }
      idx++;
    }
    if (idx >= resolver.hints.length) {
      throw new Error('Multi-factor authentication not supported');
    }
    const verificationId = await phoneAuthProvider.verifyPhoneNumber(
      {
        multiFactorHint: resolver.hints[idx],
        session: resolver.session
      },
      recaptchaVerifier
    );
    setLoginStep('verify-2fa');
    setVerificationId(verificationId);
  }

  async function handleResend() {
    if (loginStep === 'enroll-2fa-verify') {
      onPhone({ phone: getValues('phone') });
    } else {
      const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container-id', undefined);
      sendOtp(recaptchaVerifier, resolver);
    }
  }

  async function onPhone(data: any) {
    if (!fuser) {
      return;
    }
    const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container-id', undefined);
    const phoneNumber = data.phone;

    fuser.getIdToken(true).then((idToken) => {
        OpenAPI.TOKEN = idToken;
        return AuthenticationService.enable2Fa({ phone: phoneNumber });
      })
      .then((res) => {
        return multiFactor(fuser).getSession();
      })
      .then((userSession) => {
        const phoneAuthProvider = new PhoneAuthProvider(auth);
        return phoneAuthProvider.verifyPhoneNumber(
          {
            phoneNumber: phoneNumber,
            session: userSession
          },
          recaptchaVerifier
        );
      })
      .then((verificationId) => {
        setVerificationId(verificationId);
        setLoginStep('enroll-2fa-verify');
      })
      .catch((error) => {
        console.log(error);
        reset();
      });
  }

  async function onOtp(data: any) {
    try {
      if (loginStep === 'enroll-2fa-verify') {
        const cred = PhoneAuthProvider.credential(verificationId, data.code);
        const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);

        // Complete enrollment.
        if (fuser) {
          await multiFactor(fuser).enroll(multiFactorAssertion, 'Phone');
          continueLogin(fuser);
          //setLoginStep('login');
          //window.location.reload();
        }
      }
      if (loginStep === 'verify-2fa') {
        const cred = PhoneAuthProvider.credential(verificationId, data.code);
        const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);
        // Complete sign-in.
        const userCredential = await resolver.resolveSignIn(multiFactorAssertion);
        continueLogin(userCredential.user);
      }
    } catch (error) {
      console.log(error);
      // sendNotification({
      //   msg: 'Invalid verification code',
      //   variant: 'error'
      // });
      reset();
    }
  }

  async function continueLogin(user: User) {
    const idToken = await user.getIdToken(true);
    OpenAPI.TOKEN = idToken;
    const res = await AuthenticationService.ssologin();
    OpenAPI.TOKEN = res.access_token;
    localStorage.setItem('access_token', res.access_token);
    localStorage.setItem('refresh_token', res.refresh_token);
    dispatch(setToken(res))

    const res2 = await AuthenticationService.getCurrentUserInfo();
    // navigate('/home');
    router.push('/en/dashboards');

    return res;
  }

  async function postLogin(data: IEmailAndPassword) /*: Promise<LoginSuccess_Out | undefined>*/ {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    OpenAPI.TOKEN = '';
    dispatch(setToken({
      'access_token' : '',
      'refresh_token' : '',
      'token_type' : ''
    }))

    // if (!process.env.REACT_APP_SAIL_API_SERVICE_URL) throw new Error('REACT_APP_SAIL_API_SERVICE_URL not set');

    // OpenAPI.BASE = process.env.REACT_APP_SAIL_API_SERVICE_URL;

    const login_req: Body_login = {
      username: data.username,
      password: data.password
    };

    try {
      const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container-id', undefined);
      // const res = await AuthenticationService.login(login_req);

      var userCredential = null;
      try {
        userCredential = await signInWithEmailAndPassword(auth, data.username, data.password);

        // 2FA is not enabled
        setLoginStep('enroll-2fa');
        setFUser(userCredential.user);
        reset();
        return;
      } catch (error: any) {
        if (error.code === 'auth/multi-factor-auth-required') {
          const resolver = getMultiFactorResolver(auth, error);
          sendOtp(recaptchaVerifier, resolver);
          setResolver(resolver);

          return;
        } else {
          throw error;
        }
      }
      continueLogin(userCredential.user);
    } catch (error) {
      console.log(error);
      if (error) {
        // sendNotification({
        //   msg: 'Invalid email or password',
        //   variant: 'error'
        // });
        reset();
      }
    }
  }

  return (
    <Box className={styles.container}>
      <Box
        sx={{
          mt: 6,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          border: '1px solid #e0e0e0',
          borderRadius: 5,
          p: 4,
          backgroundColor: '#fff',
          boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)'
        }}
      >
        {loginStep === 'login' && (
          <Box component="form" noValidate sx={{ mt: 1, width: 400 }} onSubmit={handleSubmit(onSubmit)}>
            <Box className={styles.stack} sx={{ my: 3 }}>
              <Typography variant="h3">Login</Typography>
              <Link variant="subtitle2" href="#" underline="hover" onClick={showInfoNotification}>
                Don't have an account?
              </Link>
            </Box>
            <Typography variant="h6">Email Address</Typography>
            <Controller
              name="username"
              control={control}
              defaultValue=""
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextField
                  sx={{ mt: 1, mb: 4 }}
                  value={value}
                  onChange={onChange}
                  error={!!error}
                  helperText={error ? error.message : null}
                  required
                  fullWidth
                  id="username"
                  label="Enter email address"
                  autoComplete="email"
                  autoFocus
                />
              )}
              rules={{ required: 'Email address is required' }}
            />
            <Typography variant="h6">Password</Typography>
            <Controller
              name="password"
              control={control}
              defaultValue=""
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextField
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleShowPassword} edge="end">
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  sx={{ mt: 1, mb: 2 }}
                  value={value}
                  onChange={onChange}
                  error={!!error}
                  helperText={error ? error.message : null}
                  required
                  fullWidth
                  id="password"
                  label="Enter password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                />
              )}
              rules={{ required: 'Password is required' }}
            />
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
              <FormControlLabel control={<Checkbox value="stay_signedin" color="primary" />} label="Keep me signed in" />
              <Link variant="subtitle2" href="#" underline="hover" onClick={forgotPassword}>
                Forgot password?
              </Link>
            </Stack>
            <div id="recaptcha-container-id"></div>
            <Button
              disabled={!formState.isValid || formState.isSubmitted}
              onClick={handleSubmit(onSubmit)}
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mb: 2 }}
            >
              Log In
            </Button>
            {/* <Divider sx={{ my: 3 }}>
              <Typography variant="body2" sx={{ color: 'primary' }}>
                Login with
              </Typography>
            </Divider>
            <Box component="form">
              <Socials />
            </Box> */}
          </Box>
        )}
        {loginStep === 'enroll-2fa' && (
          <Box component="form" noValidate sx={{ mt: 1, width: 400 }} onSubmit={handleSubmit(onPhone)}>
            <Box className={styles.stack} sx={{ my: 3 }}>
              <Typography variant="h3">Enroll 2FA</Typography>
            </Box>
            <Typography variant="h6">Add your phone number for 2FA</Typography>
            <Controller
              name="phone"
              control={control}
              defaultValue=""
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <MuiTelInput
                  sx={{ mt: 1, mb: 4 }}
                  value={value}
                  onChange={onChange}
                  error={!!error}
                  helperText={error ? error.message : null}
                  required
                  fullWidth
                  defaultCountry="US"
                  id="phone"
                  label="Phone Number"
                  autoFocus
                />
              )}
              rules={{ required: 'Verification Code is required' }}
            />
            <div id="recaptcha-container-id"></div>
            <Button
              disabled={!formState.isValid || formState.isSubmitted}
              id="add-phone-button"
              onClick={handleSubmit(onPhone)}
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mb: 2 }}
            >
              Add Phone
            </Button>
          </Box>
        )}
        {(loginStep === 'enroll-2fa-verify' || loginStep === 'verify-2fa') && (
          <Box component="form" noValidate sx={{ mt: 1, width: 400 }} onSubmit={handleSubmit(onOtp)}>
            <Box className={styles.stack} sx={{ my: 3 }}>
              <Typography variant="h3">{loginStep === 'verify-2fa' ? 'Verify 2FA' : 'Enroll 2FA'}</Typography>
            </Box>
            <Typography variant="h6">Verification Code Sent To Your Phone</Typography>
            <Controller
              name="code"
              control={control}
              defaultValue=""
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextField
                  sx={{ mt: 1, mb: 4 }}
                  value={value}
                  onChange={onChange}
                  error={!!error}
                  helperText={error ? error.message : null}
                  required
                  fullWidth
                  inputProps={{ maxLength: 6, minLength: 6 }}
                  id="verify-code"
                  label="Verification Code"
                  autoFocus
                />
              )}
              rules={{ required: 'Verification Code is required' }}
            />
            <Otptimer minutes={0} seconds={59} onResend={handleResend} />
            <div id="recaptcha-container-id"></div>
            <Button disabled={!formState.isValid} onClick={handleSubmit(onOtp)} type="submit" fullWidth variant="contained" sx={{ mb: 2 }}>
              Verify
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Login;
