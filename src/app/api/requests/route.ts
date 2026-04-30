import { NextResponse } from "next/server";
import { db } from "@/db";
import { requests, tasks } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

// GET /api/requests - Get all requests
export async function GET() {
  try {
    const allRequests = await db
      .select({
        id: requests.id,
        itemName: requests.itemName,
        itemType: requests.itemType,
        description: requests.description,
        requiredTasksCount: requests.requiredTasksCount,
        completedTasksCount: requests.completedTasksCount,
        isCompleted: requests.isCompleted,
        createdAt: requests.createdAt,
      })
      .from(requests)
      .where(eq(requests.userId, 1))
      .orderBy(desc(requests.createdAt));

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
    const newRequest = await db
      .insert(requests)
      .values({
        userId: 1,
        itemName,
        itemType,
        description: description || null,
        requiredTasksCount: taskData?.length || 0,
        completedTasksCount: 0,
        isCompleted: 0,
      })
      .returning();

    // Create tasks if provided
    if (taskData && Array.isArray(taskData) && newRequest[0]) {
      for (const task of taskData) {
        await db
          .insert(tasks)
          .values({
            requestId: newRequest[0].id,
            title: task.title,
            description: task.description || null,
            xpValue: task.xpValue || 10,
            isCompleted: 0,
          })
          .returning();
      }
    }

    return NextResponse.json(newRequest[0], { status: 201 });
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