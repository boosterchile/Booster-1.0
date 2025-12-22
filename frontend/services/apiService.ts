
import { 
    UserProfile, 
    MockUserCredentials, 
    UserPreferences,
    ApiResponse,
    LoginResponse,
    CargoOffer,
    Vehicle,
    Shipment,
    Alert,
    PlatformSettings,
    BlockchainEvent,
    OtherSustainabilityInitiative,
    EsgReport,
    Certification,
} from '../types';
import { MOCK_USERS_CREDENTIALS, APP_NAME } from '../constants';

// --- TRL-7 SIMULATED BACKEND ---
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// --- DATA INITIALIZATION ---
const initialMockUserPreferences: UserPreferences = {
  language: 'es',
  notifications: { email: true, inApp: true, sms: false },
  theme: 'dark',
};

const initializeUsers = (): UserProfile[] => {
    return MOCK_USERS_CREDENTIALS.map(mockUser => ({
        id: mockUser.username,
        name: mockUser.name,
        email: `${mockUser.username}@example.com`,
        role: mockUser.role,
        companyName: mockUser.companyName || 'N/A',
        rating: Math.round((3 + Math.random() * 2) * 10) / 10,
        completedTrips: Math.floor(Math.random() * 100),
        status: mockUser.role === 'Carrier' ? 'PendingApproval' : 'Active', // Carriers start as pending
        certifications: mockUser.certifications || [],
        preferences: { ...initialMockUserPreferences },
        avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(mockUser.name)}&background=random&color=FFFFFF&font-size=0.5&length=2`,
        carrierProfileDetails: mockUser.carrierProfileDetails,
    }));
};

let users: UserProfile[] = initializeUsers();
const userPasswords = new Map<string, string>();
MOCK_USERS_CREDENTIALS.forEach(u => userPasswords.set(u.username, u.password || 'password123'));

// --- AUTHENTICATION API ---
const login = async (username: string, password: string): Promise<ApiResponse<LoginResponse>> => {
    await delay(500);
    const user = users.find(u => u.id === username);
    const storedPassword = userPasswords.get(username);

    if (user && storedPassword === password) {
        if (user.status === 'Inactive') return { success: false, message: 'Tu cuenta está inactiva. Contacta al administrador.' };
        if (user.status === 'PendingApproval') return { success: false, message: 'Tu cuenta está pendiente de aprobación.' };
        
        const token = `simulated-token-${user.id}-${Date.now()}`;
        return { success: true, data: { token, user } };
    }
    return { success: false, message: 'Usuario o contraseña incorrectos.' };
};

const register = async (userData: MockUserCredentials): Promise<ApiResponse<UserProfile>> => {
    await delay(600);
    if (users.some(u => u.id === userData.username)) return { success: false, message: `El usuario '${userData.username}' ya existe.` };
    if (users.some(u => u.email === userData.email)) return { success: false, message: `El email '${userData.email}' ya está registrado.` };

    const newUser: UserProfile = {
        id: userData.username,
        name: userData.name,
        email: userData.email!,
        role: userData.role!,
        companyName: userData.companyName!,
        status: userData.role === 'Carrier' ? 'PendingApproval' : 'Active', // New carriers require approval
        rating: 3.5, completedTrips: 0, certifications: userData.certifications || [],
        preferences: { ...initialMockUserPreferences },
        avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=random&color=FFFFFF&font-size=0.5&length=2`,
        carrierProfileDetails: userData.carrierProfileDetails,
    };
    users.push(newUser);
    userPasswords.set(newUser.id, userData.password!);
    
    addBlockchainEvent({
        eventType: 'USER_CREATED',
        details: { userId: newUser.id, role: newUser.role, status: newUser.status },
        relatedEntityId: newUser.id, actorId: 'registration_system'
    });
    return { success: true, data: newUser };
};

const validateToken = async (token: string, userId: string): Promise<ApiResponse<UserProfile>> => {
    await delay(50);
    const user = users.find(u => u.id === userId);
    if (token.startsWith('simulated-token-') && user) return { success: true, data: user };
    return { success: false, message: 'Token inválido o expirado.' };
}

// --- DATA MANAGEMENT API ---
const getUsers = async (): Promise<ApiResponse<UserProfile[]>> => {
    await delay(100);
    return { success: true, data: [...users] };
};

const updateUser = async (updatedUser: UserProfile): Promise<ApiResponse<UserProfile>> => {
    await delay(300);
    const userIndex = users.findIndex(u => u.id === updatedUser.id);
    if (userIndex > -1) {
        users[userIndex] = { ...users[userIndex], ...updatedUser };
        addBlockchainEvent({ eventType: 'USER_UPDATED', details: { userId: updatedUser.id }, relatedEntityId: updatedUser.id, actorId: 'admin_system' });
        return { success: true, data: users[userIndex] };
    }
    return { success: false, message: "Usuario no encontrado." };
};

const deleteUser = async (userId: string): Promise<ApiResponse<{ userId: string }>> => {
    await delay(400);
    const initialLength = users.length;
    users = users.filter(u => u.id !== userId);
    if (users.length < initialLength) {
        userPasswords.delete(userId);
        addBlockchainEvent({ eventType: 'USER_DELETED', details: { userId }, relatedEntityId: userId, actorId: 'admin_system' });
        return { success: true, data: { userId } };
    }
    return { success: false, message: "Usuario no encontrado para eliminar." };
};

// --- In-memory data stores ---
let cargoOffers: CargoOffer[] = []; 
let vehicles: Vehicle[] = [];
let shipments: Shipment[] = [];
let alerts: Alert[] = [];
let platformSettings: PlatformSettings = {
    platformName: APP_NAME, platformVersion: '2.0.0-AUDITED', adminContactEmail: 'soporte@smartcargo.ai',
    lastMaintenanceDate: new Date().toISOString().split('T')[0], privacyPolicyLink: '#', termsOfServiceLink: '#',
    mainCurrency: 'CLP', weightUnit: 'kg', volumeUnit: 'm3',
};
let blockchainLog: BlockchainEvent[] = [];
let otherInitiatives: OtherSustainabilityInitiative[] = [];
let esgReports: EsgReport[] = [];
let certifications: Certification[] = [];

const initializeData = (dataType: string, data: any[]) => {
    switch(dataType) {
        case 'cargo': cargoOffers = data as CargoOffer[]; break;
        case 'vehicles': vehicles = data as Vehicle[]; break;
        case 'shipments': shipments = data as Shipment[]; break;
        case 'alerts': alerts = data as Alert[]; break;
        case 'otherInitiatives': otherInitiatives = data as OtherSustainabilityInitiative[]; break;
        case 'esgReports': esgReports = data as EsgReport[]; break;
        case 'certifications': certifications = data as Certification[]; break;
    }
};

const getData = async <T>(dataType: 'cargo' | 'vehicles' | 'shipments' | 'alerts' | 'settings' | 'blockchain' | 'otherInitiatives' | 'esgReports' | 'certifications'): Promise<ApiResponse<T>> => {
    await delay(150);
    let data;
     switch(dataType) {
        case 'cargo': data = cargoOffers; break;
        case 'vehicles': data = vehicles; break;
        case 'shipments': data = shipments; break;
        case 'alerts': data = alerts; break;
        case 'settings': data = platformSettings; break;
        case 'blockchain': data = blockchainLog; break;
        case 'otherInitiatives': data = otherInitiatives; break;
        case 'esgReports': data = esgReports; break;
        case 'certifications': data = certifications; break;
        default: return { success: false, message: 'Invalid data type' };
    }
    return { success: true, data: data as T };
};

const updateData = async <T>(dataType: string, updatedData: T): Promise<ApiResponse<T>> => {
    await delay(200);
     switch(dataType) {
        case 'cargo': cargoOffers = updatedData as CargoOffer[]; break;
        case 'vehicles': vehicles = updatedData as Vehicle[]; break;
        case 'shipments': shipments = updatedData as Shipment[]; break;
        case 'alerts': alerts = updatedData as Alert[]; break;
        case 'settings': platformSettings = updatedData as PlatformSettings; break;
        case 'otherInitiatives': otherInitiatives = updatedData as OtherSustainabilityInitiative[]; break;
        case 'esgReports': esgReports = updatedData as EsgReport[]; break;
        case 'certifications': certifications = updatedData as Certification[]; break;
        default: return { success: false, message: 'Invalid data type' };
    }
    return { success: true, data: updatedData };
}

const addBlockchainEvent = (eventData: Omit<BlockchainEvent, 'id' | 'timestamp'>): BlockchainEvent => {
    const newEvent: BlockchainEvent = { id: crypto.randomUUID(), timestamp: new Date().toISOString(), ...eventData };
    blockchainLog.unshift(newEvent);
    if (blockchainLog.length > 100) blockchainLog.pop();
    return newEvent;
};

const createCargoOffer = async (offerData: Omit<CargoOffer, 'id'>): Promise<ApiResponse<CargoOffer>> => {
    await delay(400);
    const newOffer: CargoOffer = { id: `CGO${String(Date.now()).slice(-5)}`, ...offerData };
    cargoOffers.unshift(newOffer);
    addBlockchainEvent({ eventType: "CARGO_OFFER_CREATED", details: { cargoId: newOffer.id }, relatedEntityId: newOffer.id, actorId: offerData.shipperId });
    return { success: true, data: newOffer };
};

export const apiService = {
  login, register, validateToken, getUsers, updateUser, deleteUser,
  initializeData, getData, updateData, addBlockchainEvent, createCargoOffer,
};
