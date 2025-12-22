import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../../services/apiService';
import { CargoOffer } from '../../types';

export const CARGO_OFFERS_KEY = ['cargo-offers'] as const;

/**
 * Hook to fetch all cargo offers
 * Automatically caches and revalidates data
 */
export const useCargoOffers = () => {
    return useQuery({
        queryKey: CARGO_OFFERS_KEY,
        queryFn: async () => {
            const response = await apiService.getData<CargoOffer[]>('cargo');
            if (!response.success) {
                throw new Error(response.message || 'Failed to fetch cargo offers');
            }
            return response.data!;
        },
    });
};

/**
 * Hook to create a new cargo offer
 * Automatically invalidates cache on success
 */
export const useCreateCargoOffer = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (offerData: Omit<CargoOffer, 'id'>) => {
            const response = await apiService.createCargoOffer(offerData);
            if (!response.success) {
                throw new Error(response.message || 'Failed to create cargo offer');
            }
            return response.data!;
        },
        onSuccess: () => {
            // Invalidate and refetch cargo offers
            queryClient.invalidateQueries({ queryKey: CARGO_OFFERS_KEY });
        },
    });
};

/**
 * Hook to update cargo offers with optimistic updates
 * Rolls back on error
 */
export const useUpdateCargoOffers = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (offers: CargoOffer[]) => {
            const response = await apiService.updateData('cargo', offers);
            if (!response.success) {
                throw new Error(response.message || 'Failed to update cargo offers');
            }
            return response.data!;
        },
        // Optimistic update
        onMutate: async (newOffers) => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({ queryKey: CARGO_OFFERS_KEY });

            // Snapshot the previous value
            const previousOffers = queryClient.getQueryData(CARGO_OFFERS_KEY);

            // Optimistically update to the new value
            queryClient.setQueryData(CARGO_OFFERS_KEY, newOffers);

            // Return context with snapshot
            return { previousOffers };
        },
        // Rollback on error
        onError: (_err, _newOffers, context) => {
            if (context?.previousOffers) {
                queryClient.setQueryData(CARGO_OFFERS_KEY, context.previousOffers);
            }
        },
        // Always refetch after error or success
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: CARGO_OFFERS_KEY });
        },
    });
};
