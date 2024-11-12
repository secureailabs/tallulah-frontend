import { Box, Button, Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { TDocumentFileUpload } from '../PatientStoryForm';
import { Dropzone, FileMosaic } from '@dropzone-ui/react';

export interface IFile {
  url: string;
  name: string;
}

export interface IUploadMedia {
  spacing?: number;
  editPatient?: boolean;
  setDocumentFiles?: any;
  fieldName: string;
}

const DocumentsUpload: React.FC<IUploadMedia> = ({ fieldName, setDocumentFiles }) => {
  const [files, setFiles] = useState<any[]>([]);

  const updateFiles = (incomingFiles: any) => {
    setFiles(incomingFiles);
  };

  useEffect(() => {
    if (setDocumentFiles) {
      setDocumentFiles((prev: TDocumentFileUpload[]) => {
        const newDocumentFiles: TDocumentFileUpload[] = [...prev];
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
  }, [fieldName, files, setDocumentFiles]);

  return (
    <Box>
      <section className="container">
        <Dropzone onChange={updateFiles} value={files} maxFiles={5} footer={false} label="Upload files here">
          {files.map((file) => (
            <FileMosaic {...file} preview />
          ))}
        </Dropzone>
      </section>
    </Box>
  );
};

export default DocumentsUpload;
