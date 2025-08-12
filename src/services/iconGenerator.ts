import OpenAI from 'openai';

// Icon generation service using OpenAI DALL-E
export class IconGenerator {
  private openai: OpenAI;
  private basePrompt: string;

  constructor(apiKey?: string) {
    if (!apiKey) {
      throw new Error('OpenAI API key is required');
    }
    
    this.openai = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true // Note: In production, this should be handled server-side
    });

    // Base prompt that ensures consistent icon family style
    this.basePrompt = `Create a modern, minimalist app icon in a consistent design family style. 
    The icon should be:
    - 512x512 pixels
    - Clean, geometric design with rounded corners
    - Use a cohesive color palette with gradients (blues, purples, teals)
    - Modern flat design with subtle depth
    - Professional and polished appearance
    - White or light colored symbol/graphic on gradient background
    - Similar to iOS/macOS app icon style
    - No text or letters in the icon
    - Simple, recognizable symbol that represents the app's function`;
  }

  async generateIcon(appName: string, description: string, category: string): Promise<string> {
    try {
      const prompt = `${this.basePrompt}

App Name: ${appName}
Description: ${description}
Category: ${category}

Create an icon that visually represents this ${category.toLowerCase()} application. The icon should fit seamlessly with other modern app icons in the same design family.`;

      const response = await this.openai.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
        style: "vivid"
      });

      const imageUrl = response.data?.[0]?.url;
      if (!imageUrl) {
        throw new Error('No image URL returned from OpenAI');
      }

      // Convert the image to base64 for storage
      const base64Image = await this.urlToBase64(imageUrl);
      return base64Image;

    } catch (error) {
      console.error('Error generating icon:', error);
      throw new Error(`Failed to generate icon: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async urlToBase64(url: string): Promise<string> {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result as string;
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error converting URL to base64:', error);
      throw error;
    }
  }

  // Generate multiple icon variations for A/B testing
  async generateIconVariations(appName: string, description: string, category: string, count: number = 3): Promise<string[]> {
    const variations = [];
    
    for (let i = 0; i < count; i++) {
      try {
        const icon = await this.generateIcon(appName, description, category);
        variations.push(icon);
      } catch (error) {
        console.error(`Error generating variation ${i + 1}:`, error);
      }
    }
    
    return variations;
  }

  // Generate icon based on specific style preferences
  async generateStyledIcon(
    appName: string, 
    description: string, 
    category: string, 
    stylePreferences: {
      colorScheme?: 'blue' | 'purple' | 'teal' | 'gradient';
      iconStyle?: 'geometric' | 'organic' | 'tech' | 'business';
      complexity?: 'simple' | 'detailed';
    }
  ): Promise<string> {
    const { colorScheme = 'gradient', iconStyle = 'geometric', complexity = 'simple' } = stylePreferences;
    
    let colorPrompt = '';
    switch (colorScheme) {
      case 'blue':
        colorPrompt = 'Use various shades of blue with subtle gradients';
        break;
      case 'purple':
        colorPrompt = 'Use purple and violet tones with gradients';
        break;
      case 'teal':
        colorPrompt = 'Use teal and cyan colors with gradients';
        break;
      default:
        colorPrompt = 'Use a modern gradient combining blues, purples, and teals';
    }

    let stylePrompt = '';
    switch (iconStyle) {
      case 'geometric':
        stylePrompt = 'with clean geometric shapes and lines';
        break;
      case 'organic':
        stylePrompt = 'with smooth, organic curves and flowing shapes';
        break;
      case 'tech':
        stylePrompt = 'with tech-inspired elements like circuits, nodes, or digital patterns';
        break;
      case 'business':
        stylePrompt = 'with professional business-oriented symbols';
        break;
    }

    const complexityPrompt = complexity === 'simple' 
      ? 'Keep the design minimal and clean with few elements'
      : 'Include more detailed elements while maintaining clarity';

    const customPrompt = `${this.basePrompt}

App Name: ${appName}
Description: ${description}
Category: ${category}

Style Requirements:
- ${colorPrompt}
- Design ${stylePrompt}
- ${complexityPrompt}

Create an icon that visually represents this ${category.toLowerCase()} application with the specified style preferences.`;

    try {
      const response = await this.openai.images.generate({
        model: "dall-e-3",
        prompt: customPrompt,
        n: 1,
        size: "1024x1024",
        quality: "hd",
        style: "vivid"
      });

      const imageUrl = response.data?.[0]?.url;
      if (!imageUrl) {
        throw new Error('No image URL returned from OpenAI');
      }

      return await this.urlToBase64(imageUrl);
    } catch (error) {
      console.error('Error generating styled icon:', error);
      throw new Error(`Failed to generate styled icon: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// Singleton instance for the icon generator
let iconGeneratorInstance: IconGenerator | null = null;

export function getIconGenerator(apiKey?: string): IconGenerator {
  if (!iconGeneratorInstance && apiKey) {
    iconGeneratorInstance = new IconGenerator(apiKey);
  }
  
  if (!iconGeneratorInstance) {
    throw new Error('Icon generator not initialized. Please provide an OpenAI API key.');
  }
  
  return iconGeneratorInstance;
}

// Helper function to get category-specific icon prompts
export function getCategoryIconPrompt(category: string): string {
  const categoryPrompts: Record<string, string> = {
    'AI Tools': 'artificial intelligence, neural network, brain, or AI-related symbols',
    'Business': 'business charts, briefcase, handshake, or professional symbols',
    'Data': 'database, analytics, charts, or data visualization symbols',
    'Web App': 'web browser, globe, or internet-related symbols',
    'Productivity': 'checkmarks, calendars, tasks, or productivity symbols',
    'Communication': 'chat bubbles, messages, or communication symbols',
    'Finance': 'money, coins, graphs, or financial symbols',
    'Education': 'books, graduation cap, or learning symbols',
    'Health': 'medical cross, heart, or health-related symbols',
    'Entertainment': 'play button, music notes, or entertainment symbols'
  };

  return categoryPrompts[category] || 'generic app or tool symbols';
}