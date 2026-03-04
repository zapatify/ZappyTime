import { useState, useRef } from "react";
import { Plus, Clock, Check, X, Pencil, Trash2, GripVertical } from "lucide-react";

export interface Project {
  id: string;
  name: string;
  totalTime: number;
  color: string;
}

interface ProjectSelectorProps {
  projects: Project[];
  selectedProjectId: string | null;
  onSelectProject: (projectId: string) => void;
  onAddProject: (name: string) => void;
  onEditProject: (projectId: string, name: string) => void;
  onDeleteProject: (projectId: string) => void;
  onReorderProjects: (fromIndex: number, toIndex: number) => void;
}

export function ProjectSelector({
  projects,
  selectedProjectId,
  onSelectProject,
  onAddProject,
  onEditProject,
  onDeleteProject,
  onReorderProjects,
}: ProjectSelectorProps) {
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editedName, setEditedName] = useState("");
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const dragIndexRef = useRef<number | null>(null);

  const handleAddProject = () => {
    if (newProjectName.trim()) {
      onAddProject(newProjectName.trim());
      setNewProjectName("");
      setIsAddingProject(false);
    }
  };

  const handleStartEdit = (project: Project) => {
    setEditingProjectId(project.id);
    setEditedName(project.name);
  };

  const handleSaveEdit = () => {
    if (editedName.trim() && editingProjectId) {
      onEditProject(editingProjectId, editedName.trim());
      setEditingProjectId(null);
      setEditedName("");
    }
  };

  const handleCancelEdit = () => {
    setEditingProjectId(null);
    setEditedName("");
  };

  const handleDelete = (projectId: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      onDeleteProject(projectId);
    }
  };

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  return (
    <div className="w-full max-w-2xl">
      <h2 className="text-2xl mb-4 text-white font-medium">Select Project</h2>
      <div className="space-y-2">
        {projects.map((project, index) => (
          <div
            key={project.id}
            draggable={editingProjectId !== project.id}
            onDragStart={(e) => {
              dragIndexRef.current = index;
              e.dataTransfer.effectAllowed = "move";
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = "move";
              setDragOverIndex(index);
            }}
            onDragLeave={() => setDragOverIndex(null)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOverIndex(null);
              if (dragIndexRef.current !== null && dragIndexRef.current !== index) {
                onReorderProjects(dragIndexRef.current, index);
              }
              dragIndexRef.current = null;
            }}
            onDragEnd={() => {
              setDragOverIndex(null);
              dragIndexRef.current = null;
            }}
            className={dragOverIndex === index ? "opacity-50" : ""}
          >
            {editingProjectId === project.id ? (
              <div className="w-full p-4 rounded-lg border-2 border-blue-500 bg-gray-700/50 flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: project.color }}
                />
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveEdit();
                    if (e.key === "Escape") handleCancelEdit();
                  }}
                  className="flex-1 px-3 py-2 border border-gray-600 bg-gray-800 text-white rounded focus:outline-none focus:border-blue-500"
                  autoFocus
                />
                <button
                  onClick={handleSaveEdit}
                  className="p-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors cursor-pointer"
                  title="Save"
                >
                  <Check className="size-4" />
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="p-2 bg-gray-600 hover:bg-gray-500 text-white rounded transition-colors cursor-pointer"
                  title="Cancel"
                >
                  <X className="size-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="cursor-grab active:cursor-grabbing text-gray-500 hover:text-gray-300 transition-colors">
                  <GripVertical className="size-5" />
                </div>
                <button
                  onClick={() => onSelectProject(project.id)}
                  className={`flex-1 p-4 rounded-lg border-2 transition-all flex items-center justify-between cursor-pointer ${
                    selectedProjectId === project.id
                      ? "border-blue-500 bg-blue-900/30"
                      : "border-gray-700 bg-gray-700/50 hover:border-gray-600"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: project.color }}
                    />
                    <span className="text-lg text-white">{project.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Clock className="size-4" />
                    <span>{formatTime(project.totalTime)}</span>
                  </div>
                </button>
                <button
                  onClick={() => handleStartEdit(project)}
                  className="p-3 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors cursor-pointer"
                  title="Edit project"
                >
                  <Pencil className="size-5" />
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="p-3 bg-gray-700 hover:bg-red-600 text-gray-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                  title="Delete project"
                >
                  <Trash2 className="size-5" />
                </button>
              </div>
            )}
          </div>
        ))}

        {isAddingProject ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddProject()}
              placeholder="Project name"
              className="flex-1 px-4 py-3 border-2 border-gray-700 bg-gray-700 text-white rounded-lg focus:outline-none focus:border-blue-500 placeholder-gray-400"
              autoFocus
            />
            <button
              onClick={handleAddProject}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors cursor-pointer"
            >
              Add
            </button>
            <button
              onClick={() => {
                setIsAddingProject(false);
                setNewProjectName("");
              }}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsAddingProject(true)}
            className="w-full p-4 rounded-lg border-2 border-dashed border-gray-700 hover:border-gray-600 transition-colors flex items-center justify-center gap-2 text-gray-400 hover:text-gray-300 cursor-pointer"
          >
            <Plus className="size-5" />
            Add New Project
          </button>
        )}
      </div>
    </div>
  );
}
