import React, { useRef, useState } from "react";
import { useFormik } from "formik";
import ReactQuill from "react-quill";
import * as Yup from "yup";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import ImageUpload from "../shared/ImageUpload";

import { createPostAPI } from "../../services/posts/postAPI";

import "react-quill/dist/quill.snow.css";

const CreatePost = () => {
  const queryClient = useQueryClient();
  const [description, setDescription] = useState("");

  const {
    mutate: createPost,
    isPending,
    isSuccess,
    isError,
    error,
    data,
  } = useMutation({
    mutationKey: ["create-post"],
    mutationFn: createPostAPI,
    // Updating cache data (no need to refetch(revalidate))
    onSuccess: async (data) => {
      const queryFilter = { queryKey: ["posts-list"] };
      await queryClient.cancelQueries(queryFilter);
      queryClient.setQueriesData(queryFilter, (oldData) => {
        console.log("oldData: ", oldData);
        if (!oldData) return;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            data: {
              ...page.data,
              posts: [...page.data.posts, data.data],
            },
          })),
        };
      });
    },
  });

  const formik = useFormik({
    initialValues: {
      description: "",
      image: null,
    },
    validationSchema: Yup.object({
      description: Yup.string().required("Description is required"),
      image: Yup.mixed(),
    }),
    onSubmit: (values) => {
      const formData = new FormData();
      formData.append("description", values.description);
      if (values.image) {
        formData.append("image", values.image);
      }
      createPost(formData);
    },
  });

  const handleImageChange = (file) => {
    formik.setFieldValue("image", file);
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Create Blog</h1>
        <h2 className="text-xl text-gray-600">Share your thoughts</h2>
      </div>

      {isPending && (
        <div className="text-center text-gray-600 mb-4">
          <p>Creating your post...</p>
        </div>
      )}

      {isSuccess && (
        <div className="bg-green-50 text-green-600 p-4 rounded-md mb-4">
          <p>{data.message}</p>
        </div>
      )}

      {isError && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-4">
          <p>{error.response.data.message}</p>
        </div>
      )}

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        {/* Image Upload Section */}
        <ImageUpload initialImage={null} onImageChange={handleImageChange} />
        <div>
          <ReactQuill
            value={formik.values.description}
            onChange={(values) => {
              setDescription(values);
              formik.setFieldValue("description", values);
            }}
            modules={{
              toolbar: [
                [{ header: [1, 2, false] }],
                ["bold", "italic", "underline", "strike", "blockquote"],
                [{ list: "ordered" }, { list: "bullet" }],
                ["link"],
              ],
            }}
            className="bg-white rounded-lg"
          />
          {formik.touched.description && formik.errors.description && (
            <span className="text-red-500 text-sm mt-1 block">
              {formik.errors.description}
            </span>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-2 rounded-lg transition-colors duration-200"
            disabled={isPending}
          >
            {isPending ? "Creating..." : "Create Post"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
