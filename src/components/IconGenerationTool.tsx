import { useState } from 'react';
import { generateIconsForExistingApps, generateIconsForSpecificApps } from '../utils/generateExistingIcons';
import { getStoredApps } from '../utils/storage';
import { configService } from '../services/config';

export default function IconGenerationTool() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState('');
  const [selectedApps, setSelectedApps] = useState<string[]>([]);
  
  const apps = getStoredApps();
  const hasApiKey = !!configService.getOpenAIApiKey();

  const generateAllIcons = async () => {
    if (!hasApiKey) {
      setProgress('❌ Please configure OpenAI API key in settings first');
      return;
    }

    setIsGenerating(true);
    setProgress('🚀 Starting icon generation for all apps...');
    
    try {
      await generateIconsForExistingApps();
      setProgress('✅ All icons generated successfully!');
      // Refresh the page to show new icons
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      setProgress(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateSelectedIcons = async () => {
    if (!hasApiKey) {
      setProgress('❌ Please configure OpenAI API key in settings first');
      return;
    }

    if (selectedApps.length === 0) {
      setProgress('❌ Please select at least one app');
      return;
    }

    setIsGenerating(true);
    setProgress(`🚀 Generating icons for ${selectedApps.length} selected apps...`);
    
    try {
      await generateIconsForSpecificApps(selectedApps);
      setProgress('✅ Selected icons generated successfully!');
      // Refresh the page to show new icons
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      setProgress(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleAppSelection = (appName: string) => {
    setSelectedApps(prev => 
      prev.includes(appName) 
        ? prev.filter(name => name !== appName)
        : [...prev, appName]
    );
  };

  const appsNeedingIcons = apps.filter(app => 
    !app.icon || app.icon.includes('favicon') || app.icon.includes('s2/favicons')
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            AI Icon Generation Tool
          </h1>
          
          {!hasApiKey && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    OpenAI API Key Required
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>Please configure your OpenAI API key in the settings before generating icons.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Apps in Store: {apps.length}
              </h3>
              <p className="text-blue-700 text-sm">
                Total applications currently in your hub
              </p>
            </div>
            
            <div className="bg-orange-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-orange-900 mb-2">
                Need Icons: {appsNeedingIcons.length}
              </h3>
              <p className="text-orange-700 text-sm">
                Apps using favicon instead of custom AI icons
              </p>
            </div>
          </div>

          {appsNeedingIcons.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Apps Needing Icons
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {appsNeedingIcons.map((app) => (
                  <label key={app.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                    <input
                      type="checkbox"
                      checked={selectedApps.includes(app.name)}
                      onChange={() => toggleAppSelection(app.name)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {app.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {app.category}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <button
              onClick={generateAllIcons}
              disabled={isGenerating || !hasApiKey || appsNeedingIcons.length === 0}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium py-3 px-6 rounded-lg transition duration-150 ease-in-out"
            >
              {isGenerating ? 'Generating...' : `Generate All Icons (${appsNeedingIcons.length})`}
            </button>
            
            <button
              onClick={generateSelectedIcons}
              disabled={isGenerating || !hasApiKey || selectedApps.length === 0}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-3 px-6 rounded-lg transition duration-150 ease-in-out"
            >
              {isGenerating ? 'Generating...' : `Generate Selected (${selectedApps.length})`}
            </button>
          </div>

          {progress && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Progress</h4>
              <p className="text-sm text-gray-700 font-mono">{progress}</p>
            </div>
          )}

          <div className="mt-8 bg-blue-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2">How it works</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Analyzes each app's name, description, and category</li>
              <li>• Generates custom icons using OpenAI DALL-E with consistent styling</li>
              <li>• Applies category-specific color schemes (AI Tools: purple, Business: blue, Data: teal)</li>
              <li>• Saves icons as base64 data for fast loading</li>
              <li>• Includes 2-second delays between generations to respect API limits</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}