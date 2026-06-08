import { useEffect } from 'react';
import { ListTodo, Timer } from 'lucide-react';
import useAppStore from './store';
import Header from './components/Header';
import TaskList from './components/TaskList';
import PomodoroTimer from './components/PomodoroTimer';
import StatsPage from './components/StatsPage';

function App() {
  const darkMode = useAppStore((s) => s.settings.darkMode);
  const currentView = useAppStore((s) => s.currentView);
  const mobileView = useAppStore((s) => s.mobileView);
  const setMobileView = useAppStore((s) => s.setMobileView);
  const selectedTaskId = useAppStore((s) => s.selectedTaskId);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const showMobileNav = currentView === 'tasks';

  return (
    <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-900 transition-colors">
      <Header />

      {currentView === 'stats' ? (
        <StatsPage />
      ) : (
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          <div
            className={
              mobileView === 'list'
                ? 'w-full lg:w-1/2 xl:w-2/5 border-r border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col pb-14 lg:pb-0'
                : 'hidden lg:flex lg:w-1/2 xl:w-2/5 border-r border-gray-200 dark:border-gray-700 overflow-hidden flex-col'
            }
          >
            <TaskList />
          </div>

          <div
            className={
              mobileView === 'pomodoro'
                ? 'w-full flex-1 bg-white dark:bg-gray-800 pb-14 lg:pb-0'
                : 'hidden lg:flex lg:flex-1 bg-white dark:bg-gray-800'
            }
          >
            <PomodoroTimer />
          </div>
        </div>
      )}

      {showMobileNav && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 flex border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 z-10">
          <button
            onClick={() => setMobileView('list')}
            className={`flex-1 py-3 flex items-center justify-center gap-2 font-medium transition-colors ${
              mobileView === 'list'
                ? 'bg-red-500 text-white'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <ListTodo className="w-5 h-5" />
            任务列表
          </button>
          <button
            onClick={() => setMobileView('pomodoro')}
            disabled={!selectedTaskId}
            className={`flex-1 py-3 flex items-center justify-center gap-2 font-medium transition-colors ${
              mobileView === 'pomodoro'
                ? 'bg-red-500 text-white'
                : selectedTaskId
                ? 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                : 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
            }`}
          >
            <Timer className="w-5 h-5" />
            番茄钟
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
