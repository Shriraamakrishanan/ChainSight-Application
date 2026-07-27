import React, { useState } from 'react';
import { Task, TaskStatus, Priority, TeamMember } from '../types';
import {
  Plus,
  Search,
  Filter,
  CheckSquare,
  Clock,
  AlertCircle,
  MoreVertical,
  ChevronRight,
  User,
  Tag,
  CheckCircle2,
  ListTodo,
  Calendar,
  Layers
} from 'lucide-react';

interface KanbanViewProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  onOpenNewTask: () => void;
  onOpenTaskModal: (task: Task) => void;
  searchQuery: string;
}

const columns: { id: TaskStatus; title: string; color: string; badgeBg: string }[] = [
  { id: 'todo', title: 'To Do', color: 'border-zinc-700', badgeBg: 'bg-zinc-800 text-zinc-300' },
  { id: 'in_progress', title: 'In Progress', color: 'border-indigo-500/50', badgeBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
  { id: 'review', title: 'Under Review', color: 'border-amber-500/50', badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  { id: 'done', title: 'Completed', color: 'border-emerald-500/50', badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
];

export const KanbanView: React.FC<KanbanViewProps> = ({
  tasks,
  setTasks,
  onOpenNewTask,
  onOpenTaskModal,
  searchQuery,
}) => {
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [projectFilter, setProjectFilter] = useState<string>('all');

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
  };

  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const updatedSubtasks = t.subtasks.map((st) =>
          st.id === subtaskId ? { ...st, completed: !st.completed } : st
        );
        return { ...t, subtasks: updatedSubtasks };
      })
    );
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      task.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    const matchesProject = projectFilter === 'all' || task.project === projectFilter;

    return matchesSearch && matchesPriority && matchesProject;
  });

  const getPriorityBadge = (priority: Priority) => {
    switch (priority) {
      case 'urgent':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'high':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'medium':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      default:
        return 'bg-zinc-800 text-zinc-400 border-zinc-700';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Filter Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-zinc-900/80 border border-zinc-800">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
            <Filter className="w-3.5 h-3.5 text-indigo-400" />
            <span>Filters:</span>
          </div>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-2.5 py-1 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="px-2.5 py-1 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Projects</option>
            <option value="Cloud Infrastructure Migration">Cloud Migration</option>
            <option value="AI Studio Workspace Suite">AI Workspace</option>
            <option value="Security & Compliance Audit">Security Audit</option>
          </select>

          {(priorityFilter !== 'all' || projectFilter !== 'all') && (
            <button
              onClick={() => {
                setPriorityFilter('all');
                setProjectFilter('all');
              }}
              className="text-xs text-indigo-400 hover:underline font-medium"
            >
              Reset Filters
            </button>
          )}
        </div>

        <button
          onClick={onOpenNewTask}
          className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all ml-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Task</span>
        </button>
      </div>

      {/* Kanban Board Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
        {columns.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.status === col.id);

          return (
            <div
              key={col.id}
              className={`p-3.5 rounded-2xl bg-zinc-900/60 border ${col.color} min-h-[600px] flex flex-col space-y-3`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${col.badgeBg}`}>
                    {col.title}
                  </span>
                  <span className="text-xs font-mono text-zinc-400 font-medium">({colTasks.length})</span>
                </div>
                <button
                  onClick={onOpenNewTask}
                  className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 rounded transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Task Cards List */}
              <div className="space-y-3 flex-1">
                {colTasks.length === 0 ? (
                  <div className="h-32 border border-dashed border-zinc-800/80 rounded-xl flex items-center justify-center text-center p-4 text-xs text-zinc-500">
                    No items in {col.title}
                  </div>
                ) : (
                  colTasks.map((task) => {
                    const completedSubs = task.subtasks.filter((s) => s.completed).length;
                    const totalSubs = task.subtasks.length;

                    return (
                      <div
                        key={task.id}
                        className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all shadow-sm space-y-3 group"
                      >
                        {/* Priority & Move Status Controls */}
                        <div className="flex items-center justify-between">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border ${getPriorityBadge(task.priority)}`}>
                            {task.priority}
                          </span>

                          {/* Fast Move Selector */}
                          <select
                            value={task.status}
                            onChange={(e) => handleStatusChange(task.id, e.target.value as TaskStatus)}
                            className="text-[10px] bg-zinc-950 text-zinc-300 border border-zinc-800 rounded px-1.5 py-0.5 focus:outline-none focus:border-indigo-500"
                          >
                            <option value="todo">To Do</option>
                            <option value="in_progress">In Progress</option>
                            <option value="review">Review</option>
                            <option value="done">Done</option>
                          </select>
                        </div>

                        {/* Title & Description */}
                        <div>
                          <h4
                            onClick={() => onOpenTaskModal(task)}
                            className="text-xs font-semibold text-zinc-200 group-hover:text-indigo-300 transition-colors cursor-pointer line-clamp-2"
                          >
                            {task.title}
                          </h4>
                          <p className="text-[11px] text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
                            {task.description}
                          </p>
                        </div>

                        {/* Tags */}
                        {task.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {task.tags.map((tag) => (
                              <span key={tag} className="text-[9px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Subtask Progress Checklist Preview */}
                        {totalSubs > 0 && (
                          <div className="space-y-1.5 pt-1 border-t border-zinc-800/60">
                            <div className="flex items-center justify-between text-[10px] text-zinc-400">
                              <span className="flex items-center gap-1">
                                <CheckSquare className="w-3 h-3 text-indigo-400" /> Checklist
                              </span>
                              <span>
                                {completedSubs}/{totalSubs}
                              </span>
                            </div>
                            <div className="space-y-1">
                              {task.subtasks.slice(0, 2).map((sub) => (
                                <label
                                  key={sub.id}
                                  className="flex items-center gap-1.5 text-[11px] text-zinc-300 cursor-pointer select-none"
                                >
                                  <input
                                    type="checkbox"
                                    checked={sub.completed}
                                    onChange={() => handleToggleSubtask(task.id, sub.id)}
                                    className="w-3 h-3 rounded bg-zinc-950 border-zinc-700 text-indigo-600 focus:ring-0"
                                  />
                                  <span className={sub.completed ? 'line-through text-zinc-500' : ''}>
                                    {sub.title}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Footer: Assignee & Due Date */}
                        <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[10px] text-zinc-400">
                          <div className="flex items-center gap-1.5">
                            <img
                              src={task.assignee.avatar}
                              alt={task.assignee.name}
                              className="w-4 h-4 rounded-full object-cover"
                            />
                            <span>{task.assignee.name.split(' ')[0]}</span>
                          </div>

                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-zinc-500" />
                            <span>{task.dueDate}</span>
                          </div>
                        </div>

                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
