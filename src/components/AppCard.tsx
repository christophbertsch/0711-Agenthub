import React from 'react';
import { App } from '../types';

interface AppCardProps {
  app: App;
  onClick: () => void;
}

export default function AppCard({ app, onClick }: AppCardProps) {
  const handleLaunch = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(app.url, '_blank', 'noopener,noreferrer');
  };

  const getIconFromUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=64`;
    } catch {
      return null;
    }
  };

  const iconUrl = app.icon || getIconFromUrl(app.url);

  return (
    <div 
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer overflow-hidden h-full flex flex-col"
      onClick={onClick}
    >
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl overflow-hidden">
            {iconUrl ? (
              <img 
                src={iconUrl} 
                alt={`${app.name} icon`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling!.textContent = app.name.charAt(0).toUpperCase();
                }}
              />
            ) : (
              <span>{app.name.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{app.name}</h3>
            {app.category && (
              <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                {app.category}
              </span>
            )}
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">{app.description}</p>
        
        {app.tags && app.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-6">
            {app.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index}
                className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
              >
                {tag}
              </span>
            ))}
            {app.tags.length > 3 && (
              <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                +{app.tags.length - 3}
              </span>
            )}
          </div>
        )}
        
        <button
          onClick={handleLaunch}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition duration-150 ease-in-out mt-auto"
        >
          Launch App
        </button>
      </div>
    </div>
  );
}