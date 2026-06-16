"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { projectApi } from "@/lib/api";
import { Plus, ExternalLink, BarChart2, LogOut, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";

interface Project {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [fetching, setFetching] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  useEffect(() => {
    if (!loading && !user) router.push("/auth");
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      projectApi.all()
        .then(setProjects)
        .catch(() => {})
        .finally(() => setFetching(false));
    }
  }, [user]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError("");
    setCreating(true);
    try {
      const project = await projectApi.create({ name, description });
      setProjects((p) => [...p, project as Project]);
      setName("");
      setDescription("");
      setShowCreate(false);
    } catch (err: unknown) {
      setCreateError(err instanceof Error ? err.message : "Failed to create project");
    } finally {
      setCreating(false);
    }
  };

  if (loading || !user) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Top nav */}
      <nav className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="flex items-center justify-between px-8 py-4 max-w-7xl mx-auto w-full">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
              <rect x="1" y="1" width="26" height="26" rx="6" stroke="#3b82f6" strokeWidth="1.5" />
              <path d="M7 21L11 14L15 17L19 10L21 13" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="21" cy="10" r="2" fill="#06b6d4" />
            </svg>
            <span className="font-display text-base font-semibold text-slate-100">trackr</span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-3 py-1.5">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center font-display text-xs font-semibold bg-blue-600 text-white"
              >
                {user.first_name[0]}{user.last_name[0]}
              </div>
              <span className="text-sm text-slate-300">
                {user.first_name} {user.last_name}
              </span>
            </div>
            <Button
              onClick={logout}
              variant="ghost"
              size="sm"
              className="gap-1.5"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-slate-100">Projects</h1>
            <p className="text-sm mt-2 text-slate-400">
              {projects.length} project{projects.length !== 1 ? "s" : ""} tracking
            </p>
          </div>
          <Button
            onClick={() => setShowCreate(true)}
            className="gap-2"
          >
            <Plus size={16} />
            New project
          </Button>
        </div>

        {/* Create modal */}
        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create new project</DialogTitle>
              <DialogDescription>
                Create a project to start collecting visitor analytics.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate} className="flex flex-col gap-4">
              <FormField
                label="Project name"
                value={name}
                onChange={setName}
                placeholder="My Website"
                required
                minLength={2}
                maxLength={100}
              />
              <FormField
                label="Description (optional)"
                value={description}
                onChange={setDescription}
                placeholder="What site is this for?"
                maxLength={500}
              />
              {createError && (
                <Alert variant="destructive" className="border-red-500/50 bg-red-500/10">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{createError}</AlertDescription>
                </Alert>
              )}
              <div className="flex gap-3 mt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreate(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={creating}
                  loading={creating}
                  className="flex-1"
                >
                  {creating ? "Creating" : "Create project"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Projects grid */}
        {fetching ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-40 rounded-xl" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <EmptyState onCreate={() => setShowCreate(true)} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/dashboard/${project.id}`}
      className="group"
    >
      <Card className="h-full hover:border-slate-600 hover:bg-slate-700/50 transition-all cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between mb-2">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center bg-blue-500/20 border border-blue-500/30"
            >
              <Activity size={16} className="text-blue-400" />
            </div>
            <ExternalLink size={13} className="text-slate-500 group-hover:text-slate-400 transition-colors" />
          </div>
          <CardTitle className="text-base">{project.name}</CardTitle>
          {project.description && (
            <CardDescription className="line-clamp-2 mt-1">{project.description}</CardDescription>
          )}
        </CardHeader>
        <CardContent className="pb-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <BarChart2 size={12} />
            <span className="font-mono">
              {new Date(project.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center text-center py-20">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-500/20 border border-blue-500/30 mb-4">
          <Activity size={20} className="text-blue-400" />
        </div>
        <h3 className="font-display font-semibold text-lg text-slate-100">No projects yet</h3>
        <p className="text-sm text-slate-400 mb-6 max-w-xs mt-2">
          Create your first project to get a tracking script and start seeing visitor data.
        </p>
        <Button onClick={onCreate} className="gap-2">
          <Plus size={16} />
          Create a project
        </Button>
      </CardContent>
    </Card>
  );
}

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "0ms" }} />
        <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "150ms" }} />
        <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>
    </div>
  );
}
