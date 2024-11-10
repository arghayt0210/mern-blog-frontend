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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Edit Post</h1>
        </div>

        {/* Status Messages */}
        {mutation.isPending && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-center">
            <div className="animate-spin h-5 w-5 border-2 border-blue-600 rounded-full border-t-transparent mr-3"></div>
            <p className="text-blue-700">Updating your post...</p>
          </div>
        )}
        {mutation.isError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center">
            <svg
              className="h-5 w-5 text-red-400 mr-3"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-red-700">{mutation.error.message}</p>
          </div>
        )}
        {mutation.isSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center">
            <svg
              className="h-5 w-5 text-green-400 mr-3"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-green-700">{mutation.data.message}</p>
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
              <h2 className="text-sm font-medium text-gray-700">
                Post Content
              </h2>
            </div>
            <div className="p-4">
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
                className="min-h-[300px] bg-white"
              />
            </div>
          </div>

          {formik.touched.description && formik.errors.description && (
            <div className="rounded-lg bg-red-50 p-4">
              <span className="text-sm text-red-600">
                {formik.errors.description}
              </span>
            </div>
          )}

          <div className="flex justify-end gap-4">
            <button
              type="button"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg
                       hover:bg-gray-50 transition-colors duration-200
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              onClick={() => window.history.back()}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg
                       hover:bg-blue-700 transition-colors duration-200
                       disabled:bg-blue-300 disabled:cursor-not-allowed
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                       flex items-center space-x-2"
              disabled={mutation.isPending}
            >
              {mutation.isPending && (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              )}
              <span>{mutation.isPending ? "Updating..." : "Update Post"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
