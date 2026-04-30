"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { TaskItem } from "@/components/TaskItem";
import { Button } from "@/components/ui/Button";

interface Task {
  id: number;
  title: string;
  description?: string;
  xpValue: number;
  isCompleted: number;
}

interface Request {
  id: number;
  itemName: string;
  itemType: string;
  description?: string;
  isCompleted: boolean;
}

export default function RequestDetail() {
  const params = useParams();
  const requestId = params.id as string;

  const [request, setRequest] = useState<Request | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [requestRes, tasksRes] = await Promise.all([
          fetch(`/api/requests/${requestId}`),
          fetch(`/api/tasks/request/${requestId}`),
        ]);

        if (requestRes.ok) {
          const requestData = await requestRes.json();
          setRequest(requestData);
        }

        if (tasksRes.ok) {
          const tasksData = await tasksRes.json();
          setTasks(tasksData);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    }

    if (requestId) {
      fetchData();
    }
  }, [requestId]);

  const handleTaskToggle = async (taskId: number) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isCompleted: !tasks.find(t => t.id === taskId)?.isCompleted,
        }),
      });

      if (response.ok) {
        // Refresh data
        const [requestRes, tasksRes] = await Promise.all([
          fetch(`/api/requests/${requestId}`),
          fetch(`/api/tasks/request/${requestId}`),
        ]);

        if (requestRes.ok) {
          const requestData = await requestRes.json();
          setRequest(requestData);
        }

        if (tasksRes.ok) {
          const tasksData = await tasksRes.json();
          setTasks(tasksData);
        }
      }
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const getItemIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "cigarette":
        return "🚬";
      case "beer":
        return "🍺";
      case "computer_time":
        return "💻";
      default:
        return "🎁";
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="p-4">
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          Request not found
        </div>
      </div>
    );
  }

  const completedTasks = tasks.filter(t => t.isCompleted).length;
  const totalTasks = tasks.length;

  return (
    <div className="p-4">
      <div className="mb-6">
        <Button
          onClick={() => window.history.back()}
          variant="outline"
          size="sm"
          className="mb-4"
        >
          ← Back
        </Button>

        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{getItemIcon(request.itemType)}</span>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{request.itemName}</h1>
            {request.description && (
              <p className="text-gray-600 dark:text-gray-400 mt-1">{request.description}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <span>Tasks: {completedTasks}/{totalTasks}</span>
          {request.isCompleted && (
            <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-xs">
              Completed
            </span>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Tasks</h2>

        {tasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No tasks for this request
          </div>
        ) : (
          tasks.map((task) => (
            <TaskItem
              key={task.id}
              id={task.id}
              title={task.title}
              description={task.description}
              xpValue={task.xpValue}
              isCompleted={Boolean(task.isCompleted)}
              onToggle={handleTaskToggle}
            />
          ))
        )}
      </div>

      {request.isCompleted && (
        <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
          <div className="text-center">
            <div className="text-4xl mb-2">🎉</div>
            <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-1">
              Congratulations!
            </h3>
            <p className="text-green-700 dark:text-green-300">
              You&apos;ve completed all tasks! Enjoy your {request.itemName.toLowerCase()}.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}