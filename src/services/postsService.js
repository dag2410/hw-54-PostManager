import axios from "./index";

export const getPosts = () => axios.get("/posts");
export const getPostById = (id) => axios.get(`/posts/${id}`);
export const createPost = (data) => axios.post("/posts", data);
export const updatePost = (id, data) => axios.put(`/posts/${id}`, data);
export const deletePost = (id) => axios.delete(`/posts/${id}`);

export const getPostComments = (id) => axios.get(`/posts/${id}/comments`);
export const createPostComment = (postId, data) =>
  axios.post(`/posts/${postId}/comments`, data);
