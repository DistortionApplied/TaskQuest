import { NextResponse } from "next/server";
import { getTasks, updateTask, getTasksByRequestId, getRequests, updateRequest, getUserById, updateUser } from "@/lib/data";

// PUT /api/tasks/[taskId] - Toggle task completion
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const { taskId } = await params;
    const taskIdNum = parseInt(taskId);
    const { isCompleted } = await request.json();
    const tasks = await getTasks();
    const taskIndex = tasks.findIndex(t => t.id === taskIdNum);

    if (taskIndex === -1) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const task = tasks[taskIndex];

    // Update task
    const updatedTask = {
      ...task,
      isCompleted: isCompleted ? 1 : 0,
      completedAt: isCompleted ? new Date().toISOString() : undefined,
    };

    await updateTask(updatedTask);

    // Update request completion count
    const allTasks = await getTasksByRequestId(task.requestId);
    const completedCount = allTasks.filter(t => t.isCompleted === 1).length;

    const allRequests = await getRequests();
    const requestIndex = allRequests.findIndex(r => r.id === task.requestId);

    if (requestIndex !== -1) {
      const currentRequest = allRequests[requestIndex];
      const updatedRequest = {
        ...currentRequest,
        completedTasksCount: completedCount,
        isCompleted: completedCount === allTasks.length ? 1 : 0,
        completedAt: completedCount === allTasks.length ? new Date().toISOString() : currentRequest.completedAt,
      };
      await updateRequest(updatedRequest);
    }

    // Award XP if task was completed
    if (isCompleted) {
      const user = await getUserById(1);
      if (user) {
        const currentXP = user.xp || 0;
        const taskXP = task.xpValue || 0;
        const newXP = currentXP + taskXP;
        const newLevel = Math.floor(newXP / 100) + 1;

        await updateUser({
          ...user,
          xp: newXP,
          level: newLevel,
        });
      }
    }

    return NextResponse.json(updatedTask);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}