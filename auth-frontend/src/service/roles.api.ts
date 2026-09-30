import { request } from '../config/axiosConfig';

const BASE_URL = 'http://localhost:8080/api/roles';

export const getAllRoles = () => {
    return request({
        url: BASE_URL,
        method: 'GET',
    });
};

export const createRole = (data: any) => {
    return request({
        url: BASE_URL,
        method: 'POST',
        body: data,
    });
};

export const updateRole = (id: number, data: any) => {
    return request({
        url: `${BASE_URL}/${id}`,
        method: 'PUT',
        body: data,
    });
};

export const deleteRole = (id: number) => {
    return request({
        url: `${BASE_URL}/${id}`,
        method: 'DELETE',
    });
};
