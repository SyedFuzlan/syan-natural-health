import React from 'react';
import { UserData } from '../types';

interface UserInputFormProps {
  userData: UserData;
  onChange: (data: Partial<UserData>) => void;
}

const UserInputForm: React.FC<UserInputFormProps> = ({ userData, onChange }) => {
  const activityLevels = [
    { value: 'sedentary', label: 'Sedentary', description: 'Little to no exercise' },
    { value: 'lightly_active', label: 'Lightly Active', description: 'Light exercise 1-3 days/week' },
    { value: 'moderately_active', label: 'Moderately Active', description: 'Moderate exercise 3-5 days/week' },
    { value: 'very_active', label: 'Very Active', description: 'Hard exercise 6-7 days/week' },
    { value: 'extremely_active', label: 'Extremely Active', description: 'Very hard exercise, physical job' }
  ];

  const userTypes = [
    { value: 'normal', label: 'Normal Person', description: '1.0g protein/kg' },
    { value: 'daily_workout', label: 'Daily Workout', description: '1.3g protein/kg' },
    { value: 'fat_loss', label: 'Fat Loss', description: '1.6g protein/kg' },
    { value: 'bodybuilding', label: 'Bodybuilding', description: '2.0g protein/kg' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Weight */}
      <div>
        <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">
          Weight (kg) *
        </label>
        <input
          type="number"
          id="weight"
          min="1"
          max="300"
          step="0.1"
          value={userData.weight || ''}
          onChange={(e) => onChange({ weight: parseFloat(e.target.value) || 0 })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          placeholder="Enter weight"
        />
      </div>

      {/* Height */}
      <div>
        <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-2">
          Height (cm) *
        </label>
        <input
          type="number"
          id="height"
          min="1"
          max="250"
          step="0.1"
          value={userData.height || ''}
          onChange={(e) => onChange({ height: parseFloat(e.target.value) || 0 })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          placeholder="Enter height"
        />
      </div>

      {/* Age */}
      <div>
        <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
          Age (years) *
        </label>
        <input
          type="number"
          id="age"
          min="1"
          max="120"
          value={userData.age || ''}
          onChange={(e) => onChange({ age: parseInt(e.target.value) || 0 })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          placeholder="Enter age"
        />
      </div>

      {/* Gender */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Gender *
        </label>
        <div className="flex space-x-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="gender"
              value="male"
              checked={userData.gender === 'male'}
              onChange={(e) => onChange({ gender: e.target.value as 'male' | 'female' })}
              className="sr-only"
            />
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg border-2 transition-all duration-200 ${
              userData.gender === 'male' 
                ? 'border-blue-500 bg-blue-50 text-blue-700' 
                : 'border-gray-300 hover:border-gray-400'
            }`}>
              <div className={`w-4 h-4 rounded-full border-2 ${
                userData.gender === 'male' ? 'border-blue-500 bg-blue-500' : 'border-gray-400'
              }`}>
                {userData.gender === 'male' && (
                  <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                )}
              </div>
              <span className="font-medium">Male</span>
            </div>
          </label>
          
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="gender"
              value="female"
              checked={userData.gender === 'female'}
              onChange={(e) => onChange({ gender: e.target.value as 'male' | 'female' })}
              className="sr-only"
            />
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg border-2 transition-all duration-200 ${
              userData.gender === 'female' 
                ? 'border-pink-500 bg-pink-50 text-pink-700' 
                : 'border-gray-300 hover:border-gray-400'
            }`}>
              <div className={`w-4 h-4 rounded-full border-2 ${
                userData.gender === 'female' ? 'border-pink-500 bg-pink-500' : 'border-gray-400'
              }`}>
                {userData.gender === 'female' && (
                  <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                )}
              </div>
              <span className="font-medium">Female</span>
            </div>
          </label>
        </div>
      </div>

      {/* Activity Level */}
      <div className="md:col-span-2">
        <label htmlFor="activity" className="block text-sm font-medium text-gray-700 mb-3">
          Activity Level *
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {activityLevels.map((level) => (
            <label key={level.value} className="cursor-pointer">
              <input
                type="radio"
                name="activityLevel"
                value={level.value}
                checked={userData.activityLevel === level.value}
                onChange={(e) => onChange({ activityLevel: e.target.value as any })}
                className="sr-only"
              />
              <div className={`p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
                userData.activityLevel === level.value
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}>
                <div className={`font-medium mb-1 ${
                  userData.activityLevel === level.value ? 'text-green-700' : 'text-gray-900'
                }`}>
                  {level.label}
                </div>
                <div className={`text-sm ${
                  userData.activityLevel === level.value ? 'text-green-600' : 'text-gray-600'
                }`}>
                  {level.description}
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* User Type */}
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          User Type (for macro calculation)
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {userTypes.map((type) => (
            <label key={type.value} className="cursor-pointer">
              <input
                type="radio"
                name="userType"
                value={type.value}
                checked={userData.userType === type.value}
                onChange={(e) => onChange({ userType: e.target.value as any })}
                className="sr-only"
              />
              <div className={`p-3 rounded-lg border-2 transition-all duration-200 hover:shadow-md text-center ${
                userData.userType === type.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}>
                <div className={`font-medium text-sm mb-1 ${
                  userData.userType === type.value ? 'text-blue-700' : 'text-gray-900'
                }`}>
                  {type.label}
                </div>
                <div className={`text-xs ${
                  userData.userType === type.value ? 'text-blue-600' : 'text-gray-600'
                }`}>
                  {type.description}
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Form Status */}
      <div className="md:col-span-2">
        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
          <strong>Required fields:</strong> Weight, Height, Age, Gender, Activity Level, Body Composition
        </div>
      </div>
    </div>
  );
};

export default UserInputForm;