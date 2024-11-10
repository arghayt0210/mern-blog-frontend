import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useQuery } from "@tanstack/react-query";

import { fetchPostByIdAPI } from "../../services/posts/postAPI";

export default function PostDetails() {
  const params = useParams();

  const { data, isPending, isError, error, isSuccess } = useQuery({
    queryKey: ["post-details", params.postId],
    queryFn: () => fetchPostByIdAPI(params.postId),
    enabled: !!params.postId, // only fetch data if postId is present,
  });

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="p-8 bg-white rounded-xl shadow-lg">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4 text-center font-medium">
            Loading post...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
          <div className="bg-red-50 rounded-lg p-4 mb-4">
            <div className="flex">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">
                  {error.response.data.message}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <article className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Post Header */}
          <div className="px-6 py-4">
            {/* <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {data.data.title}
            </h1> */}
            <div className="flex items-center text-gray-500 text-sm">
              <span>{new Date(data.data.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Post Image */}
          {data.data.image.path && (
            <div className="w-full h-96 overflow-hidden">
              <img
                src={data.data.image.path}
                alt="Post cover"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Post Content */}
          <div className="px-6 py-4">
            <div
              className="text-gray-700 text-lg leading-relaxed"
              dangerouslySetInnerHTML={{ __html: data.data.description }}
            />
          </div>
        </article>
      </div>
    </div>
  );
}
