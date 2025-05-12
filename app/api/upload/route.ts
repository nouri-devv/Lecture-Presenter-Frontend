import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const apiUrl = `${BACKEND_URL}/api/file-record`;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
    }

    // Create a new FormData instance for the backend request
    const backendFormData = new FormData();
    backendFormData.append('file', file);

    // Send the file to your backend API
    const response = await fetch(apiUrl, {
      method: 'POST',
      body: backendFormData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to upload file to backend');
    }

    const result = await response.json();
    
    return NextResponse.json({ 
      message: 'File uploaded successfully',
      fileRecord: result.fileRecord 
    }, { status: 201 });

  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { message: 'Failed to upload file', error: error instanceof Error ? error.message : error }, 
      { status: 500 }
    );
  }
}