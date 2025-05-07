"use client";

import { useEffect, useState } from "react";
import { FileRecord } from "@/types";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:5057";

// ✅ Reusable fetch function to get slide blob
export async function fetchSlideData(
  fileId: string,
  slideNumber: number
): Promise<Blob | null> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/file-record/${fileId}/slides/${slideNumber}`
    );

    if (!response.ok) {
      throw new Error(`Failed to load slide: ${response.statusText}`);
    }

    return await response.blob();
  } catch (err) {
    console.error("Error fetching slide:", err);
    return null;
  }
}

export default function PresentationPage() {
  const [fileRecord, setFileRecord] = useState<FileRecord | null>(null);
  const [currentSlide, setCurrentSlide] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [slideLoading, setSlideLoading] = useState(true);
  const [slideUrl, setSlideUrl] = useState<string | null>(null);

  const loadSlide = async (fileId: string, slideNumber: number) => {
    setSlideLoading(true);
    try {
      const blob = await fetchSlideData(fileId, slideNumber);
      if (!blob) throw new Error("No data returned");

      const url = URL.createObjectURL(blob);
      setSlideUrl(url);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load slide");
      setSlideUrl(null);
    } finally {
      setSlideLoading(false);
    }
  };

  useEffect(() => {
    const storedRecord = localStorage.getItem("fileRecord");
    if (storedRecord) {
      const parsedRecord: FileRecord = JSON.parse(storedRecord);
      setFileRecord(parsedRecord);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (fileRecord) {
      loadSlide(fileRecord.fileId, currentSlide);
    }
  }, [fileRecord, currentSlide]);

  useEffect(() => {
    return () => {
      if (slideUrl) {
        URL.revokeObjectURL(slideUrl);
      }
    };
  }, [slideUrl]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight" || event.key === "Space") {
        if (fileRecord && currentSlide < fileRecord.totalSlides) {
          setCurrentSlide((prev) => prev + 1);
        }
      } else if (event.key === "ArrowLeft") {
        if (currentSlide > 1) {
          setCurrentSlide((prev) => prev - 1);
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentSlide, fileRecord]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!fileRecord) {
    return (
      <div className="flex h-screen items-center justify-center">
        No presentation data found
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen flex-col bg-black">
      <div className="flex flex-1 items-center justify-center p-5 relative">
        {slideLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="text-white">Loading slide...</div>
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="text-red-500">{error}</div>
          </div>
        )}
        {slideUrl && (
          <embed
            src={slideUrl}
            type="application/pdf"
            className="h-full w-full"
          />
        )}
      </div>

      <div className="flex items-center justify-center gap-6 bg-black/80 p-5">
        <button
          onClick={() => setCurrentSlide((prev) => Math.max(1, prev - 1))}
          disabled={currentSlide <= 1}
          className="rounded bg-gray-700 px-6 py-2 text-white transition-colors hover:bg-gray-600 disabled:cursor-not-allowed disabled:bg-gray-800"
        >
          Previous
        </button>
        <span className="text-lg text-white">
          {currentSlide} / {fileRecord.totalSlides}
        </span>
        <button
          onClick={() =>
            setCurrentSlide((prev) =>
              fileRecord ? Math.min(fileRecord.totalSlides, prev + 1) : prev
            )
          }
          disabled={currentSlide >= fileRecord.totalSlides}
          className="rounded bg-gray-700 px-6 py-2 text-white transition-colors hover:bg-gray-600 disabled:cursor-not-allowed disabled:bg-gray-800"
        >
          Next
        </button>
      </div>
    </div>
  );
}
