// Import necessary MUI components and custom components
import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import DeliveryPeopleForm from '../../../examples/Forms/DeliveryPeopleForm'; // Import or create a form component for creating a product

function CreateProductModal({ isOpen, onClose, deliverPerson }) {
    return (
        <Dialog open={isOpen} onClose={onClose}>
            <DialogTitle>
                <MDTypography variant="h6">Update Your Delivery Person</MDTypography>
            </DialogTitle>
            <DialogContent>
                <DeliveryPeopleForm onClose={onClose} initialPerson={deliverPerson} />
            </DialogContent>
            <DialogActions>
                <MDButton onClick={onClose} color="info">
                    Cancel
                </MDButton>
            </DialogActions>
        </Dialog>
    );
}

export default CreateProductModal;
