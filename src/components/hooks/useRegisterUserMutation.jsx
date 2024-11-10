import { useMutation } from "@tanstack/react-query";

import { registerUserAPI } from "../../services/auth/authAPI";

export function useRegisterUserMutation(options = {}) {
  const mutation = useMutation({
    mutationKey: ["delete-post"],
    mutationFn: registerUserAPI,
    ...options,
  });

  return mutation;
}
