import { useEffect, useState } from 'react';
import { ICard } from '../../CardTemplates/CardTemplates';
import { FormDataService, FormMediaTypes } from '@/tallulah-ts-client';
import { Box, Divider, Typography } from '@mui/material';
import styles from './Template5.module.css';
import PatientImage from '@/assets/images/users/avatar-3.png';
import Image from 'next/image';

const skipFieldNames = ['profilePicture', 'tags', 'name', 'firstName', 'lastName'];

const Template5: React.FC<ICard> = ({ data, formTemplate }) => {
  const [profileImageUrl, setProfileImageUrl] = useState<string>('');

  const fieldNamesToDisplay = formTemplate?.card_layout?.fields || [];

  const getFieldLabel = (fieldName: string) => {
    const fields = formTemplate?.field_groups?.flatMap((fieldGroup) => fieldGroup.fields);
    const field = fields?.find((field) => field?.name === fieldName);
    return field?.label;
  };

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
    if (!tags) return { visibleTags: [], additionalTagsCount: 0 };
    const allTags = tags.split(',');
    const visibleTags = allTags.slice(0, 3); // Display up to 3 tags
    const additionalTagsCount = allTags.length - visibleTags.length;
    return { visibleTags, additionalTagsCount };
  };

  useEffect(() => {
    fetchProfileImage();
  }, []);

  return (
    <Box className={styles.container}>
      {/* Patient Details */}
      <Box className={styles.cardHeaderLayout}>
        {/* display image  */}
        {/* <img src={profileImageUrl ? profileImageUrl : PatientImage} alt="Patient Image" className={styles.image} /> */}
        <Image
            src={profileImageUrl ? profileImageUrl : PatientImage}
            alt="patient image"
            className={styles.image}
            width={100}
            height={100}
          />

        <Box>
          {/* names and tag section */}
          <Box>
            <Box
              sx={{
                marginTop: '1rem',
                marginBottom: '1rem'
              }}
            >
              {data.values.firstName ? (
                <Typography variant="h6" className={styles.name}>
                  {data.values.firstName?.value} {data.values.lastName?.value}
                </Typography>
              ) : data.values.name ? (
                <Typography variant="h6" className={styles.name}>
                  {data.values?.name?.value}
                </Typography>
              ) : null}
            </Box>
            {data?.values && 'tags' in data?.values && fieldNamesToDisplay.includes('tags') ? (
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'nowrap',
                  gap: '0.5rem',
                  marginBottom: '1rem',
                  marginTop: '1rem'
                }}
              >
                {convertTagsStringToArray(data?.values?.tags?.value).visibleTags.map((tag: string, index) => (
                  <Box key={index} className={styles.tag}>
                    {tag}
                  </Box>
                ))}
                {convertTagsStringToArray(data?.values?.tags?.value).additionalTagsCount > 0 && (
                  <Box className={styles.tag2}>+{convertTagsStringToArray(data?.values?.tags?.value).additionalTagsCount} tags</Box>
                )}
              </Box>
            ) : null}
          </Box>
          <Divider sx={{ marginBottom: '1rem' }} />
          <Box className={styles.section2}>
            <Box>
              <Typography
                sx={{
                  color: '#909CAC'
                }}
              >
                Age
              </Typography>
              <Typography>{data?.values?.age?.value} years</Typography>
            </Box>
            <Box>
              <Typography
                sx={{
                  color: '#909CAC'
                }}
              >
                Gender
              </Typography>
              <Typography>{data?.values?.gender?.value}</Typography>
            </Box>
          </Box>
          <Divider sx={{ marginTop: '1rem' }} />
        </Box>
      </Box>

      {/* Condition to display either Name or combination of firstName and last Name */}
      <Box className={styles.section1}>
        {/* Display the field names from card layout */}
        <Box>
          {fieldNamesToDisplay.map((fieldName) => {
            if (skipFieldNames.includes(fieldName)) {
              return null;
            }
            return (
              <Box className={styles.valueContainer}>
                <Typography variant="body1" className={styles.label}>
                  {data.values[fieldName]?.label
                    ? data.values[fieldName]?.label
                    : getFieldLabel(fieldName)
                    ? getFieldLabel(fieldName)
                    : fieldName}
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
                  {data.values[fieldName]?.value ? data.values[fieldName]?.value : 'n/a'}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default Template5;
