import { useState, useEffect } from 'react';
import { App } from '../types';
import { getStoredApps, addApp, saveApps } from '../utils/storage';
import { analyzeApp } from '../utils/appAnalyzer';
import AppCard from './AppCard';
import AppModal from './AppModal';
import AddAppModal from './AddAppModal';

interface AppStoreProps {
  onLogout: () => void;
}

export default function AppStore({ onLogout }: AppStoreProps) {
  const [apps, setApps] = useState<App[]>([]);
  const [selectedApp, setSelectedApp] = useState<App | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    loadApps();
  }, []);

  const loadApps = async () => {
    let storedApps = getStoredApps();
    
    // Update existing Brand to Prompt app URL if it exists with old URL
    const oldBrandToPromptUrl = 'https://vercel.com/christophbertschs-projects/0711-brand-to-prompt';
    const newBrandToPromptUrl = 'https://0711-brand-to-prompt.vercel.app';
    const brandToPromptApp = storedApps.find(app => app.url === oldBrandToPromptUrl);
    
    if (brandToPromptApp) {
      // Update the URL and re-analyze the app
      try {
        const updatedAppData = await analyzeApp(newBrandToPromptUrl);
        brandToPromptApp.url = newBrandToPromptUrl;
        brandToPromptApp.name = updatedAppData.name;
        brandToPromptApp.description = updatedAppData.description;
        brandToPromptApp.category = updatedAppData.category;
        brandToPromptApp.tags = updatedAppData.tags;
        brandToPromptApp.icon = updatedAppData.icon;
        brandToPromptApp.updatedAt = new Date();
        
        // Save updated apps
        saveApps(storedApps);
      } catch (error) {
        console.error('Error updating Brand to Prompt app:', error);
      }
    }
    
    // If no apps are stored, add the default ones
    if (storedApps.length === 0) {
      const defaultUrls = [
        'https://ausschreibung.vercel.app/',
        'https://etim-classifier.vercel.app/',
        'https://0711-brand-to-prompt.vercel.app',
        'https://llm-comparison-tool-ten.vercel.app/'
      ];

      for (const url of defaultUrls) {
        try {
          const appData = await analyzeApp(url);
          addApp(appData);
        } catch (error) {
          console.error('Error adding default app:', error);
        }
      }
      
      // Reload apps from storage after adding defaults
      storedApps = getStoredApps();
    }
    
    setApps(storedApps);
  };

  const handleAddApp = async (appData: Omit<App, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newApp = addApp(appData);
    setApps(prev => [...prev, newApp]);
  };

  const filteredApps = apps.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || app.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', ...Array.from(new Set(apps.map(app => app.category).filter(Boolean)))];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">0711 Agent Hub</h1>
              <span className="text-sm text-gray-500">App Store</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition duration-150 ease-in-out"
              >
                Add App
              </button>
              <button
                onClick={onLogout}
                className="text-gray-500 hover:text-gray-700 font-medium py-2 px-4 rounded-lg transition duration-150 ease-in-out"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Search and Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search apps..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Apps Grid */}
        {filteredApps.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No apps found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || selectedCategory !== 'All' 
                ? 'Try adjusting your search or filter criteria'
                : 'Get started by adding your first app'
              }
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition duration-150 ease-in-out"
            >
              Add App
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredApps.map(app => (
              <AppCard
                key={app.id}
                app={app}
                onClick={() => setSelectedApp(app)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <AppModal
        app={selectedApp!}
        isOpen={!!selectedApp}
        onClose={() => setSelectedApp(null)}
      />
      
      <AddAppModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddApp}
      />
    </div>
  );
}