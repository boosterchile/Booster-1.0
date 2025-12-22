// Backend configuration - automatically switch between mock and real based on env
import { apiService as mockApiService } from './apiService';
import { apiService as realApiService } from './apiService.real';

// Check if we should use the real backend
const USE_REAL_BACKEND = (import.meta.env as any).VITE_USE_REAL_BACKEND === 'true' ||
    (import.meta.env as any).VITE_API_BASE_URL !== undefined;

// Export the correct implementation based on configuration
export const apiService = USE_REAL_BACKEND ? realApiService : mockApiService;

// Log which backend is being used
if ((import.meta.env as any).DEV) {
    console.log(`🔧 Using ${USE_REAL_BACKEND ? 'REAL' : 'MOCK'} backend`);
    if (USE_REAL_BACKEND) {
        console.log(`📡 API URL: ${(import.meta.env as any).VITE_API_BASE_URL || 'http://localhost:3001'}`);
    }
}
