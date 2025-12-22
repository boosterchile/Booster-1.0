# API Reference - SmartAICargo v3

## apiService

Backend simulado que provee todas las operaciones de datos.

### Autenticación

#### `login(username: string, password: string)`
Autentica un usuario con credenciales.

**Returns**: `Promise<ApiResponse<LoginResponse>>`

**Ejemplo**:
```typescript
const response = await apiService.login('admin', 'password123');
if (response.success) {
  const { token, user } = response.data;
  // Guardar token y usuario
}
```

#### `register(userData: MockUserCredentials)`
Registra un nuevo usuario.

**Returns**: `Promise<ApiResponse<UserProfile>>`

**Ejemplo**:
```typescript
const newUser = {
  username: 'newuser',
  password: 'SecurePass123',
  name: 'John Doe',
  email: 'john@example.com',
  role: 'Shipper',
  companyName: 'ACME Corp'
};
const response = await apiService.register(newUser);
```

**Notas**:
- Shippers son activados inmediatamente (`status: 'Active'`)
- Carriers requieren aprobación (`status: 'PendingApproval'`)

---

## geminiService

Cliente para interactuar con Gemini AI.

### `generateText(prompt: string, config?: GenerateTextConfig)`
Genera texto usando Gemini AI.

**Parámetros**:
- `prompt`: String con el prompt
- `config`: Configuración opcional
  - `systemInstruction?: string`
  - `temperature?: number` (0-2)
  - `topK?: number`
  - `topP?: number`
  - `responseMimeType?: "text/plain" | "application/json"`
  - `disableThinking?: boolean`

**Returns**: `Promise<string>`

**Ejemplo**:
```typescript
const result = await geminiService.generateText(
  "Optimiza ruta de Santiago a Valparaíso",
  { 
    responseMimeType: "application/json",
    temperature: 0.7,
    disableThinking: true // Para baja latencia
  }
);
```

### `parseJsonFromGeminiResponse<T>(jsonString: string)`
Parser robusto que maneja respuestas JSON de Gemini, incluso con code fences.

**Returns**: `T | null`

**Ejemplo**:
```typescript
const response = await geminiService.generateText(prompt, { responseMimeType: "application/json" });
const data = geminiService.parseJsonFromGeminiResponse<GeminiRiskAnalysis>(response);

if (data) {
  console.log(data.risk_level);
}
```

---

## localStorageService

Servicio de persistencia con manejo de errores.

### `getData<T>(dataType: string)`
Obtiene datos del localStorage.

**Returns**: `T | null`

**Ejemplo**:
```typescript
const cargoOffers = localStorageService.getData<CargoOffer[]>('CARGO_OFFERS');
```

### `setData<T>(dataType: string, data: T)`
Guarda datos en localStorage.

**Throws**: Error si quota excedida

**Ejemplo**:
```typescript
try {
  localStorageService.setData('CARGO_OFFERS', offers);
} catch (error) {
  console.error('Storage quota exceeded');
}
```

### `getStorageInfo()`
Obtiene información de uso de localStorage.

**Returns**: `{ used, usedKB, estimatedQuota, usagePercent }`

---

## PROMPTS (prompts/index.ts)

Prompts centralizados para Gemini AI.

### ROUTE_PROMPTS

#### `optimization(origin: string, destination: string)`
```typescript
const prompt = PROMPTS.ROUTE.optimization("Santiago", "Valparaíso");
```

#### `ecoRoute(origin, destination, cargoType)`
```typescript
const prompt = PROMPTS.ROUTE.ecoRoute("Santiago", "Concepción", "Refrigerado");
```

### RISK_PROMPTS

#### `shipmentRisk(scenario: string)`
```typescript
const prompt = PROMPTS.RISK.shipmentRisk("Tormenta en ruta 68");
```

### CONSOLIDATION_PROMPTS

#### `ltlConsolidation(offers: string[])`
```typescript
const offers = ["CGO001: 500kg, Stgo->Valpo", "CGO002: 300kg, Stgo->Valpo"];
const prompt = PROMPTS.CONSOLIDATION.ltlConsolidation(offers);
```

---

## Tipos de Respuesta

### ApiResponse<T>
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}
```

### LoginResponse
```typescript
interface LoginResponse {
  token: string;
  user: UserProfile;
}
```

### GeminiRiskAnalysis
```typescript
interface GeminiRiskAnalysis {
  risk_level: 'Low' | 'Medium' | 'High';
  potential_risks: string[];
  mitigation_suggestions: string[];
}
```

---

## Hooks de React Query (Futuro)

### useCargoOffers()
```typescript
const { data, isLoading, error } = useCargoOffers();
```

### useCreateCargoOffer()
```typescript
const mutation = useCreateCargoOffer();
mutation.mutate(newOffer);
```

---

## Constantes

### NAV_ITEMS
```typescript
const NAV_ITEMS = [
  { 
    name: 'Dashboard',
    path: '/dashboard',
    icon: 'DashboardIcon',
    allowedRoles: ['Admin', 'Shipper', 'Carrier']
  },
  // ...
]
```

### LOCALSTORAGE_KEYS
```typescript
const LOCALSTORAGE_KEYS = {
  AUTH_TOKEN: 'smartCargoApp_authToken',
  CARGO_OFFERS: 'smartCargoApp_cargoOffers',
  // ...
}
```

---

## Error Handling

Todos los servicios usan try-catch y retornan resultados estructurados:

```typescript
try {
  const result = await apiService.login(username, password);
  if (!result.success) {
    // Manejar error de negocio
    console.error(result.message);
  }
} catch (error) {
  // Manejar error técnico
  console.error('Error técnico:', error);
}
```
