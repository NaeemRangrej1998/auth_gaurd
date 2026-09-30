import { request } from '../config/axiosConfig';

const BASE_URL = 'http://localhost:8080/api/users';

export const getPaginatedUsers = (page: number, size: number, search?: string) => {
    let url = `${BASE_URL}/paginated?page=${page}&size=${size}`;
    if (search) {
        url += `&search=${encodeURIComponent(search)}`;
    }
    return request({
        url,
        method: 'GET',
    });
};

export const createUser = (data: any) => {
    return request({
        url: BASE_URL,
        method: 'POST',
        body: data,
    });
};

export const updateUser = (id: number, data: any) => {
    return request({
        url: `${BASE_URL}/${id}`,
        method: 'PUT',
        body: data,
    });
};

export const deleteUser = (id: number) => {
    return request({
        url: `${BASE_URL}/${id}`,
        method: 'DELETE',
    });
};
