"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { XPBar } from "@/components/XPBar";
import { RequestCard } from "@/components/RequestCard";
import { Button } from "@/components/ui/Button";
import {
  getUserById,
  getRequests,
  createRequest,
  createTask,
  deleteRequest,
  initializeDefaultUser,
  initializeDefaultRewardCategories,
  User,
  Request,
} from "@/lib/clientData";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [showArchived, setShowArchived] = useState(false);

  useEffect(() => {
    // Initialize data
    const user = initializeDefaultUser();
    initializeDefaultRewardCategories();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(user);

    // Initialize sample requests and tasks if none exist
    const existingRequests = getRequests();
    if (existingRequests.length === 0) {
      // Create sample requests with tasks
      const sampleRequests = [
        {
          userId: 1,
          itemType: "coffee",
          itemName: "Coffee",
          description: "A nice cup of coffee",
          requiredTasksCount: 3,
          completedTasksCount: 0,
          isCompleted: 0,
        },
        {
          userId: 1,
          itemType: "beer",
          itemName: "Beer",
          description: "An ice-cold beer",
          requiredTasksCount: 3,
          completedTasksCount: 0,
          isCompleted: 0,
        },
        {
          userId: 1,
          itemType: "cigarette",
          itemName: "Cigarette",
          description: "A relaxing cigarette",
          requiredTasksCount: 2,
          completedTasksCount: 0,
          isCompleted: 0,
        },
      ];

      sampleRequests.forEach((req) => {
        const newRequest = createRequest(req);

        // Create tasks for this request
        const taskCount = req.requiredTasksCount;
        for (let i = 1; i <= taskCount; i++) {
          createTask({
            requestId: newRequest.id,
            title: `Task ${i}`,
            description: `Complete this task to earn XP`,
            xpValue: 10,
            isCompleted: 0,
          });
        }
      });
    }

    const allRequests = getRequests();
    setRequests(allRequests);
    setLoading(false);
  }, []);

  // Refresh data when page becomes visible or data is updated
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        const updatedUser = getUserById(1);
        if (updatedUser) {
          setUser(updatedUser);
        }
        const updatedRequests = getRequests();
        setRequests(updatedRequests);
      }
    };

    const handleDataUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.type === 'user') {
        console.log('User data updated on home page, refreshing');
        const updatedUser = getUserById(1);
        if (updatedUser) {
          setUser(updatedUser);
        }
      } else if (customEvent.detail?.type === 'request') {
        const updatedRequests = getRequests();
        setRequests(updatedRequests);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("dataUpdated", handleDataUpdate);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("dataUpdated", handleDataUpdate);
    };
  }, []);

  const handleDeleteRequest = (requestId: number) => {
    if (confirm("Are you sure you want to delete this request? All associated tasks will be deleted.")) {
      deleteRequest(requestId);
      const updatedRequests = getRequests();
      setRequests(updatedRequests);
      // Dispatch event to notify other components
      window.dispatchEvent(new CustomEvent('dataUpdated', {
        detail: { type: 'request' }
      }));
    }
  };

  const activeRequests = requests.filter(r => !r.isCompleted);
  const archivedRequests = requests.filter(r => r.isCompleted);

  if (loading || !user) {
    return (
      <div className="p-4">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          My Requests
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Complete tasks to unlock your rewards
        </p>
      </div>

      {/* XP Bar */}
      <XPBar
        currentXP={user.xp}
        level={user.level}
        xpForNextLevel={100}
      />

      {/* Active Requests List */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
          Active Requests
        </h2>

        {activeRequests.length === 0 && archivedRequests.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <div className="text-4xl mb-2">📋</div>
            <p>No requests yet. Create one to get started!</p>
            <Button
              onClick={() => router.push("/add")}
              className="mt-4"
            >
              + Create Request
            </Button>
          </div>
        ) : activeRequests.length === 0 ? (
          <div className="text-center py-6 text-gray-500 dark:text-gray-400">
            <p>All requests completed! 🎉</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeRequests.map((request) => (
              <RequestCard
                key={request.id}
                id={request.id}
                itemName={request.itemName}
                itemType={request.itemType}
                description={request.description}
                isCompleted={Boolean(request.isCompleted)}
                completedTasks={request.completedTasksCount}
                totalTasks={request.requiredTasksCount}
                onDelete={handleDeleteRequest}
              />
            ))}
          </div>
        )}
      </div>

      {/* Archived Requests Section */}
      {archivedRequests.length > 0 && (
        <div className="mb-6">
          <button
            onClick={() => setShowArchived(!showArchived)}
            className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <span>{showArchived ? '▼' : '▶'}</span>
            <span>Archived Requests ({archivedRequests.length})</span>
          </button>

          {showArchived && (
            <div className="mt-3 space-y-3">
              {archivedRequests.map((request) => (
                <RequestCard
                  key={request.id}
                  id={request.id}
                  itemName={request.itemName}
                  itemType={request.itemType}
                  description={request.description}
                  isCompleted={Boolean(request.isCompleted)}
                  completedTasks={request.completedTasksCount}
                  totalTasks={request.requiredTasksCount}
                  onDelete={handleDeleteRequest}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {requests.length > 0 && (
        <Button
          onClick={() => router.push("/add")}
          variant="outline"
          className="w-full"
        >
          + Create New Request
        </Button>
      )}
    </div>
  );
}