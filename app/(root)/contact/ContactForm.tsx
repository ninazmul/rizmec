"use client";

import { useEffect, useState } from "react";
import { Send, Loader2 } from "lucide-react";
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
      if (!email && primaryEmail) setEmail(primaryEmail);
      if (!name && fullName) setName(fullName);
    }
  }, [isLoaded, user, name, email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Name, Business Email, and Message are required");
      return;
    }
    setLoading(true);
    const res = await submitContactMessage({
      name,
      email,
      phone,
      subject,
      service: subject || "General Software Engineering",
      message,
    });
    setLoading(false);
    if (res.success) {
      toast.success("Message sent successfully! We will get back to you within 24 hours.");
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
          <Label htmlFor="cf-name">Full Name *</Label>
          <Input
            id="cf-name"
            placeholder="e.g. Alex Morgan"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="cf-email">Business Email *</Label>
          <Input
            id="cf-email"
            type="email"
            placeholder="e.g. alex@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="cf-phone">Phone / WhatsApp (Optional)</Label>
          <Input
            id="cf-phone"
            placeholder="+1 234 567 890"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="cf-subject">Project Category</Label>
          <Input
            id="cf-subject"
            placeholder="e.g. Custom Web App, ERP, EdTech Platform"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="cf-message">Project Description *</Label>
        <Textarea
          id="cf-message"
          rows={4}
          placeholder="Briefly describe what you would like to build or automate..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          className="mt-1"
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-white text-black hover:bg-neutral-200 uppercase font-mono text-xs tracking-wider"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="w-4 h-4 mr-2" />
            Submit Inquiry
          </>
        )}
      </Button>
    </form>
  );
}
