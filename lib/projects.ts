// EDIT ME: real projects shown in the Collection, on the console and in the simple view.
// Overviews describe each product from its own public website or store listing (checked November 2026).
// `contribution` = what YOU did on the project. Left empty where it isn't confirmed yet; empty fields are hidden on the site.
// `tech` on websites = the platform detected on the live site. Replace it with your own stack if you prefer.
// Screenshots live in /public/projects. Replace any file with a newer capture using the same name.

export type Status = "live" | "ongoing";
export type CategoryId = "web" | "apps" | "crm";

export const CATEGORIES: { id: CategoryId; no: string; name: string; short: string; blurb: string; color: string }[] = [
  { id: "web", no: "01", name: "Business Websites", short: "WEBSITES", blurb: "E-commerce, fashion and corporate websites, live and in use.", color: "#d9ef9f" },
  { id: "apps", no: "02", name: "Mobile Applications", short: "MOBILE APPS", blurb: "Dating, transportation, fitness and fintech apps on iOS and Android.", color: "#c58bff" },
  { id: "crm", no: "03", name: "CRM & Enterprise Software", short: "CRM & ENTERPRISE", blurb: "A connected business ecosystem: website, mobile app and internal CRM.", color: "#4cc3ff" },
];

export const INDUSTRIES = ["E-commerce", "Business Websites", "Fashion", "Dating & Social", "Fitness", "Fintech", "Transportation", "CRM", "Enterprise Software"];

export type Site = {
  id: string; name: string; url: string; category: string; industry: string; overview: string;
  status: Status; contribution?: string[]; tech?: string[]; shot: string;
};
export const SITES: Site[] = [
  {
    id: "raasta", name: "Raasta Deals", url: "https://raastadeals.com/", category: "Business Website · Website development", industry: "E-commerce · Electronics",
    overview: "Online store for discounted electronics: top brands at up to 75% off, with free shipping and 30-day returns.",
    status: "live", tech: ["Shopify"], shot: "/projects/web/raasta.webp",
  },
  {
    id: "juice", name: "Get The Juice", url: "https://getthejuice.store/", category: "E-commerce / Business Website", industry: "E-commerce · Jewelry & apparel",
    overview: "Handcrafted jewelry in 925 silver, gold and lab-grown diamond, plus leather and clothing for him and her, sold online and in-store in Banani.",
    status: "live", tech: ["Shopify"], shot: "/projects/web/juice.webp",
  },
  {
    id: "dept", name: "DEPT", url: "https://www.dept.global/en-in/", category: "Corporate / Digital Agency Website", industry: "Corporate · Digital agency",
    overview: "Website for DEPT®, a “Growth Invention” company working at the intersection of technology and marketing.",
    status: "live", tech: ["WordPress"], shot: "/projects/web/dept.webp",
  },
  {
    id: "pistola", name: "Pistola Denim", url: "https://www.pistoladenim.com/", category: "E-commerce / Fashion Website", industry: "E-commerce · Fashion",
    overview: "Premium women's apparel: everyday essentials with a utilitarian sensibility.",
    status: "live", tech: ["Shopify"], shot: "/projects/web/pistola.webp",
  },
];

export type App = {
  id: string; name: string; platform: "iOS" | "Android"; store: string; category: string; industry: string; overview: string;
  status: Status; contribution?: string[]; tech?: string[]; icon: string; shots: string[]; glow: string;
};
const shots = (id: string) => [1, 2, 3, 4, 5].map((n) => `/projects/apps/${id}-${n}.webp`);
export const APPS: App[] = [
  {
    id: "nymph", name: "Nymph", platform: "iOS", store: "https://apps.apple.com/us/app/nymph-open-minded-dating-app/id6475792735",
    category: "Dating / Social Application", industry: "Dating & social",
    overview: "A community for open-minded individuals and couples to connect, with verified profiles and encrypted chats.",
    status: "live", icon: "/projects/apps/nymph-icon.webp", shots: shots("nymph"), glow: "#f3a6b8",
  },
  {
    id: "gora", name: "Gora Cabs", platform: "Android", store: "https://play.google.com/store/apps/details?id=com.gora.gora_cabs",
    category: "Ride-Hailing / Transportation Application", industry: "Transportation",
    overview: "Ride-hailing across Rajasthan for bike, auto and car rides. The platform covers a customer app, a driver app and admin management.",
    status: "ongoing", icon: "/projects/apps/gora-icon.webp", shots: shots("gora"), glow: "#3d7bff",
  },
  {
    id: "sweat", name: "Sweat", platform: "iOS", store: "https://apps.apple.com/in/app/sweat-fitness-app-for-women/id1049234587",
    category: "Fitness Application", industry: "Health & fitness",
    overview: "Women's fitness app with training programs led by co-founder and head trainer Kayla Itsines, for workouts at home or in the gym.",
    status: "live", icon: "/projects/apps/sweat-icon.webp", shots: shots("sweat"), glow: "#ff5c8d",
  },
  {
    id: "mint", name: "Mint Money", platform: "iOS", store: "https://apps.apple.com/in/app/mint-money-credit-score-loan/id6751579585",
    category: "Fintech / Financial Application", industry: "Fintech",
    overview: "Personal finance app for checking your credit score, exploring instant personal loans and reading trusted financial news.",
    status: "live", icon: "/projects/apps/mint-icon.webp", shots: shots("mint"), glow: "#ffb547",
  },
];

