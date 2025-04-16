import React, { useEffect, useState } from "react";
import { FaThumbsUp, FaRegSmile, FaComment, FaShareAlt } from "react-icons/fa";
import "../Style.css"; // Importing the CSS file
import { useAds } from "../Components/AdsContext";
const HandleGeneratePDF = () => {
    const { metaTotals, instaTotals, combinedTotals, error } = useAds();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [activeFilter, setActiveFilter] = useState(null); // Track active filter

  // Handle custom date change
  const HandleStartDateChange = (e) => {
    setStartDate(e.target.value);
    setActiveFilter(null); // Reset active filter if manually selecting date
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
    setActiveFilter(null);
  };

  // Handle Quick Filter buttons
  const applyQuickFilter = (days) => {
    const today = new Date();
    const pastDate = new Date();
    pastDate.setDate(today.getDate() - days);

    setStartDate(pastDate.toISOString().split("T")[0]);
    setEndDate(today.toISOString().split("T")[0]);
    setActiveFilter(days); // Set active filter state
  };

  const filteredPosts = posts.filter((post) => {
    const postDate = new Date(post.created_time);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    return (
      (!start || postDate >= start) &&
      (!end || postDate <= end) &&
      post.image_url &&
      post.message
    );
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader"></div>
      </div>
    );
  }}

  const handleGeneratePDF = async () => {
    const pdf = new jsPDF("p", "mm", "a4"); // A4 Portrait
    let startX = 13;
    let startY = 10;
    let boxWidth = 28;
    let boxHeight = 25;
    let spacing = 3; // Space between boxes
  
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    pdf.text("Social Media Post Summary", 13, 15);
  
    // Fetch data from MetaAdsInstaSummary
    const metaAdsInstaSummaryData = await MetaAdsInstaSummary();
    const { metaTotals, instaTotals, combinedTotals } = metaAdsInstaSummaryData;
  
    // Fetch data from Facebookadsforreport
    const facebookAdsData = await Facebookadsforreport();
    const { totalSpend: fbTotalSpend, totalImpressions: fbTotalImpressions, totalClicks: fbTotalClicks, totalCpc: fbTotalCpc, totalCpm: fbTotalCpm, totalCtr: fbTotalCtr } = facebookAdsData;
  
    // Fetch data from Instagramadsforreport
    const instagramAdsData = await Instagramadsforreport();
    const { totalSpend: igTotalSpend, totalImpressions: igTotalImpressions, totalClicks: igTotalClicks, totalCpc: igTotalCpc, totalCpm: igTotalCpm, totalCtr: igTotalCtr } = instagramAdsData;
  
    // Fetch data from Googleadforreport
    const googleAdsData = await Googleadforreport();
    const { totalCost: googleTotalCost, totalImpressions: googleTotalImpressions, totalClicks: googleTotalClicks, totalCpc: googleTotalCpc, totalCtr: googleTotalCtr } = googleAdsData;
  
    // Add table with dynamic data
    autoTable(pdf, {
      startY: startY + 10,
      head: [["Platform", "No of Creatives","Posts", "Reels/Shorts", "Posted"]],
      body: [
        ["Facebook", setInstaPostCount2,facebookPosts.length,facebookReels.length,setInstaPostCount2],
        ["Instagram",setInstaPostCount1, instagramPosts.length,InstagramReels.length, setInstaPostCount1],
      ],
    });
  
    startY = pdf.lastAutoTable.finalY + 10;
  
    // Meta Ad Performance Title
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    pdf.text("Meta Ad Performance", 13, 55);
  
    // Data for boxes (Meta Ads)
    const metaData = [
      { label: "Amount Spent", value: `$${combinedTotals.totalSpend.toFixed(2)}` },
      { label: "Impressions", value: combinedTotals.totalImpressions },
      { label: "Clicks", value: combinedTotals.totalClicks },
      { label: "CPC", value: `$${combinedTotals.totalCpc.toFixed(2)}` },
      { label: "CPM", value: `$${combinedTotals.totalCpm.toFixed(2)}` },
      { label: "CTR", value: `${combinedTotals.totalCtr.toFixed(2)}%` },
    ];
  
    startY += 10; // Move below title
  
    // Draw Meta Ad Performance boxes
    metaData.forEach((item, index) => {
      let xPos = startX + (index * (boxWidth + spacing));
  
      // Draw box
      const shadowOffset = 1; // Adjust shadow size
      const shadowColor = 200; // Adjust shadow darkness
  
      // Simulate Shadow (Lighter gray offset behind the main box)
      pdf.setFillColor(shadowColor, shadowColor, shadowColor);
      pdf.roundedRect(xPos + shadowOffset, startY + shadowOffset, boxWidth, boxHeight, 1, 1, "F");
  
      // Main Box
      pdf.setDrawColor(0);
      pdf.setFillColor(240, 240, 240); // Light grey background
      pdf.roundedRect(xPos, startY, boxWidth, boxHeight, 1, 1, "F");
  
      // Add text
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.text(item.label, xPos + 5, startY + 10);
  
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(12);
      pdf.text(item.value, xPos + 5, startY + 20);
    });
  
    startY += 45; // Move below Meta Ad Performance boxes
  
    // Facebook Ad Performance Title
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    pdf.text("Facebook Ad Performance", 13, startY);
  
    // Data for boxes (Facebook Ads)
    const facebookData = [
      { label: "Amount Spent", value: `$${fbTotalSpend.toFixed(2)}` },
      { label: "Impressions", value: fbTotalImpressions },
      { label: "Clicks", value: fbTotalClicks },
      { label: "CPC", value: `$${fbTotalCpc.toFixed(2)}` },
      { label: "CPM", value: `$${fbTotalCpm.toFixed(2)}` },
      { label: "CTR", value: `${fbTotalCtr.toFixed(2)}%` },
    ];
  
    // Draw Facebook Ad Performance boxes
    facebookData.forEach((item, index) => {
      let xPos = startX + (index * (boxWidth + spacing));
  
      // Draw box
      const shadowOffset = 1; // Adjust shadow size
      const shadowColor = 200; // Adjust shadow darkness
  
      // Simulate Shadow (Lighter gray offset behind the main box)
      pdf.setFillColor(shadowColor, shadowColor, shadowColor);
      pdf.roundedRect(xPos + shadowOffset, startY + shadowOffset, boxWidth, boxHeight, 1, 1, "F");
  
      // Main Box
      pdf.setDrawColor(0);
      pdf.setFillColor(240, 240, 240); // Light grey background
      pdf.roundedRect(xPos, startY, boxWidth, boxHeight, 1, 1, "F");
  
      // Add text
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.text(item.label, xPos + 5, startY + 10);
  
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(12);
      pdf.text(item.value, xPos + 5, startY + 20);
    });
  
    startY += 45; // Move below Facebook Ad Performance boxes
  
    // Instagram Ad Performance Title
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    pdf.text("Instagram Ad Performance", 13, startY);
  
    // Data for boxes (Instagram Ads)
    const instagramData = [
      { label: "Amount Spent", value: `$${igTotalSpend.toFixed(2)}` },
      { label: "Impressions", value: igTotalImpressions },
      { label: "Clicks", value: igTotalClicks },
      { label: "CPC", value: `$${igTotalCpc.toFixed(2)}` },
      { label: "CPM", value: `$${igTotalCpm.toFixed(2)}` },
      { label: "CTR", value: `${igTotalCtr.toFixed(2)}%` },
    ];
  
    // Draw Instagram Ad Performance boxes
    instagramData.forEach((item, index) => {
      let xPos = startX + (index * (boxWidth + spacing));
  
      // Draw box
      const shadowOffset = 1; // Adjust shadow size
      const shadowColor = 200; // Adjust shadow darkness
  
      // Simulate Shadow (Lighter gray offset behind the main box)
      pdf.setFillColor(shadowColor, shadowColor, shadowColor);
      pdf.roundedRect(xPos + shadowOffset, startY + shadowOffset, boxWidth, boxHeight, 1, 1, "F");
  
      // Main Box
      pdf.setDrawColor(0);
      pdf.setFillColor(240, 240, 240); // Light grey background
      pdf.roundedRect(xPos, startY, boxWidth, boxHeight, 1, 1, "F");
  
      // Add text
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.text(item.label, xPos + 5, startY + 10);
  
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(12);
      pdf.text(item.value, xPos + 5, startY + 20);
    });
  
    startY += 45; // Move below Instagram Ad Performance boxes
  
    // Google Ad Performance Title
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    pdf.text("Google Ad Performance", 13, startY);
  
    // Data for boxes (Google Ads)
    const googleData = [
      { label: "Amount Spent", value: `$${googleTotalCost.toFixed(2)}` },
      { label: "Impressions", value: googleTotalImpressions },
      { label: "Clicks", value: googleTotalClicks },
      { label: "CPC", value: `$${googleTotalCpc.toFixed(2)}` },
      { label: "CTR", value: `${googleTotalCtr.toFixed(2)}%` },
    ];
  
    // Draw Google Ad Performance boxes
    googleData.forEach((item, index) => {
      let xPos = startX + (index * (boxWidth + spacing));
  
      // Draw box
      const shadowOffset = 1; // Adjust shadow size
      const shadowColor = 200; // Adjust shadow darkness
  
      // Simulate Shadow (Lighter gray offset behind the main box)
      pdf.setFillColor(shadowColor, shadowColor, shadowColor);
      pdf.roundedRect(xPos + shadowOffset, startY + shadowOffset, boxWidth, boxHeight, 1, 1, "F");
  
      // Main Box
      pdf.setDrawColor(0);
      pdf.setFillColor(240, 240, 240); // Light grey background
      pdf.roundedRect(xPos, startY, boxWidth, boxHeight, 1, 1, "F");
  
      // Add text
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.text(item.label, xPos + 5, startY + 10);
  
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(12);
      pdf.text(item.value, xPos + 5, startY + 20);
    });
  
    startY += 45; // Move below Google Ad Performance boxes
  
    // Function to create a chart and return its data URL
    const generateChart = async (labels, datasetLabel, data, colors) => {
      return new Promise((resolve) => {
        const chartCanvas = document.createElement("canvas");
        chartCanvas.width = 300;
        chartCanvas.height = 200;
        const ctx = chartCanvas.getContext("2d");
  
        new Chart(ctx, {
          type: "bar",
          data: {
            labels: labels,
            datasets: [{
              label: datasetLabel,
              data: data,
              backgroundColor: colors,
              borderColor: colors.map(c => c.replace("0.6", "1")),
              borderWidth: 1
            }]
          },
          options: {
            responsive: false,
            scales: {
              y: { beginAtZero: true }
            }
          }
        });
  
        setTimeout(() => {
          resolve(chartCanvas.toDataURL("image/png"));
        }, 500);
      });
    };

        // Generate all charts
        const chart1 = await generateChart(["Reach", "Impressions"], "Reach Vs Impressions", [combinedTotals.totalReach, combinedTotals.totalImpressions], ["rgba(75, 192, 192, 0.6)", "rgba(255, 99, 132, 0.6)"]);
        const chart2 = await generateChart(["CPM", "CTR"], "CPM Vs CTR", [combinedTotals.totalCpm, combinedTotals.totalCtr], ["rgba(75, 192, 192, 0.6)", "rgba(255, 99, 132, 0.6)"]);
        const chart3 = await generateChart(["Amount Spend"], "Amount Spend", [combinedTotals.totalSpend], ["rgba(75, 192, 192, 0.6)"]);
        const chart4 = await generateChart(["Impressions"], "Impressions", [combinedTotals.totalImpressions], ["rgba(255, 99, 132, 0.6)"]);
        const chart5 = await generateChart(["CPM"], "CPM", [combinedTotals.totalCpm], ["rgba(75, 192, 192, 0.6)"]);
        const chart6 = await generateChart(["CTR"], "CTR", [combinedTotals.totalCtr], ["rgba(255, 99, 132, 0.6)"]);
      
        // Add images to PDF
        pdf.addImage(chart1, "PNG", 13, startY + 5, 90, 60);
        pdf.addImage(chart2, "PNG", 100, startY + 5, 90, 60);
        pdf.addImage(chart3, "PNG", 13, startY + 70, 45, 60);
        pdf.addImage(chart4, "PNG", 55, startY + 70, 45, 60);
        pdf.addImage(chart5, "PNG", 100, startY + 70, 45, 60);
        pdf.addImage(chart6, "PNG", 145, startY + 70, 45, 60);
      
        // Save PDF
        pdf.save("Meta_Ad_Report.pdf");
      };
    


export default HandleGeneratePDF;