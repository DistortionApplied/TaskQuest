// Client-side data utilities using localStorage

export interface User {
  id: number;
  name: string;
  xp: number;
  level: number;
  createdAt: string;
}

export interface Request {
  id: number;
  userId: number;
  itemType: string;
  itemName: string;
  description?: string;
  requiredTasksCount: number;
  completedTasksCount: number;
  isCompleted: number;
  createdAt: string;
  completedAt?: string;
}

export interface Task {
  id: number;
  requestId: number;
  title: string;
  description?: string;
  xpValue: number;
  isCompleted: number;
  createdAt: string;
  completedAt?: string;
}

export interface Reward {
  id: number;
  userId: number;
  type: string;
  description: string;
  unlockedAt: string;
}

// Storage keys
const STORAGE_KEYS = {
  users: 'gamified_app_users',
  requests: 'gamified_app_requests',
  tasks: 'gamified_app_tasks',
  rewards: 'gamified_app_rewards',
  rewardCategories: 'gamified_app_reward_categories',
};

// Reward category types
export interface RewardItem {
  id: string;
  name: string;
  icon: string;
}

export interface RewardCategory {
  id: string;
  name: string;
  icon: string;
  subcategories?: RewardCategory[];
  items?: RewardItem[];
}

// Generic storage functions
function getFromStorage<T>(key: string): T[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(key);
    if (!data) return [];

    const parsed = JSON.parse(data);
    // Ensure we return an array
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error);
    // Clear corrupted data
    try {
      localStorage.removeItem(key);
    } catch (clearError) {
      console.error('Error clearing corrupted data:', clearError);
    }
    return [];
  }
}

