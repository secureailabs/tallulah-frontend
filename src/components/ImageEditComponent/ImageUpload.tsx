import { Box, Button, Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Dropzone, FileMosaic } from '@dropzone-ui/react';

export type TMediaFileUpload = {
  fieldName: string;
  files: File[];
};

export interface ProfilePictureUploadProps {
  spacing?: number;
  fieldName: string;
  setImageFiles?: any;
}

const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({ spacing, setImageFiles, fieldName }) => {
  const [files, setFiles] = useState<any[]>([]);
  const updateFiles = (incommingFiles: any) => {
    setFiles(incommingFiles);
  };

  useEffect(() => {
    if (setImageFiles) {
      setImageFiles((prev: TMediaFileUpload[]) => {
        const newImageFiles: TMediaFileUpload[] = [...prev];
        const fileIndex = newImageFiles.findIndex((file) => file.fieldName === fieldName);
        if (fileIndex === -1) {
          newImageFiles.push({
            fieldName: fieldName,
            files: files
          });
        } else {
          newImageFiles[fileIndex] = {
            fieldName: fieldName,
            files: files
          };
        }
        return newImageFiles;
      });
    }
  }, [fieldName, files, setImageFiles]);

  return (
    <Box
      sx={{
        width: '100%'
      }}
    >
      <section className="container">
        <Dropzone
          onChange={updateFiles}
          value={files}
          accept="image/*"
          footer={false}
          label={fieldName === 'profilePicture' ? 'Upload Profile Picture' : 'Upload Images'}
          maxFiles={fieldName === 'profilePicture' ? 1 : 10}
        >
          {files.map((file) => (
            <FileMosaic {...file} preview />
          ))}
        </Dropzone>
      </section>
    </Box>
  );
};

export default ProfilePictureUpload;
