import { DatePicker, InputNumber, Modal, notification, Space } from "antd";
import { useState } from "react";
import productService from "../../../services/product-service"; // Ensure you have an API service for product handling

const { RangePicker } = DatePicker;

function ProductDiscountModal({ isOpen, onClose, product }) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);

  const handleSetDiscount = async () => {
    try {
      const setDiscountData = {
        startDate,
        endDate,
        discountPercent,
      };


      const response = await productService.setDiscountDate(
        product.props._id,
        setDiscountData
      );

      if (response.message === "Product updated successfully") {
        notification.success({
          message: "Discount updated successfully.",
        });
        onClose(); // Close the modal on success
      } else {
        notification.error({
          message: "Failed to update discount.",
        });
      }
    } catch (error) {
      console.error("Error setting discount:", error);
      notification.error({
        message: "Error setting discount. Please try again.",
      });
    }
  };

  const discountPeriod = (value, dateString) => {
    setStartDate(dateString[0]);
    setEndDate(dateString[1]);
  };

  return (
    <Modal
      open={isOpen}
      title="Product Discount"
      onOk={handleSetDiscount}
      onCancel={onClose}
      style={{ zIndex: 10000 }}
    >
      <div
        style={{
          padding: "20px",
          display: "flex",
          gap: "20px",
          flexDirection: "row",
        }}
      >
        <Space direction="vertical" size={12}>
          <RangePicker format="YYYY-MM-DD" onChange={discountPeriod} />
        </Space>
        <InputNumber
          style={{ width: "120px" }}
          min={0}
          max={100}
          formatter={(value) => `${value}%`}
          parser={(value) => (value ? value.replace("%", "") : "")}
          value={discountPercent}
          onChange={setDiscountPercent}
        />
      </div>
    </Modal>
  );
}

export default ProductDiscountModal;
