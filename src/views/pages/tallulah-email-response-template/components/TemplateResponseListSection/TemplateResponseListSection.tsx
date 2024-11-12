import { useEffect, useState } from 'react';
import styles from './TemplateResponseListSection.module.css';
import { Box } from '@mui/material';
import ResponseTemplateCard from '../ResponseTemplateCard';
import { GetResponseTemplate_Out, ResponseTemplatesService } from '@/tallulah-ts-client';

export interface ITemplateResponseListSection {
  templateList: GetResponseTemplate_Out[];
  handleRefresh: () => void;
  isFetching: boolean;
}

const TemplateResponseListSection: React.FC<ITemplateResponseListSection> = ({ templateList, handleRefresh, isFetching }) => {
  return (
    <Box>
      {templateList && templateList.length > 0 ? (
        <Box>
          {templateList.map((_template, _index) => (
            <ResponseTemplateCard key={_template.id} data={_template} handleRefresh={handleRefresh} />
          ))}
        </Box>
      ) : null}
      {!isFetching && templateList.length === 0 ? (
        <Box
          sx={{
            marginTop: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          No Template Responses Found. Add a new one to get started.
        </Box>
      ) : null}
    </Box>
  );
};

export default TemplateResponseListSection;
