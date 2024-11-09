import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import ReactQuill from "react-quill";
import { useParams } from "react-router-dom";
import * as Yup from "yup";

import { useQuery } from "@tanstack/react-query";

import { fetchPostByIdAPI } from "../../services/posts/postAPI";
import { useUpdatePostMutation } from "../hooks/useUpdatePostMutation";

import "react-quill/dist/quill.snow.css";

export default function UpdatePost() {
  const params = useParams();
  const mutation = useUpdatePostMutation();
  const [description, setDescription] = useState("");

  const { data, isPending, isError, error, isSuccess } = useQuery({
    queryKey: ["post-details", params.postId],
    queryFn: () => fetchPostByIdAPI(params.postId),
    enabled: !!params.postId, // only fetch data if postId is present,
  });

  useEffect(() => {
    if (data?.data) {
      setDescription(data?.data?.description);
    }
  }, [data?.data]);

  const formik = useFormik({
    initialValues: {
      description: data?.data?.description || "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
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
    return <div>{error.response.data.message}</div>;
  }

  return (
    <div>
      <h1>You are editing: {data?.data?.title}</h1>
      {mutation.isPending && <div>Loading...</div>}
      {mutation.isError && <div>{mutation.error.message}</div>}
      {mutation.isSuccess && <div>{mutation.data.message}</div>}
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
}
