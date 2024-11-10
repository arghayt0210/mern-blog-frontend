import { useMutation } from "@tanstack/react-query";

import { loginUserAPI } from "../../services/auth/authAPI";

export function useLoginUserMutation() {
  const mutation = useMutation({
    mutationKey: ["delete-post"],
    mutationFn: loginUserAPI,
  });

  return mutation;
}
