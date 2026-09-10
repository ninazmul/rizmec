"use client";

import React, { useState, useMemo } from "react";
import { Code2, Cpu, Layers, Sparkles, Search } from "lucide-react";

interface SkillItem {
  name: string;
  level: number;
  category?: string;
}

interface TechMasteryMatrixProps {
  skills: SkillItem[];
  technologies: string[];
  theme?: string;
}

export function TechMasteryMatrix({ skills = [], technologies = [], theme = "obsidian" }: TechMasteryMatrixProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Extract distinct categories
  const categories = useMemo(() => {
    const cats = new Set<string>();
    skills.forEach((s) => {
      if (s.category && s.category.trim()) cats.add(s.category.trim());
    });
    return ["all", ...Array.from(cats)];
  }, [skills]);

  // Filter skills
  const filteredSkills = useMemo(() => {
    return skills.filter((skill) => {
      const matchesCategory =
        selectedCategory === "all" ||
        (skill.category && skill.category.toLowerCase() === selectedCategory.toLowerCase());
      const matchesSearch =
        !searchQuery || skill.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [skills, selectedCategory, searchQuery]);

  // Filter tech tags
  const filteredTechnologies = useMemo(() => {
    if (!searchQuery) return technologies;
    return technologies.filter((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [technologies, searchQuery]);

  // Proficiency label helper
  const getProficiencyLabel = (level: number) => {
    if (level >= 90) return "Master / Lead";
    if (level >= 80) return "Advanced";
    if (level >= 70) return "Proficient";
    return "Competent";
  };

  return (
    <section id="skills" className="space-y-10 pt-16 border-t border-white/10">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <span className="text-xs font-mono tracking-widest text-cyan-400 uppercase font-semibold flex items-center gap-2">
            <Cpu className="w-4 h-4" />
            <span>// Core Competencies</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Technology Mastery & Specializations
          </h2>
          <p className="text-sm text-neutral-400 font-light max-w-xl">
            Verified algorithmic proficiency, architectural systems mastery, and modern engineering stack.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter skills & tech..."
            className="w-full pl-10 pr-4 py-2 bg-neutral-900/80 border border-white/10 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
          />
        </div>
      </div>

      {/* Category Pills */}
      {categories.length > 2 && (
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all ${
                selectedCategory === cat
                  ? "bg-white text-black font-bold shadow-md shadow-white/10"
                  : "bg-white/[0.04] text-neutral-400 border border-white/5 hover:text-white hover:border-white/20"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Skills Matrix Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredSkills.map((skill, index) => (
          <div
            key={index}
            className="p-5 rounded-2xl border border-white/10 bg-neutral-950/60 backdrop-blur-md hover:border-white/20 transition-all space-y-3 group"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {skill.name}
                </span>
                {skill.category && (
                  <span className="block text-[10px] font-mono text-neutral-500 uppercase">
                    {skill.category}
                  </span>
                )}
              </div>
              <div className="text-right">
                <span className="text-sm font-mono font-bold text-white">
                  {skill.level}%
                </span>
                <span className="block text-[10px] font-mono text-cyan-400">
                  {getProficiencyLabel(skill.level)}
                </span>
              </div>
            </div>

            {/* Proficiency Bar with Glow */}
            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-400 rounded-full transition-all duration-1000 shadow-sm"
                style={{ width: `${Math.max(10, Math.min(100, skill.level))}%` }}
              />
            </div>
          </div>
        ))}

        {filteredSkills.length === 0 && (
          <div className="col-span-full py-12 text-center text-neutral-500 font-mono text-xs">
            No matching skills found.
          </div>
        )}
      </div>

      {/* Technology Competency Cloud */}
      {filteredTechnologies.length > 0 && (
        <div className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-neutral-950/70 backdrop-blur-md space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Technology Competencies & Ecosystem</span>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {filteredTechnologies.map((tech, idx) => (
              <span
                key={idx}
                className="px-3.5 py-1.5 rounded-xl text-xs font-mono bg-white/[0.04] text-neutral-200 border border-white/10 hover:border-cyan-400/40 hover:bg-cyan-500/10 hover:text-white transition-all cursor-default"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
