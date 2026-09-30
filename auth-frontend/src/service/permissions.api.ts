import { request } from '../config/axiosConfig';

const MODULES_URL = 'http://localhost:8080/api/modules';
const ROLES_URL = 'http://localhost:8080/api/roles';

export const getAllModules = () => request({ url: MODULES_URL, method: 'GET' });

export const getRolePermissions = (roleId: number) => 
    request({ url: `${ROLES_URL}/${roleId}/permissions`, method: 'GET' });

export const setRolePermission = (roleId: number, data: any) => 
    request({ url: `${ROLES_URL}/${roleId}/permissions`, method: 'POST', body: data });
