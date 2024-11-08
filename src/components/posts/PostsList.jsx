import React from "react";
import { Link } from "react-router-dom";

import { useQuery } from "@tanstack/react-query";

import { fetchAllPostsAPI } from "../../services/posts/postAPI";
import { useDeletePostMutation } from "../hooks/useDeletePostMutation";

export default function PostsList() {
  const deletePostMutation = useDeletePostMutation();
  const { data, isPending, isError, error, isSuccess } = useQuery({
    queryKey: ["posts-list"],
    queryFn: fetchAllPostsAPI,
  });

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      {data?.data?.map((post) => (
        <div key={post._id}>
          <h2>{post.title}</h2>
          <p>{post.description}</p>
          <Link to={`/posts/${post._id}`}>Edit</Link>
          <button onClick={() => deletePostMutation.mutate(post._id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
