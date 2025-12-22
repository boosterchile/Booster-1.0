import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../../services/apiService';
import { Alert } from '../../types';

export const ALERTS_KEY = ['alerts'] as const;

/**
 * Hook to fetch all alerts
 */
export const useAlerts = () => {
    return useQuery({
        queryKey: ALERTS_KEY,
        queryFn: async () => {
            const response = await apiService.getData<Alert[]>('alerts');
            if (!response.success) {
                throw new Error(response.message || 'Failed to fetch alerts');
            }
            return response.data!;
        },
    });
};

/**
 * Hook to update alerts (mark as read, etc.)
 */
export const useUpdateAlerts = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (alerts: Alert[]) => {
            const response = await apiService.updateData('alerts', alerts);
            if (!response.success) {
                throw new Error(response.message || 'Failed to update alerts');
            }
            return response.data!;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ALERTS_KEY });
        },
    });
};
