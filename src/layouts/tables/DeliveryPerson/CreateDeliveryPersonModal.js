// Import necessary MUI components and custom components
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import MDButton from 'components/MDButton';
import MDTypography from 'components/MDTypography';
import DeliveryPeopleForm from '../../../examples/Forms/DeliveryPeopleForm';

function CreateDeliveryPersonModal({ isOpen, onClose }) {
    return (
        <Dialog open={isOpen} onClose={onClose}>
            <DialogTitle>
                <MDTypography variant="h6">Create New Delivery Person</MDTypography>
            </DialogTitle>
            <DialogContent>
                <DeliveryPeopleForm onClose={onClose} />
            </DialogContent>
            <DialogActions>
                <MDButton onClick={onClose} color="info">
                    Cancel
                </MDButton>
            </DialogActions>
        </Dialog>
    );
}

export default CreateDeliveryPersonModal;
