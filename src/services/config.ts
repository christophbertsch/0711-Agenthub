// Configuration service for managing API keys and settings
export class ConfigService {
  private static instance: ConfigService;
  private openaiApiKey: string | null = null;
  private iconGenerationEnabled: boolean = false;

  private constructor() {
    // Load from localStorage if available
    this.loadFromStorage();
  }

  static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

  setOpenAIApiKey(apiKey: string): void {
    this.openaiApiKey = apiKey;
    this.iconGenerationEnabled = !!apiKey;
    this.saveToStorage();
  }

  getOpenAIApiKey(): string | null {
    return this.openaiApiKey;
  }

  isIconGenerationEnabled(): boolean {
    return this.iconGenerationEnabled && !!this.openaiApiKey;
  }

  clearApiKey(): void {
    this.openaiApiKey = null;
    this.iconGenerationEnabled = false;
    this.saveToStorage();
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('agenthub-config');
      if (stored) {
        const config = JSON.parse(stored);
        this.openaiApiKey = config.openaiApiKey || null;
        this.iconGenerationEnabled = config.iconGenerationEnabled || false;
      }
    } catch (error) {
      console.error('Error loading config from storage:', error);
    }
  }

  private saveToStorage(): void {
    try {
      const config = {
        openaiApiKey: this.openaiApiKey,
        iconGenerationEnabled: this.iconGenerationEnabled
      };
      localStorage.setItem('agenthub-config', JSON.stringify(config));
    } catch (error) {
      console.error('Error saving config to storage:', error);
    }
  }

  // Get configuration for display (without exposing the full API key)
  getDisplayConfig(): { hasApiKey: boolean; iconGenerationEnabled: boolean } {
    return {
      hasApiKey: !!this.openaiApiKey,
      iconGenerationEnabled: this.iconGenerationEnabled
    };
  }
}

export const configService = ConfigService.getInstance();