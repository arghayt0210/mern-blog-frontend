import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updatePostByIdAPI } from "../../services/posts/postAPI";

export function useUpdatePostMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["update-post"],
    mutationFn: updatePostByIdAPI,
    onSuccess: async (updatedPost) => {
      const queryFilter = { queryKey: ["post-details", updatedPost.data._id] }; // not passing for-you bcz we want to delete post from every where
      await queryClient.cancelQueries(queryFilter);
      queryClient.setQueriesData(queryFilter, (oldData) => {
        if (!oldData) return;
        return {
          ...oldData,
          data: updatedPost.data,
        };
      });

      // toast({
      //   description: "Post deleted",
      // });
      // if (pathname === `/posts/${deletedPost.id}`) {
      //   router.push(`/users/${deletedPost.user.username}`);
      // }
    },
    onError: (error) => {
      console.error(error.response.data.message);
      //   toast({
      //     variant: "destructive",
      //     description: "Failed to delete post. Please try again!",
      //   });
    },
  });

  return mutation;
}
