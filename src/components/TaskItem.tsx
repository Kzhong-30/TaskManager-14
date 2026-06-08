import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Edit2, Check, Clock, X } from 'lucide-react';
import useAppStore from '../store';
import { Task, Priority } from '../types';
import TaskForm from './TaskForm';

interface TaskItemProps {
  task: Task;
}

const priorityColors: Record<Priority, string> = {
  high: 'bg-red-500',
  medium: 'bg-yellow-500',
  low: 'bg-green-500',
};

const TaskItem = ({ task }: TaskItemProps) => {
  const { toggleTaskComplete, deleteTask, selectTask, selectedTaskId, tags } = useAppStore();
  const [isEditing, setIsEditing] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isSelected = selectedTaskId === task.id;
  const isOverdue = !task.completed && new Date(task.dueDate) < new Date(new Date().toDateString());
  const taskTags = tags.filter((t) => task.tagIds.includes(t.id));

  if (isEditing) {
    return (
      <div ref={setNodeRef} style={style} className="mb-3">
        <TaskForm
          editTask={{
            id: task.id,
            title: task.title,
            priority: task.priority,
            dueDate: task.dueDate,
            estimatedPomodoros: task.estimatedPomodoros,
            tagIds: task.tagIds,
          }}
          onClose={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-4 bg-white dark:bg-gray-800 rounded-xl border transition-all mb-3 ${
        isDragging ? 'opacity-50 shadow-lg scale-105' : ''
      } ${
        isSelected
          ? 'border-red-500 ring-2 ring-red-200 dark:ring-red-800'
          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
      } ${task.completed ? 'opacity-60' : ''}`}
    >
      <div className="flex items-start gap-3">
        <button
          {...attributes}
          {...listeners}
          className="mt-1 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <GripVertical className="w-5 h-5" />
        </button>

        <button
          onClick={() => toggleTaskComplete(task.id)}
          className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
            task.completed
              ? 'bg-green-500 border-green-500'
              : 'border-gray-300 dark:border-gray-500 hover:border-green-500'
          }`}
        >
          {task.completed && <Check className="w-4 h-4 text-white" />}
        </button>

        <div
          className="flex-1 cursor-pointer"
          onClick={() => !task.completed && selectTask(isSelected ? null : task.id)}
        >
          <div className="flex items-center gap-2 mb-1">
            <div className={`w-2 h-2 rounded-full ${priorityColors[task.priority]}`} />
            <h3
              className={`font-medium ${
                task.completed
                  ? 'line-through text-gray-400 dark:text-gray-500'
                  : 'text-gray-900 dark:text-white'
              }`}
            >
              {task.title}
            </h3>
          </div>

          {taskTags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {taskTags.map((tag) => (
                <span
                  key={tag.id}
                  className="px-2 py-0.5 text-xs rounded-full text-white"
                  style={{ backgroundColor: tag.color }}
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span className={`flex items-center gap-1 ${isOverdue ? 'text-red-500' : ''}`}>
              <Clock className="w-4 h-4" />
              {task.dueDate}
            </span>
            <span className="flex items-center gap-1">
              <span className="text-red-500">🍅</span>
              {task.completedPomodoros}/{task.estimatedPomodoros}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
            className="p-2 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteTask(task.id);
            }}
            className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
