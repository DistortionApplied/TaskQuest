"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { getUsers, createUser, switchToUser, User } from "@/lib/clientData";

interface ProfileSelectorProps {
  onProfileSelected: () => void;
}

export function ProfileSelector({ onProfileSelected }: ProfileSelectorProps) {
  const [users, setUsers] = useState<User[]>(getUsers());
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newUsername, setNewUsername] = useState("");

  const handleSelectProfile = (userId: number) => {
    switchToUser(userId);
    onProfileSelected();
  };

  const handleCreateProfile = () => {
    if (newUsername.trim()) {
      const newUser = createUser(newUsername.trim());
      setUsers(getUsers());
      setNewUsername("");
      setShowCreateForm(false);
      onProfileSelected();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newUsername.trim()) {
      handleCreateProfile();
    }
  };

  if (users.length === 0) {
    // First time user - show create profile form directly
    return (
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Create Your Profile
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Choose a username to start your gamified task journey
          </p>
        </div>

        <div className="space-y-4">
          <Input
            placeholder="Enter your username"
            value={newUsername}
            onChange={(value) => setNewUsername(value)}
            className="w-full"
          />
          <div className="space-y-2">
            <Button
              onClick={handleCreateProfile}
              className={`w-full ${!newUsername.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Start Quest
            </Button>
            {newUsername.trim() && (
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Press Enter or click Start Quest
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (showCreateForm) {
    return (
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Create New Profile
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Enter a username for the new profile
          </p>
        </div>

        <div className="space-y-4">
          <Input
            placeholder="Enter username"
            value={newUsername}
            onChange={(value) => setNewUsername(value)}
            className="w-full"
          />
          <div className="flex gap-2">
            <Button
              onClick={() => setShowCreateForm(false)}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateProfile}
              className={`flex-1 ${!newUsername.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Create
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md w-full space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Choose Your Profile
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Select an existing profile or create a new one
        </p>
      </div>

      <div className="space-y-3">
        {users.map((user) => (
          <button
            key={user.id}
            onClick={() => handleSelectProfile(user.id)}
            className="w-full p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  {user.name}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Level {user.level} • {user.xp} XP
                </div>
              </div>
            </div>
          </button>
        ))}

        <Button
          onClick={() => setShowCreateForm(true)}
          variant="outline"
          className="w-full mt-4"
        >
          + Create New Profile
        </Button>
      </div>
    </div>
  );
}