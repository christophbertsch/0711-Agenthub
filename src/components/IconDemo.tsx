import { useState } from 'react';
import { getIconGenerator } from '../services/iconGenerator';
import { configService } from '../services/config';

export default function IconDemo() {
  const [generatedIcon, setGeneratedIcon] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateTestIcon = async () => {
    const apiKey = configService.getOpenAIApiKey();
    if (!apiKey) {
      setError('Please configure your OpenAI API key in settings first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const iconGenerator = getIconGenerator(apiKey);
      const icon = await iconGenerator.generateIcon(
        'Test App',
        'A sample application for testing AI icon generation',
        'AI Tools'
      );
      setGeneratedIcon(icon);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate icon');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-md mx-auto">
      <h3 className="text-lg font-semibold mb-4">AI Icon Generation Test</h3>
      
      <button
        onClick={generateTestIcon}
        disabled={loading}
        className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-medium py-2 px-4 rounded-lg transition duration-150 ease-in-out mb-4"
      >
        {loading ? 'Generating...' : 'Generate Test Icon'}
      </button>

      {error && (
        <div className="text-red-600 text-sm mb-4 p-3 bg-red-50 rounded-lg">
          {error}
        </div>
      )}

      {generatedIcon && (
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">Generated Icon:</p>
          <img 
            src={generatedIcon} 
            alt="Generated icon" 
            className="w-16 h-16 mx-auto rounded-xl shadow-md"
          />
        </div>
      )}
    </div>
  );
}