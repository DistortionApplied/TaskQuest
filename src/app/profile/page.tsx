"use client";

import { useState, useEffect } from "react";
import { XPBar } from "@/components/XPBar";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { getUserById, getRequests, getXpForNextLevel } from "@/lib/clientData";

interface User {
  id: number;
  name: string;
  xp: number;
  level: number;
}

interface Request {
  id: number;
  isCompleted: number;
}

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProfileData = () => {
    try {
      // Load data directly from localStorage
      const userData = getUserById(1);
      if (userData) {
        setUser(userData);
      } else {
        // Initialize default user if none exists
        setUser({
          id: 1,
          name: "Player",
          xp: 0,
          level: 1,
        });
      }
      const requestsData = getRequests();
      setRequests(requestsData);
    } catch (error) {
      console.error('Error loading profile data:', error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadProfileData();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(false);
  }, []);

  // Refresh data when component becomes visible (user navigates back to profile)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('Profile page became visible, refreshing data');
        loadProfileData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Also refresh on focus
    const handleFocus = () => {
      console.log('Profile page focused, refreshing data');
      loadProfileData();
    };

    window.addEventListener('focus', handleFocus);

    // Listen for custom data update events
    const handleDataUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.type === 'user') {
        console.log('User data updated, refreshing profile');
        loadProfileData();
      }
    };

    window.addEventListener('dataUpdated', handleDataUpdate);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('dataUpdated', handleDataUpdate);
    };
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

  const handleClearData = () => {
    if (confirm("Are you sure you want to clear ALL data? This will reset your XP, level, requests, and tasks. This cannot be undone.")) {
      try {
        localStorage.clear();
        alert("All data has been cleared. The app will now reload.");
        window.location.href = "/requests";
      } catch (error) {
        console.error("Error clearing data:", error);
        alert("Failed to clear data.");
      }
    }
  };

  const totalRequests = requests.length;
  const completedRequests = requests.filter(r => r.isCompleted).length;
  const xpForNextLevel = getXpForNextLevel(user.level);

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

      {/* Danger Zone */}
      <div className="mt-6 mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Danger Zone</h3>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-red-200 dark:border-red-800">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Clear all app data including requests, tasks, and XP progress. This cannot be undone.
          </p>
          <button
            onClick={handleClearData}
            className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Clear All Data
          </button>
        </div>
      </div>
    </div>
  );
}