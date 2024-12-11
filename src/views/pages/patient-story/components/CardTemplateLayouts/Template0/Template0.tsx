import { useEffect, useState } from 'react';
import { ICard } from '../../CardTemplates/CardTemplates';
import { FormDataService, FormMediaTypes } from '@/tallulah-ts-client';
import { Box, Typography } from '@mui/material';
import styles from './Template0.module.css';
import PatientImage from '@/assets/images/users/avatar-3.png';
import Image from 'next/image';

const Template0: React.FC<ICard> = ({ data }) => {
  const [profileImageUrl, setProfileImageUrl] = useState<string>('');
  const profileImageId =
    data?.values.profilePicture?.value && data?.values.profilePicture?.value.length > 0 ? data?.values.profilePicture.value[0].id : null;

  const fetchProfileImage = async () => {
    if (!profileImageId) return;
    try {
      const res = await FormDataService.getDownloadUrl(profileImageId, FormMediaTypes.IMAGE);
      setProfileImageUrl(res.url);
    } catch (err) {
      console.log(err);
    }
  };

  const convertTagsStringToArray = (tags: string | undefined) => {
    if (!tags) return [];

    return tags.split(',');
  };

  useEffect(() => {
    fetchProfileImage();
  }, []);

  return (
    <Box className={styles.container}>
      {/* Patient Details */}
      <Box className={styles.cardHeaderLayout}>
        <Box>
          <Typography variant="h6" className={styles.name}>
            {data.values?.firstName?.value} {data.values?.lastName?.value}
          </Typography>
          <Typography variant="body1" className={styles.age}>
            Age : {data?.values?.age?.value} years
            <Typography>Location : {data?.values?.zipCode?.value}</Typography>
            {data?.values?.diseaseType ? <Typography>Disease Type : {data?.values?.diseaseType?.value}</Typography> : null}
          </Typography>
        </Box>
        <Box>
          {/* display image  */}
          {/* <img src={profileImageUrl ? profileImageUrl : PatientImage} alt="Patient Image" className={styles.image} /> */}
          <Image
            src={profileImageUrl ? profileImageUrl : PatientImage}
            alt="patient image"
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
          <Typography variant="body1" className={styles.label}>
            Journey
          </Typography>
          <Typography
            variant="body1"
            className={styles.value}
            sx={{
              display: '-webkit-box',
              overflow: 'hidden',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 3
            }}
          >
            {data.values?.patientStory?.value ? data.values?.patientStory?.value : 'n/a'}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Template0;
