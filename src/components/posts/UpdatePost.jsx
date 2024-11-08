import React from "react";
import { useFormik } from "formik";
import { useParams } from "react-router-dom";
import * as Yup from "yup";

import { useQuery } from "@tanstack/react-query";

import { fetchPostByIdAPI } from "../../services/posts/postAPI";
import { useUpdatePostMutation } from "../hooks/useUpdatePostMutation";

export default function UpdatePost() {
  const params = useParams();
  const mutation = useUpdatePostMutation();

  const { data, isPending, isError, error, isSuccess } = useQuery({
    queryKey: ["post-details", params.postId],
    queryFn: () => fetchPostByIdAPI(params.postId),
    enabled: !!params.postId, // only fetch data if postId is present
  });

  const formik = useFormik({
    initialValues: {
      title: data?.data?.title || "",
      description: data?.data?.description || "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      description: Yup.string().required("Description is required"),
    }),
    // NOTE : you can pass onSuccess and onError in mutate function
    onSubmit: (values) => {
      mutation.mutate(
        { postId: params.postId, payload: values },
        {
          onSuccess: (data) => {
            // NOTE : you can reset form here
          },
        }
      );
    },
  });

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h1>You are editing: {data?.data?.title}</h1>
      {mutation.isPending && <div>Loading...</div>}
      {mutation.isError && <div>{mutation.error.message}</div>}
      {mutation.isSuccess && <div>{mutation.data.message}</div>}
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
}
