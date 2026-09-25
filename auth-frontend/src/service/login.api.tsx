import { api, request } from '../config/axiosConfig';
// Make sure to point to the correct Spring Boot endpoint (/api/auth)
export const BASE_URL = 'http://localhost:8080/api/auth';

// 1. Login
export const loginUser = (credential: any) => {
    return request({
        url: BASE_URL + '/login',
        method: 'POST',
        body: credential,
    });
};

export const getUserRoleAccess = () => {
    return request({
        url: BASE_URL + '/me/permissions',
        method: 'GET',
    });
};