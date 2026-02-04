// Role-based page permissions
export const ROLE_PERMISSIONS = {
  ROLE_ADMIN: [
    'dashboard',
    'productslist',
    'suppliers',
    'clients',
    'purchases',
    'sales',
    'incoming-history',
    'sales-history',
    'user-management',
  ],
  ROLE_VENDOR: [
    'dashboard',
    'sales',
    'clients',
    'sales-history',
  ],
  ROLE_MAGASINIER: [
    'dashboard',
    'productslist',
    'suppliers',
    'purchases',
    'incoming-history',
  ],
  // Also support non-prefixed versions
  Admin: [
    'dashboard',
    'productslist',
    'suppliers',
    'clients',
    'purchases',
    'sales',
    'incoming-history',
    'sales-history',
    'user-management',
  ],
  Vendor: [
    'dashboard',
    'sales',
    'clients',
    'sales-history',
  ],
  Vendeur: [
    'dashboard',
    'sales',
    'clients',
    'sales-history',
  ],
  Magasinier: [
    'dashboard',
    'productslist',
    'suppliers',
    'purchases',
    'incoming-history',
  ],
};

// Pages accessible by all (no role required)
export const PUBLIC_PAGES = ['login'];

export const canAccessPage = (role, path) => {
  if (!role) return false;
  
  // Normalize path by removing slashes and converting to lowercase
  const normalizedPath = path.toLowerCase().replace(/\//g, '');
  
  // Get allowed pages for this role
  const allowedPages = ROLE_PERMISSIONS[role];
  
  if (!allowedPages) {
    console.log('Role not found in permissions:', role);
    return false;
  }
  
  // Check if normalized path matches any allowed page
  const hasAccess = allowedPages.some(page => 
    normalizedPath === page.toLowerCase()
  );
  
  console.log('Permission check - Role:', role, 'Path:', path, 'Normalized:', normalizedPath, 'Allowed:', allowedPages, 'Result:', hasAccess);
  
  return hasAccess;
};
