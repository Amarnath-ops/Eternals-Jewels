import { CONSTANTS } from "../../constants/constants.js"
import { ERROR_MESSAGES } from "../../constants/errorMessage.js"
import { STATUS_CODES } from "../../constants/statusCode.js"
import { getLandingCategoriesService, getFilterCategoriesService } from "../../services/user/categories.service.js"

export const getLandingCategories = async (req,res)=>{
try {
  const categories = await getLandingCategoriesService()
  return res.status(STATUS_CODES.OK).json({
    success:true,
    message:CONSTANTS.CATEGORY_FETCHED_SUCCESSFULLY,
    data:categories
  })
} catch (error) {
  return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
    success: false,
    message:error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR
  })
}
}

export const getFilterCategories = async (req, res) => {
    try {
        const categories = await getFilterCategoriesService();
        return res.status(STATUS_CODES.OK).json({
            success: true,
            message: "Categories fetched successfully",
            data: categories,
        });
    } catch (error) {
        return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
};