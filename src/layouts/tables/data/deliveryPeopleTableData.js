import { notification } from "antd";
import MDTypography from "components/MDTypography";
import Switch from '@mui/material/Switch';
import { useEffect, useState } from "react";
import DeliveryPersonService from "services/deliveryPerson-service";
import axios from "axios";
import Avatar from "./3.png";


const API_URL = process.env.REACT_APP_API_URL;

export default function DeliveryPeopleTableData(searchText) {
  const [deliveryPeople, setDeliveryPeople] = useState([]);
  const [selectedDeliveryPeople, setSelectedDeliveryPeople] = useState(null);
  const [selectedProduct1, setSelectedProduct1] = useState(null);

  const fetchDeliveryPeople = async () => {
    try {
      const response = await DeliveryPersonService.getAll(searchText);
      setDeliveryPeople(response?.data);
    } catch (error) {
      console.error("Error fetching delivery people:", error);
    }
  };

  const deleteDeliveryPeople = async (personEmail) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.delete(
        `${API_URL}api/v1/users/deleteDeliveryPerson/${personEmail}`,
        {
          headers: {
            'authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );



      notification.success({
        message: "deleted successfully",
      });

      fetchDeliveryPeople();
    } catch (error) {
      console.error("Error fetching delivery people:", error);
    }
  };

  useEffect(() => {
    fetchDeliveryPeople(searchText);
  }, [searchText]);

  const handleOpenUpdateProductModal = (product) => {
    setSelectedDeliveryPeople(product);
  };

  const handleDiscountModal = (product) => {
    setSelectedProduct1(product);
  };

  const handleCloseUpdateDeliveryPersonModal = () => {
    setSelectedDeliveryPeople(null);
    fetchDeliveryPeople(); // Fetch Delivery People again after closing the modal
  };

  const handleCloseDiscountModal = () => {
    setSelectedProduct1(null);
    fetchDeliveryPeople();
  };

  return {
    columns: [
      { Header: "avatar", accessor: "avatar", align: "left", width: '50px', padding: '0px' },
      { Header: "email", accessor: "email", align: "left" },
      { Header: "name", accessor: "name", align: "left" },
      { Header: "phone number", accessor: "phonenumber", align: "left" },
      { Header: "verified", accessor: "isVerified", align: "center" },
      {
        Header: "action",
        accessor: "action",
        align: "center",
        Cell: ({ row }) => (
          <MDTypography
            component="a"
            href="#"
            variant="caption"
            color="text"
            fontWeight="medium"
            onClick={() => {
              handleOpenUpdateProductModal({
                email: row.original.email,
                firstname: row.original.name.split(" ")[0],
                lastname: row.original.name.split(" ")[1],
                phonenumber: row.original.phonenumber,
                ...row.original.product?.props,
              });
            }}
          >
            Edit
          </MDTypography>
        ),
      },
      {
        Header: "delete",
        accessor: "delete",
        align: "center",
        Cell: ({ row }) => (
          <MDTypography
            component="a"
            href="#"
            variant="caption"
            color="text"
            fontWeight="medium"
            onClick={() => {
              deleteDeliveryPeople(row.original.email);
            }}
          >
            Delete
          </MDTypography>
        ),
      },
    ],

    rows: deliveryPeople.map((deliveryPerson) => ({
      avatar: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src={Avatar}
            alt="Delivery Person Avatar"
            style={{ width: '50px', height: '50px', borderRadius: '8px', marginRight: '10px' }}
          />
          <div>
            <MDTypography variant="caption" fontWeight="medium">
              {deliveryPerson.first_name + " " + deliveryPerson.last_name}
            </MDTypography>
          </div>
        </div>
      ),
      email: deliveryPerson.email,
      name: deliveryPerson.first_name + " " + deliveryPerson.last_name,
      phonenumber: deliveryPerson.phone_number,
      isVerified: (
        <Switch
          checked={deliveryPerson.isVerified}
          inputProps={{ 'aria-label': 'controlled' }}
        />
      ),
      action: (
        <MDTypography
          component="a"
          href="#"
          variant="caption"
          color="text"
          fontWeight="medium"
          onClick={() => {
            handleOpenUpdateProductModal(deliveryPerson);
          }}
        >
          Edit
        </MDTypography>
      ),
      delete: (
        <MDTypography
          component="a"
          href="#"
          variant="caption"
          color="text"
          fontWeight="medium"
          onClick={() => {
            deleteDeliveryPeople(deliveryPerson.email);
          }}
        >
          Delete
        </MDTypography>
      ),
    })),
    selectedDeliveryPeople,
    onCloseUpdateDeliveryPersonModal: handleCloseUpdateDeliveryPersonModal,
    selectedProduct1,
    onCloseDisountModal: handleCloseDiscountModal,
  };
}
