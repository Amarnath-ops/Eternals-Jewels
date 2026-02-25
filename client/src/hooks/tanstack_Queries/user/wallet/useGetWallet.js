import { useQuery } from '@tanstack/react-query';
import { walletService } from '@/services/user/wallet.service';

export const useGetWallet = () => {
    return useQuery({
        queryKey: ['wallet'],
        queryFn: walletService.getWallet,
        staleTime: 60 * 1000,
    });
};
