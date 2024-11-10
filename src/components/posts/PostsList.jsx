import React from "react";
import { FiTrash2 } from "react-icons/fi"; // Import trash icon
import { Link, useNavigate } from "react-router-dom";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import PostsLoadingSkeleton from "./PostsLoadingSkeleton";
import InfiniteScrollContainer from "../shared/InfiniteScrollContainer";

import { fetchAllPostsAPI } from "../../services/posts/postAPI";
import { useDeletePostMutation } from "../hooks/useDeletePostMutation";

export default function PostsList() {
  const navigate = useNavigate();
  const deletePostMutation = useDeletePostMutation();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["posts-list"],
    queryFn: ({ pageParam }) => fetchAllPostsAPI(pageParam),
    initialPageParam: { cursor: null },
    getNextPageParam: (lastPage) => {
      console.log("lastPage: ", lastPage);
      return lastPage.data.pagination.hasMore
        ? {
            cursor: lastPage.data.pagination.nextCursor,
          }
        : undefined;
    },
  });

  const posts = data?.pages.flatMap((post) => {
    return post.data?.posts || [];
  });

  if (status === "pending") {
    return <PostsLoadingSkeleton />;
  }

  if (status === "success" && !hasNextPage && !posts.length) {
    return (
      <p className="text-center text-muted-foreground">
        No one has posted anything yet.
      </p>
    );
  }

  if (status === "error") {
    return (
      <div className="text-center text-red-500 p-4">Error: {error.message}</div>
    );
  }

  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Blogs</h1>
        <h2 className="text-xl text-gray-600">Latest Articles</h2>
      </div>
      <InfiniteScrollContainer
        onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
        className="space-y-5"
      >
        {posts?.map((post) => (
          <div
            key={post._id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer"
            onClick={() => navigate(`/posts/${post._id}`)}
          >
            {post.image.path && (
              <div className="w-full h-48 overflow-hidden">
                <img
                  src={post.image.path}
                  alt="Post cover"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-6">
              <div
                className="prose prose-sm max-w-none mb-4"
                dangerouslySetInnerHTML={{ __html: post.description }}
              />
              <div className="text-sm text-gray-500 mb-3">
                {new Date(post.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>

              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    navigate(`/update-post/${post._id}`);
                  }}
                  className="text-blue-500 hover:text-blue-700 font-medium"
                >
                  Edit
                </button>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    deletePostMutation.mutate(post._id);
                  }}
                  className="text-red-500 hover:text-red-700 transition-colors duration-200"
                  aria-label="Delete post"
                >
                  <FiTrash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {isFetchingNextPage && (
          <div className="flex justify-center items-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-600">Loading more posts...</span>
          </div>
        )}
      </InfiniteScrollContainer>
    </div>
  );
}
