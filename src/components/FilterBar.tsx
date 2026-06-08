import useAppStore from '../store';
import { FilterType } from '../types';

const filters: { key: FilterType; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'active', label: '进行中' },
  { key: 'completed', label: '已完成' },
  { key: 'today', label: '今日到期' },
];

const FilterBar = () => {
  const filter = useAppStore((s) => s.filter);
  const setFilter = useAppStore((s) => s.setFilter);
  const tags = useAppStore((s) => s.tags);
  const selectedTagId = useAppStore((s) => s.selectedTagId);
  const setSelectedTag = useAppStore((s) => s.setSelectedTag);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f.key
                ? 'bg-red-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-gray-500 dark:text-gray-400">标签筛选:</span>
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              !selectedTagId
                ? 'bg-red-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            全部
          </button>
          {tags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => setSelectedTag(tag.id)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedTagId === tag.id ? 'text-white' : 'text-gray-600 dark:text-gray-300'
              }`}
              style={{
                backgroundColor: selectedTagId === tag.id ? tag.color : undefined,
              }}
            >
              {tag.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterBar;
