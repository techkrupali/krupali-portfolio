import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/schema";

export async function POST(req: Request) {
  const parsed = contactSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  const key = process.env.RESEND_API_KEY;
  if (!key) return NextResponse.json({ error: "Email service not configured" }, { status: 501 });
  const { n, e, t, m } = parsed.data;
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM, to: process.env.CONTACT_TO, reply_to: e,
      subject: `Portfolio enquiry: ${t}`, text: `Name: ${n}\nEmail: ${e}\nType: ${t}\n\n${m}`,
    }),
  });
  return r.ok ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "Send failed" }, { status: 502 });
}
