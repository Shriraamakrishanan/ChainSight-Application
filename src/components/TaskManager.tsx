import React, { useState } from 'react';
import { TaskItem, TaskPriority, TaskStatus } from '../types';
import { Plus, Sparkles, Filter, CheckCircle2, Clock, AlertCircle, ArrowRight, ArrowLeft, Tag, Calendar, User, Trash2 } from 'lucide-react';

interface TaskManagerProps {
  tasks: TaskItem[];
  onAddTask: (task: TaskItem) => void;
  onUpdateTaskStatus: (id: string, newStatus: TaskStatus) => void;
  onDeleteTask: (id: string) => void;
  searchFilter: string;
}

export const TaskManager: React.FC<TaskManagerProps> = ({
  tasks,
  onAddTask,
  onUpdateTaskStatus,
  onDeleteTask,
  searchFilter,
}) => {
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPriority, setNewPriority] = useState<TaskPriority>('Medium');
  const [newAssignee, setNewAssignee] = useState('Alex Rivera');
  const [newDueDate, setNewDueDate] = useState('2026-07-30');
  const [newTagsStr, setNewTagsStr] = useState('Frontend, Feature');

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      task.description.toLowerCase().includes(searchFilter.toLowerCase()) ||
      task.assignee.toLowerCase().includes(searchFilter.toLowerCase()) ||
      task.tags.some((t) => t.toLowerCase().includes(searchFilter.toLowerCase()));

    const matchesPriority = priorityFilter === 'ALL' || task.priority === priorityFilter;

    return matchesSearch && matchesPriority;
  });

  const columns: { id: TaskStatus; title: string; icon: React.ReactNode; color: string }[] = [
    { id: 'todo', title: 'To Do', icon: <Clock className="w-4 h-4 text-zinc-400" />, color: 'border-zinc-700' },
    { id: 'in_progress', title: 'In Progress', icon: <AlertCircle className="w-4 h-4 text-amber-400" />, color: 'border-amber-500/40' },
    { id: 'review', title: 'In Review', icon: <Sparkles className="w-4 h-4 text-indigo-400" />, color: 'border-indigo-500/40' },
    { id: 'done', title: 'Completed', icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />, color: 'border-emerald-500/40' },
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask: TaskItem = {
      id: `TSK-${Math.floor(100 + Math.random() * 900)}`,
      title: newTitle.trim(),
      description: newDesc.trim() || 'No description provided.',
      status: 'todo',
      priority: newPriority,
      assignee: newAssignee,
      dueDate: newDueDate,
      tags: newTagsStr.split(',').map((t) => t.trim()).filter(Boolean),
      createdAt: new Date().toISOString().split('T')[0],
    };

    onAddTask(newTask);
    setNewTitle('');
    setNewDesc('');
    setIsAddingTask(false);
  };

  const handleAiBreakdown = async () => {
    if (!newTitle.trim()) return;
    setAiLoading(true);
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Create a concise technical task description and bullet points breakdown for: "${newTitle}". Keep it professional and under 80 words.`,
          systemInstruction: 'You are an expert technical project manager.',
        }),
      });
      const data = await res.json();
      if (data.result) {
        setNewDesc(data.result);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  const getPriorityBadgeClass = (priority: TaskPriority) => {
    switch (priority) {
      case 'Urgent':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'High':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Medium':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      case 'Low':
        return 'bg-zinc-800 text-zinc-400 border-zinc-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Control Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800/80">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-zinc-950 px-3 py-1.5 rounded-lg border border-zinc-800 text-xs">
            <Filter className="w-3.5 h-3.5 text-zinc-400" />
            <span className="text-zinc-400">Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-transparent text-zinc-200 font-medium focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-zinc-900">All Priorities</option>
              <option value="Urgent" className="bg-zinc-900">Urgent</option>
              <option value="High" className="bg-zinc-900">High</option>
              <option value="Medium" className="bg-zinc-900">Medium</option>
              <option value="Low" className="bg-zinc-900">Low</option>
            </select>
          </div>

          <span className="text-xs text-zinc-400">
            Total Tasks: <strong className="text-zinc-200">{filteredTasks.length}</strong>
          </span>
        </div>

        <button
          onClick={() => setIsAddingTask(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>

      {/* Add Task Modal */}
      {isAddingTask && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-400" /> Create New Sprint Task
              </h3>
              <button
                onClick={() => setIsAddingTask(false)}
                className="text-zinc-500 hover:text-zinc-300 text-xs cursor-pointer"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Task Title</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="e.g., Set up Redis caching layer"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="flex-1 bg-zinc-950 border border-zinc-800 text-zinc-200 p-2.5 rounded-lg focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={handleAiBreakdown}
                    disabled={aiLoading || !newTitle.trim()}
                    className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-medium cursor-pointer disabled:opacity-50"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin-slow" />
                    {aiLoading ? 'AI Thinking...' : 'AI Expand'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Description</label>
                <textarea
                  rows={3}
                  placeholder="Task details and deliverables..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 text-zinc-200 p-2.5 rounded-lg focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as TaskPriority)}
                    className="w-full bg-zinc-950 border border-zinc-800 text-zinc-200 p-2.5 rounded-lg focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">Assignee</label>
                  <input
                    type="text"
                    value={newAssignee}
                    onChange={(e) => setNewAssignee(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 text-zinc-200 p-2.5 rounded-lg focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">Due Date</label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 text-zinc-200 p-2.5 rounded-lg focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={newTagsStr}
                    onChange={(e) => setNewTagsStr(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 text-zinc-200 p-2.5 rounded-lg focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingTask(false)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-indigo-600/20 cursor-pointer"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Kanban Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.status === col.id);
          return (
            <div
              key={col.id}
              className={`bg-zinc-900/40 border ${col.color} rounded-xl p-4 flex flex-col h-[640px] max-h-[70vh] shadow-inner`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  {col.icon}
                  <h3 className="text-xs font-bold text-zinc-200 tracking-wide uppercase">{col.title}</h3>
                </div>
                <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">
                  {colTasks.length}
                </span>
              </div>

              {/* Task Cards Container */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {colTasks.length === 0 ? (
                  <div className="h-32 flex flex-col items-center justify-center text-center p-4 border border-dashed border-zinc-800 rounded-lg">
                    <p className="text-xs text-zinc-500 font-medium">No tasks in {col.title}</p>
                  </div>
                ) : (
                  colTasks.map((task) => (
                    <div
                      key={task.id}
                      className="group bg-zinc-900 border border-zinc-800/90 rounded-lg p-3.5 space-y-2 hover:border-zinc-700 transition-all shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[10px] font-mono text-zinc-500">{task.id}</span>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${getPriorityBadgeClass(
                              task.priority
                            )}`}
                          >
                            {task.priority}
                          </span>
                          <button
                            onClick={() => onDeleteTask(task.id)}
                            className="opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-rose-400 transition-opacity cursor-pointer p-0.5"
                            title="Delete task"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <h4 className="text-xs font-semibold text-zinc-100 leading-snug">{task.title}</h4>

                      <p className="text-[11px] text-zinc-400 leading-relaxed line-clamp-3 font-normal">
                        {task.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 pt-1">
                        {task.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-zinc-950 text-zinc-400 border border-zinc-800"
                          >
                            <Tag className="w-2.5 h-2.5" /> {tag}
                          </span>
                        ))}
                      </div>

                      {/* Meta Footer */}
                      <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[10px] text-zinc-500">
                        <div className="flex items-center gap-1" title="Assignee">
                          <User className="w-3 h-3 text-zinc-400" />
                          <span>{task.assignee}</span>
                        </div>

                        <div className="flex items-center gap-1" title="Due Date">
                          <Calendar className="w-3 h-3 text-zinc-400" />
                          <span>{task.dueDate}</span>
                        </div>
                      </div>

                      {/* Move Quick Controls */}
                      <div className="pt-2 flex items-center justify-between gap-1 border-t border-zinc-800/40">
                        {col.id !== 'todo' ? (
                          <button
                            onClick={() => {
                              const prevMap: Record<TaskStatus, TaskStatus> = {
                                in_progress: 'todo',
                                review: 'in_progress',
                                done: 'review',
                                todo: 'todo',
                              };
                              onUpdateTaskStatus(task.id, prevMap[col.id]);
                            }}
                            className="flex items-center gap-1 text-[10px] text-zinc-400 hover:text-indigo-400 transition-colors cursor-pointer"
                          >
                            <ArrowLeft className="w-3 h-3" /> Move left
                          </button>
                        ) : <div />}

                        {col.id !== 'done' && (
                          <button
                            onClick={() => {
                              const nextMap: Record<TaskStatus, TaskStatus> = {
                                todo: 'in_progress',
                                in_progress: 'review',
                                review: 'done',
                                done: 'done',
                              };
                              onUpdateTaskStatus(task.id, nextMap[col.id]);
                            }}
                            className="flex items-center gap-1 text-[10px] text-zinc-400 hover:text-indigo-400 transition-colors cursor-pointer ml-auto"
                          >
                            Move right <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
