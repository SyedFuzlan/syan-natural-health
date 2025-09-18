import React, { useState } from 'react';
import { Calculator, Info, Users } from 'lucide-react';
import UserInputForm from './UserInputForm';
import BodyFatSelector from './BodyFatSelector';
import ResultsPanel from './ResultsPanel';
import { UserData, CalculationResults } from '../types';
import { calculateMetabolics } from '../utils/calculations';
import { saveCalculationData } from '../utils/analytics';

const MetabolicCalculator: React.FC = () => {
  const [userData, setUserData] = useState<UserData>({
    weight: 0,
    height: 0,
    age: 0,
    gender: 'male',
    activityLevel: 'moderately_active',
    bodyFatPercentage: 15,
    userType: 'normal'
  });

  const [results, setResults] = useState<CalculationResults | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [hasCalculated, setHasCalculated] = useState(false);

  const isFormValid = userData.weight > 0 && userData.height > 0 && userData.age > 0;

  const handleCalculate = () => {
    if (!isFormValid) return;
    
    setIsCalculating(true);
    
    // Simulate calculation delay for better UX
    setTimeout(() => {
      const calculatedResults = calculateMetabolics(userData);
      setResults(calculatedResults);
      setShowResults(true);
      setHasCalculated(true);
      
      // Save anonymized data for analytics
      saveCalculationData(userData, calculatedResults);
      
      setIsCalculating(false);
    }, 500);
  };

  const handleClearData = () => {
    setUserData({
      weight: 0,
      height: 0,
      age: 0,
      gender: 'male',
      activityLevel: 'moderately_active',
      bodyFatPercentage: 15,
      name: ''
    });
    setResults(null);
    setShowResults(false);
    setHasCalculated(false);
  };

  const handleUserDataChange = (newData: Partial<UserData>) => {
    setUserData(prev => ({ ...prev, ...newData }));
    // Reset calculation state when data changes
    if (hasCalculated) {
      setShowResults(false);
      setResults(null);
      setHasCalculated(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center bg-white rounded-2xl shadow-sm border border-blue-100 p-8">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <Calculator className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Natural Metabolic Rate Calculator
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Discover your natural metabolic profile with personalized calculations 
          designed to help you stay young and healthy.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Input Section */}
        <div className="xl:col-span-2 space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Info className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
            </div>
            <UserInputForm 
              userData={userData} 
              onChange={handleUserDataChange} 
            />
          </div>

          {/* Body Composition */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Users className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Body Composition</h3>
              <div className="ml-auto">
                <div className="group relative">
                  <Info className="w-4 h-4 text-gray-400 cursor-help" />
                  <div className="absolute right-0 top-6 w-64 p-3 bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                    Select the image that best represents your current body composition. 
                    This helps provide more accurate metabolic calculations.
                  </div>
                </div>
              </div>
            </div>
            <BodyFatSelector 
              selectedPercentage={userData.bodyFatPercentage}
              gender={userData.gender}
              onChange={(percentage) => handleUserDataChange({ bodyFatPercentage: percentage })}
            />
          </div>

          {/* Name Input and Calculate Button */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Calculator className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">Calculate Results</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name (Optional)
                </label>
                <input
                  type="text"
                  id="name"
                  value={userData.name || ''}
                  onChange={(e) => handleUserDataChange({ name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your name"
                />
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={handleCalculate}
                  disabled={!isFormValid || isCalculating}
                  className={`flex-1 flex items-center justify-center space-x-2 py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                    isFormValid && !isCalculating
                      ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isCalculating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Calculating...</span>
                    </>
                  ) : (
                    <>
                      <Calculator className="w-5 h-5" />
                      <span>Calculate My Results</span>
                    </>
                  )}
                </button>
                
                {hasCalculated && (
                  <button
                    onClick={handleClearData}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
                  >
                    Clear & Start Over
                  </button>
                )}
              </div>
              
              {!isFormValid && (
                <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
                  Please fill in all required fields (weight, height, age) to calculate your results.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="xl:col-span-1">
          <div className="sticky top-8">
            <ResultsPanel 
              results={results}
              userData={userData}
              showResults={showResults}
              isCalculating={isCalculating}
              hasCalculated={hasCalculated}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetabolicCalculator;