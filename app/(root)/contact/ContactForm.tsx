"use client";

import { useEffect, useState } from "react";
import { Send, ShieldCheck, Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { submitContactMessage } from "@/lib/actions/contact.actions";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import toast from "react-hot-toast";

export default function ContactForm() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

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
      setEmail(primaryEmail);
      if (!name && fullName) {
        setName(fullName);
      }
    }
  }, [isLoaded, user]);

  if (!isLoaded) {
    return (
      <div className="p-8 text-center space-y-3">
        <Loader2 className="w-6 h-6 animate-spin mx-auto text-neutral-400" />
        <p className="text-xs font-mono text-neutral-400">Verifying session...</p>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="p-6 rounded-xl border border-white/10 bg-neutral-900/60 text-center space-y-4">
        <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center mx-auto text-emerald-400">
          <Lock className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white">Authentication Required</h4>
          <p className="text-xs text-neutral-400 mt-1">
            Please sign in to send a secure message.
          </p>
        </div>
        <Link
          href={`/sign-in?redirect_url=${encodeURIComponent("/contact")}`}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black font-semibold text-xs font-mono uppercase tracking-wider hover:bg-neutral-200 transition-all"
        >
          Sign In with Clerk
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error("Name, Email, and Message are required");
      return;
    }
    setLoading(true);
    const res = await submitContactMessage({
      name,
      email,
      phone,
      subject,
      message,
    });
    setLoading(false);
    if (res.success) {
      toast.success("Message sent successfully! We will get back to you soon.");
      setMessage("");
      setSubject("");
      setPhone("");
    } else {
      toast.error(res.error || "Failed to send message");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Full Name *</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Your name"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <Label>Email Address *</Label>
            <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Auto-filled
            </span>
          </div>
          <Input
            type="email"
            value={email}
            readOnly
            required
            className="cursor-not-allowed bg-neutral-900/50 border-emerald-500/30 text-neutral-300"
            title="Email automatically taken from your Clerk account"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Phone Number</Label>
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+880..."
          />
        </div>
        <div>
          <Label>Subject</Label>
          <Input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Regarding..."
          />
        </div>
      </div>
      <div>
        <Label>Your Message *</Label>
        <Textarea
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          placeholder="Write your message here..."
        />
      </div>
      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-primary hover:bg-emerald-700 text-white py-3 flex items-center justify-center gap-2"
      >
        <Send size={16} /> {loading ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
