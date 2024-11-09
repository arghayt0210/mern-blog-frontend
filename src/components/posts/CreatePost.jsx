import React, { useState } from "react";
import { useFormik } from "formik";
import ReactQuill from "react-quill";
import * as Yup from "yup";

import { useMutation, useQueryClient } from "@tanstack/react-query";

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
        if (!oldData) return;

        return {
          ...oldData,
          data: [...oldData.data, data.data],
        };
      });
    },
  });

  const formik = useFormik({
    initialValues: {
      description: "",
    },
    validationSchema: Yup.object({
      description: Yup.string().required("Description is required"),
    }),
    onSubmit: (values) => {
      createPost(values);
    },
  });

  return (
    <div>
      {isPending && <p>Loading...</p>}
      {isSuccess && <p>{data.message}</p>}
      {isError && <p>{error.response.data.message}</p>}
      <form onSubmit={formik.handleSubmit}>
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
              // ["clean"],
            ],
          }}
        />
        {formik.touched.description && formik.errors.description && (
          <span>{formik.errors.description}</span>
        )}
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default CreatePost;
