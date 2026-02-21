import { orderService } from '@/services/user/order.service'
import { useMutation } from '@tanstack/react-query'
import React from 'react'

const useVerifyPayment = () => {
  return useMutation({
    mutationFn:orderService.verifyPayment
  })
}

export default useVerifyPayment