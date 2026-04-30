import { promises as fs } from 'fs';
import path from 'path';

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

const DATA_DIR = path.join(process.cwd(), 'data');

async function readJSONFile<T>(filename: string): Promise<T[]> {
  try {
    const filePath = path.join(DATA_DIR, filename);
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return [];
  }
}

async function writeJSONFile<T>(filename: string, data: T[]): Promise<void> {
  try {
    const filePath = path.join(DATA_DIR, filename);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    throw error;
  }
}

// Users
export async function getUsers(): Promise<User[]> {
  return readJSONFile<User>('users.json');
}

export async function getUserById(id: number): Promise<User | undefined> {
  const users = await getUsers();
  return users.find(user => user.id === id);
}

export async function updateUser(user: User): Promise<void> {
  const users = await getUsers();
  const index = users.findIndex(u => u.id === user.id);
  if (index !== -1) {
    users[index] = user;
    await writeJSONFile('users.json', users);
  }
}

// Requests
export async function getRequests(): Promise<Request[]> {
  return readJSONFile<Request>('requests.json');
}

export async function getRequestById(id: number): Promise<Request | undefined> {
  const requests = await getRequests();
  return requests.find(request => request.id === id);
}

export async function createRequest(request: Omit<Request, 'id' | 'createdAt'>): Promise<Request> {
  const requests = await getRequests();
  const newId = Math.max(0, ...requests.map(r => r.id)) + 1;
  const newRequest: Request = {
    ...request,
    id: newId,
    createdAt: new Date().toISOString(),
  };
  requests.push(newRequest);
  await writeJSONFile('requests.json', requests);
  return newRequest;
}

export async function updateRequest(request: Request): Promise<void> {
  const requests = await getRequests();
  const index = requests.findIndex(r => r.id === request.id);
  if (index !== -1) {
    requests[index] = request;
    await writeJSONFile('requests.json', requests);
  }
}

// Tasks
export async function getTasks(): Promise<Task[]> {
  return readJSONFile<Task>('tasks.json');
}

export async function getTasksByRequestId(requestId: number): Promise<Task[]> {
  const tasks = await getTasks();
  return tasks.filter(task => task.requestId === requestId);
}

export async function createTask(task: Omit<Task, 'id' | 'createdAt'>): Promise<Task> {
  const tasks = await getTasks();
  const newId = Math.max(0, ...tasks.map(t => t.id)) + 1;
  const newTask: Task = {
    ...task,
    id: newId,
    createdAt: new Date().toISOString(),
  };
  tasks.push(newTask);
  await writeJSONFile('tasks.json', tasks);
  return newTask;
}

export async function updateTask(task: Task): Promise<void> {
  const tasks = await getTasks();
  const index = tasks.findIndex(t => t.id === task.id);
  if (index !== -1) {
    tasks[index] = task;
    await writeJSONFile('tasks.json', tasks);
  }
}

// Rewards
export async function getRewards(): Promise<Reward[]> {
  return readJSONFile<Reward>('rewards.json');
}

export async function createReward(reward: Omit<Reward, 'id' | 'unlockedAt'>): Promise<Reward> {
  const rewards = await getRewards();
  const newId = Math.max(0, ...rewards.map(r => r.id)) + 1;
  const newReward: Reward = {
    ...reward,
    id: newId,
    unlockedAt: new Date().toISOString(),
  };
  rewards.push(newReward);
  await writeJSONFile('rewards.json', rewards);
  return newReward;
}