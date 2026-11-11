"use client";

import { useEffect, useState } from "react";
import { Send, ShieldCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { submitContactMessage } from "@/lib/actions/contact.actions";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";

export default function ContactForm() {
  const { user, isLoaded } = useUser();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [country, setCountry] = useState("");
  const [service, setService] = useState("Custom Software Engineering");
  const [budget, setBudget] = useState("$10k - $25k");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");

  useEffect(() => {
    if (isLoaded && user) {
      const primaryEmail =
        user.primaryEmailAddress?.emailAddress ||
        user.emailAddresses?.[0]?.emailAddress ||
        "";
      const fullName =
        user.fullName ||
        [user.firstName, user.lastName].filter(Boolean).join(" ") ||
        "";
      if (!email && primaryEmail) setEmail(primaryEmail);
      if (!name && fullName) setName(fullName);
    }
  }, [isLoaded, user, email, name]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error("Full name, business email, and project details are required.");
      return;
    }
    setLoading(true);
    const res = await submitContactMessage({
      name,
      email,
      phone,
      company,
      country,
      service,
      budget,
      message,
      honeypot,
    });
    setLoading(false);
    if (res.success) {
      toast.success("Project inquiry sent! Our team will contact you within 24 hours.");
      setMessage("");
      setCompany("");
      setPhone("");
    } else {
      toast.error(res.error || "Failed to send message. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Honeypot anti-spam */}
      <div className="hidden" aria-hidden="true">
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-neutral-300 text-xs">Full Name *</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
            className="bg-neutral-900 border-white/10 text-white placeholder-neutral-500"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-neutral-300 text-xs">Business Email *</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            required
            className="bg-neutral-900 border-white/10 text-white placeholder-neutral-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-neutral-300 text-xs">Company Name</Label>
          <Input
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Company or organization"
            className="bg-neutral-900 border-white/10 text-white placeholder-neutral-500"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-neutral-300 text-xs">Country / Market</Label>
          <Input
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="United Kingdom, Australia, UAE, etc."
            className="bg-neutral-900 border-white/10 text-white placeholder-neutral-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-neutral-300 text-xs">Project Category</Label>
          <select
            value={service}
            onChange={(e) => setService(e.target.value)}
            className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-md text-sm text-white focus:outline-none focus:border-white"
          >
            <option value="Custom Software Engineering">Custom Software Engineering</option>
            <option value="AI & Intelligent Automation">AI & Intelligent Automation</option>
            <option value="Education Technology">Education Technology</option>
            <option value="Ongoing Technology Partnership">Ongoing Technology Partnership</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-neutral-300 text-xs">Estimated Budget (USD)</Label>
          <select
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-md text-sm text-white focus:outline-none focus:border-white"
          >
            <option value="$3k - $5k">$3,000 – $5,000</option>
            <option value="$5k - $10k">$5,000 – $10,000</option>
            <option value="$10k - $25k">$10,000 – $25,000</option>
            <option value="$25k - $50k">$25,000 – $50,000</option>
            <option value="$50k+">$50,000+</option>
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-neutral-300 text-xs">Project Description *</Label>
        <Textarea
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us what you are trying to build, automate, or improve..."
          required
          className="bg-neutral-900 border-white/10 text-white placeholder-neutral-500 resize-none"
        />
      </div>

      <div className="pt-2 flex items-center justify-between">
        <Button
          type="submit"
          disabled={loading}
          className="bg-white text-black hover:bg-neutral-200 font-semibold text-xs tracking-wider uppercase font-mono px-6 py-2.5 rounded-full"
        >
          {loading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
              <span>Sending...</span>
            </>
          ) : (
            <>
              <span>Discuss Your Project</span>
              <Send className="w-3.5 h-3.5 ml-1.5" />
            </>
          )}
        </Button>
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-neutral-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Confidentiality respected</span>
        </div>
      </div>
    </form>
  );
}
