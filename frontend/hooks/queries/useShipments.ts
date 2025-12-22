import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../../services/apiService';
import { Shipment } from '../../types';

export const SHIPMENTS_KEY = ['shipments'] as const;

/**
 * Hook to fetch all shipments
 */
export const useShipments = () => {
    return useQuery({
        queryKey: SHIPMENTS_KEY,
        queryFn: async () => {
            const response = await apiService.getData<Shipment[]>('shipments');
            if (!response.success) {
                throw new Error(response.message || 'Failed to fetch shipments');
            }
            return response.data!;
        },
    });
};

/**
 * Hook to update shipments
 */
export const useUpdateShipments = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (shipments: Shipment[]) => {
            const response = await apiService.updateData('shipments', shipments);
            if (!response.success) {
                throw new Error(response.message || 'Failed to update shipments');
            }
            return response.data!;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: SHIPMENTS_KEY });
        },
    });
};
