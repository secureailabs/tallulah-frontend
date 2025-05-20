'use client'

// MUI Imports
import CustomTextField from '@/@core/components/mui/TextField'
import { Button } from '@mui/material'
import Grid from '@mui/material/Grid'
import { Controller, useForm } from 'react-hook-form'
import { UsersService } from '@/tallulah-ts-client'
import { toast } from 'react-toastify'
import { useEffect, useState } from 'react'
import { set } from 'date-fns'

/*
"name": "string",
  "email": "user@example.com",
  "job_title": "string",
  "roles": [
    "USER"
  ],
  "avatar": "string",
  "password": "string",
  "organization_id": "string",
  "organization_name": "string"
*/

const AddUserForm = ({ data }: { data?: any }) => {
  const {
    handleSubmit,
    control,
    getValues,
    formState,
    reset,
    formState: { isSubmitSuccessful }
  } = useForm({
    mode: 'onChange'
  })

  useEffect(() => {
    if (isSubmitSuccessful) {
      console.log('isSubmitSuccessful', isSubmitSuccessful)
      reset(undefined, { keepDirtyValues: true })
    }
  }, [isSubmitSuccessful, reset])

  const onSubmit = async (data: any) => {
    console.log('data', data)
    const formData = {
      name: data.name,
      email: data.email,
      job_title: data.job_title,
      roles: [data.role],
      avatar: null,
      password: data.password,
      organization_id: data.organization_id ? data.organization_id : null,
      organization_name: data.organization_name ? data.organization_name : null
    }
    console.log('formData', formData)
    if (!formData.organization_id && !formData.organization_name) {
      toast.error('Organization Id or Organization Name is required')
      return
    }

    UsersService.registerUser(formData)
      .then(res => {
        console.log('res', res)
        toast.success(`Create user ${data.email} successfully`)
      })
      .catch(err => {
        console.log('err', err)
        toast.error(`Create user ${data.email} failed`)
      })
  }

  return (
    <form>
      <Grid container spacing={6}>
        <Grid item md={6} xs={12} spacing={6} className='flex flex-col gap-3'>
          <Grid item xs={12} sm={6}>
            <h1>Add User</h1>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name='name'
              control={control}
              rules={{ required: 'Name is required' }}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <CustomTextField
                  onChange={onChange}
                  error={!!error}
                  value={value}
                  fullWidth
                  label='Name'
                  placeholder='John Doe'
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name='email'
              control={control}
              rules={{ required: 'Email address is required' }}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <CustomTextField
                  onChange={onChange}
                  error={!!error}
                  value={value}
                  type='email'
                  fullWidth
                  label='Email'
                  placeholder='john.doe@gmail.com'
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name='password'
              control={control}
              rules={{ required: 'Password is required' }}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <CustomTextField
                  onChange={onChange}
                  error={!!error}
                  value={value}
                  fullWidth
                  label='Password'
                  placeholder='secret'
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name='job_title'
              control={control}
              rules={{ required: 'Job Title is required' }}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <CustomTextField
                  onChange={onChange}
                  error={!!error}
                  value={value}
                  fullWidth
                  label='Job Title'
                  placeholder='Director'
                />
              )}
            />
          </Grid>
          {/* <Grid item xs={12} sm={6}>
            <CustomTextField fullWidth label='Avatar' placeholder='' />
          </Grid> */}
          <Grid item xs={12} sm={6}>
            <Controller
              name='role'
              control={control}
              rules={{ required: 'Role is required' }}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <CustomTextField
                  onChange={onChange}
                  error={!!error}
                  value={value}
                  fullWidth
                  label='Role'
                  placeholder='USER'
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name='organization_id'
              control={control}
              rules={{ required: false }}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <CustomTextField
                  onChange={onChange}
                  error={!!error}
                  value={value}
                  fullWidth
                  label='Organization Id'
                  placeholder='c0da-abc-123'
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name='organization_name'
              control={control}
              rules={{ required: false }}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <CustomTextField
                  onChange={onChange}
                  error={!!error}
                  value={value}
                  fullWidth
                  label='Organization Name'
                  placeholder='Array'
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button
              disabled={!formState.isValid || formState.isSubmitting}
              variant='contained'
              onClick={handleSubmit(onSubmit)}
              type='submit'
            >
              Create User
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </form>
  )
}

export default AddUserForm
