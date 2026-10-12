import { app } from 'electron';
import * as log from 'electron-log';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Represents the configuration object for the application.
 */
interface AppConfig {
    channel: 'latest' | 'beta';
}

/**
 * The path to the configuration file.
 */
const configPath = path.join(app.getPath('userData'), 'config.json');

/**
 * Saves the given configuration object to the configuration file.
 * @param config The configuration object to save.
 */
export function saveConfig(config: AppConfig): void {
    fs.writeFileSync(configPath, JSON.stringify(config));
}

/**
 * Loads the configuration object from the configuration file.
 * If the file does not exist, a default configuration object is created and saved to the file.
 * @returns The loaded configuration object, or null if an error occurred.
 */
export function loadConfig(): AppConfig | null {
    try {
        if (!fs.existsSync(configPath)) {
            const defaultConfig: AppConfig = {
                channel: 'latest',
            };
            saveConfig(defaultConfig);
            return defaultConfig;
        }

        const data = fs.readFileSync(configPath, 'utf-8');
        return JSON.parse(data) as AppConfig;
    } catch (err) {
        log.error('Error loading config file:', err);
        return null;
    }
}
