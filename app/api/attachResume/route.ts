import { NextResponse } from "next/server";

const GREENHOUSE_API_KEY = process.env.GREENHOUSE_API_KEY || "";
const USER_ID = 4280249007;

export async function POST(req: Request) {
  try {
    const { candidateId, resumeContent, filename } = await req.json();

    if (!candidateId || !resumeContent || !filename) {
      return NextResponse.json(
        { error: "Missing required fields: candidateId, resumeContent, or filename" },
        { status: 400 }
      );
    }

    const bodyData = {
      filename: filename,
      type: "resume",
      content: resumeContent,
      content_type: "application/pdf",
    };

    const response = await fetch(
      `https://harvest.greenhouse.io/v1/candidates/${candidateId}/attachments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(`${GREENHOUSE_API_KEY}:`).toString("base64")}`,
          "On-Behalf-Of": USER_ID.toString(),
        },
        body: JSON.stringify(bodyData),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error uploading attachment: ${errorText}`);
    }

    const responseData = await response.json();
    return NextResponse.json(
      { message: "Resume attached successfully", data: responseData },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
  }
}

