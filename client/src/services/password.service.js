import { changePasswordApi } from "@/api/users/password.api";


export const passwordService = {
    changePassword: async (data) => {
      return changePasswordApi(data)
    },
};
