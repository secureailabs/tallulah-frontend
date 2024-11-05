import { useEffect, useState } from 'react'

import { useSearchParams } from 'next/navigation'

import { Button, Card, CircularProgress, Collapse, Grid, TextField, Typography } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'

import { toast } from 'react-toastify'

import styles from './RedditSearch.module.css'
import Chip from '@/@core/components/mui/Chip'
import { SocialSearchService } from '@/tallulah-ts-client/services/SocialSearchService'

export interface IRedditSearch {
  sampleTextProp?: string
}

const RedditDetailedText = ({ text }: { text: string }) => {
  const [open, setOpen] = useState(false)

  const handleExpandClick = () => {
    setOpen(!open)
  }

  return (
    <Grid>
      <Button onClick={handleExpandClick}>{open ? 'Hide' : 'Show Story'} </Button>
      <Collapse in={open} timeout='auto' unmountOnExit>
        <Typography className={styles.moreText}>{text}</Typography>
      </Collapse>
    </Grid>
  )
}

const RedditSearch = () => {
  const { handleSubmit, control, setValue, formState, reset } = useForm({
    mode: 'onChange'
  })

  const [data, setData] = useState<any>([])
  const [searchInProgress, setSearchInProgress] = useState(false)
  const [searchText, setSearchText] = useState('')

  const searchParams = useSearchParams()

  useEffect(() => {
    const search = searchParams.get('q')

    if (search) {
      setValue('search', search, { shouldValidate: true })
    }
  }, [searchParams, setValue])

  const onSubmit = (data: any) => {
    console.log(data)
    setSearchText(data.search)

    SocialSearchService.redditSearch(data.search)
      .then(response => {
        setData(response)
        reset()
      })
      .catch(error => {
        console.log(error)
      })
  }

  function openInNewTab(url: string) {
    window?.open(url, '_blank')?.focus()
  }

  return (
    <div>
      <h2>Reddit Search</h2>
      <Card
        className={styles.mainCard}
        component='form'
        noValidate
        sx={{ mt: 1, width: '100%' }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <Controller
          name='search'
          control={control}
          defaultValue=''
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <TextField
              sx={{ mt: 1, mb: 4 }}
              value={value}
              onChange={onChange}
              error={!!error}
              helperText={error ? error.message : null}
              required
              fullWidth
              id='search'
              label='Enter text to search'
              autoComplete='text'
              autoFocus
            />
          )}
          rules={{ required: 'Search Text is required' }}
        />
        <Button
          disabled={!formState.isValid || formState.isSubmitted}
          onClick={handleSubmit(onSubmit)}
          type='submit'
          fullWidth
          variant='contained'
          sx={{ mb: 2 }}
        >
          Search
        </Button>
      </Card>

      {data.map((item: any, index: number) => (
        <Card key={index} className={styles.card}>
          <Grid container>
            <Grid container item spacing={2}>
              {item.is_patient_story && (
                <Grid item>
                  <Chip color='error' label='Patient' variant='tonal' />
                </Grid>
              )}
              <Grid item>
                <Chip
                  onClick={() => {
                    openInNewTab('https://www.reddit.com/r/' + item.subreddit)
                  }}
                  clickable={true}
                  label={'Subreddit: ' + item.subreddit}
                  variant='outlined'
                />
              </Grid>
              <Grid item>
                <Chip
                  onClick={() => {
                    openInNewTab(item.author_link)
                  }}
                  clickable={true}
                  label={'Author: ' + item.author}
                  variant='outlined'
                />
              </Grid>
              <Grid item>
                <Chip label={new Date(item.created_utc * 1000).toLocaleString()} variant='outlined' />
              </Grid>
              <Grid item>
                <Chip
                  onClick={() => {
                    SocialSearchService.redditAddTag(item)
                      .then(response => {
                        console.log(response)
                        toast.success('Post successfully marked for connecting.')
                      })
                      .catch(error => {
                        console.log(error)
                        toast.error('Failed marking the post.')
                      })
                  }}
                  clickable={true}
                  label='Connect'
                  color='primary'
                  icon={<i className='tabler-plug-connected' />}
                  variant='filled'
                />
              </Grid>
            </Grid>
            <Grid
              className={styles.title}
              container
              item
              spacing={2}
              onClick={() => {
                openInNewTab(item.link)
              }}
            >
              <Grid item xs={12} md={10}>
                <Typography className={styles.titleText}>{item.title}</Typography>
              </Grid>
              {item.images.length > 0 && item.images[0].startsWith('http') && (
                <Grid item xs={2}>
                  <img className={styles.reddit_image} src={item.images[0]} alt='thumbnail' />
                </Grid>
              )}
            </Grid>
          </Grid>
          {item.selftext && <RedditDetailedText text={item.selftext} />}
        </Card>
      ))}
      {data && data.length > 0 && (
        <Button
          disabled={searchInProgress}
          onClick={(e: any) => {
            setSearchInProgress(true)
            e.preventDefault()
            SocialSearchService.redditSearch(searchText, true, data[data.length - 1].name)
              .then(response => {
                console.log(response)
                setData([...data, ...response])
                setSearchInProgress(false)
              })
              .catch(error => {
                console.log(error)
                setSearchInProgress(false)
              })
          }}
        >
          {searchInProgress ? <CircularProgress disableShrink /> : 'Load More...'}
        </Button>
      )}
    </div>
  )
}

export default RedditSearch
