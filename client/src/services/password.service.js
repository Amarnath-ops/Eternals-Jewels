import { changePasswordApi } from "@/api/password.api";


export const passwordService = {
    changePassword: async (data) => {
      return changePasswordApi(data)
    },
};
