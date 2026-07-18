"use client";

import { ChangeEvent, useState } from "react";

type CardImageUploadProps = {
  onUploadComplete: (imageUrl: string) => void;
};

export default function CardImageUpload({
  onUploadComplete,
}: CardImageUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    setErrorMessage("");
    setSuccessMessage("");

    if (!file) {
      setSelectedFile(null);
      setPreviewUrl("");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    const maximumFileSize = 10 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      setSelectedFile(null);
      setPreviewUrl("");
      setErrorMessage("Please select a JPG, PNG, or WEBP image.");
      return;
    }

    if (file.size > maximumFileSize) {
      setSelectedFile(null);
      setPreviewUrl("");
      setErrorMessage("The image must be smaller than 10 MB.");
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  async function handleUpload() {
    if (!selectedFile) {
      setErrorMessage("Please select an image first.");
      return;
    }

    setIsUploading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("/api/upload-card-image", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "The image could not be uploaded.");
      }

      onUploadComplete(result.imageUrl);
      setSuccessMessage("Card image uploaded successfully.");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong while uploading the image.";

      setErrorMessage(message);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label
          htmlFor="card-image"
          className="mb-2 block text-sm font-semibold text-white"
        >
          Card Image
        </label>

        <input
          id="card-image"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="block w-full cursor-pointer rounded-lg border border-white/20 bg-black/30 px-4 py-3 text-sm text-white file:mr-4 file:rounded-md file:border-0 file:bg-green-700 file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-green-600"
        />

        <p className="mt-2 text-xs text-gray-400">
          Accepted formats: JPG, PNG, and WEBP. Maximum size: 10 MB.
        </p>
      </div>

      {previewUrl && (
        <div className="overflow-hidden rounded-xl border border-white/10 bg-black/20 p-4">
          <p className="mb-3 text-sm font-semibold text-white">
            Image Preview
          </p>

          <img
            src={previewUrl}
            alt="Selected card preview"
            className="mx-auto max-h-80 rounded-lg object-contain"
          />
        </div>
      )}

      <button
        type="button"
        onClick={handleUpload}
        disabled={!selectedFile || isUploading}
        className="rounded-lg bg-green-700 px-5 py-3 font-semibold text-white transition hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isUploading ? "Uploading Image..." : "Upload Card Image"}
      </button>

      {errorMessage && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {errorMessage}
        </p>
      )}

      {successMessage && (
        <p className="rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-300">
          {successMessage}
        </p>
      )}
    </div>
  );
}