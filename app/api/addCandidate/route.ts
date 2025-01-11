import { NextResponse } from "next/server";

const GREENHOUSE_API_KEY = process.env.GREENHOUSE_API_KEY || "";
const USER_ID = 4280249007;
const JOB_ID = 4285367007;

export async function POST(req: Request) {
  try {
    const { firstName, lastName, email, phone, github, portfolio } = await req.json();

    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: "Missing required fields: firstName, lastName, or email" },
        { status: 400 }
      );
    }

    const bodyData = {
      first_name: firstName,
      last_name: lastName,
      email_addresses: [{ value: email, type: "personal" }],
      phone_numbers: phone ? [{ value: phone, type: "mobile" }] : [],
      website_addresses: [
        ...(github ? [{ value: github, type: "other" }] : []),
        ...(portfolio ? [{ value: portfolio, type: "portfolio" }] : []),
      ],
      applications: [
      {
        job_id: JOB_ID
      },
    ]
    };

    const response = await fetch("https://harvest.greenhouse.io/v1/candidates", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`${GREENHOUSE_API_KEY}:`).toString("base64")}`,
        "On-Behalf-Of": USER_ID.toString(),
      },
      body: JSON.stringify(bodyData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error creating candidate: ${errorText}`);
    }

    const candidate = await response.json();
    return NextResponse.json({ message: "Candidate created", candidate }, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
  }
}

