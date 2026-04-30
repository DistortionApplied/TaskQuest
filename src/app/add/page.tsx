"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { createRequest, createTask, getRewardCategories, initializeDefaultRewardCategories, RewardCategory, RewardItem } from "@/lib/clientData";

interface Task {
  id: number;
  title: string;
  description: string;
  xpValue: number;
}

export default function AddRequest() {
  const [itemName, setItemName] = useState("");
  const [selectedItem, setSelectedItem] = useState<RewardItem | null>(null);
  const [description, setDescription] = useState("");
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: "", description: "", xpValue: 10 },
  ]);
  const [categories, setCategories] = useState<RewardCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<RewardCategory | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<RewardCategory | null>(null);

  useEffect(() => {
    initializeDefaultRewardCategories();
    setCategories(getRewardCategories());
  }, []);

  const addTask = () => {
    const newTask: Task = {
      id: Date.now(),
      title: "",
      description: "",
      xpValue: 10,
    };
    setTasks([...tasks, newTask]);
  };

  const updateTask = (id: number, field: keyof Task, value: string | number) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, [field]: value } : task
    ));
  };

  const removeTask = (id: number) => {
    if (tasks.length > 1) {
      setTasks(tasks.filter(task => task.id !== id));
    }
  };

  const handleCategorySelect = (category: RewardCategory) => {
    setSelectedCategory(category);
    setSelectedSubcategory(null);
    setSelectedItem(null);
  };

  const handleSubcategorySelect = (subcategory: RewardCategory) => {
    setSelectedSubcategory(subcategory);
    setSelectedItem(null);
  };

  const handleItemSelect = (item: RewardItem) => {
    setSelectedItem(item);
  };

  const renderRewardSelection = () => {
    if (!categories.length) return null;

    return (
      <div className="space-y-4">
        {/* Main Categories */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category
          </label>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category)}
                className={`p-3 border rounded-lg text-center transition-colors ${
                  selectedCategory?.id === category.id
                    ? "border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                    : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                }`}
              >
                <div className="text-2xl mb-1">{category.icon}</div>
                <div className="text-sm">{category.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Subcategories */}
        {selectedCategory?.subcategories && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {selectedCategory.name} Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {selectedCategory.subcategories.map((subcategory) => (
                <button
                  key={subcategory.id}
                  onClick={() => handleSubcategorySelect(subcategory)}
                  className={`p-3 border rounded-lg text-center transition-colors ${
                    selectedSubcategory?.id === subcategory.id
                      ? "border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                      : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                  }`}
                >
                  <div className="text-2xl mb-1">{subcategory.icon}</div>
                  <div className="text-sm">{subcategory.name}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Items */}
        {((selectedCategory && !selectedCategory.subcategories && selectedCategory.items) ||
          (selectedSubcategory && selectedSubcategory.items)) && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Specific Item
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(selectedSubcategory?.items || selectedCategory?.items || []).map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleItemSelect(item)}
                  className={`p-3 border rounded-lg text-center transition-colors ${
                    selectedItem?.id === item.id
                      ? "border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                      : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                  }`}
                >
                  <div className="text-2xl mb-1">{item.icon}</div>
                  <div className="text-sm">{item.name}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const handleSubmit = () => {
    if (!itemName.trim() || !selectedItem || tasks.some(t => !t.title.trim())) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      // Create request directly in localStorage
      const newRequest = createRequest({
        userId: 1,
        itemName: itemName.trim(),
        itemType: selectedItem.id,
        description: description.trim() || undefined,
        requiredTasksCount: tasks.length,
        completedTasksCount: 0,
        isCompleted: 0,
      });

      // Create tasks
      for (const task of tasks) {
        createTask({
          requestId: newRequest.id,
          title: task.title.trim(),
          description: task.description.trim() || undefined,
          xpValue: task.xpValue,
          isCompleted: 0,
        });
      }

      // Reset form
      setItemName("");
      setDescription("");
      setTasks([{ id: 1, title: "", description: "", xpValue: 10 }]);
      alert("Request created successfully!");
      // Navigate back to home
      window.location.href = "/";
    } catch (error) {
      console.error("Error creating request:", error);
      alert("Failed to create request");
    }
  };

  return (
    <div className="p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Create Request</h1>
        <p className="text-gray-600 dark:text-gray-400">Set up a reward and the tasks needed to earn it</p>
      </div>

      <div className="space-y-6">
        {/* Item Details */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Reward Details</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Reward Name
              </label>
              <Input
                placeholder="e.g., Cigarette Break"
                value={itemName}
                onChange={setItemName}
              />
            </div>

            {renderRewardSelection()}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description (Optional)
              </label>
              <Textarea
                placeholder="Describe what this reward means to you..."
                value={description}
                onChange={setDescription}
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Tasks */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Required Tasks</h2>
            <Button onClick={addTask} size="sm" variant="outline">
              Add Task
            </Button>
          </div>

          <div className="space-y-4">
            {tasks.map((task, index) => (
              <div key={task.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Task {index + 1}</span>
                  {tasks.length > 1 && (
                    <button
                      onClick={() => removeTask(task.id)}
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  <Input
                    placeholder="Task title"
                    value={task.title}
                    onChange={(value) => updateTask(task.id, "title", value)}
                  />
                  <Textarea
                    placeholder="Task description (optional)"
                    value={task.description}
                    onChange={(value) => updateTask(task.id, "description", value)}
                    rows={2}
                  />
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">XP Value:</label>
                    <Input
                      type="number"
                      value={task.xpValue.toString()}
                      onChange={(value) => updateTask(task.id, "xpValue", parseInt(value) || 0)}
                      className="w-20"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pb-4">
          <Button onClick={handleSubmit} className="w-full" size="lg">
            Create Request
          </Button>
        </div>
      </div>
    </div>
  );
}