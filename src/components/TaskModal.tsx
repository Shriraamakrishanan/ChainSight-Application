import React, { useState } from 'react';
import { Task, Priority, TaskStatus, TeamMember } from '../types';
import { X, Plus, Trash2, Calendar, User, Tag, CheckSquare, Sparkles } from 'lucide-react';

interface TaskModalProps {
  task?: Task | null;
  team: TeamMember[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: Partial<Task>) => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  task,
  team,
  isOpen,
  onClose,
  onSave,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [status, setStatus] = useState<TaskStatus>(task?.status || 'todo');
  const [priority, setPriority] = useState<Priority>(task?.priority || 'medium');
  const [assigneeEmail, setAssigneeEmail] = useState((task?.assignee as any)?.email || team[0]?.email || '');
  const [dueDate, setDueDate] = useState(task?.dueDate || new Date().toISOString().split('T')[0]);
  const [project, setProject] = useState(task?.project || 'Cloud Infrastructure Migration');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(task?.tags || ['Engineering']);
  const [subtasks, setSubtasks] = useState<{ id: string; title: string; completed: boolean }[]>(
    task?.subtasks || []
  );
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    if (!tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    setSubtasks([
      ...subtasks,
      { id: `sub-${Date.now()}`, title: newSubtaskTitle.trim(), completed: false },
    ]);
    setNewSubtaskTitle('');
  };

  const handleRemoveSubtask = (subId: string) => {
    setSubtasks(subtasks.filter((s) => s.id !== subId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const assignedMember = team.find((m) => m.email === assigneeEmail) || team[0];

    onSave({
      id: task?.id,
      title,
      description,
      status,
      priority,
      assignee: {
        name: assignedMember.name,
        avatar: assignedMember.avatar,
        role: assignedMember.role,
      },
      dueDate,
      project,
      tags,
      subtasks,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            {task ? `Edit Task (${task.id})` : 'Create New Work Item'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-zinc-200 rounded-lg hover:bg-zinc-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Title */}
          <div>
            <label className="font-semibold text-zinc-400">TASK TITLE</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Implement OAuth Authorization Endpoint"
              className="w-full mt-1 px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="font-semibold text-zinc-400">DESCRIPTION & SCOPE</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail work scope, API requirements, and acceptance criteria..."
              className="w-full mt-1 px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Status & Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-zinc-400">STATUS</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full mt-1 px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="review">Under Review</option>
                <option value="done">Completed</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-zinc-400">PRIORITY LEVEL</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full mt-1 px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          {/* Project & Assignee */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-zinc-400">PROJECT STREAM</label>
              <select
                value={project}
                onChange={(e) => setProject(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="Cloud Infrastructure Migration">Cloud Infrastructure Migration</option>
                <option value="AI Studio Workspace Suite">AI Studio Workspace Suite</option>
                <option value="Security & Compliance Audit">Security & Compliance Audit</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-zinc-400">ASSIGNEE</label>
              <select
                value={assigneeEmail}
                onChange={(e) => setAssigneeEmail(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
              >
                {team.map((m) => (
                  <option key={m.id} value={m.email}>
                    {m.name} ({m.role})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="font-semibold text-zinc-400">TARGET DUE DATE</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full mt-1 px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Subtasks */}
          <div className="space-y-2 pt-2 border-t border-zinc-800">
            <label className="font-semibold text-zinc-400 flex items-center justify-between">
              <span>SUBTASK CHECKLIST ({subtasks.length})</span>
            </label>

            <div className="flex gap-2">
              <input
                type="text"
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                placeholder="Add subtask step..."
                className="flex-1 px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-semibold"
              >
                Add
              </button>
            </div>

            <div className="space-y-1 max-h-32 overflow-y-auto">
              {subtasks.map((st) => (
                <div key={st.id} className="flex items-center justify-between px-2.5 py-1 bg-zinc-950 rounded border border-zinc-800 text-[11px]">
                  <span className="text-zinc-300">{st.title}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubtask(st.id)}
                    className="text-zinc-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Submit Buttons */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold shadow-md shadow-indigo-600/20"
            >
              {task ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
