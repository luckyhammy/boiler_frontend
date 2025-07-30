// Import necessary MUI components and custom components
import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import OrderStatus from '../../../examples/Forms/OrderStatus'; // Import or create a form component for creating a product

function UpdateOrderStatusModal({ isOpen, onClose, orderId, deliverPeople }) {
    return (
        <Dialog open={isOpen} onClose={onClose}>
            <DialogTitle>
                <MDTypography variant="h6">Update your Order</MDTypography>
            </DialogTitle>
            <DialogContent>
                <OrderStatus onClose={onClose} orderId={orderId} deliverPeople={deliverPeople}/>
            </DialogContent>
            <DialogActions>
                <MDButton onClick={onClose} color="info">
                    Cancel
                </MDButton>
            </DialogActions>
        </Dialog>
    );
}

export default UpdateOrderStatusModal;
