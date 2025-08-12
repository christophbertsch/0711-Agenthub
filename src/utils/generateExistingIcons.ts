import { getStoredApps, saveApps } from './storage';
import { getIconGenerator } from '../services/iconGenerator';
import { configService } from '../services/config';

export async function generateIconsForExistingApps(): Promise<void> {
  const apiKey = configService.getOpenAIApiKey();
  if (!apiKey) {
    throw new Error('OpenAI API key is required. Please configure it in settings first.');
  }

  const apps = getStoredApps();
  const iconGenerator = getIconGenerator(apiKey);
  
  console.log(`Found ${apps.length} apps. Generating icons...`);
  
  for (let i = 0; i < apps.length; i++) {
    const app = apps[i];
    
    // Skip if app already has a custom icon (not a favicon)
    if (app.icon && !app.icon.includes('favicon') && !app.icon.includes('s2/favicons')) {
      console.log(`Skipping ${app.name} - already has custom icon`);
      continue;
    }
    
    console.log(`Generating icon for ${app.name} (${i + 1}/${apps.length})...`);
    
    try {
      // Determine style preferences based on category
      const category = app.category || 'Web App';
      const stylePreferences = {
        colorScheme: category === 'AI Tools' ? 'purple' as const : 
                    category === 'Business' ? 'blue' as const :
                    category === 'Data' ? 'teal' as const : 'gradient' as const,
        iconStyle: 'geometric' as const,
        complexity: 'simple' as const
      };
      
      const generatedIcon = await iconGenerator.generateStyledIcon(
        app.name,
        app.description,
        category,
        stylePreferences
      );
      
      // Update the app with the new icon
      apps[i] = {
        ...app,
        icon: generatedIcon,
        updatedAt: new Date()
      };
      
      console.log(`✓ Generated icon for ${app.name}`);
      
      // Add a small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      console.error(`✗ Failed to generate icon for ${app.name}:`, error);
      // Continue with the next app
    }
  }
  
  // Save all updated apps
  saveApps(apps);
  console.log('✓ All icons generated and saved!');
}

// Function to generate icons for specific apps by name
export async function generateIconsForSpecificApps(appNames: string[]): Promise<void> {
  const apiKey = configService.getOpenAIApiKey();
  if (!apiKey) {
    throw new Error('OpenAI API key is required. Please configure it in settings first.');
  }

  const apps = getStoredApps();
  const iconGenerator = getIconGenerator(apiKey);
  
  for (const appName of appNames) {
    const appIndex = apps.findIndex(app => 
      app.name.toLowerCase().includes(appName.toLowerCase())
    );
    
    if (appIndex === -1) {
      console.log(`App "${appName}" not found`);
      continue;
    }
    
    const app = apps[appIndex];
    console.log(`Generating icon for ${app.name}...`);
    
    try {
      const category = app.category || 'Web App';
      const stylePreferences = {
        colorScheme: category === 'AI Tools' ? 'purple' as const : 
                    category === 'Business' ? 'blue' as const :
                    category === 'Data' ? 'teal' as const : 'gradient' as const,
        iconStyle: 'geometric' as const,
        complexity: 'simple' as const
      };
      
      const generatedIcon = await iconGenerator.generateStyledIcon(
        app.name,
        app.description,
        category,
        stylePreferences
      );
      
      apps[appIndex] = {
        ...app,
        icon: generatedIcon,
        updatedAt: new Date()
      };
      
      console.log(`✓ Generated icon for ${app.name}`);
      
      // Add delay between generations
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      console.error(`✗ Failed to generate icon for ${app.name}:`, error);
    }
  }
  
  saveApps(apps);
  console.log('✓ Icons generated and saved!');
}