import { NextResponse } from "next/server";
import { getRequests, createRequest, createTask } from "@/lib/data";

// GET /api/requests - Get all requests
export async function GET() {
  try {
    const allRequests = await getRequests();
    // Sort by createdAt descending (newest first)
    allRequests.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json(allRequests);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch requests" }, { status: 500 });
  }
}

// POST /api/requests - Create new request
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { itemName, itemType, description, tasks: taskData } = body;

    if (!itemName || !itemType) {
      return NextResponse.json(
        { error: "itemName and itemType are required" },
        { status: 400 }
      );
    }

    // Create request
    const newRequest = await createRequest({
      userId: 1,
      itemName,
      itemType,
      description: description || undefined,
      requiredTasksCount: taskData?.length || 0,
      completedTasksCount: 0,
      isCompleted: 0,
    });

    // Create tasks if provided
    if (taskData && Array.isArray(taskData)) {
      for (const task of taskData) {
        await createTask({
          requestId: newRequest.id,
          title: task.title,
          description: task.description || undefined,
          xpValue: task.xpValue || 10,
          isCompleted: 0,
        });
      }
    }

    return NextResponse.json(newRequest, { status: 201 });
  } catch (error) {
    console.error("Error creating request:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to create request";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}