import { app } from 'electron';
import * as fs from 'fs';
import * as path from 'path';

const SETTINGS_FILE = path.join(app.getPath('userData'), 'settings.json');

interface Settings {
  anthropicApiKey: string;
}

export const defaultSettings: Settings = {
  anthropicApiKey: '',
};

export function loadSettings(): Settings {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const data = fs.readFileSync(SETTINGS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading settings:', error);
  }
  return defaultSettings;
}

export function saveSettings(settings: Settings): void {
  try {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
}