export type Product = {
  id: "web" | "app" | "crm"; no: string; label: string; url: string; linkLabel: string; about: string; built: string[];
};
export const MILLERSTORM = {
  name: "MillerStorm",
  full: "MillerStorm Roofing & Reconstruction",
  status: "ongoing" as Status,
  involvement: "Full Stack Engineer · Since January 2026",
  summary: "I have been involved in developing and maintaining a complete digital ecosystem for MillerStorm: the business website, the iOS app and the internal CRM.",
  webShot: "/projects/web/millerstorm-web.webp",
  crmShot: "/projects/web/millerstorm-crm.webp",
  appShots: shots("millerstorm-app"),
  appIcon: "/projects/apps/millerstorm-app-icon.webp",
  products: [
    {
      id: "web", no: "01", label: "Business Website", url: "https://millerstorm.com/", linkLabel: "millerstorm.com",
      about: "The public website, offering free storm damage roof inspections in Dallas–Fort Worth.",
      built: ["Main business website", "Website development", "Responsive frontend experience", "Business-facing digital presence"],
    },
    {
      id: "app", no: "02", label: "Mobile Application", url: "https://apps.apple.com/us/app/millerstorm/id6771883296", linkLabel: "App Store",
      about: "The Miller Storm Operating System on iOS, for authorized Miller Storm team members.",
      built: ["iOS mobile application", "Mobile application development and ongoing improvements", "Integration with backend services", "Employee-focused mobile functionality"],
    },
    {
      id: "crm", no: "03", label: "Internal CRM", url: "https://www.millerstorm.tech/login", linkLabel: "millerstorm.tech",
      about: "The internal company platform for employees. Sign-in required.",
      built: ["Internal company employee management platform", "Role-based access", "Employee dashboards", "Sales team management", "Analytics and reporting", "Training Center", "Leaderboards", "Internal communication features", "Document management", "Notifications and announcements"],
    },
  ] as Product[],
  // Flutter: from your earlier project notes. Next.js: detected on the live CRM. Add or change entries freely.
  tech: [["Mobile app", "Flutter"], ["Internal CRM", "Next.js"]] as [string, string][],
  // "Jan 2026" matches your Experience entry. "May 2026" is the App Store release date of the iOS app.
  timeline: [
    { when: "Jan 2026", what: "Joined MillerStorm as a Full Stack Engineer" },
    { when: "May 2026", what: "iOS app released on the App Store" },
    { when: "Now", what: "Ongoing development across the website, iOS app and internal CRM", live: true },
  ],
};

// Earlier projects from your original list, shown as a short "also worked on" line.
export const MORE_PROJECTS: [string, string][] = [
  ["Dsatguru", "Online education platform"], ["Retailians ERP", "Business management / ERP"], ["Call Taxi Partner", "Taxi partner & driver app"],
  ["OrdoGo", "Pharmacy & delivery ecosystem"], ["EatSure", "Food ordering app"], ["Ladder Strength Training", "Fitness app"],
  ["Raksha Divine Companion", "Mobile application"], ["Banking & Fintech Apps", "Fintech"],
];

// Rows on the console's Projects screen.
export const PROJECT_ROWS = [
  { id: "ms", name: "MillerStorm", line: "Featured case study · website, iOS app & CRM", action: "Open case ✧" },
  { id: "web", name: "Business websites", line: `E-commerce, fashion & corporate · ${SITES.length} live sites`, action: "View cards ◇" },
  { id: "apps", name: "Mobile apps", line: "Dating, transport, fitness & fintech · iOS & Android", action: "View cards ◇" },
  { id: "all", name: "Full collection", line: "Every project in one place.", action: "✦ Open" },
] as const;

export const host = (url: string) => new URL(url).hostname.replace(/^www\./, "");
export const projectCount = (id: CategoryId) => (id === "web" ? SITES.length : id === "apps" ? APPS.length : 1);
