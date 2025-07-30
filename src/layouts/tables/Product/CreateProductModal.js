// Import necessary MUI components and custom components
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import MDButton from 'components/MDButton';
import MDTypography from 'components/MDTypography';
import ProductForm from '../../../examples/Forms/ProductForm';

function CreateProductModal({ isOpen, onClose }) {
    return (
        <Dialog open={isOpen} onClose={onClose}>
            <DialogTitle>
                <MDTypography variant="h6">Create New Product</MDTypography>
            </DialogTitle>
            <DialogContent>
                <ProductForm onClose={onClose} />
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
