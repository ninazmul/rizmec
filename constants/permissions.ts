// ===== RIZMEC Enterprise Module & Permission Definitions =====

export const CMS_MODULES = [
  "dashboard",
  "leads",
  "clients",
  "projects",
  "quotations",
  "invoices",
  "services",
  "products",
  "team",
  "testimonials",
  "mailing",
  "profile", // Self profile for worker
  "audit-logs",
  "settings",
  "users",
] as const;

export type CmsModule = (typeof CMS_MODULES)[number];

export const CMS_ACTIONS = [
  "read",
  "create",
  "update",
  "delete",
  "publish",
  "assign",
  "export",
  "all",
] as const;

export type CmsAction = (typeof CMS_ACTIONS)[number];

export type UserRole = "super_admin" | "admin" | "moderator" | "worker" | "intern";

// Default permission matrix per role
export const ROLE_DEFAULT_PERMISSIONS: Record<
  UserRole,
  { module: CmsModule; actions: CmsAction[] }[]
> = {
  super_admin: [
    // Has full bypass rights across all modules
    { module: "dashboard", actions: ["all"] },
  ],
  admin: [
    { module: "dashboard", actions: ["read"] },
    { module: "leads", actions: ["all"] },
    { module: "clients", actions: ["all"] },
    { module: "projects", actions: ["all"] },
    { module: "quotations", actions: ["all"] },
    { module: "invoices", actions: ["all"] },
    { module: "services", actions: ["all"] },
    { module: "products", actions: ["all"] },
    { module: "team", actions: ["all"] },
    { module: "testimonials", actions: ["all"] },
    { module: "mailing", actions: ["all"] },
    { module: "profile", actions: ["all"] },
    { module: "audit-logs", actions: ["read"] },
    { module: "settings", actions: ["all"] },
    { module: "users", actions: ["read", "update"] },
  ],
  moderator: [
    { module: "dashboard", actions: ["read"] },
    { module: "leads", actions: ["read", "update"] },
    { module: "clients", actions: ["read"] },
    { module: "projects", actions: ["read", "create", "update"] },
    { module: "services", actions: ["read", "update"] },
    { module: "products", actions: ["read", "update"] },
    { module: "team", actions: ["read"] },
    { module: "testimonials", actions: ["all"] },
    { module: "profile", actions: ["all"] },
  ],
  worker: [
    { module: "projects", actions: ["read"] },
    { module: "profile", actions: ["all"] }, // Personal portfolio management
  ],
  intern: [
    { module: "projects", actions: ["read"] }, // View assigned projects
    { module: "profile", actions: ["all"] }, // Personal portfolio management & sharing
  ],
};

// Modules only accessible to Super Admin or Admin
export const RESTRICTED_MODULES: CmsModule[] = [
  "users",
  "settings",
  "audit-logs",
  "invoices",
  "quotations",
  "mailing",
];

// Modules that only a super_admin can access (not even regular admins)
export const SUPER_ADMIN_ONLY_MODULES: CmsModule[] = [
  "users",
  "audit-logs",
  "settings",
];

// Human-readable labels for dashboard sidebar navigation
export const MODULE_LABELS: Record<CmsModule, string> = {
  dashboard: "Overview",
  leads: "CRM & Leads",
  clients: "Clients",
  projects: "Project Management",
  quotations: "Quotations & Signatures",
  invoices: "Invoices & Payments",
  services: "Services CMS",
  products: "Products / SaaS",
  team: "Team Directory",
  testimonials: "Testimonials",
  mailing: "Mailing Campaigns",
  profile: "My Portfolio",
  "audit-logs": "Audit Trail",
  settings: "Company Settings",
  users: "Access Control",
};

// Sidebar route mapping
export const MODULE_ROUTES: Record<CmsModule, string> = {
  dashboard: "/dashboard",
  leads: "/dashboard/leads",
  clients: "/dashboard/clients",
  projects: "/dashboard/projects",
  quotations: "/dashboard/quotations",
  invoices: "/dashboard/invoices",
  services: "/dashboard/services",
  products: "/dashboard/products",
  team: "/dashboard/team",
  testimonials: "/dashboard/testimonials",
  mailing: "/dashboard/mailing",
  profile: "/dashboard/profile",
  "audit-logs": "/dashboard/audit-logs",
  settings: "/dashboard/settings",
  users: "/dashboard/users",
};
