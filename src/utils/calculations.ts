import { UserData, CalculationResults, MacroBreakdown } from '../types';

export const calculateMetabolics = (userData: UserData): CalculationResults => {
  const { weight, height, age, gender, activityLevel, bodyFatPercentage } = userData;

  // BMR - Mifflin-St Jeor Equation
  const bmr = gender === 'male'
    ? 10 * weight + 6.25 * height - 5 * age + 5
    : 10 * weight + 6.25 * height - 5 * age - 161;

  // RMR - Harris-Benedict Equation
  const rmr = gender === 'male'
    ? 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
    : 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);

  // Activity multipliers for TDEE
  const activityMultipliers = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725,
    extremely_active: 1.9
  };

  // TDEE
  const tdee = bmr * activityMultipliers[activityLevel];

  // Exercise Energy Expenditure factors
  const exerciseFactors = {
    sedentary: 0.05,
    lightly_active: 0.15,
    moderately_active: 0.25,
    very_active: 0.35,
    extremely_active: 0.45
  };

  // Exercise EE
  const exerciseEE = bmr * exerciseFactors[activityLevel];

  // Fat-Free Mass
  const fatFreeMass = weight - (weight * (bodyFatPercentage / 100));

  // Energy Availability
  const energyAvailability = (tdee - exerciseEE) / fatFreeMass;

  // Calculate macros based on user type
  const macros = calculateMacros(tdee, weight, userData.userType || 'normal');

  return {
    bmr,
    rmr,
    tdee,
    energyAvailability,
    exerciseEE,
    fatFreeMass,
    macros
  };
};

export const getAgeRange = (age: number): string => {
  if (age < 18) return 'under-18';
  if (age < 25) return '18-24';
  if (age < 35) return '25-34';
  if (age < 45) return '35-44';
  if (age < 55) return '45-54';
  if (age < 65) return '55-64';
  return '65+';
};

// Calculate macros based on user type and TDEE
export const calculateMacros = (tdee: number, bodyWeight: number, userType: 'normal' | 'daily_workout' | 'fat_loss' | 'bodybuilding'): MacroBreakdown => {
  // Protein multipliers based on user type
  const proteinMultipliers = {
    normal: 1.0,
    daily_workout: 1.3,
    fat_loss: 1.6,
    bodybuilding: 2.0
  };

  // Calculate protein requirements
  const proteinPerKg = proteinMultipliers[userType];
  const proteinGrams = bodyWeight * proteinPerKg;
  const proteinKcal = proteinGrams * 4;

  // Remaining calories after protein
  const remainingKcal = tdee - proteinKcal;

  // Fixed ratio for remaining calories: 3 parts carbs, 0.5 parts fats
  const totalRatioUnits = 3 + 0.5; // 3.5 units
  const kcalPerUnit = remainingKcal / totalRatioUnits;

  // Calculate carbs and fats
  const carbsKcal = 3 * kcalPerUnit;
  const fatsKcal = 0.5 * kcalPerUnit;

  const carbsGrams = carbsKcal / 4;
  const fatsGrams = fatsKcal / 9;

  return {
    proteinGrams: Math.round(proteinGrams),
    proteinKcal: Math.round(proteinKcal),
    carbsGrams: Math.round(carbsGrams),
    carbsKcal: Math.round(carbsKcal),
    fatsGrams: Math.round(fatsGrams),
    fatsKcal: Math.round(fatsKcal),
    proteinPerKg: proteinPerKg
  };
};

export const getBodyFatRange = (percentage: number): string => {
  if (percentage <= 12) return '8-12%';
  if (percentage <= 17) return '13-17%';
  if (percentage <= 22) return '18-22%';
  if (percentage <= 27) return '23-27%';
  if (percentage <= 35) return '28-35%';
  return '36-45%';
};

export const getEAStatus = (ea: number): 'low' | 'optimal' | 'high' => {
  if (ea < 30) return 'low';
  if (ea < 45) return 'optimal';
  return 'high';
};