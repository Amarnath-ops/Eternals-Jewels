import { orderService } from '@/services/user/order.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
 
const useRetryPayment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: orderService.retryPayment,
        onSuccess: (_, orderId) => {
            queryClient.invalidateQueries({ queryKey: ["order", orderId] });
            queryClient.invalidateQueries({ queryKey: ["userOrders"] });
        }
    })
}

export default useRetryPayment
