import { Box, Button, Modal, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import styles from './DeleteConfirmationModal.module.css';

export interface IDeleteConfirmationModal {
  openDeleteModal: boolean;
  handleCloseDeleteModal: () => void;
  handleDelete: () => void;
}

const DeleteConfirmationModal: React.FC<IDeleteConfirmationModal> = ({ openDeleteModal, handleCloseDeleteModal, handleDelete }) => {
  return (
    <Modal open={openDeleteModal} onClose={handleCloseDeleteModal}>
      <Box
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: '#fff',
          padding: '30px',
          outline: 'none',
          width: '500px'
        }}
      >
        <Typography variant="h3" gutterBottom>
          Delete confirmation
          <Typography variant="h6" gutterBottom>
            Are you sure you want to delete?
          </Typography>
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: '20px'
          }}
        >
          <Button variant="contained" color="info" onClick={handleCloseDeleteModal}>
            Cancel
          </Button>
          <Button variant="outlined" color="error" onClick={handleDelete} style={{ marginLeft: '10px' }} startIcon={<DeleteIcon />}>
            Delete
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default DeleteConfirmationModal;
