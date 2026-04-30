import { NextResponse } from "next/server";
import { getTasksByRequestId } from "@/lib/data";

// GET /api/tasks/request/[requestId] - Get tasks for a request
export async function GET(
  request: Request,
  { params }: { params: Promise<{ requestId: string }> }
) {
  try {
    const { requestId } = await params;
    const reqId = parseInt(requestId);
    const requestTasks = await getTasksByRequestId(reqId);

    return NextResponse.json(requestTasks);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}