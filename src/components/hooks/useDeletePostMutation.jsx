import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deletePostByIdAPI } from "../../services/posts/postAPI";

export function useDeletePostMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["delete-post"],
    mutationFn: deletePostByIdAPI,
    onSuccess: async (deletedPost) => {
      const queryFilter = { queryKey: ["posts-list"] }; // not passing for-you bcz we want to delete post from every where
      await queryClient.cancelQueries(queryFilter);
      queryClient.setQueriesData(queryFilter, (oldData) => {
        if (!oldData) return;
        return {
          ...oldData,
          data: oldData.data.filter(
            (post) => post._id !== deletedPost.data._id
          ),
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
