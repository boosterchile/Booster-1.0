

import { UserProfile } from '../types';
import { LOCALSTORAGE_KEYS } from '../constants';

/**
 * Enhanced localStorage service with generic methods for data persistence
 * Handles all localStorage operations with proper error handling and type safety
 */

// Generic localStorage operations
function getItem<T>(key: string): T | null {
    try {
        const storedValue = localStorage.getItem(key);
        if (storedValue) {
            return JSON.parse(storedValue) as T;
        }
        return null;
    } catch (error) {
        console.error(`Error getting item ${key} from localStorage:`, error);
        localStorage.removeItem(key); // Clear potentially corrupted data
        return null;
    }
}

function setItem<T>(key: string, value: T): void {
    try {
        const serialized = JSON.stringify(value);
        localStorage.setItem(key, serialized);
    } catch (error) {
        if (error instanceof Error && error.name === 'QuotaExceededError') {
            console.error(`LocalStorage quota exceeded when setting ${key}`);
            // Optionally: clear old data or notify user
        } else {
            console.error(`Error setting item ${key} in localStorage:`, error);
        }
        throw error; // Re-throw so caller knows it failed
    }
}

function removeItem(key: string): void {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error(`Error removing item ${key} from localStorage:`, error);
    }
}

// Auth Token Management
const getAuthData = (): { token: string; user: UserProfile } | null => {
    return getItem<{ token: string; user: UserProfile }>(LOCALSTORAGE_KEYS.AUTH_TOKEN);
};

const setAuthData = (token: string, user: UserProfile): void => {
    const data = { token, user };
    setItem<{ token: string; user: UserProfile }>(LOCALSTORAGE_KEYS.AUTH_TOKEN, data);
};

const removeAuthData = (): void => {
    removeItem(LOCALSTORAGE_KEYS.AUTH_TOKEN);
};

// Generic data management for apiService persistence
const getData = <T>(dataType: string): T | null => {
    const key = LOCALSTORAGE_KEYS[dataType as keyof typeof LOCALSTORAGE_KEYS];
    if (!key) {
        console.warn(`Unknown dataType: ${dataType}`);
        return null;
    }
    return getItem<T>(key);
};

const setData = <T>(dataType: string, data: T): void => {
    const key = LOCALSTORAGE_KEYS[dataType as keyof typeof LOCALSTORAGE_KEYS];
    if (!key) {
        console.warn(`Unknown dataType: ${dataType}`);
        return;
    }
    setItem<T>(key, data);
};

// Check if localStorage is available (some browsers block it)
const isAvailable = (): boolean => {
    try {
        const test = '__localStorage_test__';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch (e) {
        return false;
    }
};

// Get storage usage info
const getStorageInfo = () => {
    if (!isAvailable()) return null;

    let totalSize = 0;
    for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
            totalSize += localStorage[key].length + key.length;
        }
    }

    return {
        used: totalSize,
        usedKB: (totalSize / 1024).toFixed(2),
        // Most browsers support ~5-10MB, we'll use 5MB as conservative estimate
        estimatedQuota: 5 * 1024 * 1024,
        usagePercent: ((totalSize / (5 * 1024 * 1024)) * 100).toFixed(2),
    };
};

export const localStorageService = {
    // Auth methods
    getAuthData,
    setAuthData,
    removeAuthData,
    // Generic data methods
    getData,
    setData,
    // Utility methods
    isAvailable,
    getStorageInfo,
    // Low-level methods (exposed for advanced use)
    getItem,
    setItem,
    removeItem,
};
