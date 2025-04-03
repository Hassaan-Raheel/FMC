import React, { useEffect, useState } from "react";
import { site_url } from "../../../env";

const formatNumber = (num) => {
  if (num >= 10000) {
    return `${(num / 1000).toFixed(1)}K`; // Convert to K format with 1 decimal
  }
  return `${num.toFixed(2)}`; // Keep normal format if less than 1000
};
const MetaAdsInstaSummary = () => {
  const [metaAds, setMetaAds] = useState([]);
  const [instaAds, setInstaAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdData = async () => {
      try {
        const [metaAdsRes, instaAdsRes] = await Promise.all([
          fetch(`${site_url}/saved-meta-ads`).then((res) => {
            if (!res.ok) throw new Error("Failed to fetch Meta Ads data");
            return res.json();
          }),
          fetch(`${site_url}/saved-meta-ads2`).then((res) => {
            if (!res.ok) throw new Error("Failed to fetch Insta Ads data");
            return res.json();
          }),
        ]);
  
        console.log("Meta Ads API Response:", metaAdsRes);
        console.log("Insta Ads API Response:", instaAdsRes);
  
        // Filter and set Meta Ads data (exclude Instagram posts)
        const filteredMetaAds = Array.isArray(metaAdsRes?.ads_data)
          ? metaAdsRes.ads_data.filter(
              (ad) =>
                ad.insights &&
                ad.insights !== "No insights available" &&
                Array.isArray(ad.insights) &&
                ad.insights.length > 0 &&
                (!ad.name || !ad.name.startsWith("Instagram post:"))
            )
          : [];
        setMetaAds(filteredMetaAds);
  
        // Filter and set Insta Ads data (only Instagram posts)
        const filteredInstaAds = Array.isArray(instaAdsRes?.ads_data)
          ? instaAdsRes.ads_data.filter(
              (ad) =>
                ad.insights &&
                ad.insights !== "No insights available" &&
                Array.isArray(ad.insights) &&
                ad.insights.length > 0 &&
                ad.name && 
                ad.name.startsWith("")
            )
          : [];
        setInstaAds(filteredInstaAds);
  
      } catch (error) {
        console.error("Error fetching campaign data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchAdData();
  }, []);

  /**
   * Aggregates ad data into totals for spend, reach, impressions, clicks, CPC, CPM, and CTR.
   * @param {Array} ads - Array of ad objects.
   * @param {boolean} isInstaAds - Whether the ads are Insta Ads (to filter by publisher_platform).
   * @returns {Object} Aggregated totals.
   */
  const aggregateAdData = (ads, isInstaAds = false) => {
    const initialTotals = {
      spend: 0,
      reach: 0,
      impressions: 0,
      clicks: 0,
      cpc: 0,
      cpm: 0,
      ctr: 0,
    };

    if (!Array.isArray(ads)) {
      console.error("aggregateAdData received a non-array value:", ads);
      return initialTotals;
    }

    return ads.reduce((totals, ad) => {
      // Skip if insights is not an array or is invalid
      if (!Array.isArray(ad.insights) || ad.insights.length === 0 || ad.insights === "No insights available") {
        return totals;
      }

      // For Insta Ads, filter insights by publisher_platform === "instagram"
      const insightsToProcess = isInstaAds
        ? ad.insights.filter((i) => i.publisher_platform === "instagram")
        : ad.insights;

      // Skip if no insights are found after filtering
      if (insightsToProcess.length === 0) return totals;

      // Use the first insight (assuming there's only one)
      const insight = insightsToProcess[0];
      totals.spend += parseFloat(insight.spend || 0);
      totals.reach += parseFloat(insight.reach || 0);
      totals.impressions += parseInt(insight.impressions || 0);
      totals.clicks += parseInt(insight.clicks || 0);
      totals.cpc += parseFloat(insight.cpc || 0);
      totals.cpm += parseFloat(insight.cpm || 0);
      totals.ctr += parseFloat(insight.ctr || 0);

      return totals;
    }, initialTotals);
  };

  // Aggregate data for Meta and Insta ads
  const metaTotals = aggregateAdData(metaAds); // No filter for Meta Ads
  const instaTotals = aggregateAdData(instaAds, true); // Apply filter for Insta Ads

  // Calculate combined totals
  const combinedTotals = {
    totalSpend: metaTotals.spend + instaTotals.spend,
    totalReach: metaTotals.reach + instaTotals.reach,
    totalImpressions: metaTotals.impressions + instaTotals.impressions,
    totalClicks: metaTotals.clicks + instaTotals.clicks,
    totalCpc:
      metaTotals.clicks + instaTotals.clicks > 0
        ? (metaTotals.spend + instaTotals.spend) / (metaTotals.clicks + instaTotals.clicks)
        : 0,
    totalCpm:
      metaTotals.impressions + instaTotals.impressions > 0
        ? ((metaTotals.spend + instaTotals.spend) / (metaTotals.impressions + instaTotals.impressions)) * 1000
        : 0,
    totalCtr:
      metaTotals.impressions + instaTotals.impressions > 0
        ? ((metaTotals.clicks + instaTotals.clicks) / (metaTotals.impressions + instaTotals.impressions)) * 100
        : 0,
  };

  console.log("Meta Totals:", metaTotals);
  console.log("Insta Totals:", instaTotals);
  console.log("Combined Totals:", combinedTotals);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div> {error && (
      <div className="grid1">
        {error}
      </div>
    )}</div>;
  }

  return (

    
  
    <div className="total-details p-4 border border-gray-300 rounded-md shadow-sm">
        {/* Error Message in a Grid */}
   
          <h3 className="text-lg mb-0 mt-0">Meta Ad Performance</h3>
    <div className="grid2 summary-box">
      <p>Amount Spent: <strong>${combinedTotals.totalSpend.toFixed(2)}</strong></p>
      <p>Impressions: <strong>{combinedTotals.totalImpressions}</strong></p>
      <p>Clicks: <strong>{combinedTotals.totalClicks}</strong></p>
      <p>CPM: <strong>${combinedTotals.totalCpm.toFixed(2)}</strong></p>
      <p>CTR: <strong>{combinedTotals.totalCtr.toFixed(2)}%</strong></p>
      <p>CPC: <strong>${combinedTotals.totalCpc.toFixed(2)}</strong></p>
    </div>
    </div>
  );
};

export default MetaAdsInstaSummary;