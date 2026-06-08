# 任务管理 - 番茄钟应用

一个结合待办任务和番茄钟的任务管理应用，使用 React 18 + TypeScript + Zustand 构建。

## 功能特性

### 📝 任务管理
- 创建任务，设置标题、优先级（高/中/低）、截止日期、预估番茄数
- 拖拽排序任务
- 标记任务完成/未完成
- 编辑和删除任务
- 任务筛选：全部/进行中/已完成/今日到期

### 🍅 番茄钟
- 点击任务后右侧显示番茄钟计时器
- 专注模式（25分钟）和休息模式（5分钟）
- 计时结束后自动记录一个番茄并关联到该任务
- 支持暂停、重置、跳过功能

### 🏷️ 标签管理
- 创建自定义标签，选择标签颜色
- 为任务添加多个标签
- 按标签筛选任务

### 📊 数据统计
- 任务完成率统计
- 各优先级任务分布饼图
- 近7天每日番茄数趋势柱状图
- 总任务数、完成番茄数、专注时长统计

### 🌙 深色模式
- 支持浅色/深色模式切换
- 自动保存主题偏好

### 💾 数据持久化
- 使用 localStorage 保存所有数据
- 刷新页面数据不会丢失

## 技术栈

- **React 18** - UI 框架
- **TypeScript** - 类型安全
- **Zustand** - 状态管理
- **Tailwind CSS** - 样式框架
- **@dnd-kit** - 拖拽功能
- **Chart.js + react-chartjs-2** - 数据可视化
- **date-fns** - 日期处理
- **lucide-react** - 图标库

## 项目结构

```
src/
├── components/          # UI 组件
│   ├── Header.tsx       # 顶部导航栏
│   ├── TaskList.tsx     # 任务列表
│   ├── TaskItem.tsx     # 任务项（支持拖拽）
│   ├── TaskForm.tsx     # 任务创建/编辑表单
│   ├── FilterBar.tsx    # 筛选栏
│   ├── TagManager.tsx   # 标签管理
│   ├── PomodoroTimer.tsx # 番茄钟计时器
│   └── StatsPage.tsx    # 统计页面
├── store/
│   └── index.ts         # Zustand 状态管理
├── types/
│   └── index.ts         # TypeScript 类型定义
├── App.tsx              # 主应用组件
├── main.tsx             # 应用入口
└── index.css            # 全局样式
```

## 安装和运行

### 安装依赖

```bash
npm install
# 或
pnpm install
# 或
yarn install
```

### 启动开发服务器

```bash
npm run dev
# 或
pnpm dev
# 或
yarn dev
```

### 构建生产版本

```bash
npm run build
# 或
pnpm build
# 或
yarn build
```

### 预览生产版本

```bash
npm run preview
# 或
pnpm preview
# 或
yarn preview
```

## 使用说明

1. **创建任务**：点击底部"新建任务"按钮，填写任务信息
2. **开始番茄钟**：点击左侧任务列表中的任务，右侧会显示番茄钟
3. **专注工作**：点击播放按钮开始计时，25分钟后自动休息
4. **管理标签**：点击"标签管理"按钮创建和管理标签
5. **查看统计**：点击顶部"统计"按钮查看数据统计
6. **切换主题**：点击顶部太阳/月亮图标切换深色/浅色模式

## 浏览器支持

- Chrome (推荐)
- Firefox
- Safari
- Edge

## License

MIT
