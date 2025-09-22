import React from 'react';
import menImage from '/men.png';
import womenImage from '/women.png';

interface BodyFatSelectorProps {
  selectedPercentage: number;
  gender: 'male' | 'female';
  onChange: (percentage: number) => void;
}

const BodyFatSelector: React.FC<BodyFatSelectorProps> = ({
  selectedPercentage,
  gender,
  onChange
}) => {
  const malePercentages = [8, 10, 15, 20, 25, 30, 35, 40];
  const femalePercentages = [12, 15, 20, 25, 30, 35, 40, 45];
  
  const percentages = gender === 'male' ? malePercentages : femalePercentages;


  return (
    <div>
      <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-medium text-blue-900 mb-2">Visual Body Fat Percentage Guide</h4>
        <p className="text-sm text-blue-700">
          Use the image below to visually estimate your body fat percentage, then select from the dropdown.
        </p>
      </div>

      {/* Gender-specific body fat image */}
      <div className="mb-4 text-center">
        <img 
          src={gender === 'male' ? menImage : womenImage}
          alt={`${gender} body fat percentage guide`}
          className="max-w-full h-auto mx-auto rounded-lg shadow-md"
          style={{ maxHeight: '400px' }}
        />
      </div>

      {/* Dropdown selector */}
      <div className="mb-4">
        <label htmlFor="bodyFat" className="block text-sm font-medium text-gray-700 mb-2">
          Select Your Body Fat Percentage *
        </label>
        <select
          id="bodyFat"
          value={selectedPercentage}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        >
          <option value="">Choose your body fat percentage</option>
          {percentages.map((percentage) => (
            <option key={percentage} value={percentage}>
              {percentage}% Body Fat
            </option>
          ))}
        </select>
      </div>

      {/* Reference guidelines */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <h5 className="font-medium text-gray-900 mb-2">Reference Guidelines</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <strong className="text-blue-600">Men:</strong>
            <ul className="mt-1 space-y-1">
              <li>• Essential: 2-5%</li>
              <li>• Athletes: 6-13%</li>
              <li>• Fitness: 14-17%</li>
              <li>• Average: 18-24%</li>
              <li>• Above Average: 25%+</li>
            </ul>
          </div>
          <div>
            <strong className="text-pink-600">Women:</strong>
            <ul className="mt-1 space-y-1">
              <li>• Essential: 10-13%</li>
              <li>• Athletes: 14-20%</li>
              <li>• Fitness: 21-24%</li>
              <li>• Average: 25-31%</li>
              <li>• Above Average: 32%+</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BodyFatSelector;