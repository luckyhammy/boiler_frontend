/**
=========================================================
* Material Dashboard 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

const DataTableBodyCell = ({ noBorder = false, align = "left", children }) => {
  return (
    <MDBox
      component="td"
      textAlign={align}
      py={1.5}
      px={3}
      sx={({ palette: { light }, typography: { size }, borders: { borderWidth } }) => ({
        fontSize: size.sm,
        borderBottom: noBorder ? "none" : `${borderWidth[1]} solid ${light.main}`,
      })}
    >
      <MDBox
        display="flex"
        justifyContent={align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start"}
        alignItems="center"
        width="100%"
        color="text"
        sx={{ verticalAlign: "middle" }}
      >
        {children}
      </MDBox>
    </MDBox>
  );
}

// Typechecking props for the DataTableBodyCell
// DataTableBodyCell.propTypes = {
//   children: PropTypes.node.isRequired,
//   noBorder: PropTypes.bool,
//   align: PropTypes.oneOf(["left", "right", "center"]),
// };

export default DataTableBodyCell;
