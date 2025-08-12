import { App } from '../types';
import { getIconGenerator } from '../services/iconGenerator';
import { configService } from '../services/config';

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

    // Generate AI icon if OpenAI is configured
    let icon = `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;
    
    if (configService.isIconGenerationEnabled()) {
      try {
        const apiKey = configService.getOpenAIApiKey();
        if (apiKey) {
          console.log('Generating AI icon for:', name);
          const iconGenerator = getIconGenerator(apiKey);
          const aiIcon = await iconGenerator.generateIcon(name, description, category);
          icon = aiIcon;
          console.log('AI icon generated successfully');
        }
      } catch (error) {
        console.error('Failed to generate AI icon, falling back to favicon:', error);
        // Keep the default favicon as fallback
      }
    }
    
    return {
      name,
      description,
      url,
      icon,
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

// Enhanced app analysis with better categorization
export async function analyzeAppAdvanced(url: string, customName?: string, customDescription?: string): Promise<Omit<App, 'id' | 'createdAt' | 'updatedAt'>> {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    
    // Extract app name
    let name = customName || hostname.replace('.vercel.app', '').replace('.com', '').replace('.app', '');
    name = name.split('.')[0];
    name = name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    // Enhanced pattern matching for better categorization
    let description = customDescription || `A web application hosted at ${hostname}`;
    let category = 'Web App';
    let tags: string[] = [];

    // More comprehensive URL pattern analysis
    const urlLower = url.toLowerCase();

    if (urlLower.includes('ai') || urlLower.includes('gpt') || urlLower.includes('llm') || urlLower.includes('ml')) {
      category = 'AI Tools';
      tags.push('ai', 'machine-learning');
    } else if (urlLower.includes('business') || urlLower.includes('crm') || urlLower.includes('erp')) {
      category = 'Business';
      tags.push('business', 'productivity');
    } else if (urlLower.includes('data') || urlLower.includes('analytics') || urlLower.includes('dashboard')) {
      category = 'Data';
      tags.push('data', 'analytics');
    } else if (urlLower.includes('chat') || urlLower.includes('message') || urlLower.includes('communication')) {
      category = 'Communication';
      tags.push('communication', 'messaging');
    } else if (urlLower.includes('finance') || urlLower.includes('payment') || urlLower.includes('billing')) {
      category = 'Finance';
      tags.push('finance', 'payments');
    }

    // Specific app patterns (keeping existing ones and adding more)
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

    // Generate AI icon with enhanced prompting
    let icon = `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;
    
    if (configService.isIconGenerationEnabled()) {
      try {
        const apiKey = configService.getOpenAIApiKey();
        if (apiKey) {
          console.log('Generating AI icon for:', name, 'Category:', category);
          const iconGenerator = getIconGenerator(apiKey);
          
          // Use styled icon generation for better consistency
          const stylePreferences = {
            colorScheme: category === 'AI Tools' ? 'purple' as const : 
                        category === 'Business' ? 'blue' as const :
                        category === 'Data' ? 'teal' as const : 'gradient' as const,
            iconStyle: 'geometric' as const,
            complexity: 'simple' as const
          };
          
          const aiIcon = await iconGenerator.generateStyledIcon(name, description, category, stylePreferences);
          icon = aiIcon;
          console.log('AI icon generated successfully with style preferences');
        }
      } catch (error) {
        console.error('Failed to generate AI icon, falling back to favicon:', error);
        // Keep the default favicon as fallback
      }
    }
    
    return {
      name,
      description,
      url,
      icon,
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