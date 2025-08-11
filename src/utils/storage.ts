import { App } from '../types';

const STORAGE_KEY = 'agenthub_apps';

export function getStoredApps(): App[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading apps from storage:', error);
    return [];
  }
}

export function saveApps(apps: App[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
  } catch (error) {
    console.error('Error saving apps to storage:', error);
  }
}

export function addApp(app: Omit<App, 'id' | 'createdAt' | 'updatedAt'>): App {
  const apps = getStoredApps();
  
  // Check if app with same URL already exists
  const existingApp = apps.find(existingApp => existingApp.url === app.url);
  if (existingApp) {
    return existingApp;
  }
  
  const newApp: App = {
    ...app,
    id: generateId(),
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  apps.push(newApp);
  saveApps(apps);
  
  return newApp;
}

export function updateApp(id: string, updates: Partial<App>): App | null {
  const apps = getStoredApps();
  const index = apps.findIndex(app => app.id === id);
  
  if (index === -1) return null;
  
  apps[index] = {
    ...apps[index],
    ...updates,
    updatedAt: new Date()
  };
  
  saveApps(apps);
  return apps[index];
}

export function deleteApp(id: string): boolean {
  const apps = getStoredApps();
  const filteredApps = apps.filter(app => app.id !== id);
  
  if (filteredApps.length === apps.length) return false;
  
  saveApps(filteredApps);
  return true;
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}