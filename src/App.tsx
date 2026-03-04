import { useState, useCallback } from "react";
import { Timer } from "./components/Timer";
import { TimerControls } from "./components/TimerControls";
import { ProjectSelector } from "./components/ProjectSelector";
import type { Project } from "./components/ProjectSelector";
import { useLocalStorage } from "./hooks/useLocalStorage";

const DEFAULT_PROJECTS: Project[] = [
  { id: "1", name: "Website Redesign", totalTime: 0, color: "#3b82f6" },
  { id: "2", name: "Mobile App Development", totalTime: 0, color: "#10b981" },
  { id: "3", name: "Marketing Campaign", totalTime: 0, color: "#f59e0b" },
];

export default function App() {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [projects, setProjects] = useLocalStorage<Project[]>("zappytime-projects", DEFAULT_PROJECTS);
  const [selectedProjectId, setSelectedProjectId] = useLocalStorage<string | null>("zappytime-selected-project", null);
  const [currentSessionTime, setCurrentSessionTime] = useState(0);

  const handleStart = () => {
    if (!selectedProjectId) {
      alert("Please select a project first!");
      return;
    }
    setIsRunning(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(true);
  };

  const handleStop = () => {
    if (selectedProjectId && currentSessionTime > 0) {
      setProjects((prev) =>
        prev.map((project) =>
          project.id === selectedProjectId
            ? { ...project, totalTime: project.totalTime + currentSessionTime }
            : project
        )
      );
    }
    setIsRunning(false);
    setIsPaused(false);
    setCurrentSessionTime(0);
  };

  const handleTimeUpdate = useCallback((seconds: number) => {
    setCurrentSessionTime(seconds);
  }, []);

  const handleAddProject = (name: string) => {
    const colors = ["#ef4444", "#8b5cf6", "#ec4899", "#06b6d4", "#14b8a6"];
    const newProject: Project = {
      id: Date.now().toString(),
      name,
      totalTime: 0,
      color: colors[Math.floor(Math.random() * colors.length)],
    };
    setProjects((prev) => [...prev, newProject]);
    setSelectedProjectId(newProject.id);
  };

  const handleEditProject = (id: string, newName: string) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === id ? { ...project, name: newName } : project
      )
    );
  };

  const handleDeleteProject = (id: string) => {
    setProjects((prev) => prev.filter((project) => project.id !== id));
    if (selectedProjectId === id) {
      setSelectedProjectId(null);
    }
    if (isRunning && selectedProjectId === id) {
      setIsRunning(false);
      setIsPaused(false);
      setCurrentSessionTime(0);
    }
  };

  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl mb-8 text-center text-white font-medium">ZappyTime</h1>

        <div className="bg-gray-800 rounded-2xl shadow-lg p-12 mb-6">
          <Timer
            isRunning={isRunning}
            isPaused={isPaused}
            onTimeUpdate={handleTimeUpdate}
          />
          {selectedProject && (
            <div className="text-center mt-4 text-xl text-gray-300">
              Tracking: <span className="font-semibold text-white">{selectedProject.name}</span>
            </div>
          )}
        </div>

        <div className="mb-8">
          <TimerControls
            isRunning={isRunning}
            isPaused={isPaused}
            onStart={handleStart}
            onPause={handlePause}
            onStop={handleStop}
          />
        </div>

        <div className="bg-gray-800 rounded-2xl shadow-lg p-8">
          <ProjectSelector
            projects={projects}
            selectedProjectId={selectedProjectId}
            onSelectProject={setSelectedProjectId}
            onAddProject={handleAddProject}
            onEditProject={handleEditProject}
            onDeleteProject={handleDeleteProject}
          />
        </div>
      </div>
    </div>
  );
}
