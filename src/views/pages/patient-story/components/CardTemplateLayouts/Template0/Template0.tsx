import { useEffect, useState } from 'react'
import { ICard } from '../../CardTemplates/CardTemplates'
import { FormDataService, FormMediaTypes } from '@/tallulah-ts-client'
import { Box, Typography } from '@mui/material'
import styles from './Template0.module.css'
import PatientImage from '@/assets/images/users/avatar-3.png'
import Image from 'next/image'

const Template0: React.FC<ICard> = ({ data }) => {
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
            {findClosestValue('first', '', data.values ?? [])} {findClosestValue('last', '', data.values ?? [])}
          </Typography>
          <Typography variant='body1' className={styles.age}>
            Age : {findAge(data.values ?? [])} years
            <Typography>Location : {findClosestValue('zip', 'n/a', data.values ?? [])}</Typography>
            <Typography>{findClosestValue('disease', '', data.values ?? [], 'Disease Type: ')}</Typography>
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
            {data.form_template_id == 'f48e03d0-8ed0-4c5d-b93e-71c48d5b5b94' ? 'Additional thoughts...' : 'Journey'}
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
            {data.form_template_id == 'f48e03d0-8ed0-4c5d-b93e-71c48d5b5b94'
              ? data.values['Additional thoughts...'].value
              : findClosestValue('story', 'n/a', data.values ?? [])}
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default Template0
