import { NextResponse } from "next/server";
import { db } from "@/db";
import { tasks, requests, users } from "@/db/schema";
import { eq } from "drizzle-orm";

// GET /api/tasks/[requestId] - Get tasks for a request
export async function GET(
  request: Request,
  { params }: { params: { requestId: string } }
) {
  try {
    const requestId = parseInt(params.requestId);
    const requestTasks = await db
      .select()
      .from(tasks)
      .where(eq(tasks.requestId, requestId));

    return NextResponse.json(requestTasks);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}

// PUT /api/tasks/[taskId] - Toggle task completion
export async function PUT(
  request: Request,
  { params }: { params: { taskId: string } }
) {
  try {
    const taskId = parseInt(params.taskId);
    const { isCompleted } = await request.json();

    // Update task
    const updatedTask = await db
      .update(tasks)
      .set({
        isCompleted: isCompleted ? 1 : 0,
        completedAt: isCompleted ? new Date() : null
      })
      .where(eq(tasks.id, taskId))
      .returning();

    if (updatedTask.length === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const task = updatedTask[0];

    // Update request completion count
    const allTasks = await db
      .select()
      .from(tasks)
      .where(eq(tasks.requestId, task.requestId!));

    const completedCount = allTasks.filter((t: any) => t.isCompleted === 1).length;

    await db.update(requests).set({
      completedTasksCount: completedCount,
      isCompleted: completedCount === allTasks.length ? 1 : 0,
      completedAt: completedCount === allTasks.length ? new Date() : null,
    }).where(eq(requests.id, task.requestId!));

    // Award XP if task was completed
    if (isCompleted) {
      const userResult = await db.select().from(users).where(eq(users.id, 1)).limit(1);
      if (userResult.length > 0) {
        const currentUser = userResult[0];
        const currentXP = currentUser.xp || 0;
        const taskXP = task.xpValue || 0;
        const newXP = currentXP + taskXP;
        const newLevel = Math.floor(newXP / 100) + 1;

        await db
          .update(users)
          .set({ xp: newXP, level: newLevel })
          .where(eq(users.id, 1));
      }
    }

    return NextResponse.json(updatedTask[0]);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}