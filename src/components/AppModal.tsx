import { App } from '../types';

interface AppModalProps {
  app: App;
  isOpen: boolean;
  onClose: () => void;
}

export default function AppModal({ app, isOpen, onClose }: AppModalProps) {
  if (!isOpen) return null;

  const handleLaunch = () => {
    window.open(app.url, '_blank', 'noopener,noreferrer');
  };

  const getIconFromUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=128`;
    } catch {
      return null;
    }
  };

  const iconUrl = app.icon || getIconFromUrl(app.url);

  return (
    <div 
      className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999]"
      onClick={onClose}
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <div 
        className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl overflow-hidden">
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
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{app.name}</h2>
                {app.category && (
                  <span className="inline-block px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
                    {app.category}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600">{app.description}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">URL</h3>
              <a 
                href={app.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 break-all"
              >
                {app.url}
              </a>
            </div>

            {app.tags && app.tags.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {app.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="inline-block px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
              <div>
                <span className="font-medium">Created:</span>
                <br />
                {new Date(app.createdAt).toLocaleDateString()}
              </div>
              <div>
                <span className="font-medium">Updated:</span>
                <br />
                {new Date(app.updatedAt).toLocaleDateString()}
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                onClick={handleLaunch}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition duration-150 ease-in-out"
              >
                Launch App
              </button>
              <button
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition duration-150 ease-in-out"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}