# SmartAICargo v4 - Hooks Guide

## React Query Hooks

Esta guía documenta todos los hooks personalizados de React Query en SmartAICargo v4.

---

## Query Hooks (Lectura de Datos)

### `useCargoOffers()`

Fetch todas las ofertas de carga con cache automático.

**Uso**:
```typescript
import { useCargoOffers } from '../hooks/queries/useCargoOffers';

const { data, isLoading, error, refetch } = useCargoOffers();
```

**Retorna**:
- `data: CargoOffer[] | undefined` - Array de ofertas
- `isLoading: boolean` - Estado de carga inicial
- `isFetching: boolean` - Re-fetching en background
- `error: Error | null` - Error si existe
- `refetch: () => void` - Forzar refetch manual

**Cache**: 5 minutos

---

### `useVehicles()`

Fetch todos los vehículos disponibles.

**Uso**:
```typescript
const { data: vehicles, isLoading } = useVehicles();
```

**Cache**: 5 minutos

---

### `useShipments()`

Fetch todos los envíos activos.

**Uso**:
```typescript
const { data: shipments, isLoading } = useShipments();
```

**Cache**: 5 minutos

---

### `useAlerts()`

Fetch todas las alertas del sistema.

**Uso**:
```typescript
const { data: alerts, isLoading } = useAlerts();
```

**Cache**: 5 minutos

---

## Mutation Hooks (Escritura de Datos)

### `useCreateCargoOffer()`

Crear una nueva oferta de carga.

**Uso**:
```typescript
import { useCreateCargoOffer } from '../hooks/queries/useCargoOffers';

const mutation = useCreateCargoOffer();

const handleCreate = (offerData) => {
  mutation.mutate(offerData, {
    onSuccess: (newOffer) => {
      console.log('Oferta creada:', newOffer);
    },
    onError: (error) => {
      console.error('Error:', error);
    },
  });
};
```

**Comportamiento**:
- Invalida automáticamente cache de `useCargoOffers`
- Trigger refetch automático después de crear

---

### `useUpdateCargoOffers()`

Actualizar ofertas con **optimistic updates**.

**Uso**:
```typescript
import { useUpdateCargoOffers } from '../hooks/queries/useCargoOffers';

const mutation = useUpdateCargoOffers();

const handleUpdate = (updatedOffers) => {
  mutation.mutate(updatedOffers);
};
```

**Optimistic Update Flow**:
1. UI se actualiza inmediatamente
2. Request al servidor
3. Si falla → Rollback automático
4. Si éxito → Cache se sincroniza

---

### `useUpdateVehicles()`

Actualizar vehículos.

**Uso**:
```typescript
const mutation = useUpdateVehicles();
mutation.mutate(updatedVehicles);
```

---

### `useUpdateShipments()`

Actualizar envíos.

**Uso**:
```typescript
const mutation = useUpdateShipments();
mutation.mutate(updatedShipments);
```

---

### `useUpdateAlerts()`

Actualizar alertas (e.g., marcar como leídas).

**Uso**:
```typescript
const mutation = useUpdateAlerts();

const markAsRead = (alertId) => {
  const updatedAlerts = alerts.map(a =>
    a.id === alertId ? { ...a, read: true } : a
  );
  mutation.mutate(updatedAlerts);
};
```

---

## Patterns Avanzados

### Loading States Combinados

```typescript
const { isLoading: loadingOffers } = useCargoOffers();
const { isLoading: loadingVehicles } = useVehicles();

const isLoading = loadingOffers || loadingVehicles;

if (isLoading) return <LoadingSpinner />;
```

### Error Handling

```typescript
const { data, error, isError } = useCargoOffers();

if (isError) {
  return <ErrorMessage message={error.message} />;
}
```

### Manual Refetch

```typescript
const { refetch } = useCargoOffers();

<button onClick={() => refetch()}>
  Refrescar
</button>
```