function saveToStorage<T>(key: string, data: T[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving to localStorage:`, error);
  }
}

// Default reward categories
const DEFAULT_REWARD_CATEGORIES: RewardCategory[] = [
  {
    id: 'smoke',
    name: 'Smoke',
    icon: '🚬',
    items: [
      { id: 'cigarette', name: 'Cigarette', icon: '🚬' },
      { id: 'weed', name: 'Weed', icon: '🌿' }
    ]
  },
  {
    id: 'drink',
    name: 'Drink',
    icon: '🍺',
    subcategories: [
      {
        id: 'hot',
        name: 'Hot',
        icon: '☕',
        items: [
          { id: 'coffee', name: 'Coffee', icon: '☕' },
          { id: 'tea', name: 'Tea', icon: '🍵' }
        ]
      },
      {
        id: 'cold',
        name: 'Cold',
        icon: '🧊',
        items: [
          { id: 'beer', name: 'Beer', icon: '🍺' },
          { id: 'ginger_ale', name: 'Ginger Ale', icon: '🥤' },
          { id: 'gin_and_tonic', name: 'Gin and Tonic', icon: '🍸' },
          { id: 'iced_tea', name: 'Iced Tea', icon: '🧊' }
        ]
      }
    ]
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    icon: '🎮',
    subcategories: [
      {
        id: 'computer',
        name: 'Computer',
        icon: '💻',
        items: [
          { id: 'computer_time', name: 'Computer Time', icon: '💻' }
        ]
      },
      {
        id: 'music',
        name: 'Music',
        icon: '🎵',
        subcategories: [
          {
            id: 'live',
            name: 'Live',
            icon: '🎤',
            items: [
              { id: 'live_music', name: 'Live Music', icon: '🎤' }
            ]
          },
          {
            id: 'playlist',
            name: 'Playlist',
            icon: '🎵',
            items: [
              { id: 'playlist_music', name: 'Playlist', icon: '🎵' }
            ]
          },
          {
            id: 'other_music',
            name: 'Other',
            icon: '🎼',
            items: [
              { id: 'other_music', name: 'Other Music', icon: '🎼' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'chores',
    name: 'Chores',
    icon: '🧹',
    subcategories: [
      {
        id: 'housework',
        name: 'Housework',
        icon: '🏠',
        subcategories: [
          {
            id: 'indoors',
            name: 'Indoors',
            icon: '🏡',
            items: [
              { id: 'dishes', name: 'Dishes', icon: '🍽️' },
              { id: 'bathroom', name: 'Bathroom', icon: '🛁' },
              { id: 'bedroom', name: 'Bedroom', icon: '🛏️' },
              { id: 'dog_room', name: 'Dog Room', icon: '🐕' },
              { id: 'indoors_custom', name: 'Custom', icon: '✨' }
            ]
          },
          {
            id: 'outdoors',
            name: 'Outdoors',
            icon: '🌳',
            items: [
              { id: 'weeding', name: 'Weeding', icon: '🌱' },
              { id: 'car_wash', name: 'Car Wash', icon: '🚗' },
              { id: 'lawn_care', name: 'Lawn Care', icon: '🌿' },
              { id: 'outdoors_custom', name: 'Custom', icon: '✨' }
            ]
          }
        ]
      },
      {
        id: 'errands',
        name: 'Errands',
        icon: '🛒',
        items: [
          { id: 'grocery_store', name: 'Grocery Store', icon: '🛒' },
          { id: 'concord_stuff', name: 'Concord Stuff', icon: '📦' },
          { id: 'ma_run', name: 'MA Run', icon: '🚗' },
          { id: 'errands_other', name: 'Other', icon: '📝' }
        ]
      }
    ]
  },
  {
    id: 'work',
    name: 'Work',
    icon: '💼',
    subcategories: [
      {
        id: 'custom_work',
        name: 'Custom',
        icon: '✨',
        items: [
          { id: 'custom_work_item', name: 'Custom Work', icon: '✨' }
        ]
      }
    ]
  }
];

// Users
export function getUsers(): User[] {
  return getFromStorage<User>(STORAGE_KEYS.users);
}

export function getUserById(id: number): User | undefined {
  const users = getUsers();
  return users.find(user => user.id === id);
}

export function updateUser(user: User): void {
  const users = getUsers();
  const index = users.findIndex(u => u.id === user.id);
  if (index !== -1) {
    users[index] = user;
    saveToStorage(STORAGE_KEYS.users, users);
  }
}

export function initializeDefaultUser(): User {
  const existingUsers = getUsers();
  if (existingUsers.length > 0) {
    return existingUsers[0];
  }

  const defaultUser: User = {
    id: 1,
    name: "Player",
    xp: 0,
    level: 1,
    createdAt: new Date().toISOString(),
  };

  saveToStorage(STORAGE_KEYS.users, [defaultUser]);
  return defaultUser;
}

// Requests
export function getRequests(): Request[] {
  return getFromStorage<Request>(STORAGE_KEYS.requests);
}

export function getRequestById(id: number): Request | undefined {
  const requests = getRequests();
  return requests.find(request => request.id === id);
}

export function createRequest(request: Omit<Request, 'id' | 'createdAt'>): Request {
  const requests = getRequests();
  const newId = Math.max(0, ...requests.map(r => r.id)) + 1;
  const newRequest: Request = {
    ...request,
    id: newId,
    createdAt: new Date().toISOString(),
  };
  requests.push(newRequest);
  saveToStorage(STORAGE_KEYS.requests, requests);
  return newRequest;
}

export function updateRequest(request: Request): void {
  const requests = getRequests();
  const index = requests.findIndex(r => r.id === request.id);
  if (index !== -1) {
    requests[index] = request;
    saveToStorage(STORAGE_KEYS.requests, requests);
  }
}

export function deleteRequest(id: number): void {
  // Delete the request
  const requests = getRequests().filter(r => r.id !== id);
  saveToStorage(STORAGE_KEYS.requests, requests);

  // Delete all associated tasks
  const tasks = getTasks().filter(t => t.requestId !== id);
  saveToStorage(STORAGE_KEYS.tasks, tasks);
}

// Tasks
export function getTasks(): Task[] {
  return getFromStorage<Task>(STORAGE_KEYS.tasks);
}

export function getTasksByRequestId(requestId: number): Task[] {
  const tasks = getTasks();
  return tasks.filter(task => task.requestId === requestId);
}

export function createTask(task: Omit<Task, 'id' | 'createdAt'>): Task {
  const tasks = getTasks();
  const newId = Math.max(0, ...tasks.map(t => t.id)) + 1;
  const newTask: Task = {
    ...task,
    id: newId,
    createdAt: new Date().toISOString(),
  };
  tasks.push(newTask);
  saveToStorage(STORAGE_KEYS.tasks, tasks);
  return newTask;
}

export function updateTask(task: Task): void {
  const tasks = getTasks();
  const index = tasks.findIndex(t => t.id === task.id);
  if (index !== -1) {
    tasks[index] = task;
    saveToStorage(STORAGE_KEYS.tasks, tasks);
  }
}

// Rewards
export function getRewards(): Reward[] {
  return getFromStorage<Reward>(STORAGE_KEYS.rewards);
}

export function createReward(reward: Omit<Reward, 'id' | 'unlockedAt'>): Reward {
  const rewards = getRewards();
  const newId = Math.max(0, ...rewards.map(r => r.id)) + 1;
  const newReward: Reward = {
    ...reward,
    id: newId,
    unlockedAt: new Date().toISOString(),
  };
  rewards.push(newReward);
  saveToStorage(STORAGE_KEYS.rewards, rewards);
  return newReward;
}

// Reward Categories
export function getRewardCategories(): RewardCategory[] {
  const categories = getFromStorage<RewardCategory>(STORAGE_KEYS.rewardCategories);
  // Return default categories if none exist
  return categories.length > 0 ? categories : DEFAULT_REWARD_CATEGORIES;
}

export function saveRewardCategories(categories: RewardCategory[]): void {
  saveToStorage(STORAGE_KEYS.rewardCategories, categories);
}

export function initializeDefaultRewardCategories(): void {
  const existing = getFromStorage<RewardCategory>(STORAGE_KEYS.rewardCategories);
  if (existing.length === 0) {
    saveToStorage(STORAGE_KEYS.rewardCategories, DEFAULT_REWARD_CATEGORIES);
  } else {
    // Merge new categories with existing ones
    const mergedCategories = mergeRewardCategories(existing, DEFAULT_REWARD_CATEGORIES);
    saveToStorage(STORAGE_KEYS.rewardCategories, mergedCategories);
  }
}

// Helper function to merge new categories with existing ones (deep merge)
function mergeRewardCategories(existing: RewardCategory[], defaults: RewardCategory[]): RewardCategory[] {
  const result = [...existing];
  const existingIds = new Set(existing.map(cat => cat.id));

  // Add any new top-level categories that don't exist
  for (const defaultCat of defaults) {
    if (!existingIds.has(defaultCat.id)) {
      result.push(defaultCat);
    } else {
      // Deep merge: update existing category's subcategories and items
      const existingIndex = result.findIndex(cat => cat.id === defaultCat.id);
      if (existingIndex !== -1) {
        result[existingIndex] = mergeCategory(result[existingIndex], defaultCat);
      }
    }
  }

  return result;
}

// Recursively merge a single category with its default version
function mergeCategory(existing: RewardCategory, defaultCat: RewardCategory): RewardCategory {
  const merged: RewardCategory = { ...existing };

  // Merge subcategories if both have them
  if (defaultCat.subcategories) {
    const existingSubs = existing.subcategories || [];
    const existingSubIds = new Set(existingSubs.map(s => s.id));
    const mergedSubs = [...existingSubs];

    for (const defaultSub of defaultCat.subcategories) {
      if (!existingSubIds.has(defaultSub.id)) {
        // New subcategory — add it
        mergedSubs.push(defaultSub);
      } else {
        // Existing subcategory — recurse to merge its children
        const subIndex = mergedSubs.findIndex(s => s.id === defaultSub.id);
        if (subIndex !== -1) {
          mergedSubs[subIndex] = mergeCategory(mergedSubs[subIndex], defaultSub);
        }
      }
    }

    merged.subcategories = mergedSubs;
  }

  // Merge items if both have them
  if (defaultCat.items) {
    const existingItems = existing.items || [];
    const existingItemIds = new Set(existingItems.map(i => i.id));
    const mergedItems = [...existingItems];

    for (const defaultItem of defaultCat.items) {
      if (!existingItemIds.has(defaultItem.id)) {
        mergedItems.push(defaultItem);
      }
    }

    merged.items = mergedItems;
  }

  return merged;
}

// Helper function to get all reward item IDs (flattened)
export function getAllRewardItemIds(): string[] {
  const categories = getRewardCategories();
  const ids: string[] = [];

  function collectIds(cats: RewardCategory[]) {
    for (const cat of cats) {
      if (cat.items) {
        ids.push(...cat.items.map(item => item.id));
      }
      if (cat.subcategories) {
        collectIds(cat.subcategories);
      }
    }
  }

  collectIds(categories);
  return ids;
}

// Helper function to find a reward item by ID
export function findRewardItem(id: string): RewardItem | null {
  const categories = getRewardCategories();

  function searchCategories(cats: RewardCategory[]): RewardItem | null {
    for (const cat of cats) {
      if (cat.items) {
        const found = cat.items.find(item => item.id === id);
        if (found) return found;
      }
      if (cat.subcategories) {
        const found = searchCategories(cat.subcategories);
        if (found) return found;
      }
    }
    return null;
  }

  return searchCategories(categories);
}