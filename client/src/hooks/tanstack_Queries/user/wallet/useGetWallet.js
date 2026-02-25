import { useQuery } from '@tanstack/react-query';
import { walletService } from '@/services/user/wallet.service';

export const useGetWallet = (page = 1, limit = 5) => {
    return useQuery({
        queryKey: ['wallet', page, limit],
        queryFn: () => walletService.getWallet(page, limit),
        staleTime: 60 * 1000,
    });
};
