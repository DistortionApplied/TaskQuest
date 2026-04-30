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
};

// Generic storage functions
function getFromStorage<T>(key: string): T[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`Error reading from localStorage:`, error);
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
  console.log('deleteRequest called with id:', id);

  // Delete the request
  const requestsBefore = getRequests();
  console.log('Requests before deletion:', requestsBefore.length);

  const requests = getRequests().filter(r => r.id !== id);
  saveToStorage(STORAGE_KEYS.requests, requests);
  console.log('Requests after deletion:', requests.length);

  // Delete all associated tasks
  const tasksBefore = getTasks();
  console.log('Tasks before deletion:', tasksBefore.length);

  const tasks = getTasks().filter(t => t.requestId !== id);
  saveToStorage(STORAGE_KEYS.tasks, tasks);
  console.log('Tasks after deletion:', tasks.length);
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