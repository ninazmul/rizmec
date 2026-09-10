"use client";

import { useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Globe,
  Eye,
  FileText,
  CheckCircle,
  Clock,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RichTextEditor } from "@/components/shared/RichTextEditor";
import PageSectionBuilder from "@/components/dashboard/PageSectionBuilder";
import { IPageSection } from "@/lib/database/models/page.model";
import { createPage, updatePage, deletePage } from "@/lib/actions/page.actions";
import { usePermissions } from "@/lib/hooks/use-permissions";
import { DashboardAccess } from "@/lib/auth/rbac-rules";
import toast from "react-hot-toast";
import Link from "next/link";

type Props = {
  initialPages: any[];
  access: DashboardAccess;
};

export default function PagesClient({ initialPages, access }: Props) {
  const { hasPermission } = usePermissions(access);
  const canCreate = hasPermission("dashboard", "create");
  const canUpdate = hasPermission("dashboard", "update");
  const canDelete = hasPermission("dashboard", "delete");
  const canMutate = canCreate || canUpdate;
  const [pages, setPages] = useState(initialPages);
  const [isOpen, setIsOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<any>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("published");
  const [priority, setPriority] = useState(0);
  const [showInNav, setShowInNav] = useState(false);
  const [parentPage, setParentPage] = useState<string>("none");
  const [sections, setSections] = useState<IPageSection[]>([]);
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");

  const [loading, setLoading] = useState(false);

  // Only top-level pages (no parent) can be parent pages
  const topLevelPages = pages.filter((p) => !p.parentPage);

  // Build hierarchical list for display
  const parentPages = pages.filter((p) => !p.parentPage);
  const childPages = pages.filter((p) => p.parentPage);

  const getParentSlug = (page: any): string => {
    if (!page.parentPage) return "";
    if (typeof page.parentPage === "object") return page.parentPage.slug || "";
    // parentPage is just an id — find it
    const found = pages.find((p) => p._id === page.parentPage);
    return found?.slug || "";
  };

  const getPageUrl = (page: any): string => {
    const parentSlug = getParentSlug(page);
    return parentSlug ? `/${parentSlug}/${page.slug}` : `/${page.slug}`;
  };

  const resetForm = () => {
    setTitle("");
    setSlug("");
    setContent("");
    setDescription("");
    setStatus("published");
    setPriority(0);
    setShowInNav(false);
    setParentPage("none");
    setSections([]);
    setSeoTitle("");
    setSeoDescription("");
    setSeoKeywords("");
    setEditingPage(null);
  };

  const openEditModal = (page: any) => {
    if (!canUpdate) return;
    setEditingPage(page);
    setTitle(page.title || "");
    setSlug(page.slug || "");
    setContent(page.content || "");
    setDescription(page.description || "");
    setStatus(page.status || "published");
    setPriority(page.priority ?? 0);
    setShowInNav(Boolean(page.showInNav));
    setSections(Array.isArray(page.sections) ? page.sections : []);
    // Resolve parentPage id
    const pid =
      typeof page.parentPage === "object"
        ? page.parentPage?._id
        : page.parentPage;
    setParentPage(pid || "none");
    setSeoTitle(page.seo?.title || "");
    setSeoDescription(page.seo?.description || "");
    setSeoKeywords(
      Array.isArray(page.seo?.keywords)
        ? page.seo.keywords.join(", ")
        : typeof page.seo?.keywords === "string"
          ? page.seo.keywords
          : "",
    );
    setIsOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingPage) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setSlug(generatedSlug);
    }
  };

  // Build the live URL preview based on selected parent
  const getPreviewUrl = () => {
    if (parentPage && parentPage !== "none") {
      const parent = pages.find((p) => p._id === parentPage);
      return `/${parent?.slug || "..."}/${slug || "child-slug"}`;
    }
    return `/${slug || "page-slug"}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPage ? !canUpdate : !canCreate) return;
    if (!title.trim() || !slug.trim()) {
      toast.error("Title and Slug are required");
      return;
    }

    setLoading(true);
    const payload = {
      title,
      slug,
      content,
      description,
      status,
      priority: Number(priority),
      showInNav,
      parentPage: parentPage !== "none" ? parentPage : null,
      sections,
      seo: {
        title: seoTitle,
        description: seoDescription,
        keywords: seoKeywords
          .split(",")
          .map((k) => k.trim())
          .filter(Boolean),
      },
    };

    let res;
    if (editingPage) {
      res = await updatePage(editingPage._id, payload);
    } else {
      res = await createPage(payload);
    }

    setLoading(false);

    if (res.success) {
      toast.success(editingPage ? "Page updated!" : "Page created!");
      setIsOpen(false);
      resetForm();
      if (editingPage) {
        setPages(pages.map((p) => (p._id === editingPage._id ? res.data : p)));
      } else {
        setPages([res.data, ...pages]);
      }
    } else {
      toast.error(res.error || "Operation failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!canDelete) return;
    const pageToDelete = pages.find((p) => p._id === id);
    const hasChildren = pages.some((p) => {
      const pid =
        typeof p.parentPage === "object" ? p.parentPage?._id : p.parentPage;
      return String(pid) === String(id);
    });
    const confirmMsg = hasChildren
      ? "This page has sub-pages. Deleting it will also delete all its sub-pages. Are you sure?"
      : "Are you sure you want to delete this page?";

    if (!confirm(confirmMsg)) return;
    const res = await deletePage(id);
    if (res.success) {
      toast.success("Page deleted!");
      // Remove page and its children from local state
      setPages(
        pages.filter((p) => {
          if (p._id === id) return false;
          const pid =
            typeof p.parentPage === "object"
              ? p.parentPage?._id
              : p.parentPage;
          return String(pid) !== String(id);
        }),
      );
    } else {
      toast.error(res.error || "Failed to delete page");
    }
  };

  // Render rows: first parent, then its children indented
  const orderedRows: any[] = [];
  parentPages.forEach((parent) => {
    orderedRows.push({ ...parent, _isParent: true });
    const kids = childPages.filter((c) => {
      const pid =
        typeof c.parentPage === "object" ? c.parentPage?._id : c.parentPage;
      return String(pid) === String(parent._id);
    });
    kids.forEach((kid) => orderedRows.push({ ...kid, _isParent: false }));
  });
  // Also add orphaned children (parent deleted)
  const knownParentIds = new Set(parentPages.map((p) => String(p._id)));
  childPages.forEach((c) => {
    const pid =
      typeof c.parentPage === "object" ? c.parentPage?._id : c.parentPage;
    if (!knownParentIds.has(String(pid))) {
      orderedRows.push({ ...c, _isParent: false });
    }
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm border">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dynamic Pages</h1>
          <p className="text-sm text-gray-500">
            Create and manage dynamic CMS pages with nested sub-pages (e.g.
            /about, /about/overview).
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
                <Plus size={18} /> Create Page
              </Button>
            </DialogTrigger>
          )}
            <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingPage ? "Edit CMS Page" : "Create New CMS Page"}
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-6 py-4">
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-6">
                    <TabsTrigger value="basic">1. Basic Info & Main Content</TabsTrigger>
                    <TabsTrigger value="sections" className="relative">
                      2. Dynamic Page Sections ({sections.length})
                    </TabsTrigger>
                    <TabsTrigger value="seo">3. SEO Settings</TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Page Title *</Label>
                        <Input
                          placeholder="e.g. Overview, Vision, Privacy Policy"
                          value={title}
                          onChange={(e) => handleTitleChange(e.target.value)}
                          required
                          disabled={!canMutate}
                        />
                      </div>
                      <div>
                        <Label>URL Slug *</Label>
                        <div className="flex items-center">
                          <span className="text-xs bg-gray-100 border border-r-0 rounded-l-md px-3 py-2 text-gray-500">
                            /
                          </span>
                          <Input
                            className="rounded-l-none"
                            placeholder="about-us"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            required
                            disabled={!canMutate}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Parent Page Selector */}
                    <div>
                      <Label>Parent Page (optional)</Label>
                      <p className="text-xs text-gray-500 mb-1">
                        Select a parent to make this a sub-page (e.g. /about/overview).
                        Leave empty for a top-level page.
                      </p>
                      <Select
                        value={parentPage}
                        onValueChange={setParentPage}
                        disabled={!canMutate}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="No parent (top-level page)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No parent (top-level page)</SelectItem>
                          {topLevelPages
                            .filter((p) => p._id !== editingPage?._id)
                            .map((p) => (
                              <SelectItem key={p._id} value={p._id}>
                                /{p.slug} — {p.title}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>

                      {/* Live URL Preview */}
                      <div className="mt-2 text-xs text-gray-500 bg-gray-50 border rounded px-3 py-2">
                        <span className="font-semibold text-gray-700">URL Preview: </span>
                        <code className="text-primary font-medium">{getPreviewUrl()}</code>
                      </div>
                    </div>

                    {/* Page Description */}
                    <div>
                      <Label>
                        Page Description (shown below title on the page)
                      </Label>
                      <Input
                        placeholder="A short description of this page"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        disabled={!canMutate}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border p-4 rounded-md bg-gray-50">
                      <div className="flex items-center justify-between">
                        <Label>Publish Status</Label>
                        <Switch
                          checked={status === "published"}
                          onCheckedChange={(checked) =>
                            setStatus(checked ? "published" : "draft")
                          }
                          disabled={!canMutate}
                        />
                        <span className="text-xs font-semibold">
                          {status.toUpperCase()}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <Label>Show in Main Navigation</Label>
                        <Switch
                          checked={showInNav}
                          onCheckedChange={setShowInNav}
                          disabled={!canMutate}
                        />
                      </div>

                      <div>
                        <Label>Sort Priority Order</Label>
                        <Input
                          type="number"
                          value={priority}
                          onChange={(e) => setPriority(Number(e.target.value))}
                          disabled={!canMutate}
                        />
                      </div>
                    </div>

                    {/* Rich Content Editor */}
                    <div>
                      <Label className="mb-2 block font-semibold">
                        Page Content (Rich Text)
                      </Label>
                      <RichTextEditor
                        value={content}
                        onChange={setContent}
                        disabled={!canMutate}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="sections">
                    <PageSectionBuilder
                      sections={sections}
                      onChange={setSections}
                      disabled={!canMutate}
                    />
                  </TabsContent>

                  <TabsContent value="seo">
                    {/* SEO Settings */}
                    <div className="border p-6 rounded-md space-y-4 bg-gray-50">
                      <h4 className="font-semibold text-sm text-gray-700">
                        Search Engine Optimization (SEO)
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>SEO Meta Title</Label>
                          <Input
                            placeholder="Custom browser tab title"
                            value={seoTitle}
                            onChange={(e) => setSeoTitle(e.target.value)}
                            disabled={!canMutate}
                          />
                        </div>
                        <div>
                          <Label>SEO Keywords (comma separated)</Label>
                          <Input
                            placeholder="technology, ai, cloud, consulting, enterprise"
                            value={seoKeywords}
                            onChange={(e) => setSeoKeywords(e.target.value)}
                            disabled={!canMutate}
                          />
                        </div>
                      </div>
                      <div>
                        <Label>SEO Meta Description</Label>
                        <Input
                          placeholder="Brief description for search engine previews"
                          value={seoDescription}
                          onChange={(e) => setSeoDescription(e.target.value)}
                          disabled={!canMutate}
                        />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                  >
                    Cancel
                  </Button>
                  {(editingPage ? canUpdate : canCreate) && (
                    <Button
                      type="submit"
                      disabled={loading}
                      className="bg-primary text-white"
                    >
                      {loading
                        ? "Saving..."
                        : editingPage
                          ? "Update Page"
                          : "Publish Page"}
                    </Button>
                  )}
                </div>
              </form>
            </DialogContent>
          </Dialog>
      </div>

      {/* Pages Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Full URL</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>In Nav</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderedRows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-gray-500"
                >
                  No dynamic pages found. Click &quot;Create Page&quot; to add your first
                  page!
                </TableCell>
              </TableRow>
            ) : (
              orderedRows.map((page: any) => {
                const isChild = !page._isParent && page.parentPage;
                const url = getPageUrl(page);
                return (
                  <TableRow
                    key={page._id}
                    className={isChild ? "bg-gray-50" : ""}
                  >
                    <TableCell className="font-semibold text-gray-900">
                      <div className="flex items-center gap-2">
                        {isChild ? (
                          <>
                            <ChevronRight className="w-4 h-4 text-gray-400 ml-4" />
                            <FileText className="w-4 h-4 text-blue-400" />
                            <span className="text-gray-700 font-normal">
                              {page.title}
                            </span>
                          </>
                        ) : (
                          <>
                            <FileText className="w-4 h-4 text-primary" />
                            {page.title}
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded text-primary">
                        {url}
                      </code>
                    </TableCell>
                    <TableCell>
                      {page.status === "published" ? (
                        <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-medium">
                          <CheckCircle size={12} /> Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-medium">
                          <Clock size={12} /> Draft
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {page.showInNav ? (
                        <span className="text-xs text-primary font-semibold">
                          Yes
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">No</span>
                      )}
                    </TableCell>
                    <TableCell>{page.priority}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Link href={url} target="_blank">
                        <Button
                          variant="ghost"
                          size="icon"
                          title="View Public Page"
                        >
                          <Globe size={16} className="text-blue-600" />
                        </Button>
                      </Link>
                      {canUpdate && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditModal(page)}
                          title="Edit"
                        >
                          <Edit size={16} className="text-gray-600" />
                        </Button>
                      )}
                      {canDelete && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(page._id)}
                          title="Delete"
                        >
                          <Trash2 size={16} className="text-red-600" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
