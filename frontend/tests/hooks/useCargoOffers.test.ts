import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCargoOffers, useCreateCargoOffer } from '../../hooks/queries/useCargoOffers';
import { apiService } from '../../services/apiService';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { CargoOffer } from '../../types';

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
        },
    });

    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client= { queryClient } > { children } </QueryClientProvider>
  );
};

describe('useCargoOffers', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should fetch cargo offers successfully', async () => {
        const mockOffers: CargoOffer[] = [{
            id: '1',
            origin: 'Santiago',
            destination: 'Valparaíso',
            weight: 1000,
            volume: 5,
            cargoType: 'General',
            status: 'Pending',
            shipper: 'Test Shipper',
            pickupDate: '2025-01-15',
            deliveryDate: '2025-01-16'
        }];

        vi.spyOn(apiService, 'getData').mockResolvedValue({
            success: true,
            data: mockOffers,
        });

        const { result } = renderHook(() => useCargoOffers(), {
            wrapper: createWrapper(),
        });

        expect(result.current.isLoading).toBe(true);

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(result.current.data).toEqual(mockOffers);
        expect(apiService.getData).toHaveBeenCalledWith('cargo');
    });

    it('should handle fetch errors', async () => {
        vi.spyOn(apiService, 'getData').mockResolvedValue({
            success: false,
            message: 'Failed to fetch',
        });

        const { result } = renderHook(() => useCargoOffers(), {
            wrapper: createWrapper(),
        });

        await waitFor(() => {
            expect(result.current.isError).toBe(true);
        });

        expect(result.current.error).toBeDefined();
    });
});

describe('useCreateCargoOffer', () => {
    it('should create cargo offer and invalidate cache', async () => {
        const newOffer = {
            origin: 'Santiago',
            destination: 'Concepción',
            weight: 2000,
            volume: 10,
            cargoType: 'Refrigerado' as const,
            status: 'Pending' as const,
            shipper: 'New Shipper',
            pickupDate: '2025-01-20',
            deliveryDate: '2025-01-22'
        };

        const createdOffer = { ...newOffer, id: 'new-id' };

        vi.spyOn(apiService, 'createCargoOffer').mockResolvedValue({
            success: true,
            data: createdOffer,
        });

        const { result } = renderHook(() => useCreateCargoOffer(), {
            wrapper: createWrapper(),
        });

        result.current.mutate(newOffer);

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(result.current.data).toEqual(createdOffer);
    });
});
