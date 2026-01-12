import Address from "../models/address.modal.js";

export const createAddress = (data) => {
    return Address.create(data);
};

export const findAddressesByUser = (userId) => {
    return Address.find({ userId }).sort({ isDefault: -1, createdAt: -1 });
};

export const findAddressById = (addressId) => {
    return Address.findById(addressId);
};

export const updateAddressById = (addressId, data) => {
    return Address.findByIdAndUpdate(addressId, data, { new: true });
};

export const deleteAddressById = (addressId) => {
    return Address.findByIdAndDelete(addressId);
};

export const clearDefaultAddresses = (userId) => {
    return Address.updateMany({ userId, isDefault: true }, { isDefault: false });
};
