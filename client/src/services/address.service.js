import { addAddressApi, deleteAddressApi, getAddressApi, updateAddressApi } from "@/api/address.api"

export const  addressServices = {
  getAllAddress : async ()=>{
    return await getAddressApi()
  },
  addAddress:async (data)=>{
    return await addAddressApi(data)
  },
  updateAddress:async (addressId,data)=>{
    return await updateAddressApi(addressId,data)
  },
  deleteAddress:async (addressId)=>{
    return await deleteAddressApi(addressId)
  }
}

