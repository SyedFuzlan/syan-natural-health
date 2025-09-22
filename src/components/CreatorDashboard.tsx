import React, { useState, useEffect } from 'react';
import { Lock, TrendingUp, Users, Activity, Download, Calendar, BarChart3, PieChart, Trash2, Wifi, WifiOff } from 'lucide-react';
import { getAnalyticsData, getAnalyticsSummary, clearAnalyticsData } from '../utils/analytics';
import { firebaseService } from '../utils/firebase';
import AnalyticsCharts from './AnalyticsCharts';
import { AnalyticsData, AnalyticsSummary } from '../types';

const CreatorDashboard: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [dateRange, setDateRange] = useState('30'); // days
  const [loading, setLoading] = useState(false);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState(false);
  const [realtimeUnsubscribe, setRealtimeUnsubscribe] = useState<(() => void) | null>(null);

  // Simple authentication (in production, use proper auth)
  const authenticate = () => {
    if (password === 'admin123') {
      setIsAuthenticated(true);
      loadAnalytics();
    } else {
      alert('Invalid password');
    }
  };

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      // Check if Firebase is configured
      const firebaseConfigured = firebaseService.isConfigured();
      setIsFirebaseConnected(firebaseConfigured);

      let data: AnalyticsData[];
      
      if (firebaseConfigured) {
        // Load from Firebase if configured
        try {
          data = await firebaseService.getUserData();
          
          // Set up real-time listener
          if (realtimeUnsubscribe) {
            realtimeUnsubscribe();
          }
          
          const unsubscribe = firebaseService.onUserDataChange((realtimeData) => {
            setAnalyticsData(realtimeData);
            setSummary(getAnalyticsSummary(parseInt(dateRange), realtimeData));
          });
          
          setRealtimeUnsubscribe(() => unsubscribe);
        } catch (firebaseError) {
          console.error('Firebase error, falling back to localStorage:', firebaseError);
          data = getAnalyticsData();
          setIsFirebaseConnected(false);
        }
      } else {
        // Fallback to localStorage
        data = getAnalyticsData();
      }
      
      const summaryData = getAnalyticsSummary(parseInt(dateRange), data);
      setAnalyticsData(data);
      setSummary(summaryData);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cleanup real-time listener on unmount
  useEffect(() => {
    return () => {
      if (realtimeUnsubscribe) {
        realtimeUnsubscribe();
      }
    };
  }, [realtimeUnsubscribe]);

  useEffect(() => {
    if (isAuthenticated) {
      loadAnalytics();
    }
  }, [dateRange, isAuthenticated]);

  const exportData = () => {
    const csvContent = analyticsData.map(item => 
      `${item.timestamp},${item.userName},${item.demographics.age_range},${item.demographics.gender},${item.demographics.activity_level},${item.demographics.body_fat_range},${item.results.bmr},${item.results.rmr},${item.results.tdee},${item.results.ea},${item.results.ea_status}`
    ).join('\n');
    
    const header = 'timestamp,user_name,age_range,gender,activity_level,body_fat_range,bmr,rmr,tdee,ea,ea_status\n';
    const fullCsv = header + csvContent;
    
    const blob = new Blob([fullCsv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `metabolic-calculator-analytics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleClearData = async () => {
    if (window.confirm('Are you sure you want to clear all analytics data? This action cannot be undone.')) {
      try {
        // Clear from both localStorage and Firebase
        clearAnalyticsData();
        
        if (firebaseService.isConfigured()) {
          await firebaseService.clearAllData();
        }
        
        setAnalyticsData([]);
        setSummary(null);
        loadAnalytics();
      } catch (error) {
        console.error('Error clearing data:', error);
        alert('Error clearing data. Please try again.');
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="text-center mb-6">
            <div className="bg-gray-100 p-3 rounded-full inline-block mb-4">
              <Lock className="w-8 h-8 text-gray-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Creator Dashboard</h2>
            <p className="text-gray-600">Enter password to access analytics</p>
          </div>
          
          <div className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && authenticate()}
              placeholder="Enter admin password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <button
              onClick={authenticate}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Access Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading || !summary) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
            <div className="flex items-center space-x-2">
              {isFirebaseConnected ? (
                <div className="flex items-center text-green-600">
                  <Wifi className="w-4 h-4 mr-1" />
                  <span className="text-xs">Live</span>
                </div>
              ) : (
                <div className="flex items-center text-orange-600">
                  <WifiOff className="w-4 h-4 mr-1" />
                  <span className="text-xs">Local</span>
                </div>
              )}
            </div>
          </div>
        
          <div className="flex items-center space-x-4">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
            </select>
            
            <button
              onClick={exportData}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            
            <button
              onClick={handleClearData}
              className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear Data</span>
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <span className="text-blue-900 font-medium">Total Calculations</span>
            </div>
            <div className="text-2xl font-bold text-blue-900 mt-1">
              {summary.totalCalculations.toLocaleString()}
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-green-600" />
              <span className="text-green-900 font-medium">Daily Average</span>
            </div>
            <div className="text-2xl font-bold text-green-900 mt-1">
              {Math.round(summary.dailyAverage)}
            </div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-purple-600" />
              <span className="text-purple-900 font-medium">Avg Age</span>
            </div>
            <div className="text-2xl font-bold text-purple-900 mt-1">
              {Math.round(summary.averageAge)}
            </div>
          </div>
          
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-orange-600" />
              <span className="text-orange-900 font-medium">Avg TDEE</span>
            </div>
            <div className="text-2xl font-bold text-orange-900 mt-1">
              {Math.round(summary.averageTDEE)}
            </div>
          </div>
        </div>
      </div>

      {/* Demographics Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <PieChart className="w-5 h-5 mr-2 text-blue-600" />
            Gender Distribution
          </h3>
          <div className="space-y-3">
            {Object.entries(summary.genderDistribution).map(([gender, count]) => (
              <div key={gender} className="flex items-center justify-between">
                <span className="capitalize text-gray-700">{gender}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-2 bg-blue-500 rounded-full"
                      style={{ width: `${(count / summary.totalCalculations) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-green-600" />
            Activity Levels
          </h3>
          <div className="space-y-3">
            {Object.entries(summary.activityLevelDistribution).map(([level, count]) => (
              <div key={level} className="flex items-center justify-between">
                <span className="text-gray-700 text-sm">
                  {level.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-2 bg-green-500 rounded-full"
                      style={{ width: `${(count / summary.totalCalculations) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts */}
      <AnalyticsCharts data={analyticsData} />

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Energy Availability Status</h3>
          <div className="space-y-3">
            {Object.entries(summary.eaStatusDistribution).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    status === 'low' ? 'bg-red-500' :
                    status === 'optimal' ? 'bg-green-500' :
                    'bg-blue-500'
                  }`} />
                  <span className="capitalize text-gray-700">{status} EA</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900">{count}</span>
                  <span className="text-xs text-gray-500">
                    ({Math.round((count / summary.totalCalculations) * 100)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Body Fat Distribution</h3>
          <div className="space-y-3">
            {Object.entries(summary.bodyFatDistribution).map(([range, count]) => (
              <div key={range} className="flex items-center justify-between">
                <span className="text-gray-700 text-sm">{range}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-2 bg-purple-500 rounded-full"
                      style={{ width: `${(count / summary.totalCalculations) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Calculations</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3">Timestamp</th>
                <th className="text-left p-3">Demographics</th>
                <th className="text-left p-3">BMR</th>
                <th className="text-left p-3">TDEE</th>
                <th className="text-left p-3">EA Status</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.slice(-10).reverse().map((item, index) => (
                <tr key={index} className="border-t border-gray-100">
                  <td className="p-3 text-gray-600">
                    {new Date(item.timestamp).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    <div className="text-xs space-y-1">
                      <div>{item.demographics.gender}, {item.demographics.age_range}</div>
                      <div className="text-gray-500">{item.demographics.body_fat_range}</div>
                    </div>
                  </td>
                  <td className="p-3 font-medium">{Math.round(item.results.bmr)}</td>
                  <td className="p-3 font-medium">{Math.round(item.results.tdee)}</td>
                  <td className="p-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      item.results.ea_status === 'low' ? 'bg-red-100 text-red-800' :
                      item.results.ea_status === 'optimal' ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {item.results.ea_status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CreatorDashboard;
