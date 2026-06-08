import { Sun, Moon, ListTodo, BarChart3 } from 'lucide-react';
import useAppStore from '../store';

const Header = () => {
  const darkMode = useAppStore((s) => s.settings.darkMode);
  const updateSettings = useAppStore((s) => s.updateSettings);
  const currentView = useAppStore((s) => s.currentView);
  const setCurrentView = useAppStore((s) => s.setCurrentView);

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
            <ListTodo className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">任务管理</h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentView('tasks')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              currentView === 'tasks'
                ? 'bg-red-500 text-white'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <ListTodo className="w-4 h-4 inline mr-2" />
            任务
          </button>
          <button
            onClick={() => setCurrentView('stats')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              currentView === 'stats'
                ? 'bg-red-500 text-white'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <BarChart3 className="w-4 h-4 inline mr-2" />
            统计
          </button>
          <button
            onClick={() => updateSettings({ darkMode: !darkMode })}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
