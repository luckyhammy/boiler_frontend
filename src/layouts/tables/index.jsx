import React, { useState, useEffect } from "react";
import { notification } from "antd";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDTypography from "components/MDTypography";
import Footer from "examples/Footer";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import MDBox from "components/MDBox";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import AuthService from "../../services/auth-service";
import MDButton from "components/MDButton";
import MDAlert from "components/MDAlert";

// Custom hook for responsive design
const useResponsive = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 480);
      setIsTablet(window.innerWidth <= 768 && window.innerWidth > 480);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return { isMobile, isTablet };
};

function Tables() {
  const { isMobile, isTablet } = useResponsive();
  // State for dynamic table data
  const [tableData, setTableData] = useState({ columns: [], rows: [] });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ open: false, color: "success", message: "" });
  const [adminCount, setAdminCount] = useState(0);
  const [userCount, setUserCount] = useState(0);

  const showAlert = (message, color = "success") => {
    setAlert({ open: true, color, message });
    setTimeout(() => setAlert({ open: false, color: "success", message: "" }), 3000);
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await AuthService.getallusers();
      const users = response.data || response;
      if (Array.isArray(users) && users.length > 0) {
        // Responsive column configuration based on screen size
        const getVisibleColumns = () => {
          if (isMobile) {
            // Mobile: Show only essential columns (skip first two columns)
            return [
              { Header: 'Email', accessor: 'email' },
              { Header: 'Permission', accessor: 'permission' },
              { Header: 'Actions', accessor: 'actions' },
            ];
          } else if (isTablet) {
            // Tablet: Show more columns but not all
            return [
              { Header: 'First Name', accessor: 'first_name' },
              { Header: 'Last Name', accessor: 'last_name' },
              { Header: 'Email', accessor: 'email' },
              { Header: 'Permission', accessor: 'permission' },
              { Header: 'Actions', accessor: 'actions' },
            ];
          } else {
            // Desktop: Show all columns
            return [
              { Header: 'First Name', accessor: 'first_name' },
              { Header: 'Last Name', accessor: 'last_name' },
              { Header: 'Email', accessor: 'email' },
              { Header: 'Permission', accessor: 'permission' },
              { Header: 'Toggle Permission', accessor: 'toggle' },
              { Header: 'Delete', accessor: 'delete' },
            ];
          }
        };

        const columns = getVisibleColumns().map(col => ({
          ...col,
          minWidth: isMobile ? 80 : isTablet ? 120 : 150,
          maxWidth: isMobile ? 150 : isTablet ? 200 : 250,
          Cell: col.accessor === 'actions' ? undefined : ({ value }) => (
            <div style={{
              fontSize: isMobile ? '11px' : '13px',
              lineHeight: '1.3',
              wordBreak: 'break-word',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              padding: isMobile ? '4px 6px' : '6px 8px',
            }}>
              {value || 'N/A'}
            </div>
          ),
        }));
        // Map users to rows with permission label and buttons
        const rows = users.map((user) => {
          const baseRow = {
            email: user.email,
            permission: user.admin ? 'admin' : 'user',
          };

          // Add first_name and last_name only for tablet and desktop
          if (!isMobile) {
            baseRow.first_name = user.first_name;
            baseRow.last_name = user.last_name;
          }

          // Add actions column for mobile/tablet
          if (isMobile || isTablet) {
            baseRow.actions = (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <MDButton
                  variant="gradient"
                  color={user.admin ? 'warning' : 'info'}
                  size="small"
                  onClick={async () => {
                    await AuthService.toggleUserPermission(user._id);
                    fetchUsers();
                    notification.success({
                      message:  `permission changed to ${user.admin ? 'user' : 'admin'}.`,
                      description: "permission changed successfully",
                      placement: "topRight",
                    });
                  }}
                  style={{
                    fontSize: isMobile ? '9px' : '11px',
                    padding: isMobile ? '3px 6px' : '4px 8px',
                    minWidth: isMobile ? '40px' : '50px',
                  }}
                >
                  {user.admin ? 'Set as User' : 'Set as Admin'}
                </MDButton>
                <MDButton
                  variant="gradient"
                  color="error"
                  size="small"
                  onClick={async () => {
                    await AuthService.deleteUser(user._id);
                    fetchUsers();
                    notification.success({
                      message: `User ${user.email} deleted.`,
                      description: "permission deleted successfully",
                      placement: "topRight",
                    });
                  }}
                  style={{
                    fontSize: isMobile ? '9px' : '11px',
                    padding: isMobile ? '3px 6px' : '4px 8px',
                    minWidth: isMobile ? '40px' : '50px',
                  }}
                >
                  Delete
                </MDButton>
              </div>
            );
          } else {
            // Desktop: separate columns for toggle and delete
            baseRow.toggle = (
              <MDButton
                variant="gradient"
                color={user.admin ? 'warning' : 'info'}
                size="small"
                onClick={async () => {
                  await AuthService.toggleUserPermission(user._id);
                  fetchUsers();
                  notification.success({
                    message:  `permission changed to ${user.admin ? 'user' : 'admin'}.`,
                    description: "permission changed successfully",
                    placement: "topRight",
                  });
                }}
              >
                {user.admin ? 'Set as User' : 'Set as Admin'}
              </MDButton>
            );
            baseRow.delete = (
              <MDButton
                variant="gradient"
                color="error"
                size="small"
                onClick={async () => {
                  await AuthService.deleteUser(user._id);
                  fetchUsers();
                  notification.success({
                    message: `User ${user.email} deleted.`,
                    description: "permission deleted successfully",
                    placement: "topRight",
                  });
                }}
              >
                Delete
              </MDButton>
            );
          }

          return baseRow;
        });
        setTableData({ columns, rows });
        // Calculate admin and user counts
        const admins = users.filter((u) => u.admin === true).length;
        const normalUsers = users.filter((u) => u.admin === false).length;
        setAdminCount(admins);
        setUserCount(normalUsers);
      } else {
        setTableData({ columns: [], rows: [] });
        setAdminCount(0);
        setUserCount(0);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setTableData({ columns: [], rows: [] });
      setAdminCount(0);
      setUserCount(0);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      {alert.open && (
        <MDAlert color={alert.color} dismissible>
          {alert.message}
        </MDAlert>
      )}
      <Grid container spacing={isMobile ? 2 : 3} pt={isMobile ? 2 : 3}>
        <Grid item xs={12} md={6} lg={3}>
          <MDBox mb={isMobile ? 1 : 1.5}>
            <ComplexStatisticsCard
              icon="leaderboard"
              title="admin counts"
              count={adminCount}
              percentage={{
                color: "success",
                amount: "+3%",
                label: "than last month",
              }}
            />
          </MDBox>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <MDBox mb={isMobile ? 1 : 1.5}>
            <ComplexStatisticsCard
              color="success"
              icon="store"
              title="user counts"
              count={userCount}
              percentage={{
                color: "success",
                amount: "+1%",
                label: "than last month",
              }}
            />
          </MDBox>
        </Grid>
      </Grid>
      <MDBox pt={isMobile ? 3 : 6} pb={isMobile ? 2 : 3}>
        <Grid container spacing={isMobile ? 2 : 6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={isMobile ? 1 : 2}
                mt={isMobile ? -2 : -3}
                py={isMobile ? 2 : 3}
                px={isMobile ? 1 : 2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white" style={{ fontSize: isMobile ? '14px' : '16px' }}>
                  User Table
                </MDTypography>
              </MDBox>
              <MDBox pt={isMobile ? 2 : 3}>
                <div style={{
                  overflowX: 'auto',
                  maxWidth: '100%',
                  WebkitOverflowScrolling: 'touch',
                }}>
                  <DataTable
                    table={tableData}
                    entriesPerPage={{ 
                      defaultValue: isMobile ? 5 : isTablet ? 8 : 10, 
                      entries: isMobile ? [5, 10] : isTablet ? [8, 15] : [10, 20] 
                    }}
                    canSearch={true}
                    showTotalEntries={true}
                    isLoading={loading}
                    style={{
                      minWidth: isMobile ? '100%' : 'auto',
                      fontSize: isMobile ? '11px' : '13px',
                      '& .MuiTableCell-root': {
                        padding: isMobile ? '8px 4px' : isTablet ? '10px 6px' : '12px 8px',
                        borderSpacing: isMobile ? '2px' : '4px',
                      },
                      '& .MuiTableHead-root .MuiTableCell-root': {
                        padding: isMobile ? '10px 4px' : isTablet ? '12px 6px' : '14px 8px',
                        fontSize: isMobile ? '11px' : '13px',
                        fontWeight: 600,
                      },
                    }}
                  />
                </div>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Tables;