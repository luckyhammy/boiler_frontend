// Create this new data file: layouts/dashboard/data/groupedBarChartData.js
export default {
  labels: ["Pune", "Mumbai", "Ahilyanagar", "Solapur", "Kolhapur", "Nashik", "Nagpur"],
  datasets: [
    {
      label: "Users",
      data: [500, 1150, 150, 300, 700, 300, 600],
      backgroundColor: "rgba(54, 162, 235, 0.6)",
    },
    {
      label: "Cities",
      data: [200, 350, 300, 150, 200, 200, 450],
      backgroundColor: "rgba(255, 159, 64, 0.6)",
    },
    {
      label: "Records",
      data: [450, 500, 400, 250, 550, 450, 400],
      backgroundColor: "rgba(255, 99, 132, 0.6)",
    },
  ],
};