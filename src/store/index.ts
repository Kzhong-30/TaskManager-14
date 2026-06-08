import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, Tag, PomodoroSession, AppSettings, FilterType, AppState, Priority } from '../types';

const generateId = () => Math.random().toString(36).substring(2, 9);

const defaultSettings: AppSettings = {
  darkMode: false,
  pomodoroDuration: 25 * 60,
  shortBreakDuration: 5 * 60,
  longBreakDuration: 15 * 60,
};

interface AppActions {
  addTask: (task: Omit<Task, 'id' | 'completedPomodoros' | 'completed' | 'order' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskComplete: (id: string) => void;
  reorderTasks: (taskIds: string[]) => void;
  selectTask: (id: string | null) => void;
  addTag: (name: string, color: string) => void;
  updateTag: (id: string, updates: Partial<Tag>) => void;
  deleteTag: (id: string) => void;
  addPomodoroSession: (taskId: string, duration: number) => void;
  setFilter: (filter: FilterType) => void;
  setSelectedTag: (tagId: string | null) => void;
  setCurrentView: (view: 'tasks' | 'stats') => void;
  setMobileView: (view: 'list' | 'pomodoro') => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  getFilteredTasks: () => Task[];
}

const useAppStore = create<AppState & AppActions>()(
  persist(
    (set, get) => ({
      tasks: [],
      tags: [],
      sessions: [],
      settings: defaultSettings,
      selectedTaskId: null,
      filter: 'all',
      selectedTagId: null,
      currentView: 'tasks',
      mobileView: 'list',

      addTask: (taskData) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              ...taskData,
              id: generateId(),
              completedPomodoros: 0,
              completed: false,
              order: state.tasks.length,
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        })),

      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
          selectedTaskId: state.selectedTaskId === id ? null : state.selectedTaskId,
        })),

      toggleTaskComplete: (id) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id
              ? {
                  ...t,
                  completed: !t.completed,
                  completedAt: !t.completed ? new Date().toISOString() : undefined,
                }
              : t
          ),
        })),

      reorderTasks: (taskIds) =>
        set((state) => ({
          tasks: state.tasks
            .map((task, index) => ({ ...task, order: taskIds.indexOf(task.id) }))
            .sort((a, b) => a.order - b.order),
        })),

      selectTask: (id) => set({ selectedTaskId: id }),

      addTag: (name, color) =>
        set((state) => ({
          tags: [...state.tags, { id: generateId(), name, color }],
        })),

      updateTag: (id, updates) =>
        set((state) => ({
          tags: state.tags.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        })),

      deleteTag: (id) =>
        set((state) => ({
          tags: state.tags.filter((t) => t.id !== id),
          tasks: state.tasks.map((t) => ({
            ...t,
            tagIds: t.tagIds.filter((tid) => tid !== id),
          })),
          selectedTagId: state.selectedTagId === id ? null : state.selectedTagId,
        })),

      addPomodoroSession: (taskId, duration) =>
        set((state) => {
          const now = new Date();
          const session: PomodoroSession = {
            id: generateId(),
            taskId,
            startTime: new Date(now.getTime() - duration * 1000).toISOString(),
            endTime: now.toISOString(),
            duration,
          };
          return {
            sessions: [...state.sessions, session],
            tasks: state.tasks.map((t) =>
              t.id === taskId ? { ...t, completedPomodoros: t.completedPomodoros + 1 } : t
            ),
          };
        }),

      setFilter: (filter) => set({ filter }),

      setSelectedTag: (tagId) => set({ selectedTagId: tagId }),

      setCurrentView: (view) => set({ currentView: view }),

      setMobileView: (view) => set({ mobileView: view }),

      updateSettings: (settings) =>
        set((state) => ({
          settings: { ...state.settings, ...settings },
        })),

      getFilteredTasks: () => {
        const state = get();
        let tasks = [...state.tasks];

        switch (state.filter) {
          case 'active':
            tasks = tasks.filter((t) => !t.completed);
            break;
          case 'completed':
            tasks = tasks.filter((t) => t.completed);
            break;
          case 'today':
            const today = new Date().toISOString().split('T')[0];
            tasks = tasks.filter((t) => t.dueDate === today);
            break;
        }

        if (state.selectedTagId) {
          tasks = tasks.filter((t) => t.tagIds.includes(state.selectedTagId));
        }

        return tasks.sort((a, b) => a.order - b.order);
      },
    }),
    {
      name: 'todo-pomodoro-storage',
    }
  )
);

export default useAppStore;
