import { useEffect, useState } from 'react'
import { ICard } from '../../CardTemplates/CardTemplates'
import { FormDataService, FormMediaTypes } from '@/tallulah-ts-client'
import { Box, Typography } from '@mui/material'
import styles from './Template6.module.css'
import PatientImage from '@/assets/images/users/avatar-3.png'
import Image from 'next/image'

const Template6: React.FC<ICard> = ({ data }) => {
  const [profileImageUrl, setProfileImageUrl] = useState<string>('')
  const profileImageId =
    data?.values.profilePicture?.value && data?.values.profilePicture?.value.length > 0
      ? data?.values.profilePicture.value[0].id
      : null

  const fetchProfileImage = async () => {
    if (!profileImageId) return
    try {
      const res = await FormDataService.getDownloadUrl(profileImageId, FormMediaTypes.IMAGE)
      setProfileImageUrl(res.url)
    } catch (err) {
      console.log(err)
    }
  }

  const convertTagsStringToArray = (tags: string | undefined) => {
    if (!tags) return []

    return tags.split(',')
  }

  useEffect(() => {
    fetchProfileImage()
  }, [])

  function findClosestValue(name: string, defValue: string, values: any, prefix?: string): string {
    if (!prefix) prefix = ''
    for (const key in values) {
      if (key.toLowerCase().includes(name.toLowerCase())) {
        return prefix + values[key].value
      }
    }
    return defValue
  }

  function findClosestWholeValue(name: string, defValue: string, values: any): string {
    const regex = new RegExp(`\\b${name}\\b`, 'i') // 'i' makes it case-insensitive
    for (const key in values) {
      // Find full word match
      if (regex.test(key)) {
        return values[key].value
      }
    }
    return defValue
  }

  function findAge(values: any): string {
    const ageValue = findClosestWholeValue('age', 'n/a', values)
    if (ageValue != 'n/a') {
      return ageValue
    }
    let birthDate = findClosestWholeValue('birth', '', values)
    if (!birthDate || birthDate === 'n/a') {
      birthDate = findClosestWholeValue('dob', '', values)
    }

    if (birthDate && birthDate !== 'n/a') {
      const birthDateObj = new Date(birthDate)
      const today = new Date()
      let age = today.getFullYear() - birthDateObj.getFullYear()
      const monthDiff = today.getMonth() - birthDateObj.getMonth()
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
        age--
      }
      return age.toString()
    }
    return 'n/a'
  }

  return (
    <Box className={styles.container}>
      {/* Patient Details */}
      <Box className={styles.cardHeaderLayout}>
        <Box>
          <Typography variant='h6' className={styles.name}>
            {data.values['full_name'].value}
          </Typography>
          <Typography variant='body1' className={styles.age}>
            Email : {data.values['email'].value} Gender: {data.values['gender'].value}
          </Typography>
          <Typography variant='body1' className={styles.age}>
            Referrer : {data.values['referrer'].value}
          </Typography>
          <Typography variant='body1' className={styles.age}>
            CSAT : {data.values['metric_csat'].value} | Custom: {data.values['metric_custom'].value}
          </Typography>
        </Box>
        <Box>
          {/* display image  */}
          {/* <img src={profileImageUrl ? profileImageUrl : PatientImage} alt="Patient Image" className={styles.image} /> */}
          <Image
            src={profileImageUrl ? profileImageUrl : PatientImage}
            alt='patient image'
            className={styles.image}
            width={100}
            height={100}
          />
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          marginBottom: '1rem',
          marginTop: '1rem'
        }}
      >
        {convertTagsStringToArray(data?.values?.tags?.value).map((tag: string) => (
          <Box className={styles.tag}>{tag}</Box>
        ))}
      </Box>
      <Box className={styles.section1}>
        <Box>
          <Typography variant='body1' className={styles.label}>
            Metric
          </Typography>
          <Typography
            variant='body1'
            className={styles.value}
            sx={{
              display: '-webkit-box',
              overflow: 'hidden',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 3
            }}
          >
            Questions: {data.values['num_questions']?.value} | Sentiment: {data.values['sentiment']?.value} | Rating:{' '}
            {data.values['rating']?.value} <br />
            Positive: {data.values['postive']?.value} | Neutral: {data.values['neutral']?.value} | Negative:{' '}
            {data.values['negative']?.value}
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default Template6
