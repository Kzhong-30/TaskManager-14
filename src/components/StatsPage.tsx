import { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { format, subDays, eachDayOfInterval, parseISO } from 'date-fns';
import { CheckCircle2, Clock, Target, TrendingUp } from 'lucide-react';
import useAppStore from '../store';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const StatsPage = () => {
  const tasks = useAppStore((s) => s.tasks);
  const sessions = useAppStore((s) => s.sessions);
  const darkMode = useAppStore((s) => s.settings.darkMode);

  const stats = useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.completed).length;
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    const totalPomodoros = sessions.length;
    const totalFocusMinutes = sessions.reduce((acc, s) => acc + s.duration, 0) / 60;

    const priorityDistribution = {
      high: tasks.filter((t) => t.priority === 'high').length,
      medium: tasks.filter((t) => t.priority === 'medium').length,
      low: tasks.filter((t) => t.priority === 'low').length,
    };

    const last7Days = eachDayOfInterval({
      start: subDays(new Date(), 6),
      end: new Date(),
    });

    const dailyPomodoros = last7Days.map((date) => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const count = sessions.filter((s) => {
        const sessionDate = format(parseISO(s.endTime), 'yyyy-MM-dd');
        return sessionDate === dateStr;
      }).length;
      return {
        date: format(date, 'MM/dd'),
        count,
      };
    });

    return {
      totalTasks,
      completedTasks,
      completionRate,
      totalPomodoros,
      totalFocusMinutes,
      priorityDistribution,
      dailyPomodoros,
    };
  }, [tasks, sessions]);

  const barData = {
    labels: stats.dailyPomodoros.map((d) => d.date),
    datasets: [
      {
        label: '番茄数',
        data: stats.dailyPomodoros.map((d) => d.count),
        backgroundColor: darkMode
          ? 'rgba(239, 68, 68, 0.8)'
          : 'rgba(239, 68, 68, 0.6)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  };

  const textColor = darkMode ? '#9ca3af' : '#6b7280';
  const gridColor = darkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(209, 213, 219, 0.5)';

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: {
          color: textColor,
        },
        grid: {
          color: gridColor,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          color: textColor,
        },
        grid: {
          color: gridColor,
        },
      },
    },
  };

  const doughnutData = {
    labels: ['高优先级', '中优先级', '低优先级'],
    datasets: [
      {
        data: [
          stats.priorityDistribution.high,
          stats.priorityDistribution.medium,
          stats.priorityDistribution.low,
        ],
        backgroundColor: ['#ef4444', '#eab308', '#22c55e'],
        borderWidth: 0,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: textColor,
        },
      },
    },
  };

  return (
    <div className="p-6 h-full overflow-y-auto scrollbar-thin">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">数据统计</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-blue-500" />
            </div>
            <span className="text-gray-500 dark:text-gray-400 text-sm">总任务数</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalTasks}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
            <span className="text-gray-500 dark:text-gray-400 text-sm">完成率</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {stats.completionRate.toFixed(1)}%
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-red-500" />
            </div>
            <span className="text-gray-500 dark:text-gray-400 text-sm">完成番茄</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalPomodoros}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-500" />
            </div>
            <span className="text-gray-500 dark:text-gray-400 text-sm">专注时长</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {Math.round(stats.totalFocusMinutes)}分钟
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            近7天番茄数趋势
          </h3>
          <div className="h-64">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            任务优先级分布
          </h3>
          <div className="h-64 flex items-center justify-center">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPage;
