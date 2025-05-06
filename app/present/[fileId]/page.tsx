"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { FileRecord } from "@/types";

export default function PresentationPage() {
  const { fileId } = useParams();
  const [fileRecord, setFileRecord] = useState<FileRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFileRecord = async () => {
      try {
        const response = await fetch(`/api/present/${fileId}`);
        if (response.ok) {
          const data = await response.json();
          setFileRecord(data);
        }
      } catch (error) {
        console.error("Error fetching file record:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFileRecord();
  }, [fileId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!fileRecord) {
    return <div>File not found</div>;
  }

  return (
    <div>
      <h1>Presentation: {fileRecord.fileName}</h1>
      {/* Add your presentation UI here */}
    </div>
  );
}
