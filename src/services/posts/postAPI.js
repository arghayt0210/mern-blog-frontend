import axios from "axios";
import qs from "qs";

export const BASE_URL = "http://localhost:5000/api/v1/posts";

export const createPostAPI = async (postData) => {
  const response = await axios.post(`${BASE_URL}/create`, postData, {
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

  const response = await axios.get(`${BASE_URL}${queryString}`);
  return response.data;
};

export const fetchPostByIdAPI = async (postId) => {
  const response = await axios.get(`${BASE_URL}/${postId}`);
  return response.data;
};

export const updatePostByIdAPI = async (postData) => {
  const response = await axios.put(
    `${BASE_URL}/${postData.postId}`,
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
  const response = await axios.delete(`${BASE_URL}/${postId}`);
  return response.data;
};
