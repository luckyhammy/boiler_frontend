import { useEffect, useState } from "react";
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";
import MDBox from "components/MDBox";
import MDProgress from "components/MDProgress";
import MDTypography from "components/MDTypography";
import OrderService from "services/order-service";

import LogoAsana from "assets/images/small-logos/logo-asana.svg";

export default function data(searchText) {
  const [orders, setOrder] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const fetchOrders = async () => {
    try {
      const response = await OrderService.getAll();  // Fetch all orders initially
      const lowerCaseSearchText = searchText.toLowerCase();
      const filteredOrders = response.orders.filter(order => {
        const { email, phone_number, username } = order.customer;

        return (
          (email && email.toLowerCase().includes(lowerCaseSearchText)) ||
          (phone_number && phone_number.includes(lowerCaseSearchText)) ||
          (username && username.toLowerCase().includes(lowerCaseSearchText))
        );
      });

      if (filteredOrders.length > 0) {
        console.log("Matching Orders:", filteredOrders);
        setOrder(filteredOrders);
      } else {
        console.log("No matching orders found. Displaying all orders.");
        setOrder(response.orders || []);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders(searchText);
  }, [searchText]);

  const statusToColorAndValue = {
    Created: { color: "error", value: 0 },
    Processing: { color: "warning", value: 25 },
    Shipped: { color: "info", value: 50 },
    Delivered: { color: "success", value: 100 },
    Cancel: { color: "error", value: 0 },
  };

  const getStatusColorAndValue = (status) => {
    return statusToColorAndValue[status] || { color: "default", value: 0 };
  };

  const formatDateTimeWithAmPm = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(date.getDate()).padStart(2, '0');
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const amPm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // If hour is 0 (midnight), set it to 12
    return `${year}-${month}-${day} ${String(hours).padStart(2, '0')}:${minutes} ${amPm}`;
  };

  const getCreateColorAndValue = (createdAt) => {
    return { color: 'success' };
  };
  
  const Order = ({ image, name, email, orderId }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={image} name={name} size="lg" />
      <MDBox ml={0} lineHeight={1}>
        <MDTypography variant="caption">{orderId}</MDTypography>
      </MDBox>
    </MDBox>
  );

  const Progress = ({ color, value }) => (
    <MDBox display="flex" alignItems="center">
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {value}%
      </MDTypography>
      <MDBox ml={0.5} width="9rem">
        <MDProgress variant="gradient" color={color} value={value} />
      </MDBox>
    </MDBox>
  );

  const handleOpenUpdateOrderModal = (orderId) => {
    setSelectedOrderId(orderId);
  };

  const handleCloseUpdateOrderModal = () => {
    setSelectedOrderId(null);
    fetchOrders();
  };

  const handlePrintOrder = (orderId) => {
    // Log the orderId to debug
    console.log('Trying to print order with ID:', orderId);

    // Find the order by razorpay_order_id
    const order = orders.find(a => a.razorpay_order_id === orderId);

    // Safeguard in case the order is not found
    if (!order) {
      console.error('Order not found with razorpay_order_id:', orderId);
      alert(`Order with ID ${orderId} not found.`);
      return;
    }

    // Open a new print window
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    printWindow.document.write(`<html><head><title>Print Order</title></head><body>`);
    printWindow.document.write(`<h1>Order Details e-SireMart</h1>`);
    printWindow.document.write(`<p>Order ID: ${order.razorpay_order_id}</p>`);
    printWindow.document.write(`<p>Customer Name: ${order.customer.username}</p>`);
    printWindow.document.write(`<p>Total Price: ₹${order.totalPrice}</p>`);
    printWindow.document.write(`<h3>Products:</h3>`);
    order.items.forEach(item => {
      printWindow.document.write(`<p>${item.productId.name} (Quantity: ${item.quantity})</p>`);
    });
    printWindow.document.write(`</body></html>`);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  return {
    columns: [
      { Header: "razorpay order id", accessor: "order", align: "left" },
      { Header: "Customer Info", accessor: "customerInfo", align: "left" },
      { Header: "Products", accessor: "products", align: "left" },
      { Header: "totalPrice", accessor: "totalPrice", align: "center " },
      { Header: "status", accessor: "status", align: "center" },
      { Header: "Created Date ", accessor: "CreateAt", align: "center" },
      { Header: "Delivery Man Info", accessor: "deliveryManInfo", align: "left" },
      {
        Header: "action",
        accessor: "action",
        align: "center",
        Cell: ({ row }) => (
          <MDBox>
            <MDTypography
              component="a"
              href="#"
              variant="caption"
              color="text"
              fontWeight="medium"
              onClick={() => {
                handleOpenUpdateOrderModal(row.original.order.props.orderId)
              }}
            >
              {row.original.status.props.children.props.badgeContent == "Created" ? "Ship" : null}
              {row.original.status.props.children.props.badgeContent == "Shipped" ? "Ship" : null}
            </MDTypography>
          </MDBox>
        ),
      },
      {
        Header: "print",
        accessor: "print",
        align: "center",
        Cell: ({ row }) => (
          <MDBox>
            <MDTypography
              component="a"
              href="#"
              variant="caption"
              color="text"
              fontWeight="medium"
              onClick={() => {
                handlePrintOrder(row.original.order.props.orderId)
              }}
            >
              Print
            </MDTypography>
          </MDBox>
        ),
      },
    ],

    rows: orders.map((order) => ({
      order: (
        <Order
          image={LogoAsana}
          name={order.customer.username}
          email={order.customer.email}
          orderId={order.razorpay_order_id || "N/A"} // Access razorpay_order_id directly from order
        />
      ),
      products: order.items.map((item, index) => (
        <p key={index} style={{ margin: 0 }}>
          {`${item.productId.name} (x${item.quantity}) - ₹${item.price}`}
        </p>
      )),
      customerInfo: (
        <MDTypography component="a" href="#" variant="button" color="text" fontWeight="medium">
          {"Name : " + order.customer.username}
          <br></br>
          {"Email : " + order.customer.email}
          <br></br>
          {"Phone Number: " + order.customer.phone_number}
        </MDTypography>
      ),
      totalPrice: (
        <MDTypography component="a" href="#" variant="button" color="text" fontWeight="medium">
          ₹{order.totalPrice}
        </MDTypography>
      ),
      deliveryManInfo: order.deliveryManId ? (
        <MDTypography component="a" href="#" variant="button" color="text" fontWeight="medium">
          {"Name: " + order.deliveryManId.username} <br />
          {"Email: " + order.deliveryManId.email} <br />
          {"Phone Number: " + order.deliveryManId.phone_number}
        </MDTypography>
      ) : (
        <p>No delivery man assigned</p>
      ),
      status: (
        <MDBox ml={-1}>
          <MDBadge
            badgeContent={order.status}
            color={getStatusColorAndValue(order.status).color}
            variant="gradient"
            size="sm"
          />
        </MDBox>
      ),
      CreateAt: (
        <MDBox ml={-1}>
          <MDBadge
            badgeContent={formatDateTimeWithAmPm(order.created_at)}
            color={getCreateColorAndValue(order.created_at).color}
            variant="gradient"
            size="sm"
          />
        </MDBox>
      ),
    })),

    selectedOrderId,
    onCloseUpdateOrderModal: handleCloseUpdateOrderModal,
  };
}