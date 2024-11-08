import axios from "axios";

const BASE_URL = "http://localhost:5000/api/v1/posts";

export const createPostAPI = async (postData) => {
  const response = await axios.post(`${BASE_URL}/create`, postData);
  return response.data;
};

export const fetchAllPostsAPI = async () => {
  const response = await axios.get(BASE_URL);
  return response.data;
};

export const fetchPostByIdAPI = async (postId) => {
  const response = await axios.get(`${BASE_URL}/${postId}`);
  return response.data;
};

export const updatePostByIdAPI = async (postData) => {
  const response = await axios.put(
    `${BASE_URL}/${postData.postId}`,
    postData.payload
  );
  return response.data;
};
export const deletePostByIdAPI = async (postId) => {
  const response = await axios.delete(`${BASE_URL}/${postId}`);
  return response.data;
};
