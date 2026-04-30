"use client";

import { useState, useEffect } from "react";
import { XPBar } from "@/components/XPBar";
import { DarkModeToggle } from "@/components/DarkModeToggle";

interface User {
  id: number;
  name: string;
  xp: number;
  level: number;
}

interface Request {
  id: number;
  isCompleted: boolean;
}

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [userRes, requestsRes] = await Promise.all([
          fetch("/api/user"),
          fetch("/api/requests"),
        ]);

        if (userRes.ok) {
          const userData = await userRes.json();
          setUser(userData);
        }

        if (requestsRes.ok) {
          const requestsData = await requestsRes.json();
          setRequests(requestsData);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
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

  if (!user) {
    return (
      <div className="p-4">
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          Failed to load profile
        </div>
      </div>
    );
  }

  const totalRequests = requests.length;
  const completedRequests = requests.filter(r => r.isCompleted).length;
  const xpForNextLevel = 100; // Assuming 100 XP per level

  return (
    <div className="p-4">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Profile</h1>
          <p className="text-gray-600 dark:text-gray-400">Track your progress and achievements</p>
        </div>
        <DarkModeToggle />
      </div>

      {/* User Info */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{user.name}</h2>
          <p className="text-gray-600 dark:text-gray-400">Level {user.level} Adventurer</p>
        </div>
      </div>

      {/* XP Progress */}
      <XPBar
        currentXP={user.xp}
        level={user.level}
        xpForNextLevel={xpForNextLevel}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalRequests}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Requests</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{completedRequests}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
        </div>
      </div>

      {/* Achievements Placeholder */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Achievements</h3>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <div className="text-4xl mb-2">🏆</div>
            <p>Complete more tasks to unlock achievements!</p>
          </div>
        </div>
      </div>
    </div>
  );
}