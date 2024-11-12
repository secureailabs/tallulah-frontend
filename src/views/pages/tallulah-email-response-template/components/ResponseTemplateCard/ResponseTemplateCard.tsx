import { Box, Button, Dialog, Icon, IconButton, Typography } from '@mui/material';
import styles from './ResponseTemplateCard.module.css';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { GetResponseTemplate_Out, ResponseTemplatesService } from '@/tallulah-ts-client';
import EditResponseTemplate from '../EditResponseTemplate';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
// import useNotification from 'src/hooks/useNotification';
import { formatReceivedTime } from '@/utils/helper';

export interface IResponseTemplateCard {
  data: GetResponseTemplate_Out;
  editable?: boolean;
  selection?: boolean;
  onSelect?: (template: GetResponseTemplate_Out) => void;
  handleRefresh: () => void;
}

const ResponseTemplateCard: React.FC<IResponseTemplateCard> = ({ data, editable = true, selection = false, onSelect, handleRefresh }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState<boolean>(false);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  // TODO
  // const [sendNotification] = useNotification();

  const handleDelete = async () => {
    try {
      await ResponseTemplatesService.deleteResponseTemplate(data.id);
      handleRefresh();
      // sendNotification({
      //   msg: 'Template removed successfully',
      //   variant: 'success'
      // });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box className={styles.container}>
      <Box
        sx={{
          position: 'relative',
          marginBottom: '1rem'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Typography
            sx={{
              fontWeight: 'bold'
            }}
          >
            {data.name}
          </Typography>
          {editable ? (
            <Box
              sx={{
                display: 'flex',
                gap: '1rem'
              }}
            >
              <IconButton
                className={styles.editButton}
                onClick={() => {
                  setIsTemplateDialogOpen(true);
                }}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                className={styles.deleteButton}
                onClick={() => {
                  setOpenDeleteModal(true);
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ) : null}

          {selection && onSelect ? (
            <Box
              sx={{
                display: 'flex',
                gap: '1rem'
              }}
            >
              <Button
                variant="outlined"
                onClick={() => {
                  onSelect(data);
                }}
              >
                Use Template
              </Button>
            </Box>
          ) : null}
        </Box>
        <Box className={styles.subContainer}>
          <Typography className={styles.subTitle}>
            Subject:
            <Typography variant="body1" className={styles.subText}>
              {data.subject}
            </Typography>
          </Typography>
        </Box>
        <Box className={styles.subContainer}>
          <Typography className={styles.subTitle}>
            Body:
            {!isExpanded ? (
              <Typography
                variant="body1"
                display="inline"
                sx={{
                  display: '-webkit-box',
                  overflow: 'hidden',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: 1
                }}
                className={styles.subText}
              >
                {/* remove all htrml tags and display only text */}
                {data.body?.content.replace(/<[^>]*>?/gm, '')}
              </Typography>
            ) : (
              <Typography
                variant="body1"
                display="inline"
                className={styles.subText}
                dangerouslySetInnerHTML={data?.body?.content ? { __html: data.body.content } : { __html: '' }}
              ></Typography>
            )}
          </Typography>
        </Box>
        <Box
          sx={{
            postiion: 'absolute',
            bottom: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'flex-end'
          }}
        >
          <Typography
            sx={{
              fontStyle: 'italic',
              color: 'gray'
            }}
          >
            Last Updated: &nbsp;
            <Typography variant="body1" component={'span'}>
              {formatReceivedTime(data.last_edit_time as string)}
            </Typography>
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: '100%'
        }}
      >
        <IconButton className={styles.viewMoreButton} onClick={() => setIsExpanded((prev) => !prev)}>
          {!isExpanded ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
        </IconButton>
      </Box>
      <Dialog
        open={isTemplateDialogOpen}
        onClose={() => {
          setIsTemplateDialogOpen(false);
        }}
        fullWidth
      >
        <EditResponseTemplate initialData={data} setIsModalOpen={setIsTemplateDialogOpen} handleRefresh={handleRefresh} />
      </Dialog>
      <DeleteConfirmationModal
        openDeleteModal={openDeleteModal}
        handleCloseDeleteModal={() => {
          setOpenDeleteModal(false);
        }}
        handleDelete={handleDelete}
      />
    </Box>
  );
};

export default ResponseTemplateCard;
