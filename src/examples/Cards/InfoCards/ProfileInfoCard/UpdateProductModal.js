import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import ProfileForm from '../../../../examples/Forms/ProfileForm';

function UpdateProfileModal({ isOpen, onClose, profile }) {
    return (
        <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <MDTypography variant="h6">Update your Profile</MDTypography>
            </DialogTitle>
            <DialogContent>
                <ProfileForm onClose={onClose} initialProfile={profile} />
            </DialogContent>
            <DialogActions>
                <MDButton onClick={onClose} color="info">
                    Cancel
                </MDButton>
            </DialogActions>
        </Dialog>
    );
}

UpdateProfileModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
};

export default UpdateProfileModal;
