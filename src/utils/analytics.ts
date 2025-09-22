import { UserData, CalculationResults, AnalyticsData, AnalyticsSummary } from '../types';
import { firebaseService } from './firebase';
import { getAgeRange, getBodyFatRange, getEAStatus } from './calculations';

const ANALYTICS_KEY = 'metabolic_calculator_analytics';

// Basic data validation
const validateUserData = (userData: UserData): boolean => {
  return !!(
    userData.weight > 0 && userData.weight < 500 &&
    userData.height > 0 && userData.height < 300 &&
    userData.age > 0 && userData.age < 150 &&
    userData.gender &&
    userData.activityLevel &&
    userData.bodyFatPercentage > 0
  );
};

export const saveCalculationData = (userData: UserData, results: CalculationResults): void => {
  try {
    // Validate input data
    if (!validateUserData(userData)) {
      console.warn('Invalid user data, skipping analytics save');
      return;
    }

    // Sanitize user name (basic privacy measure)
    const sanitizedName = userData.name ? 
      userData.name.trim().substring(0, 50).replace(/[<>]/g, '') : 
      'Anonymous';

    // Create analytics data with user name
    const analyticsEntry: AnalyticsData = {
      timestamp: new Date().toISOString(),
      userName: sanitizedName,
      demographics: {
        age_range: getAgeRange(userData.age),
        gender: userData.gender,
        activity_level: userData.activityLevel,
        body_fat_range: getBodyFatRange(userData.bodyFatPercentage)
      },
      results: {
        bmr: results.bmr,
        rmr: results.rmr,
        tdee: results.tdee,
        ea: results.energyAvailability,
        ea_status: getEAStatus(results.energyAvailability)
      }
    };

    // Get existing data
    const existingData = getAnalyticsData();
    
    // Add new entry
    existingData.push(analyticsEntry);
    
    // Keep only last 1000 entries to prevent storage bloat
    const trimmedData = existingData.slice(-1000);
    
    // Save to localStorage
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(trimmedData));

    // Also save to Firebase if configured
    if (firebaseService.isConfigured()) {
      firebaseService.addUserData(analyticsEntry).catch(error => {
        console.error('Failed to save to Firebase:', error);
      });
    }
  } catch (error) {
    console.error('Error saving analytics data:', error);
  }
};

export const getAnalyticsData = (): AnalyticsData[] => {
  try {
    const data = localStorage.getItem(ANALYTICS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading analytics data:', error);
    return [];
  }
};

export const getAnalyticsSummary = (days: number = 30, data?: AnalyticsData[]): AnalyticsSummary => {
  const analyticsData = data || getAnalyticsData();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  const filteredData = analyticsData.filter(item => 
    new Date(item.timestamp) >= cutoffDate
  );

  if (filteredData.length === 0) {
    return {
      totalCalculations: 0,
      dailyAverage: 0,
      genderDistribution: {},
      activityLevelDistribution: {},
      bodyFatDistribution: {},
      eaStatusDistribution: {},
      averageAge: 0,
      averageTDEE: 0
    };
  }

  // Calculate distributions
  const genderDistribution: Record<string, number> = {};
  const activityLevelDistribution: Record<string, number> = {};
  const bodyFatDistribution: Record<string, number> = {};
  const eaStatusDistribution: Record<string, number> = {};

  let totalTDEE = 0;
  let totalAge = 0;
  const ageMidpoints: Record<string, number> = {
    'under-18': 16,
    '18-24': 21,
    '25-34': 29.5,
    '35-44': 39.5,
    '45-54': 49.5,
    '55-64': 59.5,
    '65+': 70
  };

  filteredData.forEach(item => {
    // Gender distribution
    genderDistribution[item.demographics.gender] = 
      (genderDistribution[item.demographics.gender] || 0) + 1;

    // Activity level distribution
    activityLevelDistribution[item.demographics.activity_level] = 
      (activityLevelDistribution[item.demographics.activity_level] || 0) + 1;

    // Body fat distribution
    bodyFatDistribution[item.demographics.body_fat_range] = 
      (bodyFatDistribution[item.demographics.body_fat_range] || 0) + 1;

    // EA status distribution
    eaStatusDistribution[item.results.ea_status] = 
      (eaStatusDistribution[item.results.ea_status] || 0) + 1;

    // Totals for averages
    totalTDEE += item.results.tdee;
    totalAge += ageMidpoints[item.demographics.age_range] || 30;
  });

  return {
    totalCalculations: filteredData.length,
    dailyAverage: filteredData.length / days,
    genderDistribution,
    activityLevelDistribution,
    bodyFatDistribution,
    eaStatusDistribution,
    averageAge: totalAge / filteredData.length,
    averageTDEE: totalTDEE / filteredData.length
  };
};

export const clearAnalyticsData = (): void => {
  try {
    localStorage.removeItem(ANALYTICS_KEY);
  } catch (error) {
    console.error('Error clearing analytics data:', error);
  }
};
