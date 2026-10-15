import {domainError} from '@aegis/contracts';
const GRANTS={viewer:['inventory:read','orders:read','analytics:read'],operator:['inventory:read','inventory:write','orders:read','orders:write','analytics:read'],admin:['*']};
export function authorize(principal,permission,tenantId){
  if(!principal||principal.tenantId!==tenantId)throw domainError('FORBIDDEN','Tenant access denied');
  const permissions=GRANTS[principal.role]||[];
  if(!permissions.includes('*')&&!permissions.includes(permission))throw domainError('FORBIDDEN',`Permission ${permission} denied`);
  return true;
}
export function permissionsFor(role){return [...(GRANTS[role]||[])]}
