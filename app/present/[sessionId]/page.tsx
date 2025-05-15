"use client";

import { useEffect, useState } from "react";
import { Session } from "@/types";
import { useCallback } from "react";
import { Control } from "@/components/present/Control";
import { Presenter } from "@/components/present/Presenter";

const API_BASE_URL = "https://localhost:7017";

export async function fetchSlide(
  sessionId: string,
  slideNumber: number
): Promise<Blob | null> {
  const response = await fetch(
    `${API_BASE_URL}/api/slides/${sessionId}/slide/${slideNumber}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to load slide: ${response.statusText}`);
  }

  return await response.blob();
}

export async function fetchAudio(
  sessionId: string,
  audioNumber: number
): Promise<Blob | null> {
  const response = await fetch(
    `${API_BASE_URL}/api/audios/${sessionId}/audio/${audioNumber}`,
    {
      method: "GET",
      credentials: "include",
    }
  );
  if (!response.ok) {
    throw new Error(`Failed to load audio: ${response.statusText}`);
  }
  return await response.blob();
}

export default function PresentationPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [currentSlide, setCurrentSlide] = useState(1);
  const [currentAudio, setCurrentAudio] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [slideUrl, setSlideUrl] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const loadSlide = async (sessionId: string, slideNumber: number) => {
    try {
      const slideBlob = await fetchSlide(sessionId, slideNumber);
      if (!slideBlob) throw new Error("No data returned");

      const url = URL.createObjectURL(slideBlob);
      setSlideUrl(url);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load slide");
      setSlideUrl(null);
    }
  };

  const handleAudio = async (sessionId: string, audioNumber: number) => {
    try {
      const audioBlob = await fetchAudio(sessionId, audioNumber);
      if (!audioBlob) throw new Error("No data returned");

      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load audio");
      setAudioUrl(null);
    }
  };

  const handleNext = useCallback(() => {
    if (session) {
      setCurrentSlide((prev) => Math.min(session.totalSlides, prev + 1));
      setCurrentAudio((prev) => Math.min(session.totalSlides, prev + 1));
    }
  }, [session]);

  const handlePrevious = useCallback(() => {
    setCurrentSlide((prev) => Math.max(1, prev - 1));
    setCurrentAudio((prev) => Math.max(1, prev - 1));
  }, []);

  useEffect(() => {
    const storedRecord = localStorage.getItem("session");
    if (storedRecord) {
      const parsedRecord: Session = JSON.parse(storedRecord);
      setSession(parsedRecord);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (session) {
      loadSlide(session.sessionId, currentSlide);
      handleAudio(session.sessionId, currentSlide);
    }
  }, [session, currentSlide]);

  useEffect(() => {
    return () => {
      if (slideUrl) {
        URL.revokeObjectURL(slideUrl);
      }
    };
  }, [slideUrl]);

  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!session) {
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
        {session && (
          <Control
            currentSlide={currentSlide}
            currentAudio={currentAudio}
            totalSlides={session.totalSlides}
            onPrev={handlePrevious}
            onNext={handleNext}
            audioUrl={audioUrl}
          />
        )}
      </div>
    </div>
  );
}
