import React from 'react';
import { Box, Button } from '@mui/material';
import { Save, Cancel, Delete, Edit, Add } from '@mui/icons-material';

const ActionButtons = ({ 
  onSave, 
  onCancel, 
  onDelete,
  onEdit,
  saveLabel = 'Lưu',
  cancelLabel = 'Hủy',
  deleteLabel = 'Xóa',
  editLabel = 'Sửa',
  loading = false,
  variant = 'default', // default, floating, sticky
}) => {
  const buttonStyles = {
    py: 1.5,
    px: 4,
    borderRadius: 2,
    fontWeight: 700,
    fontSize: '0.95rem',
    textTransform: 'none',
    boxShadow: 2,
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: 6,
    },
    '&:active': {
      transform: 'translateY(0)',
    },
  };

  const containerStyles = variant === 'floating' ? {
    position: 'fixed',
    bottom: 24,
    right: 24,
    zIndex: 1000,
    display: 'flex',
    gap: 2,
    bgcolor: 'background.paper',
    p: 2,
    borderRadius: 3,
    boxShadow: 8,
  } : variant === 'sticky' ? {
    position: 'sticky',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    display: 'flex',
    gap: 2,
    justifyContent: 'flex-end',
    bgcolor: 'background.paper',
    p: 2,
    borderTop: 1,
    borderColor: 'divider',
    boxShadow: '0 -4px 12px rgba(0,0,0,0.05)',
  } : {
    display: 'flex',
    gap: 2,
    justifyContent: 'flex-end',
    mt: 3,
  };

  return (
    <Box sx={containerStyles}>
      {onDelete && (
        <Button
          variant="outlined"
          color="error"
          startIcon={<Delete />}
          onClick={onDelete}
          disabled={loading}
          sx={{
            ...buttonStyles,
            borderWidth: 2,
            '&:hover': {
              ...buttonStyles['&:hover'],
              borderWidth: 2,
            },
          }}
        >
          {deleteLabel}
        </Button>
      )}
      
      {onEdit && (
        <Button
          variant="outlined"
          color="primary"
          startIcon={<Edit />}
          onClick={onEdit}
          disabled={loading}
          sx={{
            ...buttonStyles,
            borderWidth: 2,
            '&:hover': {
              ...buttonStyles['&:hover'],
              borderWidth: 2,
            },
          }}
        >
          {editLabel}
        </Button>
      )}

      {onCancel && (
        <Button
          variant="outlined"
          color="inherit"
          startIcon={<Cancel />}
          onClick={onCancel}
          disabled={loading}
          sx={{
            ...buttonStyles,
            borderWidth: 2,
            '&:hover': {
              ...buttonStyles['&:hover'],
              borderWidth: 2,
            },
          }}
        >
          {cancelLabel}
        </Button>
      )}

      {onSave && (
        <Button
          variant="contained"
          color="primary"
          startIcon={<Save />}
          onClick={onSave}
          disabled={loading}
          sx={{
            ...buttonStyles,
            background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
            '&:hover': {
              ...buttonStyles['&:hover'],
              background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
            },
          }}
        >
          {loading ? 'Đang lưu...' : saveLabel}
        </Button>
      )}
    </Box>
  );
};

export default ActionButtons;
