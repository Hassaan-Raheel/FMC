import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { site_url } from '../../env';
const AdsContext = createContext();

export const AdsProvider = ({ children }) => {
  const [metaAds, setMetaAds] = useState([]);
  const [instaAds, setInstaAds] = useState([]);
  const [googleAdsData, setGoogleAdsData] = useState([]);
  const [campaignData, setCampaignData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [metaAdsRes, instaAdsRes, googleAdsRes, campaignDataRes] = await Promise.all([
          axios.get(`${site_url}/saved-meta-ads`),
          axios.get(`${site_url}/saved-meta-ads2`),
          axios.get(`${site_url}/google-ads`),
          axios.get(`${site_url}/campaign-data`),
        ]);

        setMetaAds(metaAdsRes.data.ads_data || []);
        setInstaAds(instaAdsRes.data.ads_data || []);
        setGoogleAdsData(googleAdsRes.data || []);
        setCampaignData(campaignDataRes.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

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
      const insights = ad.insights?.[0] || {};
      totals.spend += parseFloat(insights.spend || 0);
      totals.reach += parseFloat(insights.reach || 0);
      totals.impressions += parseInt(insights.impressions || 0);
      totals.clicks += parseInt(insights.clicks || 0);
      totals.cpc += parseFloat(insights.cpc || 0);
      totals.cpm += parseFloat(insights.cpm || 0);
      totals.ctr += parseFloat(insights.ctr || 0);
      return totals;
    }, initialTotals);
  };

  const metaTotals = aggregateAdData(metaAds);
  const instaTotals = aggregateAdData(instaAds, true);

  const combinedTotals = {
    totalSpend: metaTotals.spend + instaTotals.spend,
    totalReach: metaTotals.reach + instaTotals.reach,
    totalImpressions: metaTotals.impressions + instaTotals.impressions,
    totalClicks: metaTotals.clicks + instaTotals.clicks,
    totalCpc: metaTotals.clicks + instaTotals.clicks > 0 ? (metaTotals.spend + instaTotals.spend) / (metaTotals.clicks + instaTotals.clicks) : 0,
    totalCpm: metaTotals.impressions + instaTotals.impressions > 0 ? ((metaTotals.spend + instaTotals.spend) / (metaTotals.impressions + instaTotals.impressions)) * 1000 : 0,
    totalCtr: metaTotals.impressions + instaTotals.impressions > 0 ? ((metaTotals.clicks + instaTotals.clicks) / (metaTotals.impressions + instaTotals.impressions)) * 100 : 0,
  };

  return (
    <AdsContext.Provider
      value={{
        metaAds,
        instaAds,
        googleAdsData,
        campaignData,
        loading,
        error,
        metaTotals,
        instaTotals,
        combinedTotals,
      }}
    >
      {children}
    </AdsContext.Provider>
  );
};

export const useAds = () => useContext(AdsContext);