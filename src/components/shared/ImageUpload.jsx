import React, { useRef, useState } from "react";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

const ImageUpload = ({ initialImage, onImageChange }) => {
  const [imagePreview, setImagePreview] = useState(initialImage || null);
  const [key, setKey] = useState(Date.now());
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);

  const validateFile = (file) => {
    setError(null);

    if (!ALLOWED_FILE_TYPES.includes(file.type.toLowerCase())) {
      setError("Please upload only PNG, JPG, or JPEG files");
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("Image size should be less than 5MB");
      return false;
    }

    return true;
  };

  const handleImageChange = (file) => {
    if (!file) return;

    if (validateFile(file)) {
      const preview = URL.createObjectURL(file);
      setImagePreview(preview);
      onImageChange(file);
    } else {
      // Reset file input if validation fails
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      onImageChange(null);
    }
  };

  const handleFileInput = (event) => {
    const file = event.target.files[0];
    handleImageChange(file);
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setError(null);
    setKey(Date.now());
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onImageChange(null);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      handleImageChange(file);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Cover Image
      </label>

      {imagePreview ? (
        <div className="relative">
          <img
            src={imagePreview}
            alt="Preview"
            className="w-full h-64 object-cover rounded-lg"
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      ) : (
        <>
          <div
            ref={dropZoneRef}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`flex justify-center px-6 pt-5 pb-6 border-2 ${
              isDragging
                ? "border-blue-400 bg-blue-50"
                : error
                ? "border-red-300 bg-red-50"
                : "border-gray-300 border-dashed"
            } rounded-lg transition-colors duration-200`}
          >
            <div className="space-y-1 text-center">
              <svg
                className={`mx-auto h-12 w-12 ${
                  error ? "text-red-400" : "text-gray-400"
                }`}
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                >
                  <span>Upload a file</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    key={key}
                    ref={fileInputRef}
                    className="sr-only"
                    accept=".png,.jpg,.jpeg"
                    onChange={handleFileInput}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">
                Only PNG, JPG, or JPEG (max. 5MB)
              </p>
              {isDragging && (
                <p className="text-sm text-blue-500 font-medium">
                  Drop your image here
                </p>
              )}
            </div>
          </div>
          {error && (
            <div className="mt-2 text-sm text-red-600 flex items-center">
              <svg
                className="h-4 w-4 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ImageUpload;
