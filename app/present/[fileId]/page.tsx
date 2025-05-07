"use client";

import { useEffect, useState } from "react";
import { FileRecord } from "@/types";
import { useCallback } from "react";
import { Control } from "@/components/present/Control";
import { Presenter } from "@/components/present/Presenter";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:5057";

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
  const [slideUrl, setSlideUrl] = useState<string | null>(null);

  const loadSlide = async (fileId: string, slideNumber: number) => {
    try {
      const blob = await fetchSlideData(fileId, slideNumber);
      if (!blob) throw new Error("No data returned");

      const url = URL.createObjectURL(blob);
      setSlideUrl(url);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load slide");
      setSlideUrl(null);
    }
  };

  const handleNext = useCallback(() => {
    if (fileRecord) {
      setCurrentSlide((prev) => Math.min(fileRecord.totalSlides, prev + 1));
    }
  }, [fileRecord]);

  const handlePrevious = useCallback(() => {
    setCurrentSlide((prev) => Math.max(1, prev - 1));
  }, []);

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
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="text-red-500">{error}</div>
          </div>
        )}
        {slideUrl && <Presenter slideUrl={slideUrl} />}
      </div>
      <div className="flex items-center justify-center bg-black/80 p-10">
        {fileRecord && (
          <Control
            currentSlide={currentSlide}
            totalSlides={fileRecord.totalSlides}
            onPrev={handlePrevious}
            onNext={handleNext}
          />
        )}
      </div>
    </div>
  );
}
