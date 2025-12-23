
import { MockUserCredentials } from "./types";

export const APP_NAME = "Booster 1.0";
export const APP_SUBTITLE = "Logística impulsada por IA";
export const GEMINI_TEXT_MODEL = "gemini-2.5-flash";
export const GEMINI_IMAGE_MODEL = "imagen-3.0-generate-002";

// Environment variables with validation
export const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

// Startup validation for critical env vars
if (!GEMINI_API_KEY) {
  console.error("❌ CRITICAL: VITE_GEMINI_API_KEY is not configured. Please set it in .env.local file.");
  console.warn("The application will not function properly without a valid Gemini API key.");
}

if (!GOOGLE_MAPS_API_KEY) {
  console.warn("⚠️ WARNING: VITE_GOOGLE_MAPS_API_KEY is not configured. Map functionalities will not work correctly.");
  console.info("Please set a valid Google Maps API key in .env.local file.");
}


export const NAV_ITEMS = [
  { name: 'Inicio', path: '/', icon: 'HouseIcon', description: 'Volver a la página principal de bienvenida.', allowedRoles: ['Admin', 'Shipper', 'Carrier', 'Guest'] },
  { name: 'Panel', path: '/dashboard', icon: 'DashboardIcon', description: 'Visualiza métricas clave y actividades recientes.', allowedRoles: ['Admin', 'Shipper', 'Carrier'] },
  { name: 'Envíos', path: '/shipments', icon: 'PackageIconPhosphor', description: 'Realiza seguimiento en tiempo real de tus envíos y gestiona la seguridad.', allowedRoles: ['Admin', 'Shipper'] },
  { name: 'Cargas', path: '/loads', icon: 'TruckIconPhosphor', description: 'Orquesta ofertas de carga, encuentra vehículos y optimiza rutas con IA.', allowedRoles: ['Admin', 'Shipper', 'Carrier'] },
  { name: 'Alertas', path: '/alerts', icon: 'BellIcon', description: 'Revisa y gestiona alertas operativas y del sistema.', allowedRoles: ['Admin', 'Shipper', 'Carrier'] },
  { name: 'Análisis', path: '/analytics', icon: 'ChartLineIcon', description: 'Analiza el rendimiento, la huella de carbono y otras métricas de sostenibilidad.', allowedRoles: ['Admin', 'Shipper', 'Carrier'] },
  { name: 'Configuración', path: '/settings', icon: 'GearIcon', description: 'Administra usuarios, perfiles, y configura las herramientas de colaboración.', allowedRoles: ['Admin', 'Shipper', 'Carrier'] }, // Admins manage all, users manage own profile.
];

export const DEFAULT_ERROR_MESSAGE = "Ocurrió un error inesperado. Por favor, inténtelo de nuevo más tarde.";
export const GEMINI_THINKING_BUDGET_LOW_LATENCY = 0;

// Mock Users are now managed in apiService.ts to simulate a backend.
// This constant can be removed or kept for reference.
export const MOCK_USERS_CREDENTIALS: MockUserCredentials[] = [
  {
    username: "admin",
    password: "password123",
    name: "Admin User",
    role: "Admin",
    companyName: "Booster 1.0 Platform"
  },
  {
    username: "shipper",
    password: "password123",
    name: "Shipper Example Co.",
    role: "Shipper",
    companyName: "Shipper Example Co."
  },
  {
    username: "carrier",
    password: "password123",
    name: "Carrier Express Services",
    role: "Carrier",
    companyName: "Carrier Express Services",
    certifications: ["RUTC Vigente", "Seguro Carga Total"],
    carrierProfileDetails: {
      fleet: [
        { id: "fleet1", vehicleType: 'Camión FTL', quantity: 5, capacityKg: 25000, capacityM3: 80, specialFeatures: ["GPS", "Rampa Hidráulica"] },
        { id: "fleet2", vehicleType: 'Camión Refrigerado', quantity: 2, capacityKg: 10000, capacityM3: 40, specialFeatures: ["GPS", "Control de Temperatura Avanzado"] }
      ],
      serviceAreas: "Región Metropolitana, V Región, VI Región",
      serviceTypesOffered: ["Carga General", "Carga Refrigerada", "Transporte Interurbano"],
      insurancePolicyNumber: "POL-CES-98765",
      operatingPermitIDs: "MTT-CES-001, SEREMI-SALUD-CES-002"
    }
  },
];


// For SustainabilityPage Benchmarking
export const INDUSTRY_BENCHMARKS = {
  CARRIER: { co2PerKm_kg: 0.75, emptyRunPercentage: 25, averageLoadFactor_percent: 70 },
  SHIPPER: { co2PerTonKm_kg: 0.15, onTimeDelivery_percent: 92 }
};
export const PLATFORM_AVERAGES = { // Simulated average of other users on platform
  CARRIER: { co2PerKm_kg: 0.68, emptyRunPercentage: 20, averageLoadFactor_percent: 75 },
  SHIPPER: { co2PerTonKm_kg: 0.13, onTimeDelivery_percent: 95 }
};

// LocalStorage Keys
export const LOCALSTORAGE_KEYS = {
  AUTH_TOKEN: 'smartCargoApp_authToken',
  // Data keys below are now managed by apiService and can be deprecated for frontend use
  CARGO_OFFERS: 'smartCargoApp_cargoOffers',
  VEHICLES: 'smartCargoApp_vehicles',
  SHIPMENTS: 'smartCargoApp_shipments',
  ALERTS: 'smartCargoApp_alerts',
  USER_PROFILES: 'smartCargoApp_userProfiles',
  PLATFORM_SETTINGS: 'smartCargoApp_platformSettings',
  BLOCKCHAIN_LOG: 'smartCargoApp_blockchainLog',
  OTHER_SUSTAINABILITY_INITIATIVES: 'smartCargoApp_otherSustainabilityInitiatives',
  ESG_REPORTS: 'smartCargoApp_esgReports',
  CERTIFICATIONS: 'smartCargoApp_certifications',
};
