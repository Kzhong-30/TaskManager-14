import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import useAppStore from '../store';
import { Priority } from '../types';

interface TaskFormProps {
  onClose?: () => void;
  editTask?: {
    id: string;
    title: string;
    priority: Priority;
    dueDate: string;
    estimatedPomodoros: number;
    tagIds: string[];
  } | null;
}

const priorityColors: Record<Priority, string> = {
  high: 'bg-red-500 text-white',
  medium: 'bg-yellow-500 text-white',
  low: 'bg-green-500 text-white',
};

const TaskForm = ({ onClose, editTask }: TaskFormProps) => {
  const { addTask, updateTask, tags } = useAppStore();
  const [title, setTitle] = useState(editTask?.title || '');
  const [priority, setPriority] = useState<Priority>(editTask?.priority || 'medium');
  const [dueDate, setDueDate] = useState(editTask?.dueDate || new Date().toISOString().split('T')[0]);
  const [estimatedPomodoros, setEstimatedPomodoros] = useState(editTask?.estimatedPomodoros || 1);
  const [selectedTags, setSelectedTags] = useState<string[]>(editTask?.tagIds || []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editTask) {
      updateTask(editTask.id, {
        title,
        priority,
        dueDate,
        estimatedPomodoros,
        tagIds: selectedTags,
      });
    } else {
      addTask({
        title,
        priority,
        dueDate,
        estimatedPomodoros,
        tagIds: selectedTags,
      });
    }

    setTitle('');
    setPriority('medium');
    setDueDate(new Date().toISOString().split('T')[0]);
    setEstimatedPomodoros(1);
    setSelectedTags([]);
    onClose?.();
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 dark:text-white">
          {editTask ? '编辑任务' : '新建任务'}
        </h3>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            任务标题
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="输入任务标题..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
            autoFocus
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            优先级
          </label>
          <div className="flex gap-2">
            {(['high', 'medium', 'low'] as Priority[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  priority === p
                    ? priorityColors[p]
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {p === 'high' ? '高' : p === 'medium' ? '中' : '低'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              截止日期
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              预估番茄数
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={estimatedPomodoros}
              onChange={(e) => setEstimatedPomodoros(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
        </div>

        {tags.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              标签
            </label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                    selectedTags.includes(tag.id)
                      ? 'text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
                  style={selectedTags.includes(tag.id) ? { backgroundColor: tag.color } : {}}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          type="submit"
          className="w-full py-2.5 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          {editTask ? '保存修改' : '创建任务'}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
