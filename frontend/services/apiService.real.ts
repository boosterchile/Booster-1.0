import {
    UserProfile,
    MockUserCredentials,
    ApiResponse,
    LoginResponse,
    CargoOffer,
    Vehicle,
    Shipment,
    Alert,
} from '../types';

// API Base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

// Helper to get auth token from localStorage
const getAuthToken = (): string | null => {
    return localStorage.getItem('smartCargoApp_authToken');
};

// Helper to make authenticated requests
const fetchWithAuth = async (url: string, options: RequestInit = {}): Promise<Response> => {
    const token = getAuthToken();
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers,
    });
};

// --- AUTHENTICATION API ---
const login = async (username: string, password: string): Promise<ApiResponse<LoginResponse>> => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            return { success: false, message: data.message || 'Login failed' };
        }

        return data;
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, message: 'Network error during login' };
    }
};

const register = async (userData: MockUserCredentials): Promise<ApiResponse<UserProfile>> => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });

        const data = await response.json();

        if (!response.ok) {
            return { success: false, message: data.message || 'Registration failed' };
        }

        return { success: true, data: data.data.user };
    } catch (error) {
        console.error('Register error:', error);
        return { success: false, message: 'Network error during registration' };
    }
};

const validateToken = async (token: string, userId: string): Promise<ApiResponse<UserProfile>> => {
    try {
        const response = await fetchWithAuth('/api/auth/me');
        const data = await response.json();

        if (!response.ok) {
            return { success: false, message: data.message || 'Token validation failed' };
        }

        return data;
    } catch (error) {
        console.error('Token validation error:', error);
        return { success: false, message: 'Network error during token validation' };
    }
};

// --- DATA MANAGEMENT API ---
const getUsers = async (): Promise<ApiResponse<UserProfile[]>> => {
    try {
        const response = await fetchWithAuth('/api/users');
        const data = await response.json();

        if (!response.ok) {
            return { success: false, message: data.message || 'Failed to fetch users' };
        }

        return data;
    } catch (error) {
        console.error('Get users error:', error);
        return { success: false, message: 'Network error fetching users' };
    }
};

const updateUser = async (updatedUser: UserProfile): Promise<ApiResponse<UserProfile>> => {
    try {
        const response = await fetchWithAuth(`/api/users/${updatedUser.id}`, {
            method: 'PUT',
            body: JSON.stringify(updatedUser),
        });

        const data = await response.json();

        if (!response.ok) {
            return { success: false, message: data.message || 'Failed to update user' };
        }

        return data;
    } catch (error) {
        console.error('Update user error:', error);
        return { success: false, message: 'Network error updating user' };
    }
};

const deleteUser = async (userId: string): Promise<ApiResponse<{ userId: string }>> => {
    try {
        const response = await fetchWithAuth(`/api/users/${userId}`, {
            method: 'DELETE',
        });

        const data = await response.json();

        if (!response.ok) {
            return { success: false, message: data.message || 'Failed to delete user' };
        }

        return data;
    } catch (error) {
        console.error('Delete user error:', error);
        return { success: false, message: 'Network error deleting user' };
    }
};

// Generic getData function that maps to different endpoints
const getData = async <T>(dataType: 'cargo' | 'vehicles' | 'shipments' | 'alerts' | 'settings' | 'blockchain' | 'otherInitiatives' | 'esgReports' | 'certifications'): Promise<ApiResponse<T>> => {
    try {
        let endpoint = '';

        switch (dataType) {
            case 'cargo':
                endpoint = '/api/cargo';
                break;
            case 'vehicles':
                endpoint = '/api/vehicles';
                break;
            case 'shipments':
                endpoint = '/api/shipments';
                break;
            case 'alerts':
                endpoint = '/api/alerts';
                break;
            case 'settings':
            case 'blockchain':
            case 'otherInitiatives':
            case 'esgReports':
            case 'certifications':
                // These are not yet implemented in backend
                return { success: true, data: [] as T };
            default:
                return { success: false, message: 'Invalid data type' };
        }

        const response = await fetchWithAuth(endpoint);
        const data = await response.json();

        if (!response.ok) {
            return { success: false, message: data.message || `Failed to fetch ${dataType}` };
        }

        return data;
    } catch (error) {
        console.error(`Get ${dataType} error:`, error);
        return { success: false, message: `Network error fetching ${dataType}` };
    }
};

const updateData = async <T>(dataType: string, updatedData: T): Promise<ApiResponse<T>> => {
    // For now, this bulk update isn't used in v4 (we use specific update endpoints)
    // Keep for compatibility
    return { success: true, data: updatedData };
};

const initializeData = (dataType: string, data: any[]) => {
    // No-op for real backend (data is in PostgreSQL)
    console.log(`initializeData called for ${dataType}, ignoring (using real backend)`);
};

const addBlockchainEvent = (eventData: any) => {
    // Blockchain events are created automatically in the backend
    return { id: 'auto-generated', timestamp: new Date().toISOString(), ...eventData };
};

const createCargoOffer = async (offerData: Omit<CargoOffer, 'id'>): Promise<ApiResponse<CargoOffer>> => {
    try {
        const response = await fetchWithAuth('/api/cargo', {
            method: 'POST',
            body: JSON.stringify(offerData),
        });

        const data = await response.json();

        if (!response.ok) {
            return { success: false, message: data.message || 'Failed to create cargo offer' };
        }

        return data;
    } catch (error) {
        console.error('Create cargo offer error:', error);
        return { success: false, message: 'Network error creating cargo offer' };
    }
};

export const apiService = {
    login,
    register,
    validateToken,
    getUsers,
    updateUser,
    deleteUser,
    initializeData,
    getData,
    updateData,
    addBlockchainEvent,
    createCargoOffer,
};
