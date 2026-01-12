import { ERROR_MESSAGES } from "../../constants/errorMessage.js";
import { STATUS_CODES } from "../../constants/statusCode.js";
import {
    clearDefaultAddresses,
    createAddress,
    deleteAddressById,
    findAddressById,
    findAddressesByUser,
    updateAddressById,
} from "../../repositories/address.repo.js";
import { findUserById } from "../../repositories/user.repo.js";

export const addAddressService = async (userId, payload) => {
    const user = await findUserById(userId);
    if (!user) {
        const error = new Error(ERROR_MESSAGES.USER_NOT_FOUND);
        error.statusCode = STATUS_CODES.UNAUTHORIZED;
        throw error;
    }
    if (user.isBlocked) {
        const error = new Error(ERROR_MESSAGES.USER_BLOCKED);
        error.statusCode = STATUS_CODES.FORBIDDEN;
        throw error;
    }
    const userAddresses = await findAddressesByUser(userId);
    if(userAddresses.length === 0){
        payload.isDefault = true
    }
    if(payload.isDefault){
        await clearDefaultAddresses(userId)
    }
    return createAddress({
        fullname: payload.fullname,
        phone:payload.phone,
        address:payload.address,
        state:payload.state,
        district:payload.district,
        city:payload.city,
        pincode:payload.pincode,
        landmark:payload.landmark,
        isDefault:payload.isDefault,
        userId,
    });
};

export const getUserAddressService = async (userId) => {
    const user = await findUserById(userId);
    if (!user) {
        const error = new Error(ERROR_MESSAGES.USER_NOT_FOUND);
        error.statusCode = STATUS_CODES.UNAUTHORIZED;
        throw error;
    }
    if (user.isBlocked) {
        const error = new Error(ERROR_MESSAGES.USER_BLOCKED);
        error.statusCode = STATUS_CODES.FORBIDDEN;
        throw error;
    }

    return findAddressesByUser(userId);
};

export const updateAddressService = async (userId, addressId, payload) => {
    const address = await findAddressById(addressId);
    if (!address) {
        const error = new Error(ERROR_MESSAGES.ADDRESS_NOT_FOUND);
        error.statusCode = STATUS_CODES.NOT_FOUND;
        throw error;
    }

    if (address.userId === userId) {
        const error = new Error(ERROR_MESSAGES.UNAUTHORIZED);
        error.statusCode = STATUS_CODES.UNAUTHORIZED;
        throw error;
    }
    if(address.length === 0){
        payload.isDefault=true
    }
    if(payload.isDefault){
        await clearDefaultAddresses(userId)
    }
    const updatedAddress = await updateAddressById(addressId, {
        fullname:payload.fullname,
        phone:payload.phone,
        address:payload.address,
        state:payload.state,
        district:payload.district,
        city:payload.city,
        pincode:payload.pincode,
        landmark:payload.landmark,
        isDefault:payload.isDefault
    });

    return updatedAddress;
};

export const deleteAddressService = async (userId, addressId) => {
    const address = await findAddressById(addressId);
    if (!address) {
        const error = new Error(ERROR_MESSAGES.ADDRESS_NOT_FOUND);
        error.statusCode = STATUS_CODES.NOT_FOUND;
        throw error;
    }

    if (address.userId === userId) {
        const error = new Error(ERROR_MESSAGES.UNAUTHORIZED);
        error.statusCode = STATUS_CODES.UNAUTHORIZED;
        throw error;
    }

    return deleteAddressById(addressId)
};
