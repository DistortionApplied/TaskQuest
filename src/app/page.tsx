"use client";

import { useState, useEffect } from "react";
import { RequestCard } from "@/components/RequestCard";
import { getRequests } from "@/lib/clientData";

interface DisplayRequest {
  id: number;
  itemName: string;
  itemType: string;
  description?: string;
  completedTasksCount: number;
  requiredTasksCount: number;
  isCompleted: boolean;
}

export default function Home() {
  const [requests, setRequests] = useState<DisplayRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load requests directly from localStorage and convert to display format
    const data = getRequests().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const displayData: DisplayRequest[] = data.map(req => ({
      id: req.id,
      itemName: req.itemName,
      itemType: req.itemType,
      description: req.description,
      completedTasksCount: req.completedTasksCount,
      requiredTasksCount: req.requiredTasksCount,
      isCompleted: Boolean(req.isCompleted),
    }));

    setRequests(displayData);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="p-4">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">My Requests</h1>
        <p className="text-gray-600 dark:text-gray-400">Complete tasks to unlock your rewards</p>
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎯</div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No requests yet</h2>
          <p className="text-gray-600 dark:text-gray-400">Create your first request to start earning rewards!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <RequestCard
              key={request.id}
              id={request.id}
              itemName={request.itemName}
              itemType={request.itemType}
              description={request.description}
              completedTasks={request.completedTasksCount}
              totalTasks={request.requiredTasksCount}
              isCompleted={Boolean(request.isCompleted)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
