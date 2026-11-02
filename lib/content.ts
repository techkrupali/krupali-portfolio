// EDIT ME: all portfolio content lives here.
export const CFG = {
  email: "krupalivekariya50@gmail.com",
  phone: "+91 93167 34210",
  linkedin: "https://www.linkedin.com/in/krupali-vekariya-671855269/",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? "",
};
// The console's home screen and menu.
export const HOME = {
  kick: "Krupali Vekariya / Player one",
  title: "Building ideas into digital reality.",
  text: "Full-stack AI engineer. Product builder.",
};
export const MENU = [
  ["projects", "Projects"], ["about", "About"], ["exp", "Experience"],
  ["stack", "Tech stack"], ["build", "What I build"], ["contact", "Contact"],
] as const;
export type Mode = "home" | (typeof MENU)[number][0];
// Every menu item except Projects opens in the projected panel above the console.
export type Section = Exclude<Mode, "home" | "projects">;
export const isSection = (m: Mode): m is Section => m !== "home" && m !== "projects";

// Projects live in lib/projects.ts.
export const STACK_INTRO = {
  title: "Technology Stack & Engineering Expertise",
  text: "I work with a modern technology ecosystem to design, develop, test, deploy, and maintain scalable digital products. From frontend experiences to backend infrastructure, mobile applications, cloud services, and quality assurance, I cover the complete software development lifecycle.",
};
export type StackGroup = { no: string; name: string; blurb: string; items: string[] };
export const STACK: StackGroup[] = [
  { no: "01", name: "Frontend Development", blurb: "Building responsive, high-performance, and intuitive user interfaces.",
    items: ["React.js", "Next.js", "JavaScript (ES6+)", "TypeScript", "HTML5 & CSS3", "Tailwind CSS", "Bootstrap", "Redux & Context API"] },
  { no: "02", name: "Backend Development", blurb: "Engineering secure APIs, business logic, and scalable server-side applications.",
    items: ["Node.js", "Express.js", "Laravel", "PHP", "RESTful APIs", "GraphQL", "Authentication & Authorization", "Microservices Architecture"] },
  { no: "03", name: "Mobile Application Development", blurb: "Developing modern cross-platform and native mobile experiences.",
    items: ["Flutter", "React Native", "Android Development", "iOS Development", "Kotlin", "Swift", "Firebase Cloud Messaging", "Push Notifications", "App Store & Google Play Deployment"] },
  { no: "04", name: "Databases & Data Management", blurb: "Designing efficient database architectures and reliable data systems.",
    items: ["MongoDB", "PostgreSQL", "MySQL", "Firebase Firestore", "Firebase Realtime Database", "Supabase", "Database Design & Optimization"] },
  { no: "05", name: "Cloud, Server & Infrastructure", blurb: "Managing application hosting, deployment, server environments, and production infrastructure.",
    items: ["AWS", "Firebase", "Vercel", "Hostinger", "Linux Server Management", "Nginx", "Apache", "PM2", "Docker", "CI/CD Pipelines", "Domain & DNS Configuration", "Production Deployment & Monitoring"] },
  { no: "06", name: "Firebase & Backend Services", blurb: "Building cloud-connected applications with integrated backend services.",
    items: ["Firebase Authentication", "Cloud Firestore", "Realtime Database", "Cloud Functions", "Firebase Storage", "Firebase Cloud Messaging (FCM)", "Firebase Analytics", "Firebase App Distribution", "Remote Config"] },
  { no: "07", name: "AI & Automation", blurb: "Integrating intelligent capabilities into modern software products.",
    items: ["OpenAI API", "AI-Powered Applications", "AI Chatbots", "LLM Integrations", "Business Process Automation", "Workflow Automation", "Third-Party AI Integrations"] },
  { no: "08", name: "API, Payment & Third-Party Integrations", blurb: "Connecting applications with external platforms and business services.",
    items: ["REST API Integration", "Webhooks", "Razorpay", "Stripe", "Payment Gateway Integration", "OAuth & Social Login", "Real-Time Communication", "Socket.IO", "Google Maps API", "Third-Party Service Integrations"] },
  { no: "09", name: "Quality Assurance & Testing", blurb: "Ensuring applications are stable, secure, reliable, and production-ready.",
    items: ["Manual Testing", "Functional Testing", "API Testing", "Integration Testing", "Regression Testing", "UI/UX Testing", "Cross-Browser Testing", "Cross-Device Testing", "Postman", "Jest", "Flutter Testing", "Debugging & Performance Optimization"] },
  { no: "10", name: "Development Tools & Collaboration", blurb: "Maintaining efficient development workflows and collaborative engineering practices.",
    items: ["Git", "GitHub", "GitLab", "VS Code", "Android Studio", "Xcode", "Postman", "Jira", "Figma", "Agile Development"] },
];
export const BUILD: [string, string][] = [
  ["WEB", "Web Applications"], ["APP", "Mobile Applications"], ["AI", "AI-Powered Applications"], ["SAAS", "SaaS Products"],
  ["CRM", "CRM & ERP Systems"], ["PAY", "Fintech Applications"], ["BOT", "Business Automation"], ["API", "API & Payment Integrations"],
];
export const ABOUT = {
  headline: "I ENGINEER. I BUILD. I INNOVATE.", // shown bold as the first line
  title: "Engineering Ideas. Architecting Solutions. Building the Future.",
  intro: [
    "I'm Krupali Vekariya — a Full-Stack AI Engineer and Software Engineer with 3+ years of experience building scalable digital products, intelligent applications, and enterprise-grade software solutions.",
    "I specialize in transforming complex business requirements into powerful, production-ready technology.",
    "From crafting intuitive frontend experiences to architecting robust backend systems, developing cross-platform mobile applications, and integrating AI-powered capabilities, I work across the entire product development lifecycle.",
  ],
  toolkit: {
    title: "Technology is my toolkit",
    lead: "My expertise spans a modern technology ecosystem:",
    items: [
      ["Frontend", "React.js, Next.js, TypeScript, JavaScript, Tailwind CSS"],
      ["Backend", "Node.js, Express.js, Laravel, PHP, REST APIs"],
      ["Mobile", "Flutter, React Native, Android, iOS"],
      ["Databases", "MongoDB, PostgreSQL, MySQL, Firebase, Supabase"],
      ["AI & Automation", "OpenAI, AI integrations, intelligent automation, chatbots"],
      ["Cloud & Infrastructure", "AWS, Vercel, Hostinger, Firebase"],
      ["Integrations", "Payment Gateways, Third-Party APIs, Real-Time Systems"],
    ] as [string, string][],
  },
  engineer: {
    title: "What I engineer",
    lead: "I build complete technology solutions, not just interfaces.",
    items: [
      "Scalable Web Applications & Platforms",
      "Native & Cross-Platform Mobile Applications",
      "AI-Powered Products & Automation Systems",
      "SaaS Platforms & Subscription-Based Products",
      "Enterprise CRM & ERP Ecosystems",
      "Fintech & Payment Solutions",
      "Business Management & Workflow Automation",
    ],
  },
  beyond: {
    title: "Beyond the code",
    paragraphs: [
      "I believe great software engineering goes beyond writing code. It requires understanding business challenges, making the right architectural decisions, choosing the right technologies, and delivering solutions that create real value.",
      "I work with international clients, founders, and businesses to turn ideas into functional digital products — from concept and development to deployment and continuous improvement.",
      "Whether it's a startup building its first product or an established business modernizing its technology, I bring a product-first mindset and an engineering-driven approach.",
    ],
    closing: "I don't just develop software. I engineer solutions that move businesses forward.",
  },
};
// The spoken intro that plays when a visitor puts on the record (read aloud by the browser's voice, with captions).
// To use a recorded voice instead, put an MP3 at public/intro.mp3 and set INTRO_AUDIO = "/intro.mp3".
export const INTRO_AUDIO = "";
export const INTRO = [
  "Hi, I'm Krupali Vekariya, a Full-Stack AI Engineer and Software Developer with over 3 years of experience in building modern, scalable, and reliable software solutions.",
  "My expertise covers the complete software development ecosystem, including frontend engineering, backend architecture, mobile application development, database management, cloud infrastructure, and AI integrations.",
  "On the frontend, I work with React.js, Next.js, JavaScript, TypeScript, and Tailwind CSS to create responsive, high-performance user experiences.",
  "On the backend, I specialize in Node.js, Express.js, Laravel, PHP, REST APIs, and scalable server-side architectures.",
  "For mobile development, I work with Flutter and React Native, building cross-platform applications for Android and iOS.",
  "I'm also experienced with databases and cloud technologies, including MongoDB, PostgreSQL, MySQL, Firebase, Supabase, AWS, and modern deployment platforms.",
  "Beyond traditional software development, I work with AI integrations, OpenAI APIs, intelligent chatbots, business process automation, payment gateways, real-time systems, and third-party API integrations.",
  "But technology is only one part of building a successful product.",
  "My approach is to first understand your business, your challenges, and your goals. Then I focus on selecting the right technology, designing a scalable architecture, and developing a solution that is secure, maintainable, and ready to grow with your business.",
  "When you work with me, you can expect clear communication, transparency, ownership, attention to detail, and a strong commitment to delivering quality work.",
  "I can take responsibility for the complete development lifecycle, from planning and architecture to development, testing, deployment, and ongoing technical support.",
  "Whether you need a website, mobile application, AI-powered solution, SaaS platform, CRM, ERP, or a completely custom software product, I'm ready to help turn your requirements into reality.",
  "My goal is simple: to build technology that doesn't just work today, but continues to deliver value as your business grows.",
  "Thank you. I'm looking forward to working with you.",
];

