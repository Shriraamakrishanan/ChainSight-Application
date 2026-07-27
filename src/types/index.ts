export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  assignee: {
    name: string;
    avatar: string;
    role: string;
  };
  dueDate: string;
  tags: string[];
  subtasks: Subtask[];
  project: string;
  createdAt: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  content: string;
  category: 'PRD' | 'Meeting' | 'Architecture' | 'Guide' | 'General';
  tags: string[];
  author: string;
  lastUpdated: string;
  pinned: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  avatar: string;
  status: 'active' | 'busy' | 'offline';
  tasksAssigned: number;
}

export interface ActivityLog {
  id: string;
  user: string;
  avatar: string;
  action: string;
  target: string;
  time: string;
  type: 'task' | 'doc' | 'system' | 'team';
}

export interface ProjectSummary {
  id: string;
  name: string;
  key: string;
  color: string;
  description: string;
  taskCount: number;
  completedCount: number;
}

export type ActiveTab = 'dashboard' | 'kanban' | 'docs' | 'analytics' | 'team' | 'settings';
