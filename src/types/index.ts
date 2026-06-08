export type Priority = 'high' | 'medium' | 'low';

export type FilterType = 'all' | 'active' | 'completed' | 'today';

export interface Task {
  id: string;
  title: string;
  priority: Priority;
  dueDate: string;
  estimatedPomodoros: number;
  completedPomodoros: number;
  completed: boolean;
  completedAt?: string;
  tagIds: string[];
  order: number;
  createdAt: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface PomodoroSession {
  id: string;
  taskId: string;
  startTime: string;
  endTime: string;
  duration: number;
}

export interface AppSettings {
  darkMode: boolean;
  pomodoroDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
}

export interface AppState {
  tasks: Task[];
  tags: Tag[];
  sessions: PomodoroSession[];
  settings: AppSettings;
  selectedTaskId: string | null;
  filter: FilterType;
  selectedTagId: string | null;
  currentView: 'tasks' | 'stats';
  mobileView: 'list' | 'pomodoro';
}