// Dates are "YYYY-MM". Leave `end` out for a current role; durations are worked out automatically.
export type Role = {
  company: string; title: string; type: string; start: string; end?: string; location: string;
  highlight: string; summary: string[]; points: string[]; skills: string[];
};
export const EXPERIENCE: Role[] = [
  {
    company: "MillerStorm Roofing & Reconstruction", title: "Full Stack Engineer", type: "Part-time",
    start: "2026-01", location: "Remote", highlight: "International client · Enterprise software",
    summary: ["Working with MillerStorm, a US-based roofing and reconstruction company, where I contribute to designing, developing, and maintaining a complete digital ecosystem for business operations."],
    points: [
      "Develop and maintain scalable web applications and internal business software.",
      "Build and enhance cross-platform mobile applications using Flutter.",
      "Develop backend services, REST APIs, and database integrations.",
      "Build internal CRM features for employee management, sales operations, analytics, and reporting.",
      "Integrate AI-powered tools and intelligent business automation.",
      "Implement real-time communication, notifications, and third-party integrations.",
      "Manage application deployment, testing, debugging, and ongoing improvements.",
      "Collaborate remotely with international teams to deliver reliable software solutions.",
    ],
    skills: ["Full-Stack Development", "Flutter", "React.js", "Next.js", "Node.js", "MongoDB", "Firebase", "REST APIs", "AI Integration", "Software Architecture"],
  },
  {
    company: "Technova Technologies", title: "Co-Founder | Full-Stack Software Engineer", type: "Full-time",
    start: "2024-06", location: "Rajkot, Gujarat, India", highlight: "Founder · Technical leadership · End-to-end products",
    summary: [
      "Co-founded Technova Technologies, a software development company focused on building innovative digital products, scalable business applications, and intelligent technology solutions.",
      "I lead and contribute to end-to-end software development, working across web, mobile, backend, AI, and enterprise technologies.",
    ],
    points: [
      "Architect and develop custom web applications, mobile apps, SaaS platforms, CRM, and ERP systems.",
      "Build modern frontend applications using React.js, Next.js, JavaScript, and TypeScript.",
      "Develop scalable backend architectures using Node.js, Express.js, Laravel, and PHP.",
      "Build Android and iOS applications using Flutter and React Native.",
      "Design and manage databases using MongoDB, PostgreSQL, MySQL, Firebase, and Supabase.",
      "Integrate AI capabilities, OpenAI APIs, payment gateways, and third-party services.",
      "Manage cloud infrastructure, server deployment, application maintenance, and production releases.",
      "Coordinate with developers, designers, and QA professionals to deliver complete software solutions.",
      "Work directly with international clients to understand requirements and transform business ideas into production-ready products.",
    ],
    skills: ["Full-Stack Development", "Software Architecture", "Mobile App Development", "AI Integration", "SaaS Development", "CRM", "ERP", "Cloud Computing", "Team Leadership"],
  },
  {
    company: "Vision Tech", title: "Frontend Web Developer", type: "Part-time",
    start: "2021-01", end: "2022-12", location: "Ahmedabad, Gujarat, India", highlight: "Where it started · Frontend development",
    summary: ["Worked as a Frontend Web Developer, focusing on building responsive, user-friendly, and interactive web applications."],
    points: [
      "Developed responsive web interfaces using modern frontend technologies.",
      "Built reusable UI components and optimized frontend performance.",
      "Worked with React.js, JavaScript, HTML5, and CSS3.",
      "Integrated REST APIs and connected frontend applications with backend services.",
      "Collaborated with development teams to implement UI/UX designs.",
      "Improved website usability, responsiveness, and cross-browser compatibility.",
      "Participated in debugging, testing, and frontend optimization.",
    ],
    skills: ["React.js", "JavaScript", "HTML5", "CSS3", "Responsive Web Design", "REST API Integration"],
  },
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const ym = (s: string) => s.split("-").map(Number) as [number, number];
// "Jan 2026 – Present"
export const roleDates = (r: Role) => `${MONTHS[ym(r.start)[1] - 1]} ${ym(r.start)[0]} – ${r.end ? `${MONTHS[ym(r.end)[1] - 1]} ${ym(r.end)[0]}` : "Present"}`;
// "2 yrs 6 mos", counted like LinkedIn (both the first and last month included).
export function roleLength(r: Role) {
  const [sy, sm] = ym(r.start);
  const now = new Date();
  const [ey, em] = r.end ? ym(r.end) : [now.getFullYear(), now.getMonth() + 1];
  const months = (ey - sy) * 12 + (em - sm) + 1;
  const y = Math.floor(months / 12), m = months % 12;
  return [y ? `${y} yr${y > 1 ? "s" : ""}` : "", m ? `${m} mo${m > 1 ? "s" : ""}` : ""].filter(Boolean).join(" ");
}
