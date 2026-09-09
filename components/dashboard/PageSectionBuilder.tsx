"use client";

import { useState } from "react";
import { IPageSection } from "@/lib/database/models/page.model";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Image as ImageIcon,
  User,
  LayoutGrid,
  Megaphone,
  BarChart3,
  HelpCircle,
  FileText,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import MediaLibraryModal from "@/components/shared/MediaLibrary/MediaLibraryModal";
import { RichTextEditor } from "@/components/shared/RichTextEditor";

interface Props {
  sections: IPageSection[];
  onChange: (sections: IPageSection[]) => void;
  disabled?: boolean;
}

export default function PageSectionBuilder({
  sections,
  onChange,
  disabled = false,
}: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // State for MediaLibrary Modal selection target
  const [mediaPickerConfig, setMediaPickerConfig] = useState<{
    open: boolean;
    onSelect: (url: string) => void;
  }>({
    open: false,
    onSelect: () => {},
  });

  const openMediaPicker = (onSelectUrl: (url: string) => void) => {
    if (disabled) return;
    setMediaPickerConfig({
      open: true,
      onSelect: onSelectUrl,
    });
  };

  const addSection = (type: IPageSection["type"]) => {
    if (disabled) return;
    const id = `sec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newSection: IPageSection = {
      id,
      type,
      title: getDefaultTitle(type),
      subtitle: "",
      enabled: true,
      order: sections.length,
      founders: type === "founders" ? [createDefaultFounder()] : [],
      images: type === "imageBanner" ? [{ url: "", caption: "", alt: "", link: "" }] : [],
      imageLayout: "banner",
      cards: type === "contentCards" ? [createDefaultCard()] : [],
      cardColumns: 3,
      cta:
        type === "ctaBox"
          ? {
              title: "Ready to Make a Difference?",
              description: "Join our mission today and transform lives.",
              buttonText: "Get Involved",
              buttonUrl: "/contact",
              variant: "primary",
            }
          : undefined,
      stats: type === "statCards" ? [createDefaultStat()] : [],
      accordion: type === "accordion" ? [createDefaultAccordion()] : [],
      richText: type === "richText" ? "<p>Add custom content here...</p>" : "",
    };

    const updated = [...sections, newSection];
    onChange(updated);
    setExpandedId(id);
  };

  const updateSection = (id: string, updatedFields: Partial<IPageSection>) => {
    if (disabled) return;
    const updated = sections.map((sec) =>
      sec.id === id ? { ...sec, ...updatedFields } : sec
    );
    onChange(updated);
  };

  const deleteSection = (id: string) => {
    if (disabled) return;
    const updated = sections.filter((sec) => sec.id !== id);
    onChange(updated);
  };

  const moveSection = (index: number, direction: "up" | "down") => {
    if (disabled) return;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const newSections = [...sections];
    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;

    // re-index order
    const ordered = newSections.map((sec, idx) => ({ ...sec, order: idx }));
    onChange(ordered);
  };

  return (
    <div className="space-y-6">
      <MediaLibraryModal
        open={mediaPickerConfig.open}
        onOpenChange={(open) =>
          setMediaPickerConfig((prev) => ({ ...prev, open }))
        }
        onSelect={mediaPickerConfig.onSelect}
      />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div>
          <h3 className="font-bold text-slate-900 text-lg">
            Dynamic Page Sections & Cards Builder
          </h3>
          <p className="text-xs text-slate-500">
            Add custom interactive cards, founders profiles, image banners, stats, or accordions to this page.
          </p>
        </div>

        {!disabled && (
          <Select onValueChange={(val) => addSection(val as IPageSection["type"])}>
            <SelectTrigger className="w-full sm:w-[220px] bg-primary text-white font-semibold hover:bg-emerald-700">
              <Plus className="w-4 h-4 mr-2" />
              <span>Add New Section</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="founders">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-600" />
                  <span>Founders / Team Cards</span>
                </div>
              </SelectItem>
              <SelectItem value="imageBanner">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-blue-600" />
                  <span>Image Banner / Gallery</span>
                </div>
              </SelectItem>
              <SelectItem value="contentCards">
                <div className="flex items-center gap-2">
                  <LayoutGrid className="w-4 h-4 text-purple-600" />
                  <span>Feature / Content Cards</span>
                </div>
              </SelectItem>
              <SelectItem value="ctaBox">
                <div className="flex items-center gap-2">
                  <Megaphone className="w-4 h-4 text-amber-600" />
                  <span>Call to Action Box</span>
                </div>
              </SelectItem>
              <SelectItem value="statCards">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-indigo-600" />
                  <span>Impact Stat Cards</span>
                </div>
              </SelectItem>
              <SelectItem value="accordion">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-teal-600" />
                  <span>FAQ / Accordion</span>
                </div>
              </SelectItem>
              <SelectItem value="richText">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-600" />
                  <span>Custom Rich Text</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Sections List */}
      {sections.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl bg-white">
          <LayoutGrid className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h4 className="font-semibold text-slate-700 mb-1">
            No dynamic sections added yet
          </h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
            Click &quot;Add New Section&quot; above to add founder profile cards, image banners, feature grids, CTAs, or statistics.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sections.map((section, idx) => {
            const isExpanded = expandedId === section.id;
            return (
              <div
                key={section.id || idx}
                className={`bg-white rounded-xl border transition shadow-sm ${
                  section.enabled !== false
                    ? "border-slate-200"
                    : "border-slate-200 opacity-60 bg-slate-50"
                }`}
              >
                {/* Header Row */}
                <div className="p-4 flex items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/50 rounded-t-xl">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedId(isExpanded ? null : section.id)
                      }
                      className="p-1 hover:bg-slate-200 rounded text-slate-600 transition"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>
                    <SectionIcon type={section.type} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800 text-sm">
                          {section.title || getDefaultTitle(section.type)}
                        </span>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                          {section.type}
                        </span>
                      </div>
                      {section.subtitle && (
                        <p className="text-xs text-slate-500">
                          {section.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 mr-2">
                      <Switch
                        checked={section.enabled !== false}
                        onCheckedChange={(checked) =>
                          updateSection(section.id, { enabled: checked })
                        }
                        disabled={disabled}
                      />
                      <span className="text-xs font-semibold text-slate-600">
                        {section.enabled !== false ? "Active" : "Hidden"}
                      </span>
                    </div>

                    {!disabled && (
                      <>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => moveSection(idx, "up")}
                          disabled={idx === 0}
                          title="Move Up"
                        >
                          <ArrowUp className="w-4 h-4 text-slate-600" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => moveSection(idx, "down")}
                          disabled={idx === sections.length - 1}
                          title="Move Down"
                        >
                          <ArrowDown className="w-4 h-4 text-slate-600" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteSection(section.id)}
                          title="Delete Section"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* Expanded Form Body */}
                {isExpanded && (
                  <div className="p-6 space-y-6">
                    {/* Common Section Meta */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-slate-100">
                      <div>
                        <Label>Section Main Title</Label>
                        <Input
                          placeholder="e.g. Meet Our Founders"
                          value={section.title || ""}
                          onChange={(e) =>
                            updateSection(section.id, {
                              title: e.target.value,
                            })
                          }
                          disabled={disabled}
                        />
                      </div>
                      <div>
                        <Label>Section Subtitle / Tagline</Label>
                        <Input
                          placeholder="e.g. The leaders driving our mission"
                          value={section.subtitle || ""}
                          onChange={(e) =>
                            updateSection(section.id, {
                              subtitle: e.target.value,
                            })
                          }
                          disabled={disabled}
                        />
                      </div>
                    </div>

                    {/* Specific Section Editors */}
                    {section.type === "founders" && (
                      <FoundersEditor
                        founders={section.founders || []}
                        onChange={(founders) =>
                          updateSection(section.id, { founders })
                        }
                        openMediaPicker={openMediaPicker}
                        disabled={disabled}
                      />
                    )}

                    {section.type === "imageBanner" && (
                      <ImageBannerEditor
                        images={section.images || []}
                        imageLayout={section.imageLayout || "banner"}
                        onChange={(images, imageLayout) =>
                          updateSection(section.id, { images, imageLayout })
                        }
                        openMediaPicker={openMediaPicker}
                        disabled={disabled}
                      />
                    )}

                    {section.type === "contentCards" && (
                      <ContentCardsEditor
                        cards={section.cards || []}
                        cardColumns={section.cardColumns || 3}
                        onChange={(cards, cardColumns) =>
                          updateSection(section.id, { cards, cardColumns })
                        }
                        openMediaPicker={openMediaPicker}
                        disabled={disabled}
                      />
                    )}

                    {section.type === "ctaBox" && (
                      <CtaBoxEditor
                        cta={
                          section.cta || {
                            title: "",
                            description: "",
                            buttonText: "",
                            buttonUrl: "",
                            variant: "primary",
                          }
                        }
                        onChange={(cta) =>
                          updateSection(section.id, { cta })
                        }
                        openMediaPicker={openMediaPicker}
                        disabled={disabled}
                      />
                    )}

                    {section.type === "statCards" && (
                      <StatCardsEditor
                        stats={section.stats || []}
                        onChange={(stats) =>
                          updateSection(section.id, { stats })
                        }
                        disabled={disabled}
                      />
                    )}

                    {section.type === "accordion" && (
                      <AccordionEditor
                        accordion={section.accordion || []}
                        onChange={(accordion) =>
                          updateSection(section.id, { accordion })
                        }
                        disabled={disabled}
                      />
                    )}

                    {section.type === "richText" && (
                      <div>
                        <Label className="mb-2 block font-semibold">
                          Custom HTML / Content
                        </Label>
                        <RichTextEditor
                          value={section.richText || ""}
                          onChange={(val) =>
                            updateSection(section.id, { richText: val })
                          }
                          disabled={disabled}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   HELPER UTILS & SUB-EDITORS
   ========================================================================= */

function SectionIcon({ type }: { type: IPageSection["type"] }) {
  switch (type) {
    case "founders":
      return <User className="w-5 h-5 text-emerald-600" />;
    case "imageBanner":
      return <ImageIcon className="w-5 h-5 text-blue-600" />;
    case "contentCards":
      return <LayoutGrid className="w-5 h-5 text-purple-600" />;
    case "ctaBox":
      return <Megaphone className="w-5 h-5 text-amber-600" />;
    case "statCards":
      return <BarChart3 className="w-5 h-5 text-indigo-600" />;
    case "accordion":
      return <HelpCircle className="w-5 h-5 text-teal-600" />;
    case "richText":
      return <FileText className="w-5 h-5 text-gray-600" />;
  }
}

function getDefaultTitle(type: IPageSection["type"]) {
  switch (type) {
    case "founders":
      return "Meet Our Founders & Leadership";
    case "imageBanner":
      return "Featured Gallery / Banner";
    case "contentCards":
      return "Key Focus Areas & Programs";
    case "ctaBox":
      return "Support Our Mission";
    case "statCards":
      return "Our Impact in Numbers";
    case "accordion":
      return "Frequently Asked Questions";
    case "richText":
      return "Custom Content Section";
  }
}

function createDefaultFounder() {
  return {
    name: "Jane Doe",
    title: "Co-Founder & Executive Director",
    image: "",
    bio: "Dedicated leader with a vision to empower local communities through education and development.",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    email: "hello@rizmec.com",
  };
}

function createDefaultCard() {
  return {
    title: "Education Initiative",
    subtitle: "Empowerment",
    description: "Providing resources, schools, and scholarships for underprivileged children.",
    image: "",
    linkUrl: "/projects",
    linkText: "Learn More",
  };
}

function createDefaultStat() {
  return {
    value: "10,000+",
    label: "Lives Impacted",
    description: "Across multiple rural communities.",
  };
}

function createDefaultAccordion() {
  return {
    question: "What is the primary mission of RIZMEC?",
    answer: "Our mission is to foster sustainable community development, healthcare, and education.",
  };
}

/* -------------------------------------------------------------------------
   FOUNDERS EDITOR
   ------------------------------------------------------------------------- */
function FoundersEditor({
  founders,
  onChange,
  openMediaPicker,
  disabled,
}: {
  founders: NonNullable<IPageSection["founders"]>;
  onChange: (founders: NonNullable<IPageSection["founders"]>) => void;
  openMediaPicker: (onSelect: (url: string) => void) => void;
  disabled: boolean;
}) {
  const addFounder = () => {
    onChange([...founders, createDefaultFounder()]);
  };

  const updateFounder = (index: number, fields: any) => {
    const updated = founders.map((item, idx) =>
      idx === index ? { ...item, ...fields } : item
    );
    onChange(updated);
  };

  const removeFounder = (index: number) => {
    onChange(founders.filter((_, idx) => idx !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-bold text-slate-800 text-sm">Founder Cards List</h4>
        {!disabled && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={addFounder}
            className="flex items-center gap-1 text-xs"
          >
            <Plus className="w-3.5 h-3.5" /> Add Founder
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {founders.map((founder, idx) => (
          <div
            key={idx}
            className="p-4 border rounded-xl bg-slate-50/50 space-y-4 relative"
          >
            <div className="flex justify-between items-center border-b pb-2">
              <span className="font-semibold text-xs text-slate-600">
                Founder #{idx + 1}
              </span>
              {!disabled && founders.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-red-500"
                  onClick={() => removeFounder(idx)}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Full Name *</Label>
                <Input
                  value={founder.name}
                  onChange={(e) =>
                    updateFounder(idx, { name: e.target.value })
                  }
                  placeholder="e.g. Dr. Sarah Rahman"
                  disabled={disabled}
                />
              </div>
              <div>
                <Label>Designation / Title *</Label>
                <Input
                  value={founder.title}
                  onChange={(e) =>
                    updateFounder(idx, { title: e.target.value })
                  }
                  placeholder="e.g. Founder & Chairman"
                  disabled={disabled}
                />
              </div>
            </div>

            {/* Image Picker */}
            <div>
              <Label>Founder Profile Photo</Label>
              <div className="flex items-center gap-3 mt-1">
                <Input
                  value={founder.image || ""}
                  onChange={(e) =>
                    updateFounder(idx, { image: e.target.value })
                  }
                  placeholder="https://... or select from Media Library"
                  disabled={disabled}
                />
                {!disabled && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      openMediaPicker((url) =>
                        updateFounder(idx, { image: url })
                      )
                    }
                  >
                    <ImageIcon className="w-4 h-4 mr-1" /> Browse
                  </Button>
                )}
              </div>
            </div>

            <div>
              <Label>Short Biography</Label>
              <Textarea
                rows={2}
                value={founder.bio || ""}
                onChange={(e) =>
                  updateFounder(idx, { bio: e.target.value })
                }
                placeholder="Brief summary of founder background..."
                disabled={disabled}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <Label>LinkedIn URL</Label>
                <Input
                  value={founder.linkedin || ""}
                  onChange={(e) =>
                    updateFounder(idx, { linkedin: e.target.value })
                  }
                  placeholder="https://linkedin.com/in/..."
                  disabled={disabled}
                />
              </div>
              <div>
                <Label>Twitter / X URL</Label>
                <Input
                  value={founder.twitter || ""}
                  onChange={(e) =>
                    updateFounder(idx, { twitter: e.target.value })
                  }
                  placeholder="https://x.com/..."
                  disabled={disabled}
                />
              </div>
              <div>
                <Label>Contact Email</Label>
                <Input
                  value={founder.email || ""}
                  onChange={(e) =>
                    updateFounder(idx, { email: e.target.value })
                  }
                  placeholder="hello@rizmec.com"
                  disabled={disabled}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------
   IMAGE BANNER EDITOR
   ------------------------------------------------------------------------- */
function ImageBannerEditor({
  images,
  imageLayout,
  onChange,
  openMediaPicker,
  disabled,
}: {
  images: NonNullable<IPageSection["images"]>;
  imageLayout: "banner" | "grid" | "sideBySide";
  onChange: (
    images: NonNullable<IPageSection["images"]>,
    imageLayout: "banner" | "grid" | "sideBySide"
  ) => void;
  openMediaPicker: (onSelect: (url: string) => void) => void;
  disabled: boolean;
}) {
  const addImage = () => {
    onChange([...images, { url: "", caption: "", alt: "", link: "" }], imageLayout);
  };

  const updateImage = (index: number, fields: any) => {
    const updated = images.map((item, idx) =>
      idx === index ? { ...item, ...fields } : item
    );
    onChange(updated, imageLayout);
  };

  const removeImage = (index: number) => {
    onChange(
      images.filter((_, idx) => idx !== index),
      imageLayout
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Layout Format</Label>
        <Select
          value={imageLayout}
          onValueChange={(val: any) => onChange(images, val)}
          disabled={disabled}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="banner">Single Full Banner</SelectItem>
            <SelectItem value="grid">Image Gallery Grid</SelectItem>
            <SelectItem value="sideBySide">Side-by-Side (Image + Text)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-between items-center">
        <h4 className="font-bold text-slate-800 text-sm">Images List</h4>
        {!disabled && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={addImage}
            className="flex items-center gap-1 text-xs"
          >
            <Plus className="w-3.5 h-3.5" /> Add Image
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {images.map((img, idx) => (
          <div key={idx} className="p-4 border rounded-xl bg-slate-50/50 space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-xs text-slate-600">
                Image #{idx + 1}
              </span>
              {!disabled && images.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-red-500"
                  onClick={() => removeImage(idx)}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>

            <div>
              <Label>Image URL *</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input
                  value={img.url}
                  onChange={(e) =>
                    updateImage(idx, { url: e.target.value })
                  }
                  placeholder="https://... or select from Media Library"
                  disabled={disabled}
                />
                {!disabled && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      openMediaPicker((url) =>
                        updateImage(idx, { url })
                      )
                    }
                  >
                    <ImageIcon className="w-4 h-4 mr-1" /> Browse
                  </Button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label>Caption / Text Overlay</Label>
                <Input
                  value={img.caption || ""}
                  onChange={(e) =>
                    updateImage(idx, { caption: e.target.value })
                  }
                  placeholder="Caption text..."
                  disabled={disabled}
                />
              </div>
              <div>
                <Label>Link / Target URL (optional)</Label>
                <Input
                  value={img.link || ""}
                  onChange={(e) =>
                    updateImage(idx, { link: e.target.value })
                  }
                  placeholder="/projects or https://..."
                  disabled={disabled}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------
   CONTENT CARDS EDITOR
   ------------------------------------------------------------------------- */
function ContentCardsEditor({
  cards,
  cardColumns,
  onChange,
  openMediaPicker,
  disabled,
}: {
  cards: NonNullable<IPageSection["cards"]>;
  cardColumns: number;
  onChange: (cards: NonNullable<IPageSection["cards"]>, cols: number) => void;
  openMediaPicker: (onSelect: (url: string) => void) => void;
  disabled: boolean;
}) {
  const addCard = () => {
    onChange([...cards, createDefaultCard()], cardColumns);
  };

  const updateCard = (index: number, fields: any) => {
    const updated = cards.map((item, idx) =>
      idx === index ? { ...item, ...fields } : item
    );
    onChange(updated, cardColumns);
  };

  const removeCard = (index: number) => {
    onChange(
      cards.filter((_, idx) => idx !== index),
      cardColumns
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Grid Columns</Label>
        <Select
          value={String(cardColumns)}
          onValueChange={(val) => onChange(cards, Number(val))}
          disabled={disabled}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2">2 Columns</SelectItem>
            <SelectItem value="3">3 Columns</SelectItem>
            <SelectItem value="4">4 Columns</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-between items-center">
        <h4 className="font-bold text-slate-800 text-sm">Feature Cards List</h4>
        {!disabled && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={addCard}
            className="flex items-center gap-1 text-xs"
          >
            <Plus className="w-3.5 h-3.5" /> Add Card
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {cards.map((card, idx) => (
          <div key={idx} className="p-4 border rounded-xl bg-slate-50/50 space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-xs text-slate-600">
                Card #{idx + 1}
              </span>
              {!disabled && cards.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-red-500"
                  onClick={() => removeCard(idx)}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label>Card Title *</Label>
                <Input
                  value={card.title}
                  onChange={(e) =>
                    updateCard(idx, { title: e.target.value })
                  }
                  placeholder="Card Title"
                  disabled={disabled}
                />
              </div>
              <div>
                <Label>Card Subtitle / Category Tag</Label>
                <Input
                  value={card.subtitle || ""}
                  onChange={(e) =>
                    updateCard(idx, { subtitle: e.target.value })
                  }
                  placeholder="e.g. Healthcare"
                  disabled={disabled}
                />
              </div>
            </div>

            <div>
              <Label>Card Image (optional)</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input
                  value={card.image || ""}
                  onChange={(e) =>
                    updateCard(idx, { image: e.target.value })
                  }
                  placeholder="https://..."
                  disabled={disabled}
                />
                {!disabled && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      openMediaPicker((url) =>
                        updateCard(idx, { image: url })
                      )
                    }
                  >
                    <ImageIcon className="w-4 h-4 mr-1" /> Browse
                  </Button>
                )}
              </div>
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                rows={2}
                value={card.description || ""}
                onChange={(e) =>
                  updateCard(idx, { description: e.target.value })
                }
                placeholder="Card description..."
                disabled={disabled}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label>Button Link URL</Label>
                <Input
                  value={card.linkUrl || ""}
                  onChange={(e) =>
                    updateCard(idx, { linkUrl: e.target.value })
                  }
                  placeholder="/contact or https://..."
                  disabled={disabled}
                />
              </div>
              <div>
                <Label>Button Text</Label>
                <Input
                  value={card.linkText || ""}
                  onChange={(e) =>
                    updateCard(idx, { linkText: e.target.value })
                  }
                  placeholder="Learn More"
                  disabled={disabled}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------
   CTA BOX EDITOR
   ------------------------------------------------------------------------- */
function CtaBoxEditor({
  cta,
  onChange,
  openMediaPicker,
  disabled,
}: {
  cta: NonNullable<IPageSection["cta"]>;
  onChange: (cta: NonNullable<IPageSection["cta"]>) => void;
  openMediaPicker: (onSelect: (url: string) => void) => void;
  disabled: boolean;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>CTA Title</Label>
          <Input
            value={cta.title || ""}
            onChange={(e) => onChange({ ...cta, title: e.target.value })}
            placeholder="Main headline"
            disabled={disabled}
          />
        </div>
        <div>
          <Label>Background Style Variant</Label>
          <Select
            value={cta.variant || "primary"}
            onValueChange={(val: any) => onChange({ ...cta, variant: val })}
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="primary">Primary Gradient (Green/Emerald)</SelectItem>
              <SelectItem value="dark">Dark Theme (Slate 900)</SelectItem>
              <SelectItem value="outline">Light Card with Shadow</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>CTA Description</Label>
        <Textarea
          rows={2}
          value={cta.description || ""}
          onChange={(e) => onChange({ ...cta, description: e.target.value })}
          placeholder="Call to action text..."
          disabled={disabled}
        />
      </div>

      <div>
        <Label>Side Image (optional)</Label>
        <div className="flex items-center gap-2 mt-1">
          <Input
            value={cta.image || ""}
            onChange={(e) => onChange({ ...cta, image: e.target.value })}
            placeholder="https://..."
            disabled={disabled}
          />
          {!disabled && (
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                openMediaPicker((url) => onChange({ ...cta, image: url }))
              }
            >
              <ImageIcon className="w-4 h-4 mr-1" /> Browse
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t">
        <div>
          <Label>Primary Button Text</Label>
          <Input
            value={cta.buttonText || ""}
            onChange={(e) => onChange({ ...cta, buttonText: e.target.value })}
            placeholder="Get Started"
            disabled={disabled}
          />
        </div>
        <div>
          <Label>Primary Button Link URL</Label>
          <Input
            value={cta.buttonUrl || ""}
            onChange={(e) => onChange({ ...cta, buttonUrl: e.target.value })}
            placeholder="/contact"
            disabled={disabled}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Secondary Button Text (optional)</Label>
          <Input
            value={cta.secondaryButtonText || ""}
            onChange={(e) =>
              onChange({ ...cta, secondaryButtonText: e.target.value })
            }
            placeholder="Learn More"
            disabled={disabled}
          />
        </div>
        <div>
          <Label>Secondary Button Link URL</Label>
          <Input
            value={cta.secondaryButtonUrl || ""}
            onChange={(e) =>
              onChange({ ...cta, secondaryButtonUrl: e.target.value })
            }
            placeholder="/contact"
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------
   STAT CARDS EDITOR
   ------------------------------------------------------------------------- */
function StatCardsEditor({
  stats,
  onChange,
  disabled,
}: {
  stats: NonNullable<IPageSection["stats"]>;
  onChange: (stats: NonNullable<IPageSection["stats"]>) => void;
  disabled: boolean;
}) {
  const addStat = () => {
    onChange([...stats, createDefaultStat()]);
  };

  const updateStat = (index: number, fields: any) => {
    const updated = stats.map((item, idx) =>
      idx === index ? { ...item, ...fields } : item
    );
    onChange(updated);
  };

  const removeStat = (index: number) => {
    onChange(stats.filter((_, idx) => idx !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-bold text-slate-800 text-sm">Stat Cards List</h4>
        {!disabled && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={addStat}
            className="flex items-center gap-1 text-xs"
          >
            <Plus className="w-3.5 h-3.5" /> Add Metric Stat
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="p-4 border rounded-xl bg-slate-50/50 space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-xs text-slate-600">
                Stat #{idx + 1}
              </span>
              {!disabled && stats.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-red-500"
                  onClick={() => removeStat(idx)}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>

            <div>
              <Label>Stat Value / Number *</Label>
              <Input
                value={stat.value}
                onChange={(e) =>
                  updateStat(idx, { value: e.target.value })
                }
                placeholder="e.g. 50,000+ or $1.2M"
                disabled={disabled}
              />
            </div>
            <div>
              <Label>Stat Label *</Label>
              <Input
                value={stat.label}
                onChange={(e) =>
                  updateStat(idx, { label: e.target.value })
                }
                placeholder="e.g. Lives Impacted"
                disabled={disabled}
              />
            </div>
            <div>
              <Label>Subtext / Description</Label>
              <Input
                value={stat.description || ""}
                onChange={(e) =>
                  updateStat(idx, { description: e.target.value })
                }
                placeholder="Across 12 districts"
                disabled={disabled}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------
   ACCORDION EDITOR
   ------------------------------------------------------------------------- */
function AccordionEditor({
  accordion,
  onChange,
  disabled,
}: {
  accordion: NonNullable<IPageSection["accordion"]>;
  onChange: (accordion: NonNullable<IPageSection["accordion"]>) => void;
  disabled: boolean;
}) {
  const addItem = () => {
    onChange([...accordion, createDefaultAccordion()]);
  };

  const updateItem = (index: number, fields: any) => {
    const updated = accordion.map((item, idx) =>
      idx === index ? { ...item, ...fields } : item
    );
    onChange(updated);
  };

  const removeItem = (index: number) => {
    onChange(accordion.filter((_, idx) => idx !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-bold text-slate-800 text-sm">FAQ Accordion Items</h4>
        {!disabled && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={addItem}
            className="flex items-center gap-1 text-xs"
          >
            <Plus className="w-3.5 h-3.5" /> Add FAQ Item
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {accordion.map((item, idx) => (
          <div key={idx} className="p-4 border rounded-xl bg-slate-50/50 space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-xs text-slate-600">
                Question #{idx + 1}
              </span>
              {!disabled && accordion.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-red-500"
                  onClick={() => removeItem(idx)}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>

            <div>
              <Label>Question *</Label>
              <Input
                value={item.question}
                onChange={(e) =>
                  updateItem(idx, { question: e.target.value })
                }
                placeholder="Question text"
                disabled={disabled}
              />
            </div>
            <div>
              <Label>Answer *</Label>
              <Textarea
                rows={2}
                value={item.answer}
                onChange={(e) =>
                  updateItem(idx, { answer: e.target.value })
                }
                placeholder="Answer text..."
                disabled={disabled}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
