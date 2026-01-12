import { CONSTANTS } from "../../constants/constants.js";
import { ERROR_MESSAGES } from "../../constants/errorMessage.js";
import { STATUS_CODES } from "../../constants/statusCode.js";
import { addAddressService, deleteAddressService, getUserAddressService,updateAddressService } from "../../services/user/address.service.js";

export const addAddress = async (req, res) => {
    try {
        
        const address = await addAddressService(req.user._id, req.body);

        res.status(STATUS_CODES.OK).json({
            success: true,
            message: CONSTANTS.ADDRESS_ADDED,
            data: address,
        });
    } catch (error) {
        return res
            .status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR)
            .json({ message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
    }
};
export const getAddress = async (req, res) => {
    try {
        const addresses = await getUserAddressService(req.user._id);

        return res.status(STATUS_CODES.OK).json({
            success: true,
            message: CONSTANTS.ADDRESS_FETCHED,
            data: addresses,
        });
    } catch (error) {
        return res
            .status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR)
            .json({ message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
    }
};

export const updateAddress = async (req, res) => {
    try {
        const updated = await updateAddressService(req.user._id, req.params.addressId, req.body);
        return res.status(STATUS_CODES.OK).json({
            success: true,
            message: CONSTANTS.ADDRESS_UPDATED,
            data:updated
        });
    } catch (error) {
        return res
            .status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR)
            .json({ message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
    }
};
export const deleteAddress = async (req, res) => {
    try {
        await deleteAddressService(req.user._id,req.params.addressId)
        return res.status(STATUS_CODES.OK).json({
            success: true,
            message: CONSTANTS.ADDRESS_DELETED,
        });
    } catch (error) {
        return res
            .status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR)
            .json({ message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
    }
};
