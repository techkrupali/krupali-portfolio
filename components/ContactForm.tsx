"use client";
import { useState } from "react";
import { Send } from "lucide-react";
import { CFG } from "@/lib/content";
import { contactSchema } from "@/lib/schema";

const TYPES = ["Web application", "Mobile app", "AI-powered app", "SaaS / CRM / ERP", "Fintech", "Other"];

export default function ContactForm() {
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [status, setStatus] = useState("");

  async function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const d = Object.fromEntries(new FormData(ev.currentTarget)) as Record<string, string>;
    const p = contactSchema.safeParse(d);
    if (!p.success) {
      const f = p.error.flatten().fieldErrors;
      setErrs({ n: f.n?.[0] ?? "", e: f.e?.[0] ?? "", m: f.m?.[0] ?? "" });
      return;
    }
    setErrs({});
    setStatus("Sending…");
    try {
      const r = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(p.data) });
      if (r.ok) return setStatus("Sent! I’ll reply soon.");
      if (r.status !== 501) throw new Error();
      // Email service not configured: fall back to the visitor's email app.
      const body = `Name: ${d.n}\nEmail: ${d.e}\nProject type: ${d.t}\n\n${d.m}`;
      window.location.href = `mailto:${CFG.email}?subject=${encodeURIComponent("Project enquiry: " + d.t)}&body=${encodeURIComponent(body)}`;
      setStatus("Opening your email app…");
    } catch { setStatus("Something went wrong. Please email me directly."); }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-1">
      <label>Name<input name="n" autoComplete="name" /></label><div className="err">{errs.n}</div>
      <label>Email<input name="e" type="email" autoComplete="email" /></label><div className="err">{errs.e}</div>
      <label>Project type<select name="t">{TYPES.map((t) => <option key={t}>{t}</option>)}</select></label>
      <label>Message<textarea name="m" rows={3} /></label><div className="err">{errs.m}</div>
      <div>
        <button className="sbtn" type="submit"><Send size={12} className="inline mr-1" />SEND MESSAGE</button>
        {CFG.whatsapp && <a className="sbtn no-underline" target="_blank" rel="noopener noreferrer" href={`https://wa.me/${CFG.whatsapp}`}>WHATSAPP</a>}
      </div>
      <div className="err" style={{ color: "var(--dk)" }} role="status">{status}</div>
    </form>
  );
}
