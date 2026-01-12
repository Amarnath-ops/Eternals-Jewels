import { ERROR_MESSAGES } from "../../constants/errorMessage.js";
import { STATUS_CODES } from "../../constants/statusCode.js";
import { countCustomers, findCustomers, findUserById, toggleBlockStatus } from "../../repositories/user.repo.js";

export const getAllCustomersService = async ({ search, page, limit, status }) => {
    const query = {
        isAdmin: false,
        $or: [{ fullname: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }],
    };
    const skip = (page - 1) * limit;
    if (status === "Active" || status === "Blocked") {
        query.isBlocked = status === "Blocked" ? true : false;
    }
    const customers = await findCustomers(query, skip, limit);
    const total = await countCustomers(query);

    return {
        customers,
        total,
        page,
        totalPages: Math.ceil(total / limit),
    };
};

export const toggleBlockUserService = async (userId)=>{
  const user = await findUserById(userId);

  if(!user || user.isAdmin){
    const error = new Error(ERROR_MESSAGES.USER_NOT_FOUND);
    error.statusCode = STATUS_CODES.NOT_FOUND
    throw error
  }

  return await toggleBlockStatus(userId)
}