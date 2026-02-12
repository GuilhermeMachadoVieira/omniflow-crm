import { revalidateTag, revalidatePath } from "next/cache";

// Cache tags para diferentes tipos de dados
export const CACHE_TAGS = {
  // Dashboard metrics
  DASHBOARD_METRICS: (orgId: string) => `dashboard:${orgId}`,
  DASHBOARD_REVENUE: (orgId: string) => `dashboard:revenue:${orgId}`,
  
  // Customers
  CUSTOMERS_LIST: (orgId: string) => `customers:list:${orgId}`,
  CUSTOMER_DETAIL: (orgId: string, customerId: string) => `customer:${orgId}:${customerId}`,
  CUSTOMER_ACTIVITIES: (orgId: string, customerId: string) => `activities:${orgId}:${customerId}`,
  
  // Pipeline
  PIPELINE_DATA: (orgId: string) => `pipeline:${orgId}`,
  OPPORTUNITIES_LIST: (orgId: string) => `opportunities:${orgId}`,
  OPPORTUNITY_DETAIL: (orgId: string, opportunityId: string) => `opportunity:${orgId}:${opportunityId}`,
  
  // Team
  TEAM_MEMBERS: (orgId: string) => `team:${orgId}`,
  
  // Settings
  ORGANIZATION_SETTINGS: (orgId: string) => `settings:${orgId}`,
} as const;

// Funções para revalidação de cache específica
export const revalidateCache = {
  // Dashboard
  dashboard: (orgId: string) => {
    revalidateTag(CACHE_TAGS.DASHBOARD_METRICS(orgId));
    revalidateTag(CACHE_TAGS.DASHBOARD_REVENUE(orgId));
  },
  
  // Customers
  customers: (orgId: string) => {
    revalidateTag(CACHE_TAGS.CUSTOMERS_LIST(orgId));
    revalidateTag(CACHE_TAGS.DASHBOARD_METRICS(orgId));
  },
  
  customer: (orgId: string, customerId: string) => {
    revalidateTag(CACHE_TAGS.CUSTOMER_DETAIL(orgId, customerId));
    revalidateTag(CACHE_TAGS.CUSTOMER_ACTIVITIES(orgId, customerId));
    revalidateTag(CACHE_TAGS.CUSTOMERS_LIST(orgId));
    revalidateTag(CACHE_TAGS.DASHBOARD_METRICS(orgId));
  },
  
  // Pipeline
  pipeline: (orgId: string) => {
    revalidateTag(CACHE_TAGS.PIPELINE_DATA(orgId));
    revalidateTag(CACHE_TAGS.OPPORTUNITIES_LIST(orgId));
    revalidateTag(CACHE_TAGS.DASHBOARD_METRICS(orgId));
  },
  
  opportunity: (orgId: string, opportunityId: string) => {
    revalidateTag(CACHE_TAGS.OPPORTUNITY_DETAIL(orgId, opportunityId));
    revalidateTag(CACHE_TAGS.OPPORTUNITIES_LIST(orgId));
    revalidateTag(CACHE_TAGS.PIPELINE_DATA(orgId));
    revalidateTag(CACHE_TAGS.DASHBOARD_METRICS(orgId));
  },
  
  // Team
  team: (orgId: string) => {
    revalidateTag(CACHE_TAGS.TEAM_MEMBERS(orgId));
  },
  
  // Activities
  activities: (orgId: string, customerId: string) => {
    revalidateTag(CACHE_TAGS.CUSTOMER_ACTIVITIES(orgId, customerId));
    revalidateTag(CACHE_TAGS.CUSTOMER_DETAIL(orgId, customerId));
  },
  
  // Settings
  settings: (orgId: string) => {
    revalidateTag(CACHE_TAGS.ORGANIZATION_SETTINGS(orgId));
  },
} as const;

// Tempos de cache em segundos
export const CACHE_DURATIONS = {
  DASHBOARD_METRICS: 300, // 5 minutos
  REVENUE_DATA: 600,      // 10 minutos
  CUSTOMERS_LIST: 120,    // 2 minutos
  CUSTOMER_DETAIL: 300,  // 5 minutos
  PIPELINE_DATA: 60,      // 1 minuto
  OPPORTUNITIES: 60,      // 1 minuto
  TEAM_MEMBERS: 600,      // 10 minutos
  ACTIVITIES: 300,        // 5 minutos
  SETTINGS: 1800,         // 30 minutos
} as const;
