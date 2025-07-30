import React, { useState, useEffect, useMemo, useContext } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { useSelector, useDispatch } from "react-redux";
import { setSheet1 } from "../../redux/sheet1";
import axios from "axios";
import DataTable from "examples/Tables/DataTable";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import ReportsBarChart from "examples/Charts/BarCharts/VerticalBarChart";
import MDSelect from "components/MDSelect/MDSelect";
import PieChart from "examples/Charts/PieChart";
import { AuthContext } from "context";
import { getUserInfo } from "../../utils/jwtUtils";
import { notification } from "antd";
import MDButton from "components/MDButton";

// Add global test function
window.testUserRegion = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.log("No token found");
    return;
  }
  
  const decoded = getUserInfo(token);
  console.log("Decoded user info:", decoded);
  
  if (decoded && decoded.id) {
    // Test backend data
    axios.get(`/api/v1/auth/user/${decoded.id}`)
      .then(response => {
      })
      .catch(error => {
        console.error("Backend error:", error);
      });
  }
};

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

// Registering the necessary chart elements
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Sheet2() {
  const dispatch = useDispatch();
  const { isMobile, isTablet } = useResponsive();
  const sheetData1 = useSelector((state) => state.sheet1.data);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCity, setSelectedCity] = useState('');
  const { isAdmin, userInfo } = useContext(AuthContext);

  const sheetData2 = sheetData1.slice(2, 10);

  // Get available regions for select dropdown
  const availableRegions = useMemo(() => {
    if (!sheetData2 || sheetData2.length === 0) return [];
    return sheetData2.slice(1).map(row => row[1]).filter(region => region);
  }, [sheetData2]);

  // Get user's region from JWT token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const userInfoFromToken = getUserInfo(token);
      if (userInfoFromToken) {
        // Set the selected city based on user permissions
        if (isAdmin) {
          // Admin can select any region, default to first available
          if (!selectedCity && availableRegions.length > 0) {
            setSelectedCity(availableRegions[0]);
          }
        } else {
          // Regular user is restricted to their assigned region
          if (userInfoFromToken.region) {
            setSelectedCity(userInfoFromToken.region); // Force their region
          }
        }
      } else {
        console.log("Failed to decode user information from token");
      }
    } else {
      console.log("No token found in localStorage");
    }
  }, [userInfo, isAdmin, availableRegions, selectedCity]);

  const fetchSheet = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/sheet-data");
      dispatch(setSheet1(res.data[1]));
    } catch (err) {
      dispatch(setSheet1([]));
    }
    setLoading(false);
  };

  const refreshData = async () => {
    setRefreshing(true);
    try {
      const res = await axios.post("/api/refresh-sheet-data");
      if (res.data.success) {
        dispatch(setSheet1(res.data.data[1]));
        notification.success({
          message: 'Data Refreshed Successfully!',
          description: 'Google Sheets data has been updated and synchronized.',
          placement: 'topRight',
          duration: 3,
        });
      } else {
        notification.error({
          message: 'Refresh Failed',
          description: 'Failed to refresh data from Google Sheets.',
          placement: 'topRight',
          duration: 4,
        });
      }
    } catch (err) {
      console.error("Error refreshing data:", err);
      notification.error({
        message: 'Refresh Error',
        description: 'An error occurred while refreshing the data.',
        placement: 'topRight',
        duration: 4,
      });
    }
    setRefreshing(false);
  };

  useEffect(() => {
    fetchSheet();
  }, [dispatch]);

  // Generate columns and rows for the table with responsive design
  const allKeys = sheetData1 && sheetData1.length > 2 ? Object.keys(sheetData1[2]) : [];
  
  // Responsive column configuration based on screen size
  const getVisibleKeys = () => {
    if (isMobile) {
      // Mobile: Show only 2 most important columns
      return allKeys.slice(1, 3);
    } else if (isTablet) {
      // Tablet: Show 3 columns
      return allKeys.slice(1, 4);
    } else {
      // Desktop: Show all columns
      return allKeys.slice(1, 6);
    }
  };

  const visibleKeys = getVisibleKeys();
  
  const columns = visibleKeys.map((key) => ({
    Header: sheetData1[2][key],
    accessor: key,
    minWidth: isMobile ? 80 : isTablet ? 120 : 150,
    maxWidth: isMobile ? 150 : isTablet ? 200 : 250,
    Cell: ({ value }) => (
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

  const rows =
    sheetData1 && sheetData1.length > 3
      ? sheetData1.slice(3).map((row) => {
        const filteredRow = {};
        visibleKeys.forEach((key) => {
          filteredRow[key] = row[key];
        });
        // Also include the first column (region name)
        filteredRow[allKeys[0]] = row[allKeys[0]];
        return filteredRow;
      }) // Keep all rows for the table (including Total)
      : [];

  // Create chart data from sheetData2
  const data = useMemo(() => {
    if (!sheetData2 || sheetData2.length === 0) {
      return {
        labels: [],
        datasets: []
      };
    }

    // Skip the first row (header) and extract region names from the second column
    const labels = sheetData2.slice(1).map(row => row[1] || '').filter(label => label !== '');

    // Define colors for different datasets
    const colors = ["info", "success", "error", "warning", "primary"];

    // Extract dataset labels dynamically from the header row (columns 3-6, indices 2-5)
    const datasetLabels = [];
    for (let i = 2; i <= 5; i++) {
      if (sheetData2[0] && sheetData2[0][i]) {
        datasetLabels.push(sheetData2[0][i]);
      }
    }

    // Create datasets for columns 3-6 (indices 2-5)
    const datasets = [];

    for (let i = 2; i <= 5; i++) {
      if (sheetData2[0] && sheetData2[0][i]) {
        const dataset = {
          label: datasetLabels[i - 2], // Use dynamic label from header
          data: sheetData2.slice(1).map(row => {
            const value = parseInt(row[i]) || 0;
            return value;
          }),
          color: colors[i - 2] || "info"
        };
        datasets.push(dataset);
      }
    }

    return {
      labels,
      datasets
    };
  }, [sheetData2]);

  // Create reusable function for bar chart data generation
  const createBarChartData = useMemo(() => {
    return (startColumn, endColumn) => {
      if (!sheetData2 || sheetData2.length === 0) {
        return {
          labels: [],
          datasets: []
        };
      }

      // Get available regions (skip header row)
      const availableRegions = sheetData2.slice(1).map(row => row[1]).filter(region => region);

      // Set default selected city if not set
      if (!selectedCity && availableRegions.length > 0) {
        setSelectedCity(availableRegions[0]);
      }

      // Find the selected region's data
      const selectedRegionData = sheetData2.slice(1).find(row => row[1] === selectedCity);

      if (!selectedRegionData) {
        return {
          labels: [],
          datasets: []
        };
      }

      // Extract column headers (labels) from header row
      const chartLabels = [];
      for (let i = startColumn; i <= endColumn; i++) {
        if (sheetData2[0][i]) {
          chartLabels.push(sheetData2[0][i]);
        }
      }

      // Extract data for selected region
      const chartData = [];
      for (let i = startColumn; i <= endColumn; i++) {
        const value = parseInt(selectedRegionData[i]) || 0;
        chartData.push(value);
      }

      return {
        labels: chartLabels,
        datasets: [
          {
            label: selectedCity,
            data: chartData,
            color: "info"
          }
        ]
      };
    };
  }, [sheetData2, selectedCity]);

  // Create regional chart data for selected city (Boiler status as per various region and total)
  const regionalData = createBarChartData(2, 5);

  // Create certificate bar chart data (Boiler as per type of certificate according to the region)
  const certificateBarChartData = createBarChartData(81, 103);

  // Create reusable function for pie chart data generation
  const createPieChartData = useMemo(() => {
    return (startColumn, endColumn, title) => {
      if (!sheetData2 || sheetData2.length === 0) {
        return {
          labels: [],
          datasets: {}
        };
      }
      
      // Find the selected region's data
      const selectedRegionData = sheetData2.slice(1).find(row => row[1] === selectedCity);
      
      if (!selectedRegionData) {
        return {
          labels: [],
          datasets: {}
        };
      }
      
      // Extract column headers (labels) from header row
      const chartLabels = [];
      for (let i = startColumn; i <= endColumn; i++) {
        if (sheetData2[0][i]) {
          chartLabels.push(sheetData2[0][i]);
        }
      }
      
      // Extract data for selected region
      const chartData = [];
      for (let i = startColumn; i <= endColumn; i++) {
        const value = parseInt(selectedRegionData[i]) || 0;
        chartData.push(value);
      }

      // Define colors for pie chart segments (using theme color names)
      const backgroundColors = [
        "info", "success", "error", "warning", "primary", "secondary",
        "light", "dark", "info", "success", "error", "warning",
        "primary", "secondary", "light", "dark", "info", "success",
        "error", "warning", "primary", "secondary", "light", "dark"
      ];

      return {
        labels: chartLabels,
        datasets: {
          label: selectedCity,
          data: chartData,
          backgroundColors: backgroundColors
        }
      };
    };
  }, [sheetData2, selectedCity]);

  // Create pie chart data for selected city (Boiler as per type by region)
  const pieChartData = createPieChartData(6, 20);

  // Create pie chart data for fuel data (Boiler as per fuel by region)
  const fuelPieChartData = createPieChartData(58, 76);
  const industryPieChartData = createPieChartData(29, 50);
  const surfacePieChartData = createPieChartData(51, 57);
  const CapacityPieChartData = createPieChartData(21, 28);

  // Calculate the number of regions from the table data
  const regionCount = useMemo(() => {
    if (!sheetData1 || sheetData1.length === 0) return 0;
    
    // Get all rows from the table (excluding header rows)
    const tableRows = sheetData1.slice(3);
    
    // Count unique regions (excluding the "Total" row)
    const regions = tableRows
      .map(row => row[allKeys[0]]) // Get region name from first column
      .filter(region => region && region !== 'Total' && region.trim() !== '');
    
    return regions.length;
  }, [sheetData1, allKeys]);


  return (
    <DashboardLayout>
      <DashboardNavbar />
      {/* ... existing code ... */}
      <Grid container spacing={3} pt={3}>
        {isAdmin && (
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="leaderboard"
                title="region counts"
                count="7"
                percentage={{
                  color: "success",
                  amount: "+3%",
                  label: "than last month",
                }}
              />
            </MDBox>
          </Grid>
        )}
      </Grid>
      <MDBox pt={isMobile ? 3 : 6} pb={isMobile ? 2 : 3}>
        <Grid container spacing={isMobile ? 2 : 6}>
          {isAdmin && (
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
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <MDTypography variant="h6" color="white" style={{ fontSize: isMobile ? '14px' : '16px' }}>
                    All Table
                  </MDTypography>
                  
                  <MDButton
                    variant="gradient"
                    color="success"
                    size={isMobile ? "small" : "medium"}
                    onClick={refreshData}
                    disabled={refreshing}
                    style={{
                      fontSize: isMobile ? '10px' : '12px',
                      padding: isMobile ? '6px 12px' : '8px 16px',
                      minWidth: isMobile ? '60px' : '80px',
                    }}
                  >
                    {refreshing ? "..." : isMobile ? "↻" : "Refresh"}
                  </MDButton>
                </MDBox>
                <MDBox pt={isMobile ? 2 : 3}>
                  <div style={{
                    overflowX: 'auto',
                    maxWidth: '100%',
                    WebkitOverflowScrolling: 'touch',
                  }}>
                    <DataTable
                      table={{ columns, rows }}
                      entriesPerPage={{ 
                        defaultValue: isMobile ? 5 : isTablet ? 8 : 10, 
                        entries: isMobile ? [5, 10] : isTablet ? [8, 15] : [10, 20] 
                      }}
                      canSearch={false}
                      showTotalEntries={true}
                      isLoading={loading}
                      isSorted={false}
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
                  <MDBox
                    mx={isMobile ? 1 : 2}
                    mt={isMobile ? -2 : -3}
                    py={isMobile ? 2 : 3}
                    px={isMobile ? 1 : 2}
                    variant="gradient"
                    borderRadius="lg"
                  >
                    <MDBox mb={isMobile ? 2 : 3}>
                      <ReportsBarChart
                        color="info"
                        title="Boiler Statistics by Region"
                        description="Regional boiler performance data"
                        date="data updated from Google Sheets"
                        chart={data}
                      />
                    </MDBox>
                  </MDBox>
                </MDBox>
              </Card>
            </Grid>
          )}
        </Grid>
      </MDBox>
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
                  City Table
                </MDTypography>
              </MDBox>
              <MDBox pt={isMobile ? 2 : 3}>
                {isAdmin ? (
                  <MDBox mx={isMobile ? 1 : 2} mb={isMobile ? 2 : 3}>
                    <MDSelect
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      label="Select Region"
                      options={availableRegions}
                      style={{
                        fontSize: isMobile ? '12px' : '14px',
                      }}
                    />
                  </MDBox>
                ) : (
                  <MDBox mx={isMobile ? 1 : 2} mb={isMobile ? 2 : 3}>
                    <MDTypography variant="h6" color="text" fontWeight="medium">
                      Your Region: {selectedCity}
                    </MDTypography>
                    <MDTypography variant="caption" color="text" fontWeight="light">
                      You can only view data for your assigned region
                    </MDTypography>
                  </MDBox>
                )}
                <MDBox
                  mx={isMobile ? 1 : 2}
                  mt={isMobile ? -2 : -3}
                  py={isMobile ? 2 : 3}
                  px={isMobile ? 1 : 2}
                  variant="gradient"
                  borderRadius="lg"
                >
                  <MDBox mb={isMobile ? 2 : 3}>
                    <Grid container spacing={isMobile ? 1 : 3}>
                      <Grid item xs={12} md={6} lg={6}>
                        <MDBox mb={isMobile ? 1 : 3}>
                          <ReportsBarChart
                            color="info"
                            title={isMobile ? `${selectedCity || 'Region'} : Boiler status` : `${selectedCity || 'Region'} : Boiler status as per various region and total`}
                            description={isMobile ? `Statistics for ${selectedCity || 'selected region'}` : `Detailed statistics for ${selectedCity || 'selected region'}`}
                            date="data updated from Google Sheets"
                            chart={regionalData}
                          />
                        </MDBox>
                      </Grid>
                      <Grid item xs={12} md={6} lg={6}>
                        <MDBox mb={isMobile ? 1 : 3}>
                          <PieChart
                            color="info"
                            title={isMobile ? `${selectedCity || 'Region'} : Boiler type` : `${selectedCity || 'Region'} : Boiler as per type by region`}
                            description={isMobile ? `Type distribution for ${selectedCity || 'selected region'}` : `Boiler status distribution for ${selectedCity || 'selected region'}`}
                            date="data updated from Google Sheets"
                            chart={pieChartData}
                          />
                        </MDBox>
                      </Grid>
                    </Grid>
                  </MDBox>
                  <MDBox mb={isMobile ? 2 : 3}>
                    <Grid container spacing={isMobile ? 1 : 3}>
                      <Grid item xs={12} md={6} lg={6}>
                        <MDBox mb={isMobile ? 1 : 3}>
                          <PieChart
                            color="success"
                            title={isMobile ? `${selectedCity || 'Region'} : Fuel type` : `${selectedCity || 'Region'} : Boiler as per fuel by region`}
                            description={isMobile ? `Fuel distribution for ${selectedCity || 'selected region'}` : `Fuel distribution for ${selectedCity || 'selected region'}`}
                            date="data updated from Google Sheets"
                            chart={fuelPieChartData}
                          />
                        </MDBox>
                      </Grid>
                      <Grid item xs={12} md={6} lg={6}>
                        <MDBox mb={isMobile ? 1 : 3}>
                          <PieChart
                            color="success"
                            title={isMobile ? `${selectedCity || 'Region'} : Industry types` : `${selectedCity || 'Region'} : Boiler used in various industry`}
                            description={isMobile ? `Industry distribution for ${selectedCity || 'selected region'}` : `used in various industry for ${selectedCity || 'selected region'}`}
                            date="data updated from Google Sheets"
                            chart={industryPieChartData}
                          />
                        </MDBox>
                      </Grid>
                    </Grid>
                  </MDBox>
                  <MDBox mb={isMobile ? 2 : 3}>
                    <Grid container spacing={isMobile ? 1 : 3}>
                      <Grid item xs={12} md={6} lg={6}>
                        <MDBox mb={isMobile ? 1 : 3}>
                          <PieChart
                            color="success"
                            title={isMobile ? `${selectedCity || 'Region'} : Heating surface` : `${selectedCity || 'Region'} : Boiler as per Heating surface in m2 `}
                            description={isMobile ? `Heating surface for ${selectedCity || 'selected region'}` : `Boiler as per Heating surface in m2 for ${selectedCity || 'selected region'}`}
                            date="data updated from Google Sheets"
                            chart={surfacePieChartData}
                          />
                        </MDBox>
                      </Grid>
                      <Grid item xs={12} md={6} lg={6}>
                        <MDBox mb={isMobile ? 1 : 3}>
                          <PieChart
                            color="success"
                            title={isMobile ? `${selectedCity || 'Region'} : Capacity TPH` : `${selectedCity || 'Region'} : Boiler as per Capacity in TPH`}
                            description={isMobile ? `Capacity for ${selectedCity || 'selected region'}` : `Boiler as per Capacity in TPH for ${selectedCity || 'selected region'}`}
                            date="data updated from Google Sheets"
                            chart={CapacityPieChartData}
                          />
                        </MDBox>
                      </Grid>
                    </Grid>
                  </MDBox>
                  <MDBox mb={isMobile ? 2 : 3}>
                    <Grid container spacing={isMobile ? 1 : 3}>
                      <Grid item xs={12} md={6} lg={6}>
                        <MDBox mb={isMobile ? 1 : 3}>
                          <ReportsBarChart
                            color="warning"
                            title={isMobile ? `${selectedCity || 'Region'} : Certificate types` : `${selectedCity || 'Region'} : Boiler as per type of certificate according to the region`}
                            description={isMobile ? `Certificate distribution for ${selectedCity || 'selected region'}` : `Certificate distribution for ${selectedCity || 'selected region'}`}
                            date="data updated from Google Sheets"
                            chart={certificateBarChartData}
                          />
                        </MDBox>
                      </Grid>
                    </Grid>
                  </MDBox>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Sheet2;
