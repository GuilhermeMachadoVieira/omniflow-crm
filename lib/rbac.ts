import { AuthUser } from "@/lib/types";

// Funções auxiliares para verificação de permissões
export const canManageTeam = (user: AuthUser): boolean => {
  return user.role === 'OWNER' || user.role === 'ADMIN';
};

export const canDeleteOrganization = (user: AuthUser): boolean => {
  return user.role === 'OWNER';
};

export const canManageSettings = (user: AuthUser): boolean => {
  return user.role === 'OWNER' || user.role === 'ADMIN';
};

export const canViewAllCustomers = (user: AuthUser): boolean => {
  return user.role === 'OWNER' || user.role === 'ADMIN';
};

export const canManageCustomer = (user: AuthUser, customerUserId?: string): boolean => {
  // Owner e Admin podem gerenciar qualquer cliente
  if (user.role === 'OWNER' || user.role === 'ADMIN') {
    return true;
  }
  
  // Member só pode gerenciar seus próprios clientes
  if (user.role === 'MEMBER' && customerUserId) {
    return customerUserId === user.id;
  }
  
  return false;
};

export const canDeleteCustomer = (user: AuthUser, customerUserId?: string): boolean => {
  return canManageCustomer(user, customerUserId);
};

export const canManageAllOpportunities = (user: AuthUser): boolean => {
  return user.role === 'OWNER' || user.role === 'ADMIN';
};

export const canManageOpportunity = (user: AuthUser, opportunityUserId?: string): boolean => {
  // Owner e Admin podem gerenciar qualquer oportunidade
  if (user.role === 'OWNER' || user.role === 'ADMIN') {
    return true;
  }
  
  // Member só pode gerenciar suas próprias oportunidades
  if (user.role === 'MEMBER' && opportunityUserId) {
    return opportunityUserId === user.id;
  }
  
  return false;
};

export const canViewDashboard = (user: AuthUser): boolean => {
  // Todos os usuários autenticados podem ver o dashboard
  return true;
};

export const canExportData = (user: AuthUser): boolean => {
  return user.role === 'OWNER' || user.role === 'ADMIN';
};

// Mapeamento de roles para descrições
export const ROLE_DESCRIPTIONS = {
  OWNER: 'Proprietário - Acesso total a todas as funcionalidades',
  ADMIN: 'Administrador - Pode gerenciar equipe e configurações',
  MEMBER: 'Membro - Acesso limitado aos seus próprios dados',
} as const;

// Mapeamento de permissões por role
export const ROLE_PERMISSIONS = {
  OWNER: [
    'manage_team',
    'delete_organization',
    'manage_settings',
    'view_all_customers',
    'manage_all_customers',
    'delete_all_customers',
    'manage_all_opportunities',
    'delete_all_opportunities',
    'export_data',
    'view_dashboard',
  ] as const,
  ADMIN: [
    'manage_team',
    'manage_settings',
    'view_all_customers',
    'manage_all_customers',
    'delete_all_customers',
    'manage_all_opportunities',
    'delete_all_opportunities',
    'export_data',
    'view_dashboard',
  ] as const,
  MEMBER: [
    'manage_own_customers',
    'delete_own_customers',
    'manage_own_opportunities',
    'delete_own_opportunities',
    'view_dashboard',
  ] as const,
} as const;

// Helper para verificar se um usuário tem uma permissão específica
export const hasPermission = (user: AuthUser, permission: string): boolean => {
  const userPermissions = ROLE_PERMISSIONS[user.role] || [];
  return userPermissions.includes(permission as any);
};

// Helper para verificar se um usuário tem alguma das permissões listadas
export const hasAnyPermission = (user: AuthUser, permissions: string[]): boolean => {
  const userPermissions = ROLE_PERMISSIONS[user.role] || [];
  return permissions.some(permission => userPermissions.includes(permission as any));
};
