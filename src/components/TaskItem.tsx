"use client";

import { useState } from "react";

interface TaskItemProps {
  id: number;
  title: string;
  description?: string;
  xpValue: number;
  isCompleted: boolean;
  onToggle: (id: number) => void;
}

export function TaskItem({
  id,
  title,
  description,
  xpValue,
  isCompleted,
  onToggle,
}: TaskItemProps) {
  const [isChecked, setIsChecked] = useState(isCompleted);

  const handleToggle = () => {
    setIsChecked(!isChecked);
    onToggle(id);
  };

  return (
    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleToggle}
        className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className={`font-medium ${isChecked ? "line-through text-gray-500" : "text-gray-900"}`}>
            {title}
          </h4>
          <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded">
            +{xpValue} XP
          </span>
        </div>
        {description && (
          <p className={`text-sm ${isChecked ? "text-gray-400" : "text-gray-600"}`}>
            {description}
          </p>
        )}
      </div>
    </div>
  );
}