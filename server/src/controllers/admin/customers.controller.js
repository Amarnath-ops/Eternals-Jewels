import { CONSTANTS } from "../../constants/constants.js";
import { ERROR_MESSAGES } from "../../constants/errorMessage.js";
import { STATUS_CODES } from "../../constants/statusCode.js";
import { getAllCustomersService, toggleBlockUserService } from "../../services/admin/customers.service.js";

export const getAllCustomers = async (req, res) => {
    try {
      console.log(req.query)
      const {search="" , page=1, limit= 10, status } = req.query;
      const data = await getAllCustomersService({
        search,
        page:Number(page),
        limit:Number(limit),
        status
      })

      return res.status(STATUS_CODES.OK).json({
        success:true,
        message:CONSTANTS.CUSTOMERS_FETCHED,
        data
      })
    } catch (error) {
        return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
};


export const toggleBlockUser = async (req, res) => {
    try {
      const data = await toggleBlockUserService(req.params.id)

      return res.status(STATUS_CODES.OK).json({
        success:true,
        message:CONSTANTS.CUSTOMERS_FETCHED,
        data
      })
    } catch (error) {
        return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
};
