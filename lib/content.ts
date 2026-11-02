// EDIT ME: all portfolio content lives here.
export const CFG = {
  email: "krupali@technovatechnologies.com",
  linkedin: "https://www.linkedin.com/in/krupali-vekariya-671855269/",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? "",
};
export const MENU = [
  ["about", "ABOUT"], ["projects", "PROJECTS"], ["stack", "TECH STACK"],
  ["build", "WHAT I BUILD"], ["exp", "EXPERIENCE"], ["contact", "CONTACT"],
] as const;
export type Mode = "title" | "boot" | "menu" | (typeof MENU)[number][0];

export type Project = { name: string; category: string; desc: string; tech?: string; role?: string; link?: string };
// tech / role / link are intentionally empty: fill in real details. Placeholders show until then.
export const PROJECTS: Project[] = [
  { name: "MillerStorm", category: "Roofing & Reconstruction platform", desc: "Web application, Flutter mobile app, CRM features, analytics and team management." },
  { name: "Dsatguru", category: "Online education platform", desc: "Courses, classes, tests, payments and student management." },
  { name: "Retailians ERP", category: "Business management / ERP", desc: "Business management and ERP platform." },
  { name: "Gora Cabs", category: "Ride-hailing platform", desc: "Customer app, driver app and admin management." },
  { name: "Call Taxi Partner", category: "Taxi partner & driver app", desc: "Taxi partner and driver management application." },
  { name: "OrdoGo", category: "Pharmacy & delivery ecosystem", desc: "Pharmacy and delivery application ecosystem." },
  { name: "EatSure", category: "Food ordering mobile app", desc: "Food ordering mobile application." },
  { name: "Ladder Strength Training", category: "Fitness mobile app", desc: "Fitness mobile application." },
  { name: "Raksha Divine Companion", category: "Mobile application", desc: "Mobile application." },
  { name: "Banking & Fintech Apps", category: "Fintech", desc: "Financial application development and payment-related integrations." },
];
export const STACK: Record<string, string[]> = {
  Frontend: ["React.js", "Next.js", "JavaScript", "TypeScript", "Tailwind CSS"],
  Backend: ["Node.js", "Express.js", "Laravel", "PHP"],
  Mobile: ["Flutter", "React Native", "Android", "iOS"],
  Databases: ["MongoDB", "PostgreSQL", "MySQL", "Firebase", "Supabase"],
  "AI & Integrations": ["OpenAI API", "AI Automation", "Chatbots", "API Integrations"],
  "Cloud & Tools": ["AWS", "GitHub", "Docker", "Vercel", "Hostinger", "Postman"],
};
export const BUILD: [string, string][] = [
  ["WEB", "Web Applications"], ["APP", "Mobile Applications"], ["AI", "AI-Powered Applications"], ["SAAS", "SaaS Products"],
  ["CRM", "CRM & ERP Systems"], ["PAY", "Fintech Applications"], ["BOT", "Business Automation"], ["API", "API & Payment Integrations"],
];
