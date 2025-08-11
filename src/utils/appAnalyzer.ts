import { App } from '../types';

export async function analyzeApp(url: string): Promise<Omit<App, 'id' | 'createdAt' | 'updatedAt'>> {
  try {
    // For demo purposes, we'll extract basic info from the URL
    // In a real implementation, you'd fetch the page and analyze it
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    
    // Extract app name from URL
    let name = hostname.replace('.vercel.app', '').replace('.com', '');
    name = name.split('.')[0];
    name = name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    // Generate basic description based on URL patterns
    let description = `A web application hosted at ${hostname}`;
    let category = 'Web App';
    let tags: string[] = [];
    
    // Analyze URL for specific patterns
    if (url.includes('ausschreibung')) {
      name = 'Ausschreibung Tool';
      description = 'A tool for managing tenders and procurement processes';
      category = 'Business';
      tags = ['procurement', 'business', 'management'];
    } else if (url.includes('etim-classifier')) {
      name = 'ETIM Classifier';
      description = 'Classification tool for ETIM product data standards';
      category = 'Data';
      tags = ['classification', 'data', 'etim'];
    } else if (url.includes('brand-to-prompt')) {
      name = 'Brand to Prompt';
      description = 'Convert brand information into AI prompts';
      category = 'AI Tools';
      tags = ['ai', 'branding', 'prompts'];
    } else if (url.includes('llm-comparison')) {
      name = 'LLM Comparison Tool';
      description = 'Compare different Large Language Models';
      category = 'AI Tools';
      tags = ['ai', 'llm', 'comparison'];
    }
    
    return {
      name,
      description,
      url,
      icon: `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`,
      category,
      tags
    };
  } catch (error) {
    console.error('Error analyzing app:', error);
    return {
      name: 'Unknown App',
      description: 'Unable to analyze application',
      url,
      icon: `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=64`,
      category: 'Unknown',
      tags: []
    };
  }
}