import { Box } from '@mui/material';
import styles from './ImageEditComponent.module.css';
import { useEffect, useState } from 'react';
import { FormMediaTypes, FormDataService } from '@/tallulah-ts-client';
import CloseIcon from '@mui/icons-material/Close';
import ImageUpload, { TMediaFileUpload } from './ImageUpload';

export interface IImageEditComponent {
  imageFileIds: any[];
  handleRemovePhoto: (videoId: string) => void;
  setImageFiles: (files: TMediaFileUpload[]) => void;
  type?: "profilePicture" | "image";
}

const ImageFile: React.FC<{ imageId: string; handleRemovePhoto: any }> = ({ imageId, handleRemovePhoto }) => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const fetchImageUrl = async (imageId: string) => {
    try {
      const res = await FormDataService.getDownloadUrl(imageId, FormMediaTypes.IMAGE);
      setImageUrl(res.url);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchImageUrl(imageId);
  }, [imageId]);

  return (
    <Box
      sx={{
        position: 'relative'
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '0',
          right: '0'
        }}
      >
        {/* add a close icon with absolute position */}
        <CloseIcon
          onClick={() => {
            handleRemovePhoto(imageId);
          }}
          sx={{
            cursor: 'pointer'
          }}
        />
      </Box>
      <img src={imageUrl} alt="patient" className={styles.image} />
    </Box>
  );
};

const ImageEditComponent: React.FC<IImageEditComponent> = ({ imageFileIds, handleRemovePhoto, setImageFiles, type }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap',
        marginTop: '1rem',
        width: '100%'
      }}
    >
      <ImageUpload fieldName={type === 'profilePicture' ? 'profilePicture' : 'photos'} setImageFiles={setImageFiles} />
      {imageFileIds.map((image) => (
        <ImageFile key={image.id} imageId={image.id} handleRemovePhoto={handleRemovePhoto} />
      ))}
    </Box>
  );
};

export default ImageEditComponent;
