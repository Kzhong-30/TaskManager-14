import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import useAppStore from '../store';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';
import FilterBar from './FilterBar';
import TagManager from './TagManager';

const TaskList = () => {
  const { getFilteredTasks, reorderTasks, filter, selectedTagId } = useAppStore();
  const [showForm, setShowForm] = useState(false);

  const filteredTasks = getFilteredTasks();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const taskIds = filteredTasks.map((t) => t.id);
      const oldIndex = taskIds.indexOf(active.id as string);
      const newIndex = taskIds.indexOf(over.id as string);
      const newTaskIds = arrayMove(taskIds, oldIndex, newIndex);
      reorderTasks(newTaskIds);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">任务列表</h2>
          <TagManager />
        </div>
        <FilterBar />
      </div>

      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
        {showForm && (
          <div className="mb-4">
            <TaskForm onClose={() => setShowForm(false)} />
          </div>
        )}

        {filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-5xl mb-4">📝</div>
            <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
              暂无任务
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              点击下方按钮创建你的第一个任务
            </p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={filteredTasks.map((t) => t.id)}
              strategy={verticalListSortingStrategy}
            >
              {filteredTasks.map((task) => (
                <TaskItem key={task.id} task={task} />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <button
          onClick={() => setShowForm(!showForm)}
          className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          新建任务
        </button>
      </div>
    </div>
  );
};

export default TaskList;
