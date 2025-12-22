import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../../services/apiService';
import { Vehicle } from '../../types';

export const VEHICLES_KEY = ['vehicles'] as const;

/**
 * Hook to fetch all vehicles
 */
export const useVehicles = () => {
    return useQuery({
        queryKey: VEHICLES_KEY,
        queryFn: async () => {
            const response = await apiService.getData<Vehicle[]>('vehicles');
            if (!response.success) {
                throw new Error(response.message || 'Failed to fetch vehicles');
            }
            return response.data!;
        },
    });
};

/**
 * Hook to update vehicles
 */
export const useUpdateVehicles = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (vehicles: Vehicle[]) => {
            const response = await apiService.updateData('vehicles', vehicles);
            if (!response.success) {
                throw new Error(response.message || 'Failed to update vehicles');
            }
            return response.data!;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: VEHICLES_KEY });
        },
    });
};
