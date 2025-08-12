import { useState } from 'react';
import { getIconGenerator } from '../services/iconGenerator';
import { configService } from '../services/config';

interface TestIcon {
  name: string;
  description: string;
  category: string;
  icon?: string;
  loading?: boolean;
  error?: string;
}

export default function IconTestPage() {
  const [testIcons, setTestIcons] = useState<TestIcon[]>([
    {
      name: 'Analytics Dashboard',
      description: 'A comprehensive data analytics and visualization platform',
      category: 'Data'
    },
    {
      name: 'AI Assistant',
      description: 'An intelligent virtual assistant powered by machine learning',
      category: 'AI Tools'
    },
    {
      name: 'Project Manager',
      description: 'A business tool for managing projects and team collaboration',
      category: 'Business'
    },
    {
      name: 'Chat Application',
      description: 'A real-time messaging and communication platform',
      category: 'Communication'
    }
  ]);

  const generateIcon = async (index: number) => {
    const apiKey = configService.getOpenAIApiKey();
    if (!apiKey) {
      setTestIcons(prev => prev.map((icon, i) => 
        i === index ? { ...icon, error: 'Please configure OpenAI API key first' } : icon
      ));
      return;
    }

    setTestIcons(prev => prev.map((icon, i) => 
      i === index ? { ...icon, loading: true, error: undefined } : icon
    ));

    try {
      const iconGenerator = getIconGenerator(apiKey);
      const testIcon = testIcons[index];
      
      // Use styled icon generation for better consistency
      const stylePreferences = {
        colorScheme: testIcon.category === 'AI Tools' ? 'purple' as const : 
                    testIcon.category === 'Business' ? 'blue' as const :
                    testIcon.category === 'Data' ? 'teal' as const : 'gradient' as const,
        iconStyle: 'geometric' as const,
        complexity: 'simple' as const
      };
      
      const generatedIcon = await iconGenerator.generateStyledIcon(
        testIcon.name,
        testIcon.description,
        testIcon.category,
        stylePreferences
      );

      setTestIcons(prev => prev.map((icon, i) => 
        i === index ? { ...icon, icon: generatedIcon, loading: false } : icon
      ));
    } catch (error) {
      setTestIcons(prev => prev.map((icon, i) => 
        i === index ? { 
          ...icon, 
          loading: false, 
          error: error instanceof Error ? error.message : 'Failed to generate icon'
        } : icon
      ));
    }
  };

  const generateAllIcons = async () => {
    for (let i = 0; i < testIcons.length; i++) {
      await generateIcon(i);
      // Add a small delay between generations to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  };

  const clearAllIcons = () => {
    setTestIcons(prev => prev.map(icon => ({ 
      ...icon, 
      icon: undefined, 
      loading: false, 
      error: undefined 
    })));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            AI Icon Generation Test
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Test the AI-powered icon generation system with sample applications
          </p>
          
          <div className="flex justify-center space-x-4 mb-8">
            <button
              onClick={generateAllIcons}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition duration-150 ease-in-out"
            >
              Generate All Icons
            </button>
            <button
              onClick={clearAllIcons}
              className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-6 rounded-lg transition duration-150 ease-in-out"
            >
              Clear All
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testIcons.map((testIcon, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-6">
              <div className="text-center mb-4">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center overflow-hidden">
                  {testIcon.loading ? (
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  ) : testIcon.icon ? (
                    <img 
                      src={testIcon.icon} 
                      alt={`${testIcon.name} icon`}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <span className="text-white font-bold text-xl">
                      {testIcon.name.charAt(0)}
                    </span>
                  )}
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {testIcon.name}
                </h3>
                <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full mb-2">
                  {testIcon.category}
                </span>
                <p className="text-sm text-gray-600 mb-4">
                  {testIcon.description}
                </p>
              </div>

              {testIcon.error && (
                <div className="text-red-600 text-xs mb-4 p-2 bg-red-50 rounded">
                  {testIcon.error}
                </div>
              )}

              <button
                onClick={() => generateIcon(index)}
                disabled={testIcon.loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium py-2 px-4 rounded-lg transition duration-150 ease-in-out"
              >
                {testIcon.loading ? 'Generating...' : 
                 testIcon.icon ? 'Regenerate Icon' : 'Generate Icon'}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Smart Analysis</h3>
              <p className="text-sm text-gray-600">
                Analyzes app name, description, and category to understand the purpose
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2M7 4h10" />
                </svg>
              </div>
              <h3 className="font-medium text-gray-900 mb-2">AI Generation</h3>
              <p className="text-sm text-gray-600">
                Uses OpenAI DALL-E to create custom icons with consistent styling
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Consistent Style</h3>
              <p className="text-sm text-gray-600">
                Ensures all icons follow the same design family with matching colors and style
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}