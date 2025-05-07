import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:5057";

export async function GET(
  request: NextRequest,
  { params }: { params: { fileId: string; slideNumber: string } }
) {
  try {
    console.log(`API_BASE_URL: ${API_BASE_URL}`);
    console.log(`Fetching slide ${params.slideNumber} for file ${params.fileId}`);

    if (!params.fileId || !params.slideNumber) {
      console.error('Missing parameters:', { fileId: params.fileId, slideNumber: params.slideNumber });
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const url = `${API_BASE_URL}/api/file-record/${params.fileId}/slides/${params.slideNumber}`;
    console.log('Making request to:', url);

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/pdf',
      }
    }).catch(error => {
      console.error('Fetch error:', error);
      throw new Error(`Connection error: ${error.message}`);
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error: ${response.status} - ${errorText}`);
      return NextResponse.json(
        { 
          error: "Failed to fetch slide",
          details: errorText,
          status: response.status 
        },
        { status: response.status }
      );
    }

    const arrayBuffer = await response.arrayBuffer();
    console.log('Received array buffer size:', arrayBuffer.byteLength);

    if (!arrayBuffer || arrayBuffer.byteLength === 0) {
      console.error('Empty response received from API');
      return NextResponse.json(
        { error: "Empty response received from API" },
        { status: 404 }
      );
    }

    const buffer = Buffer.from(arrayBuffer);
    const response2 = new NextResponse(buffer);
    response2.headers.set("Content-Type", "application/pdf");
    console.log('Sending response with PDF content');
    return response2;
  } catch (error) {
    console.error("Error fetching slide:", error);
    if (error instanceof Error) {
      console.error('Error stack:', error.stack);
    }
    return NextResponse.json(
      { 
        error: "Internal server error",
        details: error instanceof Error ? error.message : 'Unknown error',
        url: `${API_BASE_URL}/api/file-record/${params.fileId}/slides/${params.slideNumber}`
      },
      { status: 500 }
    );
  }
}