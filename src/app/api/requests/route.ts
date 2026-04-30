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
    const { itemName, itemType, description, tasks: taskData } = await request.json();

    // Create request
    const newRequest = await db.insert(requests).values({
      userId: 1,
      itemName,
      itemType,
      description,
      requiredTasksCount: taskData.length,
      completedTasksCount: 0,
      isCompleted: 0,
    }).returning();

    // TODO: Create tasks - temporarily disabled due to Drizzle typing issues

    return NextResponse.json(newRequest[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create request" }, { status: 500 });
  }
}