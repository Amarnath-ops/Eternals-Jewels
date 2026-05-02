import { orderService } from '@/services/user/order.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'

const useVerifyPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: orderService.verifyPayment,
    onSuccess: (_, variables) => {
      const orderId = variables.orderId;
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
      queryClient.invalidateQueries({ queryKey: ["userOrders"] });
    }
  })
}

export default useVerifyPayment