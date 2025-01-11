import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config(); 


const GREENHOUSE_API_KEY = process.env.GREENHOUSE_API_KEY;
const USER_ID = 4280249007; 

async function listCandidates() {
  try {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const url = 
    `https://harvest.greenhouse.io/v1/candidates?job_id=4285367007&per_page=50&page=1&created_after=${encodeURIComponent(
      oneDayAgo
    )}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Basic ${Buffer.from(`${GREENHOUSE_API_KEY}:`).toString("base64")}`,
        "On-Behalf-Of": USER_ID.toString(),
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Greenhouse error: ${errorText}`);
    }

    const candidates = await response.json();
    console.log("Candidates:", candidates);
  } catch (error) {
    console.error("Error fetching candidates:", error);
  }
}

listCandidates();
