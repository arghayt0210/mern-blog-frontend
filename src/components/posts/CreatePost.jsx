import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPostAPI } from "../../services/posts/postAPI";

const CreatePost = () => {
  const queryClient = useQueryClient();

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
      title: "",
      description: "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
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
      {isError && <p>{error.message}</p>}
      <form onSubmit={formik.handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Enter Title"
          {...formik.getFieldProps("title")}
        />
        {formik.touched.title && formik.errors.title && (
          <span>{formik.errors.title}</span>
        )}
        <input
          type="text"
          name="description"
          placeholder="Enter Description"
          {...formik.getFieldProps("description")}
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
