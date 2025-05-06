"use client";

import { useState } from "react";

interface SlideRecord {
  slideId: string;
  slideNumber: number;
  slideLocation: string;
}

interface FileRecord {
  fileId: string;
  fileName: string;
  fileLocation: string;
  fileCreatedTime: string;
  fileSlides: SlideRecord[];
}

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [fileRecord, setFileRecord] = useState<FileRecord>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please select a file first");
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await response.json();
      console.log("API Response:", data); // Add this line to debug

      if (response.ok) {
        setMessage(data.message);
        setFileRecord(data.fileRecord);
        setFile(null);
      } else {
        setMessage(data.message || data.error || "Failed to upload file.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setMessage(
        error instanceof Error ? error.message : "Error uploading file."
      );
    } finally {
      setUploading(false);
    }

    console.log(fileRecord);
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-8 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">File Upload</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="w-full p-2 border rounded-md focus:outline-none"
          disabled={uploading}
        />
        <button
          type="submit"
          disabled={uploading || !file}
          className="w-full py-2 px-4 rounded-md disabled:cursor-not-allowed transition-colors"
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>
      {message && (
        <p
          className={`mt-4 p-2 text-center rounded-md ${
            fileRecord ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
      {fileRecord && (
        <div className="mt-4 p-4 rounded-md">
          <h2 className="text-lg font-semibold">Uploaded File Details:</h2>
          <p>File ID: {fileRecord.fileId}</p>
          <p>Filename: {fileRecord.fileName}</p>
          <p>File Location: {fileRecord.fileLocation}</p>
          <p>
            Created Time:{" "}
            {new Date(fileRecord.fileCreatedTime).toLocaleString()}
          </p>
          <h3 className="text-md font-semibold mt-4">Slides:</h3>
          {fileRecord.fileSlides.map((slide) => (
            <p key={slide.slideId}>
              Slide ID: {slide.slideId}, Slide Number: {slide.slideNumber},
              Slide Location: {slide.slideLocation}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
