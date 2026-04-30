import { NextResponse } from "next/server";
import { getRequestById } from "@/lib/data";

// GET /api/requests/[id] - Get a single request
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const requestId = parseInt(id);
    const requestData = await getRequestById(requestId);

    if (!requestData) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    return NextResponse.json(requestData);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch request" }, { status: 500 });
  }
}