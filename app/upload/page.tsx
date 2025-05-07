"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileRecord } from "@/types";

export default function UploadPage() {
  const router = useRouter();
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

      if (response.ok) {
        setMessage(data.message);
        setFileRecord(data.fileRecord);
        setFile(null);

        // Store the fileRecord in localStorage and navigate
        localStorage.setItem("fileRecord", JSON.stringify(data.fileRecord));
        router.push(`/present/${data.fileRecord.fileId}`);
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
    </div>
  );
}
