import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiUrl = process.env.FINANCIAL_API_URL;

    if (!apiUrl) {
      throw new Error("API URL is not configured");
    }

    const response = await fetch(apiUrl, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data from financial API");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch financial data" },
      { status: 500 }
    );
  }
}