### Dependent Queries

```typescript
const { data: offers } = useCargoOffers();
const { data: vehicles, isLoading } = useVehicles();

// Solo usar vehicles después de que offers esté disponible
const matchedVehicles = useMemo(() => {
  if (!offers || !vehicles) return [];
  return matchVehiclesToCargo(offers, vehicles);
}, [offers, vehicles]);
```

---

## Query Keys

Cada hook usa un query key específico:

```typescript
['cargo-offers']  // useCargoOffers
['vehicles']      // useVehicles
['shipments']     // useShipments
['alerts']        // useAlerts
```

### Invalidación Manual

```typescript
import { useQueryClient } from '@tanstack/react-query';

const queryClient = useQueryClient();

// Invalidar cargo offers
queryClient.invalidateQueries({ queryKey: ['cargo-offers'] });

// Invalidar todos
queryClient.invalidateQueries();
```

---

## DevTools

React Query DevTools están disponibles en desarrollo.

**Acceso**: Esquina inferior derecha de la pantalla

**Funcionalidades**:
- Ver cache de todas las queries
- Inspeccionar estados
- Forzar invalidación
- Ver timeline de requests
- Debug de mutations

---

## Best Practices

### ✅ DO

- Usar hooks en el nivel más alto necesario
- Aprovechar cache automático
- Usar optimistic updates para mejor UX
- Manejar estados de loading explícitamente

### ❌ DON'T

- No llamar hooks condicionalmente
- No bypasear el cache sin razón
- No olvidar invalidar después de mutations
- No ignorar estados de error

---

## Ejemplos Completos

### Página con múltiples queries

```typescript
const DashboardPage = () => {
  const { data: offers, isLoading: loadingOffers } = useCargoOffers();
  const { data: vehicles, isLoading: loadingVehicles } = useVehicles();
  const { data: alerts, isLoading: loadingAlerts } = useAlerts();

  const isLoading = loadingOffers || loadingVehicles || loadingAlerts;

  if (isLoading) return <DashboardSkeleton />;

  return (
    <div>
      <CargoSection offers={offers} />
      <VehicleSection vehicles={vehicles} />
      <AlertSection alerts={alerts} />
    </div>
  );
};
```

### Crear y actualizar con feedback

```typescript
const CreateOfferForm = () => {
  const { mutate, isLoading, isError, error } = useCreateCargoOffer();

  const handleSubmit = (data) => {
    mutate(data, {
      onSuccess: () => {
        toast.success('Oferta creada exitosamente');
        navigate('/loads');
      },
      onError: (err) => {
        toast.error(err.message);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* campos */}
      <button disabled={isLoading}>
        {isLoading ? 'Creando...' : 'Crear Oferta'}
      </button>
      {isError && <FormError message={error.message} />}
    </form>
  );
};
```

---

## Troubleshooting

### Cache no se actualiza

**Problema**: Hice una mutación pero la lista no cambió.

**Solución**: Verifica que la mutation invalide el query key correcto:
```typescript
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ['cargo-offers'] });
}
```

### Requests duplicados

**Problema**: Veo múltiples requests para la misma data.

**Solución**: React Query deduplica automáticamente. Si ves duplicados:
- Verifica que uses el mismo query key
- Revisa que el componente no se remonte innecesariamente

### Error "Cannot read property 'data'"

**Problema**: `data` es undefined.

**Solución**: Siempre verifica `isLoading` antes de usar `data`:
```typescript
if (isLoading) return <LoadingSpinner />;
if (!data) return <EmptyState />;

return <DataDisplay data={data} />;
```

---

## Referencias

- [React Query Docs](https://tanstack.com/query/latest/docs/react/overview)
- [DevTools Guide](https://tanstack.com/query/latest/docs/react/devtools)
- [Optimistic Updates](https://tanstack.com/query/latest/docs/react/guides/optimistic-updates)
