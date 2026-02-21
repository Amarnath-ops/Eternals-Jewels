import { orderService } from '@/services/user/order.service'
import { useMutation } from '@tanstack/react-query'

const useRetryPayment = () => {
  return useMutation({
    mutationFn: orderService.retryPayment
  })
}

export default useRetryPayment
