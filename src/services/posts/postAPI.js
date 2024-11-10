import qs from "qs";

import axiosInstance from "../../utils/axiosInterceptor";

export const createPostAPI = async (postData) => {
  const response = await axiosInstance.post(`/posts/create`, postData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const fetchAllPostsAPI = async (pageParam) => {
  console.log("pageParam: ", pageParam);
  // Filter out null/undefined values
  const filteredParams = Object.fromEntries(
    Object.entries({ ...pageParam, limit: 2 }).filter(
      ([_, value]) => value != null
    )
  );
  console.log("filteredParams: ", filteredParams);

  // Build query string using qs
  const queryString = qs.stringify(filteredParams, {
    skipNulls: true,
    addQueryPrefix: true, // This adds the ? automatically
  });

  const response = await axiosInstance.get(`/posts${queryString}`);
  return response.data;
};

export const fetchPostByIdAPI = async (postId) => {
  const response = await axiosInstance.get(`/posts/${postId}`);
  return response.data;
};

export const updatePostByIdAPI = async (postData) => {
  const response = await axiosInstance.put(
    `/posts/${postData.postId}`,
    postData.payload,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};
export const deletePostByIdAPI = async (postId) => {
  const response = await axiosInstance.delete(`/posts/${postId}`);
  return response.data;
};
