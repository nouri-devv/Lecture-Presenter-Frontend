"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Session } from "@/types";

const API_BASE_URL = "https://localhost:7017";

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [session, setSession] = useState<Session>();

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

      const response = await fetch(`${API_BASE_URL}/api/new-session`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await response.json();
      console.log("Response data:", data);

      if (response.ok) {
        setMessage(data.message);
        setSession(data);
        setFile(null);

        // Store the fileRecord in localStorage and navigate
        localStorage.setItem("session", JSON.stringify(data));
        router.push(`/present/${data.sessionId}`);
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
            session ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
