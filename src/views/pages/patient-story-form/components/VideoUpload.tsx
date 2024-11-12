import { Box, Button, Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { TVideoUpload } from '../PatientStoryForm';
import { Dropzone, FileMosaic } from '@dropzone-ui/react';

export interface IFile {
  url: string;
  name: string;
}

export interface IUploadMedia {
  spacing?: number;
  editPatient?: boolean;
  setVideoFiles?: any;
  fieldName: string;
}

const VideoUpload: React.FC<IUploadMedia> = ({ fieldName, setVideoFiles }) => {
  const [files, setFiles] = useState<any[]>([]);

  useEffect(() => {
    if (setVideoFiles) {
      setVideoFiles((prev: TVideoUpload[]) => {
        const newDocumentFiles: TVideoUpload[] = [...prev];
        const fileIndex = newDocumentFiles.findIndex((file) => file.fieldName === fieldName);
        if (fileIndex === -1) {
          newDocumentFiles.push({
            fieldName: fieldName,
            files: files
          });
        } else {
          newDocumentFiles[fileIndex] = {
            fieldName: fieldName,
            files: files
          };
        }
        return newDocumentFiles;
      });
    }
  }, [fieldName, files, setVideoFiles]);

  const updateFiles = (incommingFiles: any) => {
    setFiles(incommingFiles);
  };

  return (
    <Box>
      <section className="container">
        <Dropzone onChange={updateFiles} value={files} accept="video/*" footer={false} label="Upload video here">
          {files.map((file) => (
            <FileMosaic {...file} preview />
          ))}
        </Dropzone>
      </section>
    </Box>
  );
};

export default VideoUpload;
