"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, Star, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RichTextEditor } from "@/components/shared/RichTextEditor";
import MediaLibraryModal from "@/components/shared/MediaLibrary/MediaLibraryModal";
import {
  createProject,
  updateProject,
  deleteProject,
} from "@/lib/actions/project.actions";
import { usePermissions } from "@/lib/hooks/use-permissions";
import { DashboardAccess } from "@/lib/auth/rbac-rules";
import toast from "react-hot-toast";

type Props = {
  initialProjects: any[];
  access: DashboardAccess;
};

export default function ProjectsClient({ initialProjects, access }: Props) {
  const { hasPermission } = usePermissions(access);
  const canCreate = hasPermission("projects", "create");
  const canUpdate = hasPermission("projects", "update");
  const canDelete = hasPermission("projects", "delete");
  const canMutate = canCreate || canUpdate;
  const [projects, setProjects] = useState(initialProjects);
  const [isOpen, setIsOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [featured, setFeatured] = useState(false);
  const [published, setPublished] = useState(true);

  const [isMediaOpen, setIsMediaOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setTitle("");
    setSlug("");
    setThumbnail("");
    setShortDescription("");
    setFullDescription("");
    setFeatured(false);
    setPublished(true);
    setEditingProject(null);
  };

  const openEditModal = (project: any) => {
    if (!canUpdate) return;
    setEditingProject(project);
    setTitle(project.title || "");
    setSlug(project.slug || "");
    setThumbnail(project.image || project.thumbnail || "");
    setShortDescription(project.shortDescription || "");
    setFullDescription(project.fullDescription || "");
    setFeatured(project.featured || false);
    setPublished(project.published !== undefined ? project.published : true);
    setIsOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingProject) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setSlug(generatedSlug);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProject ? !canUpdate : !canCreate) return;
    if (!title.trim() || !slug.trim()) {
      toast.error("Title and Slug are required");
      return;
    }

    setLoading(true);
    const payload = {
      title,
      slug,
      thumbnail,
      shortDescription,
      fullDescription,
      featured,
      published,
    };

    let res;
    if (editingProject) {
      res = await updateProject(editingProject._id, payload);
    } else {
      res = await createProject(payload);
    }

    setLoading(false);

    if (res.success) {
      toast.success(editingProject ? "Project updated!" : "Project created!");
      setIsOpen(false);
      resetForm();
      if (editingProject) {
        setProjects(
          projects.map((p) => (p._id === editingProject._id ? res.data : p)),
        );
      } else {
        setProjects([res.data, ...projects]);
      }
    } else {
      toast.error(res.error || "Operation failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!canDelete) return;
    if (!confirm("Delete this project?")) return;
    const res = await deleteProject(id);
    if (res.success) {
      toast.success("Project deleted!");
      setProjects(projects.filter((p) => p._id !== id));
    } else {
      toast.error(res.error || "Failed to delete project");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm border">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            NGO Projects & Initiatives
          </h1>
          <p className="text-sm text-gray-500">
            Create and manage ongoing community projects, featured initiatives,
            and descriptions
          </p>
        </div>
        <Dialog
          open={isOpen}
          onOpenChange={(val) => {
            setIsOpen(val);
            if (!val) resetForm();
          }}
        >
          {canCreate && (
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2 bg-primary text-white">
                <Plus size={18} /> Add Project
              </Button>
            </DialogTrigger>
          )}
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProject ? "Edit Project" : "Create Project"}
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Project Title *</Label>
                    <Input
                      placeholder="e.g. Clean Water Initiative 2026"
                      value={title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      required
                      disabled={
                        !canMutate
                      }
                    />
                  </div>
                  <div>
                    <Label>URL Slug *</Label>
                    <Input
                      placeholder="clean-water-initiative-2026"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      required
                      disabled={
                        !canMutate
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label>Thumbnail Image URL</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="https://..."
                      value={thumbnail}
                      onChange={(e) => setThumbnail(e.target.value)}
                      disabled={
                        !canMutate
                      }
                    />
                    {canMutate && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsMediaOpen(true)}
                      >
                        Select Image
                      </Button>
                    )}
                  </div>
                  {thumbnail && (
                    <img
                      src={thumbnail}
                      alt="Thumbnail"
                      className="mt-2 h-24 object-cover rounded border"
                    />
                  )}
                </div>

                <div>
                  <Label>Short Summary / Subtitle</Label>
                  <Textarea
                    rows={2}
                    placeholder="Brief 1-2 sentence overview of the project..."
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    disabled={
                      !canMutate
                    }
                  />
                </div>

                <div>
                  <Label className="mb-2 block">
                    Full Project Details (Rich Text)
                  </Label>
                  <RichTextEditor
                    value={fullDescription}
                    onChange={setFullDescription}
                    disabled={
                      !canMutate
                    }
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-md bg-gray-50">
                  <div className="flex items-center justify-between">
                    <Label>Feature on Homepage</Label>
                    <Switch
                      checked={featured}
                      onCheckedChange={setFeatured}
                      disabled={
                        !canMutate
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Published Status</Label>
                    <Switch
                      checked={published}
                      onCheckedChange={setPublished}
                      disabled={
                        !canMutate
                      }
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                  >
                    Cancel
                  </Button>
                  {(editingProject ? canUpdate : canCreate) && (
                    <Button
                      type="submit"
                      disabled={loading}
                      className="bg-primary text-white"
                    >
                      {loading
                        ? "Saving..."
                        : editingProject
                          ? "Update Project"
                          : "Create Project"}
                    </Button>
                  )}
                </div>
              </form>
            </DialogContent>
          </Dialog>
      </div>

      <MediaLibraryModal
        open={isMediaOpen}
        onOpenChange={setIsMediaOpen}
        onSelect={(url) => {
          setThumbnail(url);
          setIsMediaOpen(false);
        }}
      />

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Thumbnail</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-gray-500"
                >
                  No projects added yet. Click "Add Project" to get started!
                </TableCell>
              </TableRow>
            ) : (
              projects.map((project: any) => (
                <TableRow key={project._id}>
                  <TableCell>
                    {project.image || project.thumbnail ? (
                      <img
                        src={project.image || project.thumbnail}
                        alt={project.title}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">
                        No img
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold text-gray-900">
                      {project.title}
                    </div>
                    <div className="text-xs text-gray-500">/{project.slug}</div>
                  </TableCell>
                  <TableCell>
                    {project.featured ? (
                      <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-medium">
                        <Star size={12} fill="currentColor" /> Featured
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">Standard</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {project.published ? (
                      <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-medium">
                        <CheckCircle size={12} /> Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-800 font-medium">
                        <Clock size={12} /> Draft
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    {canUpdate && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditModal(project)}
                      >
                        <Edit size={16} className="text-gray-600" />
                      </Button>
                    )}
                    {canDelete && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(project._id)}
                      >
                        <Trash2 size={16} className="text-red-600" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
