import React from 'react';
import { TrendingUp, Zap, Activity, Heart, Info, AlertCircle, CheckCircle } from 'lucide-react';
import { CalculationResults, UserData } from '../types';

interface ResultsPanelProps {
  results: CalculationResults | null;
  userData: UserData;
  showResults: boolean;
  isCalculating: boolean;
  hasCalculated: boolean;
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({
  results,
  userData,
  showResults,
  isCalculating,
  hasCalculated
}) => {
  const getEnergyAvailabilityStatus = (ea: number) => {
    if (ea < 30) return { status: 'low', color: 'red', icon: AlertCircle, message: 'Low Energy Availability - Consider increasing caloric intake' };
    if (ea < 45) return { status: 'optimal', color: 'green', icon: CheckCircle, message: 'Optimal Energy Availability' };
    return { status: 'high', color: 'blue', icon: Info, message: 'High Energy Availability' };
  };

  if (isCalculating) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Calculating...</h3>
          <p className="text-gray-600">Processing your metabolic data</p>
        </div>
      </div>
    );
  }

  if (!showResults || !results) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center py-8">
          <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {hasCalculated ? 'Calculation Complete' : 'Ready to Calculate'}
          </h3>
          <p className="text-gray-600">
            {hasCalculated 
              ? 'Your results were calculated successfully. Make changes to inputs and calculate again if needed.'
              : 'Fill in all required fields and click "Calculate My Results" to see your metabolic data'
            }
          </p>
        </div>
      </div>
    );
  }

  const eaStatus = getEnergyAvailabilityStatus(results.energyAvailability);
  const StatusIcon = eaStatus.icon;

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg text-white p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <Heart className="w-5 h-5 mr-2" />
          {userData.name ? `${userData.name}'s Metabolic Profile` : 'Your Metabolic Profile'}
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-blue-100 text-sm">Daily Calories</div>
            <div className="text-2xl font-bold">{Math.round(results.tdee)}</div>
          </div>
          <div>
            <div className="text-blue-100 text-sm">Body Fat</div>
            <div className="text-2xl font-bold">{userData.bodyFatPercentage}%</div>
          </div>
        </div>
        {userData.name && (
          <div className="mt-4 text-blue-100 text-sm">
            Results calculated for: <span className="font-medium text-white">{userData.name}</span>
          </div>
        )}
      </div>

      {/* Detailed Results */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
          <Activity className="w-5 h-5 mr-2 text-green-600" />
          Metabolic Calculations
        </h4>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {/* BMR */}
          <div className="p-3 bg-blue-50 rounded-lg text-center">
            <div className="text-lg font-bold text-blue-900">{Math.round(results.bmr)}</div>
            <div className="text-xs text-blue-700">BMR</div>
          </div>

          {/* RMR */}
          <div className="p-3 bg-green-50 rounded-lg text-center">
            <div className="text-lg font-bold text-green-900">{Math.round(results.rmr)}</div>
            <div className="text-xs text-green-700">RMR</div>
          </div>

          {/* TDEE */}
          <div className="p-3 bg-purple-50 rounded-lg text-center">
            <div className="text-lg font-bold text-purple-900">{Math.round(results.tdee)}</div>
            <div className="text-xs text-purple-700">TDEE</div>
          </div>

          {/* Exercise EE */}
          <div className="p-3 bg-orange-50 rounded-lg text-center">
            <div className="text-lg font-bold text-orange-900">{Math.round(results.exerciseEE)}</div>
            <div className="text-xs text-orange-700">Exercise EE</div>
          </div>

          {/* Fat-Free Mass */}
          <div className="p-3 bg-gray-50 rounded-lg text-center">
            <div className="text-lg font-bold text-gray-900">{results.fatFreeMass.toFixed(1)}</div>
            <div className="text-xs text-gray-700">FFM (kg)</div>
          </div>

          {/* Energy Availability */}
          <div className={`p-3 bg-${eaStatus.color}-50 rounded-lg text-center`}>
            <div className={`text-lg font-bold text-${eaStatus.color}-900`}>{results.energyAvailability.toFixed(1)}</div>
            <div className={`text-xs text-${eaStatus.color}-700`}>EA</div>
          </div>
        </div>
      </div>

      {/* Macro Breakdown */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
          <Activity className="w-5 h-5 mr-2 text-purple-600" />
          Macro Breakdown ({userData.userType ? userData.userType.replace('_', ' ').toUpperCase() : 'NORMAL'})
        </h4>
        
        <div className="grid grid-cols-3 gap-4 mb-4">
          {/* Protein */}
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-900">{results.macros.proteinGrams}g</div>
            <div className="text-sm text-red-700">Protein</div>
            <div className="text-xs text-red-600">{results.macros.proteinKcal} kcal</div>
            <div className="text-xs text-red-600 mt-1">{results.macros.proteinPerKg}g/kg</div>
          </div>

          {/* Carbs */}
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-900">{results.macros.carbsGrams}g</div>
            <div className="text-sm text-yellow-700">Carbs</div>
            <div className="text-xs text-yellow-600">{results.macros.carbsKcal} kcal</div>
          </div>

          {/* Fats */}
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-900">{results.macros.fatsGrams}g</div>
            <div className="text-sm text-green-700">Fats</div>
            <div className="text-xs text-green-600">{results.macros.fatsKcal} kcal</div>
          </div>
        </div>

        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
          <strong>Ratio:</strong> Protein optimized for {userData.userType || 'normal'} goals, 
          remaining calories split as 3:0.5 (Carbs:Fats)
        </div>
      </div>

      {/* Energy Availability */}
      <div className={`bg-white rounded-xl shadow-sm border-2 border-${eaStatus.color}-200 p-6`}>
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
          <Zap className={`w-5 h-5 mr-2 text-${eaStatus.color}-600`} />
          Energy Availability Analysis
        </h4>
        
        <div className={`p-4 bg-${eaStatus.color}-50 rounded-lg mb-4`}>
          <div className="flex items-center space-x-3 mb-2">
            <StatusIcon className={`w-5 h-5 text-${eaStatus.color}-600`} />
            <span className={`font-semibold text-${eaStatus.color}-900`}>
              {results.energyAvailability.toFixed(1)} kcal/kg FFM/day
            </span>
          </div>
          <p className={`text-sm text-${eaStatus.color}-700`}>
            {eaStatus.message}
          </p>
        </div>

        {/* EA Reference Scale */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-700">Reference Ranges:</div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span>Low EA (&lt;30)</span>
              <span className="text-red-600">Risk of metabolic dysfunction</span>
            </div>
            <div className="flex justify-between">
              <span>Optimal EA (30-45)</span>
              <span className="text-green-600">Healthy metabolic function</span>
            </div>
            <div className="flex justify-between">
              <span>High EA (&gt;45)</span>
              <span className="text-blue-600">Surplus energy available</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
          <Info className="w-5 h-5 mr-2 text-blue-600" />
          Personalized Recommendations
        </h4>
        
        <div className="space-y-3 text-sm">
          <div className="p-3 bg-blue-50 rounded-lg">
            <strong className="text-blue-900">For Weight Maintenance:</strong>
            <p className="text-blue-800 mt-1">
              Consume approximately {Math.round(results.tdee)} calories per day
            </p>
          </div>
          
          <div className="p-3 bg-green-50 rounded-lg">
            <strong className="text-green-900">For Fat Loss:</strong>
            <p className="text-green-800 mt-1">
              Create a moderate deficit of 300-500 calories ({Math.round(results.tdee - 400)} - {Math.round(results.tdee - 300)} kcal/day)
            </p>
          </div>
          
          <div className="p-3 bg-purple-50 rounded-lg">
            <strong className="text-purple-900">For Muscle Gain:</strong>
            <p className="text-purple-800 mt-1">
              Maintain a slight surplus of 200-300 calories ({Math.round(results.tdee + 200)} - {Math.round(results.tdee + 300)} kcal/day)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPanel;